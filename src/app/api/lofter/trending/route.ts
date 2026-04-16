import { NextResponse } from "next/server";
import { fetchLofterHotTags } from "@/lib/lofter/scraper";
import { IP_CP_DATABASE } from "@/lib/lofter/ip-cp-database";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 抓取 LOFTER 热门榜
    const [cpResult, workResult] = await Promise.all([
      fetchLofterHotTags(1),
      fetchLofterHotTags(2),
    ]);

    // 合并知识库中的稳定高热IP
    const knowledgeHot = IP_CP_DATABASE
      .filter(ip => ip.topCPs.some(cp => cp.heat === "🔥🔥🔥"))
      .flatMap(ip =>
        ip.topCPs
          .filter(cp => cp.heat === "🔥🔥🔥")
          .map(cp => ({
            source: "knowledge" as const,
            tagName: `${ip.name}·${cp.name}`,
            ipName: ip.name,
            cpName: cp.name,
            postCount: 0,
            url: `https://www.lofter.com/tag/${encodeURIComponent(ip.name + " " + cp.name)}`,
            heat: cp.heat,
            latestNews: ip.latestNews,
          }))
      )
      .slice(0, 20);

    // 如果API失败，全部用知识库
    const apiTags = cpResult.success
      ? cpResult.tags.slice(0, 20).map(tag => ({
          source: "api" as const,
          tagName: tag.tagName,
          postCount: tag.postCount,
          url: tag.tagUrl,
          heat: "🔥🔥🔥" as const,
        }))
      : [];

    const trending = [...apiTags, ...knowledgeHot].slice(0, 20);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      apiAvailable: cpResult.success,
      total: trending.length,
      items: trending,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "获取热门榜失败" },
      { status: 500 }
    );
  }
}
