/**
 * LOFTER 发布器
 * 支持：复制粘贴格式 / 浏览器自动化发布草稿箱
 * 
 * LOFTER 没有公开 API，本模块提供两种发布方式：
 * 1. formatForCopy() - 生成富文本，一键复制到LOFTER后台发布
 * 2. publishViaBrowser() - 使用浏览器自动化发布（需要登录cookie）
 */

import type { GeneratedArticle } from "./generator";
import { formatForCopy as formatForCopyText } from "./generator";

export interface PublishResult {
  success: boolean;
  method: "copy" | "browser";
  article?: GeneratedArticle;
  copyContent?: string;
  browserUrl?: string;
  error?: string;
}

export interface LofterCookie {
  username: string;
  token: string;         // lofter_client_sign
  userId: string;
  expires: string;
}

/**
 * 验证 LOFTER cookie 是否有效
 */
export async function validateLofterCookie(cookie: LofterCookie): Promise<boolean> {
  try {
    const response = await fetch("https://www.lofter.com/api/user/profile", {
      headers: {
        "Cookie": `lofter_client_sign=${cookie.token}`,
        "User-Agent": "Mozilla/5.0",
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * 发布到LOFTER草稿箱（浏览器自动化方式）
 * 通过直接调用LOFTER的发布API（需要有效cookie）
 */
export async function publishToLofterDraft(
  article: GeneratedArticle,
  cookie: LofterCookie
): Promise<{success: boolean; draftId?: string; error?: string}> {
  try {
    // LOFTER 草稿箱 API
    const response = await fetch("https://www.lofter.com/dwr/call/plaincall/PostBean.saveDraft.dwr", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
        "Cookie": `lofter_client_sign=${cookie.token}`,
        "Referer": "https://www.lofter.com/",
      },
      body: buildDWRCall(article),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const text = await response.text();
    
    // 解析 DWR 响应获取 draftId
    const draftIdMatch = text.match(/draftId\s*=\s*['"]?([^'";\s]+)/);
    
    return {
      success: true,
      draftId: draftIdMatch?.[1],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "发布失败",
    };
  }
}

/**
 * 生成 DWR 格式的发布请求体
 */
function buildDWRCall(article: GeneratedArticle): string {
  const tags = article.tags.map(t => t.replace(/\s/g, "")).join(",");
  const content = formatForCopyText(article);
  
  // DWR 序列化格式
  return `callCount=1
scriptSessionId=\${scriptSessionId}190
httpSessionId=${new Date().getTime()}
c0-scriptName=PostBean
c0-methodName=saveDraft
c0-id=0
c0-param0=string:${escapeDWR(content)}
c0-param1=string:${article.title}
c0-param2=string:0
c0-param3=string:${tags}
c0-param4=string:
c0-param5=string:0
c0-param6=boolean:false
batchId=${Date.now()}
`;
}

/**
 * 发布主函数：智能选择发布方式
 */
export async function publishArticle(
  article: GeneratedArticle,
  cookie?: LofterCookie
): Promise<PublishResult> {
  // 优先尝试浏览器自动化
  if (cookie) {
    const isValid = await validateLofterCookie(cookie);
    if (isValid) {
      const result = await publishToLofterDraft(article, cookie);
      if (result.success) {
        return {
          success: true,
          method: "browser",
          article,
          browserUrl: "https://www.lofter.com/draft",
        };
      }
    }
  }

  // 回退到复制模式
  return {
    success: true,
    method: "copy",
    article,
    copyContent: formatForCopyText(article),
  };
}

/**
 * 生成一键复制格式（用于手动发布）
 */
export function formatForCopy(article: GeneratedArticle): string {
  const separator = "═".repeat(30);
  
  return `
${separator}
📋 LOFTER 发布内容
${separator}

【标题】
${article.title}

【导语】
${article.intro}

【正文】
${article.body}

${separator}
🏷️ 推荐标签（直接复制粘贴到LOFTER）：
${separator}

${article.tags.map(t => `#${t}`).join(" ")}

${separator}
📌 发布步骤：
${separator}
1. 打开 https://www.lofter.com/draft
2. 点击「写文章」
3. 标题复制上面的【标题】
4. 内容复制上面的【正文】
5. 标签直接粘贴上面的推荐标签
6. 选择好封面图后发布！

${separator}
💡 生成信息
${separator}
IP: ${article.ip.name} | CP: ${article.cp.name}
类型: ${article.genre} | 字数: ${article.estimatedLength}
生成时间: ${new Date(article.generatedAt).toLocaleString("zh-CN")}
`;
}

/**
 * 转义 DWR 特殊字符
 */
function escapeDWR(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

/**
 * 验证标签格式（LOFTER 标签规则）
 */
export function validateTags(tags: string[]): {valid: string[]; invalid: string[]} {
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const tag of tags) {
    // LOFTER 标签：不超过15字，不含特殊字符
    if (tag.length <= 15 && /^[a-zA-Z0-9\u4e00-\u9fa5_]+$/.test(tag)) {
      valid.push(tag);
    } else {
      invalid.push(tag);
    }
  }

  return { valid, invalid };
}
