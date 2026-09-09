import { motion } from "motion/react";

interface Props {
  onBack: () => void;
}

const galleryBg = "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&h=1200&fit=crop&auto=format";

const glassCard: React.CSSProperties = {
  background: "rgba(255,252,245,0.58)",
  backdropFilter: "blur(28px) saturate(1.25)",
  WebkitBackdropFilter: "blur(28px) saturate(1.25)",
  border: "1.5px solid rgba(255,255,255,0.82)",
  boxShadow: "0 6px 24px rgba(120,90,60,0.07), 0 2px 8px rgba(120,90,60,0.04), inset 0 1.5px 0 rgba(255,255,255,0.92)",
};

const recentRecords = [
  { id: "r1", text: "今天开会后有些委屈", time: "今天 18:32" },
  { id: "r2", text: "突然很想家", time: "昨天 23:15" },
  { id: "r3", text: "总觉得自己不够好", time: "6月2日" },
];

const quickEntries = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(130,100,60,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    label: "记录一句话",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(130,100,60,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    label: "记录一张照片",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(130,100,60,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
    label: "记录一个声音",
  },
];

export function DailySketchRoom({ onBack }: Props) {
  return (
    <div className="h-full relative overflow-hidden">
      {/* Background — fixed, same as explorer page */}
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
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(250,246,238,0.82)" }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "260px", height: "180px",
          background: "radial-gradient(ellipse 130px 90px at 50% 0%, rgba(255,252,244,0.3) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Scrollable content */}
      <div className="absolute inset-0 z-10 overflow-y-auto flex flex-col" style={{ scrollbarWidth: "none" }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38 }}
          className="px-5 pt-14 pb-2"
        >
          <p style={{
            fontFamily: "'Noto Serif SC', serif",
            fontSize: "22px",
            fontWeight: 500,
            color: "rgba(50,38,22,0.92)",
            letterSpacing: "0.03em",
            marginBottom: "4px",
          }}>
            情绪工作台
          </p>
          <p style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: "12px",
            color: "rgba(130,100,62,0.52)",
            fontWeight: 300,
            letterSpacing: "0.04em",
          }}>
            有些情绪，还没有成为画。
          </p>
        </motion.div>

        {/* ── Stats card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.08 }}
          className="mx-5 mt-5 mb-5"
          style={{
            borderRadius: "16px",
            background: "rgba(255,252,245,0.62)",
            backdropFilter: "blur(28px) saturate(1.25)",
            WebkitBackdropFilter: "blur(28px) saturate(1.25)",
            border: "1.5px solid rgba(255,255,255,0.82)",
            boxShadow: "0 6px 24px rgba(120,90,60,0.07), 0 2px 8px rgba(120,90,60,0.04), inset 0 1.5px 0 rgba(255,255,255,0.92)",
          }}
        >
          <div style={{ display: "flex" }}>
            {[
              { value: "3", label: "未完成记录" },
              { value: "2", label: "等待生成" },
              { value: "8", label: "本周整理" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "22px 8px",
                  borderRight: i < 2 ? "1px solid rgba(190,162,118,0.18)" : undefined,
                }}
              >
                <p style={{
                  fontFamily: "'Noto Serif SC', serif",
                  fontSize: "28px",
                  fontWeight: 500,
                  color: "rgba(90,65,28,0.88)",
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                }}>
                  {stat.value}
                </p>
                <p style={{
                  fontFamily: "'Noto Sans SC', sans-serif",
                  fontSize: "10px",
                  color: "rgba(140,108,62,0.48)",
                  marginTop: "7px",
                  letterSpacing: "0.03em",
                  fontWeight: 300,
                }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Recent records ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.16 }}
          className="px-5 mb-5"
        >
          <p style={{
            fontFamily: "'Noto Serif SC', serif",
            fontSize: "13px",
            color: "rgba(75,58,40,0.78)",
            fontWeight: 500,
            letterSpacing: "0.04em",
            marginBottom: "12px",
          }}>
            最近记录
          </p>

          <div className="flex flex-col gap-3">
            {recentRecords.map((rec, i) => (
              <motion.button
                key={rec.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.07 }}
                className="w-full text-left rounded-2xl transition-all duration-200 active:scale-[0.983] relative overflow-hidden"
                style={glassCard}
              >
                {/* Sheen */}
                <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
                  height: "50%",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)",
                  borderRadius: "16px 16px 0 0",
                }} />
                <div className="flex items-center justify-between px-4 py-4 relative">
                  <div className="flex-1 min-w-0 pr-3">
                    <p style={{
                      fontFamily: "'Noto Sans SC', sans-serif",
                      fontSize: "13px",
                      color: "rgba(55,40,18,0.85)",
                      fontWeight: 400,
                      marginBottom: "5px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {rec.text}
                    </p>
                    <p style={{
                      fontFamily: "'Noto Sans SC', sans-serif",
                      fontSize: "10px",
                      color: "rgba(140,108,62,0.45)",
                      fontWeight: 300,
                      letterSpacing: "0.03em",
                    }}>
                      {rec.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span style={{
                      fontFamily: "'Noto Sans SC', sans-serif",
                      fontSize: "11px",
                      color: "rgba(140,108,62,0.6)",
                      letterSpacing: "0.03em",
                    }}>
                      继续整理
                    </span>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4l4 4-4 4" stroke="rgba(140,108,62,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── Quick capture ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.32 }}
          className="px-5 mb-6"
        >
          <p style={{
            fontFamily: "'Noto Serif SC', serif",
            fontSize: "13px",
            color: "rgba(75,58,40,0.78)",
            fontWeight: 500,
            letterSpacing: "0.04em",
            marginBottom: "4px",
          }}>
            捕捉这一刻
          </p>
          <p style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: "10px",
            color: "rgba(140,108,62,0.4)",
            fontWeight: 300,
            letterSpacing: "0.04em",
            marginBottom: "12px",
          }}>
            快速记录
          </p>

          <div className="flex gap-2.5">
            {quickEntries.map((entry, i) => (
              <motion.button
                key={entry.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: 0.38 + i * 0.07 }}
                className="flex-1 flex flex-col items-center gap-3 py-5 rounded-2xl transition-all duration-200 active:scale-[0.96] relative overflow-hidden"
                style={glassCard}
              >
                <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
                  height: "50%",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.26) 0%, transparent 100%)",
                  borderRadius: "16px 16px 0 0",
                }} />
                <div
                  className="w-9 h-9 flex items-center justify-center rounded-xl relative"
                  style={{
                    background: "rgba(248,243,232,0.75)",
                    border: "1.5px solid rgba(255,255,255,0.72)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
                  }}
                >
                  {entry.icon}
                </div>
                <p style={{
                  fontFamily: "'Noto Sans SC', sans-serif",
                  fontSize: "10px",
                  color: "rgba(100,75,42,0.62)",
                  letterSpacing: "0.02em",
                  fontWeight: 400,
                  textAlign: "center",
                  lineHeight: 1.4,
                  position: "relative",
                }}>
                  {entry.label}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── Footer quote ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.52 }}
          className="px-5 pb-28 mt-auto"
        >
          <div className="flex items-center gap-3 mb-4">
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(180,148,100,0.2))" }} />
            <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(180,148,100,0.28)" }} />
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(180,148,100,0.2), transparent)" }} />
          </div>
          <p style={{
            fontFamily: "'Noto Serif SC', serif",
            fontSize: "12px",
            color: "rgba(140,108,62,0.38)",
            letterSpacing: "0.06em",
            lineHeight: 2,
            textAlign: "center",
            fontWeight: 300,
          }}>
            情绪会褪色，<br />记录能帮它留下痕迹。
          </p>
        </motion.div>

      </div>
    </div>
  );
}
