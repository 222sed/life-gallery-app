import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  onComplete: () => void;
}

const styleProps = [
  {
    id: "watercolor",
    label: "水彩笔",
    icon: "💧",
    desc: "这种感觉正在慢慢晕开",
    recommended: true,
  },
  {
    id: "pencil",
    label: "铅笔",
    icon: "✏️",
    desc: "有一种未完成的诚实",
    recommended: false,
  },
  {
    id: "oil",
    label: "油画笔",
    icon: "🎨",
    desc: "沉甸甸的，有分量",
    recommended: false,
  },
  {
    id: "crayon",
    label: "蜡笔",
    icon: "🖍️",
    desc: "像儿时的颜色",
    recommended: false,
  },
];

const galleryBg = "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&h=1200&fit=crop&auto=format";

export function ArtworkGenerating({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"choose" | "generating">("choose");
  const [selectedStyle, setSelectedStyle] = useState(styleProps[0]);

  useEffect(() => {
    if (phase !== "generating") return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 600);
          return 100;
        }
        return p + Math.random() * 4 + 1;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [phase, onComplete]);

  if (phase === "choose") {
    return (
      <div className="relative w-full h-full overflow-hidden flex flex-col">
        {/* Background — same as ProfilePage */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `url(${galleryBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(10px) brightness(1.06) saturate(0.85)",
          transform: "scale(1.06)",
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "linear-gradient(180deg, rgba(252,249,243,0.64) 0%, rgba(248,244,236,0.72) 55%, rgba(244,239,228,0.76) 100%)",
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{
          width: "260px", height: "180px",
          background: "radial-gradient(ellipse 130px 90px at 50% 0%, rgba(255,252,244,0.3) 0%, transparent 70%)",
          filter: "blur(20px)",
        }} />

        <div className="relative z-10 flex flex-col h-full px-5 pt-14 pb-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38 }}
            className="mb-6"
          >
            <p style={{
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(140,108,62,0.5)",
              marginBottom: "6px",
            }}>
              风格道具宣告
            </p>
            <h2 style={{
              fontFamily: "'Noto Serif SC', serif",
              fontSize: "22px",
              fontWeight: 400,
              color: "rgba(50,38,22,0.9)",
              letterSpacing: "0.03em",
              marginBottom: "6px",
            }}>
              用什么来记录今天？
            </h2>
            <p style={{
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: "12px",
              color: "rgba(130,100,62,0.48)",
              fontWeight: 300,
              letterSpacing: "0.03em",
            }}>
              每种工具都有它的情绪。
            </p>
          </motion.div>

          {/* Style grid */}
          <div className="grid grid-cols-2 gap-3 flex-1">
            {styleProps.map((s, i) => (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.34, delay: 0.1 + i * 0.07 }}
                onClick={() => { setSelectedStyle(s); setPhase("generating"); }}
                className="flex flex-col items-center justify-center gap-3 py-7 rounded-3xl transition-all duration-200 active:scale-[0.96] relative overflow-hidden"
                style={{
                  background: "rgba(255,252,245,0.58)",
                  backdropFilter: "blur(28px) saturate(1.25)",
                  WebkitBackdropFilter: "blur(28px) saturate(1.25)",
                  border: "1.5px solid rgba(255,255,255,0.82)",
                  boxShadow: "0 4px 18px rgba(100,78,52,0.07), 0 1px 4px rgba(100,78,52,0.04), inset 0 1.5px 0 rgba(255,255,255,0.92)",
                }}
              >
                {/* Top glass sheen */}
                <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
                  height: "50%",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, transparent 100%)",
                  borderRadius: "24px 24px 0 0",
                }} />

                {/* Recommended badge */}
                {s.recommended && (
                  <div
                    className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full flex items-center gap-1"
                    style={{
                      background: "linear-gradient(135deg, rgba(212,160,48,0.88) 0%, rgba(180,128,32,0.92) 100%)",
                      border: "1px solid rgba(255,230,160,0.35)",
                      boxShadow: "0 2px 8px rgba(180,128,32,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
                    }}
                  >
                    <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
                      <path d="M4 0.5L4.93 3.05H7.63L5.35 4.7L6.28 7.25L4 5.6L1.72 7.25L2.65 4.7L0.37 3.05H3.07L4 0.5Z" fill="rgba(255,245,210,0.95)" />
                    </svg>
                    <span style={{
                      fontFamily: "'Noto Sans SC', sans-serif",
                      fontSize: "8.5px",
                      color: "rgba(255,245,210,0.96)",
                      fontWeight: 500,
                      letterSpacing: "0.04em",
                    }}>
                      推荐
                    </span>
                  </div>
                )}

                <span style={{ fontSize: "28px", lineHeight: 1, position: "relative" }}>{s.icon}</span>
                <div className="text-center px-2 relative">
                  <p style={{
                    fontFamily: "'Noto Sans SC', sans-serif",
                    fontSize: "14px",
                    color: "rgba(55,40,18,0.88)",
                    fontWeight: 500,
                    marginBottom: "4px",
                  }}>
                    {s.label}
                  </p>
                  <p style={{
                    fontFamily: "'Noto Sans SC', sans-serif",
                    fontSize: "10.5px",
                    color: "rgba(120,90,50,0.48)",
                    lineHeight: 1.5,
                    fontWeight: 300,
                  }}>
                    {s.desc}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Secondary props */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, delay: 0.42 }}
            className="flex gap-3 mt-4"
          >
            {[{ label: "纸张肌理", icon: "📄" }, { label: "柔光光源", icon: "☀️" }].map((item) => (
              <button
                key={item.label}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl transition-all duration-200 active:scale-[0.97] relative overflow-hidden"
                style={{
                  background: "rgba(255,252,245,0.45)",
                  backdropFilter: "blur(20px) saturate(1.15)",
                  WebkitBackdropFilter: "blur(20px) saturate(1.15)",
                  border: "1.5px solid rgba(255,255,255,0.75)",
                  boxShadow: "0 2px 10px rgba(100,78,52,0.05), inset 0 1px 0 rgba(255,255,255,0.85)",
                }}
              >
                <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "55%", background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)", borderRadius: "16px 16px 0 0" }} />
                <span style={{ fontSize: "14px" }}>{item.icon}</span>
                <p style={{
                  fontFamily: "'Noto Sans SC', sans-serif",
                  fontSize: "12px",
                  color: "rgba(110,82,48,0.52)",
                  fontWeight: 300,
                  letterSpacing: "0.02em",
                  position: "relative",
                }}>
                  {item.label}
                </p>
              </button>
            ))}
          </motion.div>

        </div>
      </div>
    );
  }

  // Generating phase
  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `url(${galleryBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(14px) brightness(1.04) saturate(0.8)",
        transform: "scale(1.06)",
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(180deg, rgba(252,249,243,0.7) 0%, rgba(248,244,236,0.78) 60%, rgba(244,239,228,0.82) 100%)",
      }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{
        width: "300px", height: "240px",
        background: "radial-gradient(ellipse 150px 120px at 50% 0%, rgba(255,252,244,0.35) 0%, transparent 70%)",
        filter: "blur(20px)",
      }} />

      <div className="relative z-10 flex flex-col items-center px-8 text-center gap-7">
        {/* Artwork frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            padding: "14px",
            background: "rgba(255,252,245,0.62)",
            backdropFilter: "blur(28px) saturate(1.2)",
            WebkitBackdropFilter: "blur(28px) saturate(1.2)",
            borderRadius: "4px",
            boxShadow: [
              "inset 3px 3px 0 rgba(255,255,255,0.95)",
              "inset -3px -3px 0 rgba(180,174,165,0.45)",
              "inset 6px 6px 12px rgba(200,196,190,0.18)",
              "0 18px 48px rgba(80,60,32,0.16)",
              "0 6px 16px rgba(80,60,32,0.1)",
            ].join(", "),
            border: "1.5px solid rgba(255,255,255,0.85)",
          }}
        >
          <div style={{
            width: "200px",
            height: "200px",
            background: `linear-gradient(${progress * 3}deg, rgba(185,200,210,${0.15 + progress * 0.007}) 0%, rgba(210,185,150,${0.15 + progress * 0.007}) 50%, rgba(218,175,162,${0.15 + progress * 0.007}) 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
          }}>
            <span style={{ fontSize: "44px", filter: "blur(0.5px)", opacity: 0.45 + progress * 0.004 }}>
              {selectedStyle.icon}
            </span>
            {/* Scan line effect */}
            <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: `${Math.min(progress, 100)}%`,
              background: "linear-gradient(180deg, rgba(255,248,235,0.04) 0%, rgba(255,245,225,0.06) 100%)",
              transition: "height 0.3s ease",
              pointerEvents: "none",
            }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <p style={{
            fontFamily: "'Noto Serif SC', serif",
            fontSize: "13px",
            lineHeight: 1.9,
            color: "rgba(85,62,30,0.55)",
            fontWeight: 300,
          }}>
            我要用{selectedStyle.label}来记录今天，<br />
            因为{selectedStyle.desc}。
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="w-full max-w-[180px]"
        >
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: "3px", background: "rgba(190,165,125,0.2)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: "linear-gradient(90deg, rgba(180,140,72,0.7) 0%, rgba(160,120,55,0.9) 100%)",
              }}
            />
          </div>
          <p style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: "10px",
            color: "rgba(140,108,62,0.38)",
            marginTop: "8px",
            letterSpacing: "0.04em",
          }}>
            {progress < 100 ? "正在为你绘制……" : "完成了"}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
