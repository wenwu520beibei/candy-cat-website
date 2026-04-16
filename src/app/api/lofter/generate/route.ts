import { NextRequest, NextResponse } from "next/server";
import { IP_CP_DATABASE, type CPPair, type IP } from "@/lib/lofter/ip-cp-database";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { ipId, cpName, genre, prompt, style } = await req.json();

    // 查找IP和CP
    const ip = IP_CP_DATABASE.find(i => i.id === ipId);
    if (!ip) {
      return NextResponse.json({ success: false, error: "IP不存在" }, { status: 400 });
    }

    const cp = cpName
      ? ip.topCPs.find(c => c.name === cpName)
      : ip.topCPs[0];
    if (!cp) {
      return NextResponse.json({ success: false, error: "CP不存在" }, { status: 400 });
    }

    // 调用 MiniMax LLM 生成文章
    const genreMap: Record<string, string> = {
      "甜": "以甜蜜日常为主，暧昧互动为主旋律，有明确的双向奔赴。",
      "虐": "以虐心为主，虐度要够，能让读者落泪，注意虐完之后要有温暖的结局或开放式结尾。",
      "治愈": "以温暖为主，基调是治愈，即使有虐也是为了更温暖的结局。",
      "日常": "以生活化场景为主，有烟火气，对话自然有趣。",
      "混搭": "有起承转合，有甜有虐，情节丰富，人物关系立体。",
    };

    const styleMap: Record<string, string> = {
      "细腻": "注重心理描写和情感层次，文笔优美。",
      "热血": "注重动作场面和情感张力，节奏较快。",
      "轻松": "注重幽默和轻松对话，文风活泼。",
      "虐心": "注重内心挣扎和痛苦描写，有深度。",
    };

    const systemPrompt = `你是一个专业的同人小说作者，擅长写${ip.name}同人，CP为${cp.name}（${cp.chars}）。人设标签：${cp.tags.join("、")}。故事梗概：${cp.summary}。`;

    const userPrompt = `请为 CP "${cp.name}"（${cp.chars}）创作一篇同人文章。

## IP信息
- IP名称：${ip.name}
- CP组合：${cp.chars}
- 人设标签：${cp.tags.join("、")}
- 故事梗概：${cp.summary}
- 写作要点：${cp.writingTips.map(t => `· ${t}`).join("\n")}

## 写作要求
- 类型：${genreMap[genre] || genreMap["混搭"]}
- 风格：${styleMap[style] || styleMap["细腻"]}
${prompt ? `- 自定义方向：${prompt}` : ""}
- 必须严格遵循CP人设，不得OOC
- 必须使用简体中文
- 字数要求：1500-3000字

## 输出格式（严格按此格式返回，不要有任何额外内容）
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

    const miniMaxKey = process.env.MINIMAX_API_KEY;
    if (!miniMaxKey) {
      return NextResponse.json({ success: false, error: "未配置 MINIMAX_API_KEY" }, { status: 500 });
    }

    const llmRes = await fetch("https://api.minimaxi.chat/v1/text/chatcompletion_v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${miniMaxKey}`,
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

    if (!llmRes.ok) {
      return NextResponse.json({ success: false, error: "LLM生成失败" }, { status: 500 });
    }

    const llmData = await llmRes.json();
    const content = llmData.choices?.[0]?.message?.content || "";

    // 解析文章
    const article = parseArticle(content, ip, cp, genre || "混搭");

    return NextResponse.json({
      success: true,
      article,
      copyContent: formatForCopy(article),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "生成失败" },
      { status: 500 }
    );
  }
}

function parseArticle(
  content: string,
  ip: IP,
  cp: CPPair,
  genre: string
): any {
  const lines = content.split("\n");
  let section = "";
  let title = "";
  let intro = "";
  const outline: string[] = [];
  let body = "";
  const tags: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("【标题】")) { section = "title"; title = trimmed.replace("【标题】", "").trim(); }
    else if (trimmed.startsWith("【导语】")) { section = "intro"; intro = trimmed.replace("【导语】", "").trim(); }
    else if (trimmed.startsWith("【大纲】")) { section = "outline"; }
    else if (trimmed.startsWith("【正文】")) { section = "body"; }
    else if (trimmed.startsWith("【推荐标签】")) {
      section = "tags";
      const tagStr = trimmed.replace("【推荐标签】", "").trim();
      const matches = tagStr.match(/#[^\s#]+/g) || [];
      tags.push(...matches.map((t: string) => t.replace("#", "").trim()).filter(Boolean));
    } else {
      if (section === "title") title = trimmed;
      else if (section === "intro") intro = trimmed;
      else if (section === "outline" && trimmed) outline.push(trimmed);
      else if (section === "body") body += trimmed + "\n";
    }
  }

  // 补充标签
  if (!tags.includes(cp.name)) tags.unshift(cp.name);
  if (!tags.includes(ip.name)) tags.unshift(ip.name);
  for (const t of ip.hotTags.slice(0, 4)) {
    if (!tags.includes(t)) tags.push(t);
  }

  return {
    title: title || `${ip.name}·${cp.name}同人`,
    intro: intro || "",
    outline,
    body: body.trim(),
    tags,
    ip: { id: ip.id, name: ip.name, logo: ip.logo },
    cp: { name: cp.name, chars: cp.chars, tags: cp.tags },
    genre,
    estimatedLength: `${body.trim().length}字`,
    generatedAt: new Date().toISOString(),
  };
}

function formatForCopy(article: any): string {
  const sep = "═".repeat(30);
  return `
${sep}
📋 LOFTER 发布内容
${sep}

【标题】
${article.title}

【导语】
${article.intro}

【正文】
${article.body}

${sep}
🏷️ 推荐标签（直接复制）：
${sep}
${article.tags.map((t: string) => `#${t}`).join(" ")}

${sep}
📌 发布步骤：
${sep}
1. 打开 https://www.lofter.com/draft
2. 点击「写文章」
3. 复制标题、正文、标签发布

💡 生成信息
IP: ${article.ip.name} | CP: ${article.cp.name}
类型: ${article.genre} | 字数: ${article.estimatedLength}
生成时间: ${new Date(article.generatedAt).toLocaleString("zh-CN")}
`;
}
