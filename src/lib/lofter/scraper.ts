/**
 * LOFTER 热门CP排行榜抓取器
 * 抓取 LOFTER 官方标签热度数据
 * API: https://www.lofter.com/ljx?op=listHotTag&type=1
 */

export interface LofterHotTag {
  tagName: string;      // 标签名（如 "忘羡"）
  tagUrl: string;       // 标签页URL
  postCount: number;   // 内容数量
  viewCount: number;    // 浏览量
  rank: number;         // 当前排名
  trend: "up" | "down" | "stable";
  category: string;     // 所属分类
}

export interface LofterRankResponse {
  success: boolean;
  timestamp: string;
  totalCount: number;
  tags: LofterHotTag[];
  source: string;
}

const LOFTER_TAG_API = "https://www.lofter.com/ljx";
const LOFTER_BASE = "https://www.lofter.com/tag";

/**
 * 抓取 LOFTER 热门CP标签榜
 * type=1: 同人CP榜
 * type=2: 同人作品榜
 * type=3: 原创作品榜
 */
export async function fetchLofterHotTags(type: 1 | 2 | 3 = 1): Promise<LofterRankResponse> {
  try {
    const params = new URLSearchParams({
      op: "listHotTag",
      type: String(type),
      random: String(Math.random()),
      _: String(Date.now()),
    });

    const response = await fetch(`${LOFTER_TAG_API}?${params}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
        "Referer": "https://www.lofter.com/",
        "Accept": "application/json",
      },
      next: { revalidate: 3600 }, // 缓存1小时
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    const tags: LofterHotTag[] = (data?.data?.list || []).map((item: any, index: number) => ({
      tagName: item.tagName || item.tag || "",
      tagUrl: item.tagUrl || `${LOFTER_BASE}/${encodeURIComponent(item.tagName || item.tag || "")}`,
      postCount: item.postCount || item.count || 0,
      viewCount: item.viewCount || 0,
      rank: item.rank || index + 1,
      trend: item.trend || "stable",
      category: type === 1 ? "同人CP" : type === 2 ? "同人作品" : "原创作品",
    }));

    return {
      success: true,
      timestamp: new Date().toISOString(),
      totalCount: tags.length,
      tags,
      source: "LOFTER官方热榜API",
    };
  } catch (error) {
    console.error("LOFTER API抓取失败:", error);
    return {
      success: false,
      timestamp: new Date().toISOString(),
      totalCount: 0,
      tags: [],
      source: "LOFTER官方热榜API",
    };
  }
}

/**
 * 从LOFTER标签页抓取详细信息
 */
export async function fetchLofterTagDetail(tagName: string): Promise<{
  description?: string;
  recentPosts?: Array<{title: string; author: string; summary: string; likes: number}>;
  relatedTags?: string[];
} | null> {
  try {
    const response = await fetch(
      `${LOFTER_BASE}/${encodeURIComponent(tagName)}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
          "Accept": "text/html",
        },
        next: { revalidate: 7200 },
      }
    );

    if (!response.ok) return null;

    const html = await response.text();
    
    // 简单解析（实际生产应该用cheerio）
    const descriptionMatch = html.match(/"tagDesc"\s*:\s*"([^"]+)"/);
    const relatedMatch = html.match(/"relTags"\s*:\s*\[([^\]]+)\]/);

    return {
      description: descriptionMatch?.[1],
      relatedTags: relatedMatch?.[1].split(",").map(t => t.trim().replace(/"/g, "")),
    };
  } catch {
    return null;
  }
}

/**
 * 获取当前热门CP推荐（结合API + 知识库）
 */
export async function getTrendingCPs(limit: number = 10): Promise<Array<{
  source: "api" | "knowledge";
  tagName: string;
  ipName?: string;
  cpName?: string;
  postCount: number;
  url: string;
}>> {
  // 并行：抓API + 知识库
  const [apiResult] = await Promise.all([fetchLofterHotTags(1)]);
  
  const results: Array<{
    source: "api" | "knowledge";
    tagName: string;
    ipName?: string;
    cpName?: string;
    postCount: number;
    url: string;
  }> = [];

  // 从API结果
  if (apiResult.success && apiResult.tags.length > 0) {
    for (const tag of apiResult.tags.slice(0, limit)) {
      results.push({
        source: "api",
        tagName: tag.tagName,
        postCount: tag.postCount,
        url: tag.tagUrl,
      });
    }
  }

  // 补充知识库高热CP（当API失败时）
  if (results.length < limit) {
    const { IP_CP_DATABASE, getHotIPs } = await import("./ip-cp-database");
    const hotIPs = getHotIPs();
    for (const ip of hotIPs) {
      if (results.length >= limit) break;
      for (const cp of ip.topCPs) {
        if (results.length >= limit) break;
        if (cp.heat === "🔥🔥🔥") {
          results.push({
            source: "knowledge",
            tagName: `${ip.name}·${cp.name}`,
            ipName: ip.name,
            cpName: cp.name,
            postCount: 0, // 知识库无精确数据
            url: `${LOFTER_BASE}/${encodeURIComponent(ip.name + " " + cp.name)}`,
          });
        }
      }
    }
  }

  return results;
}
