import { motion } from "motion/react";

interface Props {
  onEnter: () => void;
}

const galleryBg = "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&h=1200&fit=crop&auto=format";

export function SplashScreen({ onEnter }: Props) {
  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-between">
      {/* Background — same warm gallery as ProfilePage */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `url(${galleryBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(10px) brightness(1.06) saturate(0.85)",
        transform: "scale(1.06)",
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "rgba(250,246,238,0.82)",
      }} />
      {/* Ceiling light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{
        width: "260px", height: "220px",
        background: "radial-gradient(ellipse 130px 110px at 50% 0%, rgba(255,252,244,0.38) 0%, transparent 70%)",
        filter: "blur(20px)",
      }} />

      <div className="relative z-10 flex-1" />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-3 px-10 text-center">
        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
          style={{
            background: "rgba(255,252,245,0.62)",
            backdropFilter: "blur(28px) saturate(1.25)",
            WebkitBackdropFilter: "blur(28px) saturate(1.25)",
            border: "1.5px solid rgba(255,255,255,0.85)",
            boxShadow: "0 8px 28px rgba(100,78,52,0.1), inset 0 1.5px 0 rgba(255,255,255,0.92)",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7.5" height="9" rx="1.5" fill="rgba(140,108,62,0.22)" stroke="rgba(140,108,62,0.6)" strokeWidth="1.2" />
            <rect x="13.5" y="3" width="7.5" height="6" rx="1.5" fill="rgba(140,108,62,0.14)" stroke="rgba(140,108,62,0.42)" strokeWidth="1.2" />
            <rect x="13.5" y="12" width="7.5" height="9" rx="1.5" fill="rgba(140,108,62,0.18)" stroke="rgba(140,108,62,0.5)" strokeWidth="1.2" />
            <rect x="3" y="15" width="7.5" height="6" rx="1.5" fill="rgba(140,108,62,0.1)" stroke="rgba(140,108,62,0.35)" strokeWidth="1.2" />
          </svg>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.15 }}
          style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            color: "rgba(140,108,62,0.45)",
          }}
        >
          Life Gallery · 人生画廊
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.46, delay: 0.24 }}
          style={{
            fontFamily: "'Noto Serif SC', serif",
            fontSize: "26px",
            fontWeight: 400,
            lineHeight: 1.7,
            color: "rgba(50,38,22,0.88)",
            letterSpacing: "0.03em",
            marginTop: "6px",
          }}
        >
          你好，<br />我在等你来布置这里。
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.34 }}
          style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: "12px",
            lineHeight: 1.9,
            color: "rgba(140,108,62,0.45)",
            fontWeight: 300,
            letterSpacing: "0.04em",
            marginTop: "2px",
          }}
        >
          把每一个感受，变成只属于你的画。
        </motion.p>
      </div>

      {/* CTA */}
      <div className="relative z-10 flex flex-col items-center gap-3 pb-16 mt-14">
        <motion.button
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.44, delay: 0.44 }}
          onClick={onEnter}
          className="px-10 py-4 rounded-full transition-all duration-200 active:scale-95 relative overflow-hidden"
          style={{
            background: "rgba(255,252,245,0.68)",
            backdropFilter: "blur(28px) saturate(1.3)",
            WebkitBackdropFilter: "blur(28px) saturate(1.3)",
            border: "1.5px solid rgba(255,255,255,0.88)",
            boxShadow: "0 8px 32px rgba(100,78,42,0.12), 0 3px 10px rgba(100,78,42,0.07), inset 0 1.5px 0 rgba(255,255,255,0.95)",
          }}
        >
          <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
            height: "55%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)",
            borderRadius: "999px",
          }} />
          <span style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: "14px",
            color: "rgba(80,58,22,0.85)",
            fontWeight: 500,
            letterSpacing: "0.06em",
            position: "relative",
          }}>
            进入我的画廊
          </span>
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.58 }}
          style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: "10px",
            color: "rgba(140,108,62,0.32)",
            letterSpacing: "0.05em",
            fontWeight: 300,
          }}
        >
          轻触，开始你的第一幅
        </motion.p>
      </div>
    </div>
  );
}
