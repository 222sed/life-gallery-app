import { useState } from "react";
import { motion } from "motion/react";
import { styleLabel } from "./mockData";

interface Props {
  onBack: () => void;
  onArtworkClick: (artworkId: string) => void;
}

const galleryBg = "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&h=1200&fit=crop&auto=format";

const filterTags = ["全部", "治愈", "诗意", "夜色", "旅途", "回忆", "孤独", "温柔", "迷惘"];

const featuredArtworks = [
  {
    id: "f1",
    title: "消失的午后",
    author: "林 · 某",
    mood: "治愈",
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1551229848-24af7e52077a?w=600&h=700&fit=crop&auto=format",
  },
  {
    id: "f2",
    title: "第一场雪",
    author: "远 · 山",
    mood: "诗意",
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1763064603464-8a83bd0ea261?w=400&h=400&fit=crop&auto=format",
  },
  {
    id: "f3",
    title: "晚风",
    author: "月 · 白",
    mood: "温柔",
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1737040455341-9e515e95e1cf?w=400&h=400&fit=crop&auto=format",
  },
];

const hotArtworks = [
  { id: "h1", title: "重量", author: "沉 · 默", mood: "孤独", height: 180, imageUrl: "https://images.unsplash.com/photo-1751004865777-8ccf6c3c487d?w=400&h=500&fit=crop&auto=format", style: "watercolor" },
  { id: "h2", title: "雾中长廊", author: "行 · 者", mood: "迷惘", height: 140, imageUrl: "https://images.unsplash.com/photo-1774015584060-17766b147227?w=400&h=400&fit=crop&auto=format", style: "watercolor" },
  { id: "h3", title: "三月的窗", author: "春 · 风", mood: "诗意", height: 158, imageUrl: "https://images.unsplash.com/photo-1744572361164-94280a82e3e7?w=400&h=480&fit=crop&auto=format", style: "crayon" },
  { id: "h4", title: "海边的下午", author: "潮 · 声", mood: "温柔", height: 175, imageUrl: "https://images.unsplash.com/photo-1737040455341-9e515e95e1cf?w=400&h=500&fit=crop&auto=format", style: "watercolor" },
  { id: "h5", title: "周二的咖啡", author: "晨 · 光", mood: "治愈", height: 148, imageUrl: "https://images.unsplash.com/photo-1717445130415-d43ebd8fed1c?w=400&h=400&fit=crop&auto=format", style: "pen" },
  { id: "h6", title: "晴天的屋顶", author: "云 · 游", mood: "旅途", height: 165, imageUrl: "https://images.unsplash.com/photo-1696527018053-3343b9853505?w=400&h=500&fit=crop&auto=format", style: "crayon" },
  { id: "h7", title: "旧照片里的夏天", author: "光 · 阴", mood: "回忆", height: 155, imageUrl: "https://images.unsplash.com/photo-1551229848-24af7e52077a?w=400&h=480&fit=crop&auto=format", style: "watercolor" },
  { id: "h8", title: "城市里的夜", author: "霓 · 虹", mood: "夜色", height: 168, imageUrl: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=400&h=520&fit=crop&auto=format", style: "pen" },
];

// Glass card shared style
const glassCard = {
  background: "rgba(255,252,245,0.58)",
  backdropFilter: "blur(28px) saturate(1.25)",
  WebkitBackdropFilter: "blur(28px) saturate(1.25)",
  border: "1.5px solid rgba(255,255,255,0.82)",
  boxShadow: "0 6px 24px rgba(120,90,60,0.07), 0 2px 8px rgba(120,90,60,0.04), inset 0 1.5px 0 rgba(255,255,255,0.92)",
} as React.CSSProperties;

export function VisitorGallery({ onBack, onArtworkClick }: Props) {
  const [activeFilter, setActiveFilter] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFeatured = activeFilter === "全部"
    ? featuredArtworks
    : featuredArtworks.filter((a) => a.mood === activeFilter);

  const filteredHot = activeFilter === "全部"
    ? hotArtworks
    : hotArtworks.filter((a) => a.mood === activeFilter);

  const leftCol = filteredHot.filter((_, i) => i % 2 === 0);
  const rightCol = filteredHot.filter((_, i) => i % 2 === 1);

  return (
    <div className="h-full relative overflow-hidden">
      {/* Background — fixed to frame, never scrolls */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${galleryBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(10px) brightness(1.06) saturate(0.85)",
          transform: "scale(1.06)",
        }}
      />
      {/* Frosted overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "rgba(250,246,238,0.82)",
        }}
      />
      {/* Ceiling light */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "260px", height: "180px",
          background: "radial-gradient(ellipse 130px 90px at 50% 0%, rgba(255,252,244,0.3) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* ── Scrollable Content ── */}
      <div className="absolute inset-0 z-10 overflow-y-auto flex flex-col" style={{ scrollbarWidth: "none" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="flex items-center justify-between px-5 pt-14 pb-4"
        >
          <div>
            <p style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "18px", color: "rgba(55,44,32,0.95)", fontWeight: 500, letterSpacing: "0.04em", textShadow: "0 1px 2px rgba(255,255,255,0.7)", marginBottom: "2px" }}>
              探索
            </p>
            <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "11px", color: "rgba(110,90,68,0.55)", letterSpacing: "0.05em", fontWeight: 300 }}>
              发现那些触动你的瞬间
            </p>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ ...glassCard, boxShadow: undefined, background: "rgba(255,252,245,0.6)", border: "1.5px solid rgba(255,255,255,0.8)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(140,110,80,0.65)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.12 }}
          className="px-5 mb-3"
        >
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl relative overflow-hidden"
            style={glassCard}
          >
            <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "55%", background: "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, transparent 100%)", borderRadius: "16px 16px 0 0" }} />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(145,115,82,0.42)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索作品、创作者或心情"
              className="flex-1 bg-transparent outline-none relative z-10"
              style={{ fontSize: "13px", color: "rgba(75,58,40,0.82)", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 300 }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="relative z-10">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(145,115,82,0.45)" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </motion.div>

        {/* Filter tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="mb-5"
        >
        <div className="flex gap-2 px-5 overflow-x-auto" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
          {filterTags.map((tag) => {
            const active = activeFilter === tag;
            return (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className="flex-shrink-0 transition-all duration-200 active:scale-95"
                style={{
                  padding: "6px 14px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontFamily: "'Noto Sans SC', sans-serif",
                  fontWeight: active ? 500 : 300,
                  letterSpacing: "0.03em",
                  background: active
                    ? "linear-gradient(135deg, #6b4a22 0%, #4a3014 100%)"
                    : "rgba(255,252,245,0.62)",
                  border: active
                    ? "1.5px solid rgba(107,74,34,0.0)"
                    : "1.5px solid rgba(180,155,118,0.32)",
                  color: active ? "rgba(248,235,210,0.96)" : "rgba(100,78,52,0.7)",
                  boxShadow: active
                    ? "0 3px 12px rgba(80,50,18,0.2), inset 0 1px 0 rgba(255,255,255,0.12)"
                    : "0 2px 8px rgba(120,90,60,0.05), inset 0 1px 0 rgba(255,255,255,0.85)",
                  backdropFilter: active ? undefined : "blur(16px)",
                  WebkitBackdropFilter: active ? undefined : "blur(16px)",
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>
        </motion.div>

        {/* ── 筛选提示 ── */}
        {activeFilter !== "全部" && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="mx-5 mb-3 flex items-center justify-between px-3 py-2 rounded-xl"
            style={{
              background: "rgba(107,74,34,0.08)",
              border: "1px solid rgba(107,74,34,0.14)",
            }}
          >
            <p style={{ fontSize: "11px", color: "rgba(90,62,22,0.72)", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 400, letterSpacing: "0.03em" }}>
              正在筛选：<span style={{ fontWeight: 500 }}>{activeFilter}</span>
            </p>
            <button
              onClick={() => setActiveFilter("全部")}
              className="flex items-center gap-1 transition-all active:scale-95"
              style={{ fontSize: "10px", color: "rgba(107,74,34,0.6)", fontFamily: "'Noto Sans SC', sans-serif", letterSpacing: "0.03em" }}
            >
              清除筛选
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 2L10 10M10 2L2 10" stroke="rgba(107,74,34,0.5)" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          </motion.div>
        )}

        {/* ── 今日精选 ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.24 }}
          className="px-5 mb-5"
        >
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontSize: "13px", color: "rgba(75,58,40,0.78)", fontFamily: "'Noto Serif SC', serif", fontWeight: 500, letterSpacing: "0.03em" }}>今日精选</p>
            <p style={{ fontSize: "10px", color: "rgba(130,105,78,0.42)", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 300, letterSpacing: "0.04em" }}>每日更新</p>
          </div>

          {filteredFeatured.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 rounded-2xl" style={{ background: "rgba(255,252,245,0.4)", border: "1.5px solid rgba(200,175,130,0.2)" }}>
              <p style={{ fontSize: "12px", color: "rgba(130,105,78,0.45)", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 300 }}>暂无「{activeFilter}」精选作品</p>
            </div>
          ) : (
            <div className="flex gap-2.5" style={{ height: "192px" }}>
              {/* Large card */}
              <button
                onClick={() => onArtworkClick(filteredFeatured[0].id)}
                className="flex-1 relative rounded-2xl overflow-hidden transition-all duration-200 active:scale-[0.985]"
                style={{ boxShadow: "0 6px 22px rgba(80,55,28,0.13)" }}
              >
                <img src={filteredFeatured[0].imageUrl} alt={filteredFeatured[0].title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 32%, rgba(38,26,12,0.68) 100%)" }} />
                {/* Featured badge */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,252,245,0.55)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.7)" }}>
                  <p style={{ fontSize: "9px", color: "rgba(107,74,34,0.88)", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 500, letterSpacing: "0.04em" }}>✦ 今日精选</p>
                </div>
                {/* Mood badge top-right */}
                <div className="absolute top-2.5 right-2.5">
                  <MoodPill mood={filteredFeatured[0].mood} />
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p style={{ fontSize: "13px", color: "rgba(248,238,218,0.95)", fontFamily: "'Noto Serif SC', serif", fontWeight: 400, marginBottom: "3px" }}>{filteredFeatured[0].title}</p>
                  <p style={{ fontSize: "10px", color: "rgba(220,195,158,0.7)", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 300 }}>{filteredFeatured[0].author}</p>
                </div>
              </button>

              {/* Right small cards — only if there are more items */}
              {filteredFeatured.length > 1 && (
                <div className="flex flex-col gap-2.5" style={{ width: "118px" }}>
                  {filteredFeatured.slice(1, 3).map((art) => (
                    <button
                      key={art.id}
                      onClick={() => onArtworkClick(art.id)}
                      className="flex-1 relative rounded-xl overflow-hidden transition-all duration-200 active:scale-[0.985]"
                      style={{ boxShadow: "0 4px 14px rgba(80,55,28,0.11)" }}
                    >
                      <img src={art.imageUrl} alt={art.title} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 38%, rgba(38,26,12,0.7) 100%)" }} />
                      {/* Mood badge */}
                      <div className="absolute top-2 right-2">
                        <MoodPill mood={art.mood} />
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <p style={{ fontSize: "11px", color: "rgba(248,235,215,0.92)", fontFamily: "'Noto Serif SC', serif", fontWeight: 400 }}>{art.title}</p>
                        <p style={{ fontSize: "9px", color: "rgba(210,185,148,0.62)", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 300, marginTop: "1px" }}>{art.author}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* ── 入口模块 ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="px-5 mb-5 flex gap-2.5"
        >
          {[
            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(107,74,34,0.75)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, title: "公开画廊", desc: "精选公开作品" },
            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(107,74,34,0.75)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, title: "他人画廊", desc: "探索创作者" },
          ].map((item) => (
            <button
              key={item.title}
              className="flex-1 flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 active:scale-[0.983] relative overflow-hidden group"
              style={glassCard}
            >
              <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "60%", background: "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, transparent 100%)", borderRadius: "16px 16px 0 0" }} />
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl" style={{ background: "rgba(248,243,232,0.75)", border: "1.5px solid rgba(255,255,255,0.72)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)" }}>
                {item.icon}
              </div>
              <div className="flex-1 text-left relative z-10">
                <p style={{ fontSize: "12px", color: "rgba(60,46,32,0.9)", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 500 }}>{item.title}</p>
                <p style={{ fontSize: "10px", color: "rgba(130,105,78,0.52)", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 300, marginTop: "1px" }}>{item.desc}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="relative z-10"><path d="M6 4l4 4-4 4" stroke="rgba(145,115,82,0.42)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          ))}
        </motion.div>

        {/* ── 热门榜单 ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.36 }}
          className="px-5 pb-24"
        >
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontSize: "13px", color: "rgba(75,58,40,0.78)", fontFamily: "'Noto Serif SC', serif", fontWeight: 500, letterSpacing: "0.03em" }}>热门榜单</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(180,120,60,0.5)" }} />
              <p style={{ fontSize: "10px", color: "rgba(130,105,78,0.42)", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 300, letterSpacing: "0.04em" }}>实时更新</p>
            </div>
          </div>

          {/* Masonry 2-col */}
          {filteredHot.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 rounded-2xl" style={{ background: "rgba(255,252,245,0.4)", border: "1.5px solid rgba(200,175,130,0.2)" }}>
              <p style={{ fontSize: "12px", color: "rgba(130,105,78,0.45)", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 300 }}>暂无「{activeFilter}」热门作品</p>
            </div>
          ) : (
            <div className="flex gap-2.5">
              <div className="flex-1 flex flex-col gap-2.5">
                {leftCol.map((art) => (
                  <WaterfallCard key={art.id} art={art} onClick={() => onArtworkClick(art.id)} />
                ))}
              </div>
              <div className="flex-1 flex flex-col gap-2.5" style={{ marginTop: "28px" }}>
                {rightCol.map((art) => (
                  <WaterfallCard key={art.id} art={art} onClick={() => onArtworkClick(art.id)} />
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-center mt-5 gap-2">
            <div className="h-px flex-1" style={{ background: "rgba(180,155,118,0.18)" }} />
            <p style={{ fontSize: "10px", color: "rgba(145,115,82,0.35)", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 300 }}>继续滑动探索更多</p>
            <div className="h-px flex-1" style={{ background: "rgba(180,155,118,0.18)" }} />
          </div>
        </motion.div>

      </div>
    </div>
  );
}

function MoodPill({ mood }: { mood: string }) {
  return (
    <span
      className="inline-block px-1.5 py-0.5 rounded-full"
      style={{
        fontSize: "8px",
        background: "rgba(255,252,245,0.35)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.45)",
        color: "rgba(240,220,185,0.88)",
        fontFamily: "'Noto Sans SC', sans-serif",
        fontWeight: 300,
      }}
    >
      {mood}
    </span>
  );
}

function WaterfallCard({ art, onClick }: { art: typeof hotArtworks[0]; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full relative rounded-2xl overflow-hidden text-left transition-all duration-200 active:scale-[0.982]"
      style={{
        height: `${art.height}px`,
        boxShadow: "0 4px 16px rgba(80,55,28,0.1), 0 1px 4px rgba(80,55,28,0.06)",
        border: "1.5px solid rgba(255,255,255,0.72)",
      }}
    >
      <img src={art.imageUrl} alt={art.title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 38%, rgba(30,20,8,0.72) 100%)" }} />
      {/* Top badges row */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
        {/* Mood badge left */}
        <span
          className="inline-block px-1.5 py-0.5 rounded-full"
          style={{
            fontSize: "8px",
            background: "rgba(107,74,34,0.55)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,220,160,0.28)",
            color: "rgba(255,230,180,0.92)",
            fontFamily: "'Noto Sans SC', sans-serif",
            fontWeight: 400,
          }}
        >
          {art.mood}
        </span>
        {/* Style badge right */}
        <div
          className="px-1.5 py-0.5 rounded-full overflow-hidden"
          style={{ background: "rgba(255,252,245,0.52)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.65)" }}
        >
          <p style={{ fontSize: "8px", color: "rgba(107,80,48,0.75)", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 400 }}>
            {styleLabel[art.style]}
          </p>
        </div>
      </div>
      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5">
        <p style={{ fontSize: "12px", color: "rgba(245,232,210,0.94)", fontFamily: "'Noto Serif SC', serif", fontWeight: 400, marginBottom: "2px" }}>
          {art.title}
        </p>
        <p style={{ fontSize: "9px", color: "rgba(210,185,148,0.65)", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 300 }}>
          {art.author}
        </p>
      </div>
    </button>
  );
}
