"use client";

import { useState } from "react";

const IP_CATEGORIES = [
  { value: "all", label: "全部" },
  { value: "anime", label: "动漫" },
  { value: "game", label: "游戏" },
  { value: "novel", label: "小说" },
  { value: "movie", label: "影视" },
];

const IP_LOGOS: Record<string, string> = {
  guomanzhushizu: "⚔️", guimiezhixia: "🌊", feichirensheng: "🏎️", longzu: "🐉",
  siwangbiji: "📓", daomubiji: "🗺️", zhuintan: "🔍", penghai: "🚂",
  genshin: "🌟", zhoushuixc: "👊", zetsuboutachi: "⚽", chiikawa: "🐱",
  fatezhongshen: "⚜️", ao3hot: "📚", hp: "⚡",
};

interface Article {
  title: string;
  intro: string;
  outline: string[];
  body: string;
  tags: string[];
  ip: { id: string; name: string; logo?: string };
  cp: { name: string; chars: string; tags: string[] };
  genre: string;
  estimatedLength: string;
  generatedAt: string;
}

interface TrendingItem {
  source: string;
  tagName: string;
  ipName?: string;
  cpName?: string;
  postCount: number;
  url: string;
  heat?: string;
  latestNews?: string;
}

export default function LofterPage() {
  const [view, setView] = useState<"home" | "select" | "generate" | "result">("home");
  const [selectedIP, setSelectedIP] = useState<any>(null);
  const [selectedCP, setSelectedCP] = useState<any>(null);
  const [genre, setGenre] = useState("混搭");
  const [style, setStyle] = useState("细腻");
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [article, setArticle] = useState<Article | null>(null);
  const [copyContent, setCopyContent] = useState("");
  const [category, setCategory] = useState("all");
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [genrePage, setGenrePage] = useState(0);

  const GENRES = ["甜", "虐", "治愈", "日常", "混搭"];
  const STYLES = ["细腻", "热血", "轻松", "虐心"];

  const loadTrending = async () => {
    setTrendingLoading(true);
    try {
      const res = await fetch("/api/lofter/trending");
      const data = await res.json();
      if (data.success) {
        setTrending(data.items);
      }
    } catch {
      // 静默失败
    }
    setTrendingLoading(false);
  };

  const handleSelectTrending = (item: TrendingItem) => {
    if (item.source === "knowledge" && item.ipName) {
      const ip = IP_DB.find(i => i.name === item.ipName);
      if (ip) {
        setSelectedIP(ip);
        const cp = ip.topCPs.find(c => c.name === item.cpName);
        setSelectedCP(cp || ip.topCPs[0]);
        setView("generate");
      }
    }
  };

  const handleGenerate = async () => {
    if (!selectedIP || !selectedCP) {
      setError("请先选择IP和CP");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/lofter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ipId: selectedIP.id,
          cpName: selectedCP.name,
          genre,
          style,
          prompt: customPrompt,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setArticle(data.article);
        setCopyContent(data.copyContent);
        setView("result");
      } else {
        setError(data.error || "生成失败");
      }
    } catch {
      setError("网络错误，请重试");
    }
    setLoading(false);
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(copyContent);
      alert("已复制到剪贴板！去 LOFTER 草稿箱发布吧～");
    } catch {
      alert("复制失败，请手动选择内容复制");
    }
  };

  const goSelect = () => {
    loadTrending();
    setView("select");
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0f0f1a 0%, #1a1030 50%, #0d0d20 100%)", color: "#e2e8f0" }}>
      {/* 顶部导航 */}
      <div className="sticky top-0 z-50 border-b" style={{ borderColor: "rgba(139, 92, 246, 0.2)", background: "rgba(15, 15, 26, 0.9)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {view !== "home" && (
              <button onClick={() => setView(view === "result" ? "generate" : "select")} className="text-sm px-3 py-1.5 rounded-lg transition-all" style={{ background: "rgba(139, 92, 246, 0.2)", color: "#a78bfa" }}>
                ← 返回
              </button>
            )}
            <span className="text-lg font-bold" style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              🎯 LOFTER 同人变现助手
            </span>
          </div>
          <span className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(236, 72, 153, 0.2)", color: "#f472b6" }}>
            {view === "home" ? "首页" : view === "select" ? "选择CP" : view === "generate" ? "生成文章" : "发布内容"}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* HOME */}
        {view === "home" && (
          <div className="space-y-10">
            {/* Hero */}
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h1 className="text-4xl font-bold mb-4" style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899, #22D3EE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                LOFTER 同人变现助手
              </h1>
              <p className="text-lg mb-2" style={{ color: "#94a3b8" }}>
                自动抓取热门CP · AI生成同人文章 · 一键复制发布
              </p>
              <p className="text-sm" style={{ color: "#64748b" }}>
                基于 {IP_DB.length}+ 热门IP · {IP_DB.reduce((a, ip) => a + ip.topCPs.length, 0)}+ CP组合 · 持续更新排行
              </p>
            </div>

            {/* 功能卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl p-6 transition-all hover:scale-105 cursor-pointer" style={{ background: "linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.05))", border: "1px solid rgba(139, 92, 246, 0.3)" }} onClick={() => { loadTrending(); goSelect(); }}>
                <div className="text-4xl mb-3">🔥</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "#a78bfa" }}>热门CP排行榜</h3>
                <p className="text-sm" style={{ color: "#94a3b8" }}>实时抓取LOFTER热门标签，自动推荐当前最火的IP/CP组合</p>
                <div className="mt-4 text-sm font-medium" style={{ color: "#8B5CF6" }}>开始选CP →</div>
              </div>

              <div className="rounded-2xl p-6 transition-all hover:scale-105" style={{ background: "linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(236, 72, 153, 0.05))", border: "1px solid rgba(236, 72, 153, 0.3)" }}>
                <div className="text-4xl mb-3">✍️</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "#f472b6" }}>AI文章生成</h3>
                <p className="text-sm" style={{ color: "#94a3b8" }}>选择CP和类型（甜/虐/治愈），AI自动生成1500-3000字高质量同人</p>
                <div className="mt-4 text-sm" style={{ color: "#64748b" }}>支持多种风格和自定义提示词</div>
              </div>

              <div className="rounded-2xl p-6 transition-all hover:scale-105" style={{ background: "linear-gradient(135deg, rgba(34, 211, 238, 0.15), rgba(34, 211, 238, 0.05))", border: "1px solid rgba(34, 211, 238, 0.3)" }}>
                <div className="text-4xl mb-3">📋</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "#22D3EE" }}>一键复制发布</h3>
                <p className="text-sm" style={{ color: "#94a3b8" }}>生成最优化的发布格式，复制后直接粘贴到LOFTER草稿箱</p>
                <div className="mt-4 text-sm" style={{ color: "#64748b" }}>自动推荐热门标签</div>
              </div>
            </div>

            {/* IP分类入口 */}
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ color: "#e2e8f0" }}>📚 热门IP库</h2>
              <div className="flex gap-3 mb-6 flex-wrap">
                {IP_CATEGORIES.map(cat => (
                  <button key={cat.value} onClick={() => { setCategory(cat.value); goSelect(); }} className="px-4 py-2 rounded-lg text-sm font-medium transition-all" style={{ background: category === cat.value ? "rgba(139, 92, 246, 0.3)" : "rgba(255,255,255,0.05)", color: category === cat.value ? "#a78bfa" : "#94a3b8", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {IP_DB.filter(ip => category === "all" || ip.category === category).slice(0, 15).map(ip => (
                  <button key={ip.id} onClick={() => { setSelectedIP(ip); setSelectedCP(ip.topCPs[0]); setView("generate"); }} className="rounded-xl p-4 text-left transition-all hover:scale-105" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="text-2xl mb-1">{ip.logo || "📚"}</div>
                    <div className="text-sm font-medium truncate" style={{ color: "#e2e8f0" }}>{ip.name}</div>
                    <div className="text-xs mt-1 truncate" style={{ color: "#64748b" }}>{ip.topCPs[0]?.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SELECT */}
        {view === "select" && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2" style={{ background: "linear-gradient(135deg, #8B5CF6, #22D3EE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>选择你的CP</h2>
              <p className="text-sm" style={{ color: "#64748b" }}>从热门排行榜和IP库中选择</p>
            </div>

            {/* 热门榜 */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: "#f472b6" }}>
                <span>🔥</span> 热门CP排行榜
                <button onClick={loadTrending} disabled={trendingLoading} className="text-xs px-2 py-1 rounded" style={{ background: "rgba(236, 72, 153, 0.15)", color: "#f472b6" }}>
                  {trendingLoading ? "刷新中..." : "刷新"}
                </button>
              </h3>
              {trending.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {trending.slice(0, 12).map((item, i) => (
                    <button key={i} onClick={() => handleSelectTrending(item)} className="rounded-xl p-4 text-left transition-all hover:scale-102" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(236, 72, 153, 0.2)" }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: i < 3 ? "rgba(236, 72, 153, 0.3)" : "rgba(255,255,255,0.05)", color: i < 3 ? "#f472b6" : "#64748b" }}>
                          #{i + 1}
                        </span>
                        {item.heat && <span className="text-xs">{item.heat}</span>}
                      </div>
                      <div className="text-sm font-bold mb-1" style={{ color: "#e2e8f0" }}>{item.tagName}</div>
                      {item.source === "knowledge" && (
                        <div className="text-xs truncate" style={{ color: "#64748b" }}>{item.ipName} · {item.cpName}</div>
                      )}
                      {item.latestNews && (
                        <div className="text-xs mt-1 truncate" style={{ color: "#8B5CF6" }}>{item.latestNews}</div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8" style={{ color: "#64748b" }}>
                  {trendingLoading ? "加载中..." : "暂无数据，点击刷新"}
                </div>
              )}
            </div>

            {/* IP分类浏览 */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: "#8B5CF6" }}>📚 IP库浏览</h3>
              <div className="flex gap-2 mb-4 flex-wrap">
                {IP_CATEGORIES.map(cat => (
                  <button key={cat.value} onClick={() => setCategory(cat.value)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: category === cat.value ? "rgba(139, 92, 246, 0.3)" : "rgba(255,255,255,0.05)", color: category === cat.value ? "#a78bfa" : "#94a3b8" }}>
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {IP_DB.filter(ip => category === "all" || ip.category === category).map(ip => (
                  <div key={ip.id} className="rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(139, 92, 246, 0.15)" }}>
                    <div className="p-4 flex items-center gap-3">
                      <span className="text-3xl">{ip.logo || "📚"}</span>
                      <div>
                        <div className="font-bold" style={{ color: "#e2e8f0" }}>{ip.name}</div>
                        <div className="text-xs" style={{ color: "#64748b" }}>{ip.source}</div>
                      </div>
                    </div>
                    <div className="px-4 pb-3 flex gap-2 flex-wrap">
                      {ip.topCPs.slice(0, 3).map(cp => (
                        <button key={cp.name} onClick={() => { setSelectedIP(ip); setSelectedCP(cp); setView("generate"); }} className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#a78bfa", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
                          {cp.name} {cp.heat}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GENERATE */}
        {view === "generate" && selectedIP && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2" style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>生成同人文章</h2>
            </div>

            {/* 已选CP */}
            <div className="rounded-2xl p-6" style={{ background: "linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(236, 72, 153, 0.08))", border: "1px solid rgba(139, 92, 246, 0.25)" }}>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{selectedIP.logo || "📚"}</span>
                <div>
                  <div className="text-2xl font-bold" style={{ color: "#e2e8f0" }}>{selectedIP.name}</div>
                  <div className="text-sm" style={{ color: "#94a3b8" }}>{selectedIP.source}</div>
                </div>
              </div>
              {selectedCP && (
                <div className="rounded-xl p-4" style={{ background: "rgba(0,0,0,0.2)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg" style={{ color: "#f472b6" }}>{selectedCP.name}</span>
                    <span className="text-sm">{selectedCP.heat}</span>
                  </div>
                  <div className="text-sm mb-2" style={{ color: "#94a3b8" }}>{selectedCP.chars}</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedCP.tags.map((t: string) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(236, 72, 153, 0.15)", color: "#f472b6" }}>{t}</span>
                    ))}
                  </div>
                  <div className="mt-3 text-sm" style={{ color: "#64748b" }}>{selectedCP.summary}</div>
                </div>
              )}
              {selectedIP.topCPs.length > 1 && (
                <div className="mt-4">
                  <div className="text-xs mb-2" style={{ color: "#64748b" }}>切换CP：</div>
                  <div className="flex gap-2 flex-wrap">
                    {selectedIP.topCPs.map((cp: any) => (
                      <button key={cp.name} onClick={() => setSelectedCP(cp)} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: selectedCP?.name === cp.name ? "rgba(139, 92, 246, 0.3)" : "rgba(255,255,255,0.05)", color: selectedCP?.name === cp.name ? "#a78bfa" : "#64748b" }}>
                        {cp.name} {cp.heat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 类型选择 */}
            <div>
              <div className="text-sm font-medium mb-3" style={{ color: "#94a3b8" }}>🎭 文章类型</div>
              <div className="grid grid-cols-5 gap-2">
                {GENRES.map(g => (
                  <button key={g} onClick={() => setGenre(g)} className="py-3 rounded-xl text-sm font-medium transition-all" style={{ background: genre === g ? "rgba(236, 72, 153, 0.3)" : "rgba(255,255,255,0.04)", color: genre === g ? "#f472b6" : "#64748b", border: genre === g ? "2px solid rgba(236, 72, 153, 0.5)" : "1px solid rgba(255,255,255,0.08)" }}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* 风格选择 */}
            <div>
              <div className="text-sm font-medium mb-3" style={{ color: "#94a3b8" }}>🎨 写作风格</div>
              <div className="grid grid-cols-4 gap-2">
                {STYLES.map(s => (
                  <button key={s} onClick={() => setStyle(s)} className="py-3 rounded-xl text-sm font-medium transition-all" style={{ background: style === s ? "rgba(139, 92, 246, 0.3)" : "rgba(255,255,255,0.04)", color: style === s ? "#a78bfa" : "#64748b", border: style === s ? "2px solid rgba(139, 92, 246, 0.5)" : "1px solid rgba(255,255,255,0.08)" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* 自定义提示词 */}
            <div>
              <div className="text-sm font-medium mb-3" style={{ color: "#94a3b8" }}>💬 自定义写作方向（可选）</div>
              <textarea value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} placeholder="例如：写一个破镜重圆的故事、要有校园场景、攻是明星受是经纪人..." className="w-full rounded-xl px-4 py-3 text-sm" rows={3} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", outline: "none", resize: "none" }} />
            </div>

            {error && <div className="text-sm text-center py-2 rounded-lg" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#f87171" }}>{error}</div>}

            {/* 生成按钮 */}
            <button onClick={handleGenerate} disabled={loading} className="w-full py-4 rounded-2xl text-xl font-bold transition-all hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: loading ? "rgba(139, 92, 246, 0.5)" : "linear-gradient(135deg, #8B5CF6, #EC4899)", boxShadow: loading ? "none" : "0 8px 32px rgba(139, 92, 246, 0.4)" }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⟳</span> AI正在创作中，请稍候...
                </span>
              ) : (
                "✨ 生成同人文章"
              )}
            </button>
          </div>
        )}

        {/* RESULT */}
        {view === "result" && article && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* 成功提示 */}
            <div className="text-center py-6">
              <div className="text-5xl mb-3">✅</div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: "#22D3EE" }}>文章生成成功！</h2>
              <p className="text-sm" style={{ color: "#64748b" }}>IP: {article.ip.name} · CP: {article.cp.name} · 类型: {article.genre}</p>
            </div>

            {/* 文章预览 */}
            <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
              <div className="text-xs mb-3" style={{ color: "#64748b" }}>📖 文章预览</div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: "#e2e8f0" }}>{article.title}</h3>
              {article.intro && <p className="text-sm mb-4 italic" style={{ color: "#94a3b8", borderLeft: "3px solid #8B5CF6", paddingLeft: "12px" }}>{article.intro}</p>}
              {article.outline.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-medium mb-2" style={{ color: "#8B5CF6" }}>📋 大纲</div>
                  {article.outline.map((o, i) => (
                    <div key={i} className="text-sm mb-1" style={{ color: "#94a3b8" }}>{o}</div>
                  ))}
                </div>
              )}
              <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#cbd5e1", maxHeight: "400px", overflow: "hidden", position: "relative" }}>
                {article.body.slice(0, 1200)}
                <div className="absolute bottom-0 left-0 right-0 h-20" style={{ background: "linear-gradient(transparent, rgba(15, 15, 26, 0.95))" }} />
              </div>
            </div>

            {/* 标签 */}
            <div className="rounded-xl p-4" style={{ background: "rgba(236, 72, 153, 0.08)", border: "1px solid rgba(236, 72, 153, 0.2)" }}>
              <div className="text-xs mb-2" style={{ color: "#f472b6" }}>🏷️ 推荐标签（已复制）</div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((t: string) => (
                  <span key={t} className="text-sm px-3 py-1 rounded-full" style={{ background: "rgba(236, 72, 153, 0.15)", color: "#f472b6" }}>#{t}</span>
                ))}
              </div>
            </div>

            {/* 操作 */}
            <div className="space-y-3">
              <button onClick={handleCopyAll} className="w-full py-4 rounded-2xl text-lg font-bold transition-all hover:scale-102" style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)", boxShadow: "0 8px 32px rgba(139, 92, 246, 0.4)" }}>
                📋 一键复制全部内容
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { setGenrePage(0); setView("generate"); }} className="py-3 rounded-xl text-sm font-medium transition-all hover:scale-102" style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)" }}>
                  🔄 换个类型生成
                </button>
                <button onClick={() => setView("select")} className="py-3 rounded-xl text-sm font-medium transition-all hover:scale-102" style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)" }}>
                  🔥 选择新CP
                </button>
              </div>
            </div>

            {/* 发布步骤 */}
            <div className="rounded-xl p-4" style={{ background: "rgba(34, 211, 238, 0.05)", border: "1px solid rgba(34, 211, 238, 0.2)" }}>
              <div className="text-sm font-bold mb-3" style={{ color: "#22D3EE" }}>📌 发布到LOFTER步骤</div>
              <div className="space-y-2 text-sm" style={{ color: "#94a3b8" }}>
                <div>1️⃣ 打开 <a href="https://www.lofter.com/draft" target="_blank" rel="noopener" style={{ color: "#a78bfa" }}>lofter.com/draft</a></div>
                <div>2️⃣ 点击「写文章」</div>
                <div>3️⃣ 标题粘贴【标题】，正文粘贴【正文】</div>
                <div>4️⃣ 标签栏粘贴全部 #标签</div>
                <div>5️⃣ 添加一张封面图（建议用剧情截图或CP图）</div>
                <div>6️⃣ 选择「公开」发布！</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 内嵌IP数据库（避免额外请求）
const IP_DB = [
  { id: "guomanzhushizu", name: "魔道祖师", category: "anime", source: "墨香铜臭", logo: "⚔️", topCPs: [{ name: "忘羡", chars: "蓝忘机 × 魏無羨", tags: ["雅正攻", "疯批受", "双强"], heat: "🔥🔥🔥", summary: "前世魏無羨剖丹惨死，蓝忘机独守十三年", writingTips: ["开局即重逢", "含光君的压抑宠溺"] }] },
  { id: "guimiezhixia", name: "鬼灭之刃", category: "anime", source: "吾峠呼世晴", logo: "🌊", topCPs: [{ name: "锖义", chars: "锖兔 × 富冈义勇", tags: ["温柔少年攻", "沉默受", "竹马"], heat: "🔥🔥🔥", summary: "锖兔为救义勇断喉牺牲，义勇带着半片锖兔的羽织活下去", writingTips: ["开场即刀", "义勇的沉默寡言"] }, { name: "炼蜜", chars: "炼狱杏寿郎 × 蜜璃", tags: ["热血攻", "可爱受"], heat: "🔥🔥", summary: "无限列车后再无交集，但温暖治愈系首选", writingTips: ["蜜璃相亲失败后遇到炼狱"] }] },
  { id: "feichirensheng", name: "飞驰人生", category: "movie", source: "韩寒电影", logo: "🏎️", topCPs: [{ name: "驰强", chars: "张驰 × 孙宇强", tags: ["热血车手攻", "长发领航员受", "七年搭档"], heat: "🔥🔥🔥", summary: "巴音布鲁克车神与他的领航员，落魄时互相扶持", writingTips: ["从巅峰跌落谷底", "一根筋的张驰+全程跟陪的宇强"] }] },
  { id: "longzu", name: "龙族", category: "novel", source: "江南", logo: "🐉", topCPs: [{ name: "泽非", chars: "路鸣泽 × 路明非", tags: ["魔鬼弟弟攻", "废柴哥哥受", "宿命共生"], heat: "🔥🔥", summary: "路鸣泽以生命为代价帮路明非实现愿望", writingTips: ["路鸣泽的真实身份", "每一次交易的代价"] }] },
  { id: "siwangbiji", name: "死亡笔记", category: "anime", source: "大场鸫/小畑健", logo: "📓", topCPs: [{ name: "L月", chars: "L × 夜神月", tags: ["侦探攻", "天才受", "智斗宿敌"], heat: "🔥🔥", summary: "世界第一侦探与夜神月的极致智商博弈", writingTips: ["开局即对决", "双方的心理战"] }] },
  { id: "daomubiji", name: "盗墓笔记", category: "novel", source: "南派三叔", logo: "🗺️", topCPs: [{ name: "瓶邪", chars: "张起灵 × 吴邪", tags: ["高冷神攻", "软萌受", "宿命羁绊"], heat: "🔥🔥🔥", summary: "吴邪追寻小哥足迹，跨越生死的百年守护", writingTips: ["吴邪的失踪与小哥出场", "铁三角下斗日常"] }] },
  { id: "zhuintan", name: "名侦探柯南", category: "anime", source: "青山刚昌", logo: "🔍", topCPs: [{ name: "快新", chars: "黑羽快斗 × 工藤新一", tags: ["怪盗攻", "侦探受", "欢喜冤家"], heat: "🔥🔥🔥", summary: "怪盗与侦探的猫鼠游戏，互相试探又彼此守护", writingTips: ["基德的预告函 vs 新一的推理", "秘密身份的心照不宣"] }, { name: "赤安", chars: "赤井秀一 × 安室透", tags: ["卧底攻", "公安受"], heat: "🔥🔥", summary: "FBI与日本公安的对立与和解", writingTips: ["诸星大人与波本身份", "拆弹篇合作"] }] },
  { id: "genshin", name: "原神", category: "game", source: "米哈游", logo: "🌟", topCPs: [{ name: "魈荧", chars: "魈 × 旅行者", tags: ["高冷守护攻", "救赎"], heat: "🔥🔥🔥", summary: "降魔大圣与旅行者的守护契约", writingTips: ["海灯节的约定", "旅行者带来的改变"] }, { name: "公钟", chars: "钟离 × 达达利亚", tags: ["契约之神攻", "至冬执行官受"], heat: "🔥🔥🔥", summary: "岩王帝君与愚人众执行官的契约式调情", writingTips: ["达达利亚的挑战与钟离从容", "关于账单的各种梗"] }] },
  { id: "zhoushuixc", name: "崩坏星穹铁道", category: "game", source: "米哈游", logo: "🚂", topCPs: [{ name: "星穹列车组", chars: "丹恒 × 饮月", tags: ["宿命", "前世", "龙师"], heat: "🔥🔥", summary: "饮月之乱的真相，丹恒作为饮月转世背负前世罪孽", writingTips: ["饮月的骄傲与丹恒的隐忍"] }] },
  { id: "zhoushuixc2", name: "咒术回战", category: "anime", source: "芥见下々", logo: "👊", topCPs: [{ name: "五悠", chars: "五条件 × 虎杖悠仁", tags: ["导师攻", "阳光受", "救赎"], heat: "🔥🔥🔥", summary: "五条件作为导师对虎杖的救赎与羁绊", writingTips: ["五条件的轻小说日常", "虎杖的善良与纯粹"] }, { name: "夏油", chars: "夏油杰 × 悟", tags: ["挚友", "理念对立"], heat: "🔥🔥🔥", summary: "最佳挚友走向对立，正反对决", writingTips: ["高专时期的回忆", "怀玉篇的虐"] }] },
  { id: "zetsuboutachi", name: "蓝色监狱", category: "anime", source: "手游屋优翔太", logo: "⚽", topCPs: [{ name: "洁蜂", chars: "洁世一 × 蜂乐回", tags: ["核心搭档", "天才", "进攻意识"], heat: "🔥🔥", summary: "蓝色监狱最吸睛的进攻组合", writingTips: ["第一次碰面时的火花"] }] },
  { id: "chiikawa", name: "Chiikawa", category: "anime", source: "はまじあき", logo: "🐱", topCPs: [{ name: "小可爱们", chars: "小可爱 × 小兔子 × 小三角", tags: ["治愈", "友情", "萌系"], heat: "🔥🔥", summary: "三位小可爱的温暖日常", writingTips: ["每个角色的独特性格", "可爱的日常互动"] }] },
  { id: "fatezhongshen", name: "Fate/Zero", category: "anime", source: "虚渊玄", logo: "⚜️", topCPs: [{ name: "金樱", chars: "吉尔伽美什 × 阿尔托莉雅", tags: ["古王攻", "呆萌受"], heat: "🔥🔥", summary: "英雄王与不列颠王的跨时代碰撞", writingTips: ["金皮卡的杂修名台词", "呆毛王的认真与正直"] }, { name: "言切", chars: "言峰绮礼 × 卫宫切嗣", tags: ["神父攻", "杀手受"], heat: "🔥🔥", summary: "第四次圣杯战争的核心对立", writingTips: ["各自的正义观", "理念与手段的终极碰撞"] }] },
  { id: "ao3hot", name: "MCU/漫威", category: "novel", source: "Marvel", logo: "📚", topCPs: [{ name: "史传奇", chars: "Stephen Strange × Tony Stark", tags: ["科学家攻", "天才受", "漫威"], heat: "🔥🔥🔥", summary: "漫威双魔法天才的合作与互相拯救", writingTips: ["时间宝石的代价", "泰坦星之战的重逢"] }] },
  { id: "hp", name: "哈利·波特", category: "novel", source: "J.K.罗琳", logo: "⚡", topCPs: [{ name: "德哈", chars: "德拉科·马尔福 × 哈利·波特", tags: ["校园宿敌", "傲娇攻"], heat: "🔥🔥🔥", summary: "霍格沃茨最经典的冤家CP", writingTips: ["狭路相逢的走廊", "O.W.L考试期间的合作"] }, { name: "犬狼", chars: "詹姆·波特 × 小天狼星·布莱克", tags: ["竹马", "生死之交"], heat: "🔥🔥", summary: "掠夺者时代的友情岁月", writingTips: ["霍格沃茨的友谊岁月", "尖叫棚屋的真相"] }] },
];
