/**
 * LOFTER 同人文章 AI 生成器
 * 基于 IP/CP 知识库生成高质量同人文章
 */

import type { CPPair, IP } from "./ip-cp-database";

export interface GeneratedArticle {
  title: string;          // 标题
  intro: string;          // 导语/引言
  outline: string[];      // 大纲（3-5个情节点）
  body: string;           // 正文（完整文章）
  tags: string[];         // LOFTER标签
  ip: IP;                 // 所属IP
  cp: CPPair;             // 所属CP
  genre: string;          // 文章类型
  estimatedLength: string; // 预估字数
  generatedAt: string;    // 生成时间
}

export interface GenerationRequest {
  ip: IP;
  cp: CPPair;
  genre?: "甜" | "虐" | "治愈" | "日常" | "车" | "混搭";
  prompt?: string;         // 自定义写作方向
  style?: "细腻" | "热血" | "轻松" | "虐心";
}

/**
 * 生成同人文章（使用LLM）
 */
export async function generateArticle(req: GenerationRequest): Promise<GeneratedArticle> {
  const { ip, cp, genre = "混搭", prompt, style = "细腻" } = req;

  const genrePrompts = {
    "甜": "以甜蜜日常为主，暧昧互动为主旋律，有明确的双向奔赴。",
    "虐": "以虐心为主，虐度要够，能让读者落泪，注意虐完之后要有温暖的结局或开放式结尾。",
    "治愈": "以温暖为主，基调是治愈，即使有虐也是为了更温暖的结局。",
    "日常": "以生活化场景为主，有烟火气，对话自然有趣。",
    "车": "以暧昧和暗示为主，适当留白，不过分露骨。",
    "混搭": "有起承转合，有甜有虐，情节丰富，人物关系立体。",
  };

  const stylePrompts = {
    "细腻": "注重心理描写和情感层次，文笔优美。",
    "热血": "注重动作场面和情感张力，节奏较快。",
    "轻松": "注重幽默和轻松对话，文风活泼。",
    "虐心": "注重内心挣扎和痛苦描写，有深度。",
  };

  const systemPrompt = `你是一个专业的同人小说作者，擅长写BL同人（${ip.name}·${cp.name}）。`;

  const userPrompt = `请为 CP "${cp.name}"（${cp.chars}）创作一篇同人文章。

## IP信息
- IP名称：${ip.name}
- CP组合：${cp.chars}
- 人设标签：${cp.tags.join("、")}
- 故事梗概：${cp.summary}
- 写作要点：${cp.writingTips.map(t => `· ${t}`).join("\n")}

## 写作要求
- 类型：${genrePrompts[genre]}
- 风格：${stylePrompts[style]}
${prompt ? `- 自定义方向：${prompt}` : ""}
- 必须严格遵循CP人设，不得OOC
- 必须使用简体中文
- 字数要求：1500-3000字的中长篇

## 输出格式（严格按此格式返回）
【标题】
标题文字

【导语】
一段话引出故事，50字以内

【大纲】
第1点：...
第2点：...
第3点：...

【正文】
完整文章正文，分段清晰

【推荐标签】
#标签1 #标签2 #标签3（至少8个，和CP及内容相关的热门标签）`;

  // 调用 LLM 生成
  const response = await fetch("https://api.minimaxi.chat/v1/text/chatcompletion_v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.MINIMAX_API_KEY}`,
    },
    body: JSON.stringify({
      model: "abab6.5s-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      tokens_to_generate: 3000,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    throw new Error(`生成失败: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";

  return parseGeneratedContent(content, ip, cp, genre);
}

/**
 * 解析LLM输出为结构化文章
 */
function parseGeneratedContent(
  content: string,
  ip: IP,
  cp: CPPair,
  genre: string
): GeneratedArticle {
  const lines = content.split("\n");
  
  let section = "";
  let title = "";
  let intro = "";
  const outline: string[] = [];
  let body = "";
  const tags: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("【标题】")) {
      section = "title";
      title = trimmed.replace("【标题】", "").trim();
    } else if (trimmed.startsWith("【导语】")) {
      section = "intro";
      intro = trimmed.replace("【导语】", "").trim();
    } else if (trimmed.startsWith("【大纲】")) {
      section = "outline";
    } else if (trimmed.startsWith("【正文】")) {
      section = "body";
    } else if (trimmed.startsWith("【推荐标签】")) {
      section = "tags";
      const tagStr = trimmed.replace("【推荐标签】", "").trim();
      const matches = tagStr.match(/#[^\s#]+/g) || [];
      tags.push(...matches.map(t => t.replace("#", "")));
    } else {
      if (section === "title") title = trimmed;
      else if (section === "intro") intro = trimmed;
      else if (section === "outline" && trimmed) outline.push(trimmed);
      else if (section === "body") body += trimmed + "\n";
    }
  }

  // 合并IP标签
  const ipTags = ip.hotTags.slice(0, 5);
  const cpTag = `#${cp.name}`;
  const ipTag = `#${ip.name}`;
  if (!tags.includes(cp.name)) tags.unshift(cp.name);
  if (!tags.includes(ip.name)) tags.unshift(ip.name);
  for (const t of ipTags) {
    if (!tags.includes(t)) tags.push(t);
  }

  return {
    title,
    intro,
    outline,
    body: body.trim(),
    tags,
    ip,
    cp,
    genre,
    estimatedLength: `${body.length}字（约${Math.round(body.length / 2)}词）`,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * 格式化文章为LOFTER发布格式
 */
export function formatForLofter(article: GeneratedArticle): string {
  return `${article.title}

${article.intro}

正文：

${article.body}

——
${article.tags.map(t => `#${t}`).join(" ")}`;
}

/**
 * 获取推荐CP（用于UI选择）
 */
export function getRecommendedCPs(count: number = 5) {
  const { getHotIPs } = require("./ip-cp-database");
  const hotIPs = getHotIPs();
  const result: Array<{ip: IP; cp: CPPair}> = [];

  for (const ip of hotIPs) {
    for (const cp of ip.topCPs) {
      if (result.length >= count) break;
      if (cp.heat === "🔥🔥🔥") {
        result.push({ ip, cp });
      }
    }
    if (result.length >= count) break;
  }
  return result;
}
