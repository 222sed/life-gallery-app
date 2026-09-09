import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { styleLabel } from "./mockData";
import type { AvatarConfig } from "../types/avatar";

interface Props {
  artwork: {
    id: string;
    title: string;
    author: string;
    date: string;
    mood: string;
    emotionTags: string[];
    description: string;
    style: string;
    imageUrl: string;
  };
  creatorAvatar: AvatarConfig;
  onBack: () => void;
}

// AI导览者的故事讲述
const artworkStories: Record<string, string[]> = {
  h1: [
    "那天我独自坐在咖啡馆的角落。",
    "外面下着雨，雨滴敲打着玻璃窗。",
    "突然意识到，有些重量是无形的。",
    "但它一直在那里，从未离开。"
  ],
  h2: [
    "这是一个雾气很重的清晨。",
    "我走在长廊上，看不清前方。",
    "但我知道，只要继续走下去。",
    "终会走出这片迷雾。"
  ],
  h3: [
    "三月的阳光洒进窗户。",
    "窗外的树木开始发芽。",
    "那一刻我突然觉得。",
    "一切都会好起来的。"
  ],
  h4: [
    "记得小时候和妈妈在海边。",
    "她说我最喜欢把脚埋在沙里。",
    "海浪一次次冲刷过来。",
    "温柔得就像她的手。"
  ],
  h5: [
    "周二的咖啡时间是我的秘密。",
    "在这十五分钟里。",
    "整个世界都属于我一个人。",
    "这是一天中最安静的时刻。"
  ],
  h6: [
    "那天我爬上了屋顶。",
    "整个城市在脚下变得很小。",
    "天空变得很大很大。",
    "我第一次感受到真正的自由。"
  ],
  h7: [
    "翻到一张旧照片。",
    "那个夏天的蝉鸣又响起了。",
    "冰棍的甜味好像还在舌尖。",
    "有些时光，永远不会真正离开。"
  ],
  h8: [
    "城市的夜晚很热闹。",
    "霓虹灯下人来人往。",
    "但每个人都在独自行走。",
    "这是城市最孤独的样子。"
  ],
  default: [
    "这幅作品诞生于一个安静的午后。",
    "创作者当时正经历着复杂的情绪。",
    "每一笔触都承载着真实的感受。",
    "希望你也能从中找到共鸣。"
  ]
};

export function OthersArtworkDetailWithGuide({ artwork, creatorAvatar, onBack }: Props) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const storySegments = artworkStories[artwork.id] || artworkStories.default;

  useEffect(() => {
    if (currentStoryIndex < storySegments.length - 1) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setCurrentStoryIndex((prev) => prev + 1);
          setIsTyping(false);
        }, 800);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [currentStoryIndex, storySegments.length]);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #e8ddd0 0%, #d8cfc0 40%, #c8bfac 100%)",
        }}
      />
      {/* Gallery wall texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1766801848077-31bd1900efcc?w=800&h=1200&fit=crop&auto=format')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.18,
          filter: "saturate(0.4) brightness(0.9)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#e8ddd0]/50 via-transparent to-[#2a1c10]/60" />

      {/* Ceiling spotlight on artwork */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-80"
        style={{
          background: "radial-gradient(ellipse 120px 220px at 50% 0%, rgba(255,215,140,0.35) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full overflow-y-auto scrollbar-none">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-12 pb-4">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: "rgba(60,35,15,0.1)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(80,50,20,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <p className="text-[12px]" style={{ color: "rgba(100,70,35,0.5)", fontFamily: "'Noto Sans SC', sans-serif" }}>作品详情</p>
          <div className="w-9" />
        </div>

        {/* Artwork on gallery wall — with frame */}
        <div className="px-10 mb-5 flex justify-center">
          <div
            style={{
              padding: "14px 14px 18px 14px",
              background: "#f8f2e8",
              borderRadius: "3px",
              boxShadow: "0 8px 40px rgba(40,20,5,0.35), 0 2px 8px rgba(40,20,5,0.2), inset 0 0 0 1px rgba(180,140,80,0.25)",
            }}
          >
            {/* Artwork */}
            <div style={{ width: "230px", height: "230px", position: "relative", overflow: "hidden" }}>
              <img src={artwork.imageUrl} alt={artwork.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            {/* Mat label */}
            <div className="mt-2 text-center">
              <p style={{ fontSize: "10px", color: "rgba(100,70,35,0.4)", fontFamily: "'Noto Serif SC', serif", letterSpacing: "0.1em" }}>
                {artwork.title} · {styleLabel[artwork.style]}
              </p>
            </div>
          </div>
        </div>

        {/* AI Guide Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mx-6 mb-4"
        >
          <div
            className="px-5 py-4 rounded-3xl relative overflow-hidden"
            style={{
              background: "rgba(250,244,232,0.85)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(180,140,80,0.18)",
              boxShadow: "0 2px 16px rgba(60,35,10,0.1)",
            }}
          >
            {/* Guide header */}
            <div className="flex items-center gap-3 mb-4">
              {/* Creator avatar as guide */}
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-full overflow-hidden relative"
                  style={{
                    border: "2px solid rgba(184,122,74,0.3)",
                    boxShadow: "0 2px 8px rgba(120,90,60,0.15)",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: creatorAvatar.skin || "#fce5cd",
                    }}
                  />
                  {/* Face features */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Eyes */}
                      <div className="flex gap-4 mb-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: creatorAvatar.eyeColor || "#2a1810" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: creatorAvatar.eyeColor || "#2a1810" }}
                        />
                      </div>
                      {/* Mouth */}
                      <div
                        className="w-4 h-1.5 rounded-full mx-auto mt-3"
                        style={{
                          background: "rgba(200,100,80,0.3)",
                          transform: "translateY(4px)",
                        }}
                      />
                    </div>
                  </div>
                  {/* Hair */}
                  <div
                    className="absolute top-0 left-0 right-0 h-6 rounded-t-full"
                    style={{
                      background: creatorAvatar.hairColor || "#3a2820",
                    }}
                  />
                </div>
                {/* Breathing animation indicator */}
                <motion.div
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full"
                  style={{
                    background: "rgba(107,74,34,0.75)",
                    border: "1.5px solid rgba(250,244,232,0.9)",
                  }}
                  animate={{
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              <div className="flex-1">
                <p style={{ fontSize: "12px", color: "rgba(75,58,40,0.88)", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 500, marginBottom: "2px" }}>
                  {artwork.author.split(" · ")[0]}的分身导览
                </p>
                <p style={{ fontSize: "10px", color: "rgba(130,105,78,0.45)", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 300 }}>
                  为你讲述这幅作品的故事
                </p>
              </div>
            </div>

            {/* Story dialogue */}
            <div
              className="px-4 py-3.5 rounded-2xl relative"
              style={{
                background: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(180,140,80,0.12)",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentStoryIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="text-[13px] leading-relaxed"
                  style={{
                    color: "rgba(80,55,30,0.75)",
                    fontFamily: "'Noto Serif SC', serif",
                    fontWeight: 300,
                  }}
                >
                  {storySegments[currentStoryIndex]}
                </motion.p>
              </AnimatePresence>

              {/* Typing indicator */}
              {isTyping && currentStoryIndex < storySegments.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-1 mt-2"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-1 rounded-full"
                      style={{ background: "rgba(130,105,78,0.35)" }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </div>

            {/* Progress indicator */}
            <div className="flex gap-1.5 justify-center mt-3">
              {storySegments.map((_, index) => (
                <div
                  key={index}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: index === currentStoryIndex ? "16px" : "6px",
                    background: index <= currentStoryIndex
                      ? "rgba(184,122,74,0.5)"
                      : "rgba(180,140,80,0.15)",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Info card — cream colored */}
        <div
          className="mx-6 px-5 py-5 rounded-3xl mb-4"
          style={{
            background: "rgba(250,244,232,0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(180,140,80,0.18)",
            boxShadow: "0 2px 16px rgba(60,35,10,0.1)",
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h2 className="text-[24px] mb-1" style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 600, color: "rgba(42,28,16,0.9)" }}>
                {artwork.title}
              </h2>
              <p className="text-[12px]" style={{ color: "rgba(100,70,35,0.65)", fontFamily: "'Noto Sans SC', sans-serif" }}>
                {artwork.author}
              </p>
            </div>
            <p className="text-[11px] mt-1" style={{ color: "rgba(100,70,35,0.5)", fontFamily: "'Noto Sans SC', sans-serif" }}>
              {artwork.date}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {artwork.emotionTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-[11px]"
                style={{
                  background: "rgba(184,122,74,0.1)",
                  border: "1px solid rgba(184,122,74,0.22)",
                  color: "rgba(140,85,40,0.85)",
                  fontFamily: "'Noto Sans SC', sans-serif",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-[13px] leading-relaxed" style={{ color: "rgba(80,55,30,0.6)", fontFamily: "'Noto Serif SC', serif", fontWeight: 300 }}>
            {artwork.description}
          </p>
        </div>

        <div className="pb-10" />
      </div>
    </div>
  );
}
