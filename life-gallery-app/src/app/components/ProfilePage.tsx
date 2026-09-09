import { User, Settings, Bell, Clock, Users, Sparkles } from "lucide-react";
import { motion } from "motion/react";
const galleryBg = "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&h=1200&fit=crop&auto=format";

interface ProfilePageProps {
  onBack?: () => void;
  onAvatarManagement?: () => void;
}

export function ProfilePage({ onBack, onAvatarManagement }: ProfilePageProps) {
  return (
    <div className="h-full relative overflow-hidden">
      {/* Blurred gallery background — fixed to frame, never scrolls */}
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
          width: "260px",
          height: "180px",
          background: "radial-gradient(ellipse 130px 90px at 50% 0%, rgba(255,252,244,0.32) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Scrollable content layer */}
      <div className="absolute inset-0 z-10 overflow-y-auto flex flex-col" style={{ scrollbarWidth: "none" }}>

      {/* ── Avatar + Name ── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative flex-shrink-0 pt-16 pb-9 px-6 flex flex-col items-center z-10"
      >
        {/* Avatar — slightly smaller */}
        <div
          className="w-[72px] h-[72px] rounded-full mb-3.5 flex items-center justify-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,251,242,0.7) 0%, rgba(248,243,230,0.6) 100%)",
            backdropFilter: "blur(28px) saturate(1.3)",
            WebkitBackdropFilter: "blur(28px) saturate(1.3)",
            border: "1.5px solid rgba(255,255,255,0.82)",
            boxShadow: "0 10px 36px rgba(120,90,60,0.11), 0 3px 10px rgba(120,90,60,0.06), inset 0 1.5px 0 rgba(255,255,255,0.92), inset 0 -2px 4px rgba(180,150,120,0.07)",
          }}
        >
          <User size={30} strokeWidth={1.4} style={{ color: "#a08860", opacity: 0.85 }} />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(128deg, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.14) 44%, transparent 64%)",
              borderRadius: "50%",
            }}
          />
        </div>

        <h1
          style={{
            fontFamily: "'Noto Serif SC', serif",
            fontSize: "18px",
            color: "rgba(55,44,32,0.95)",
            fontWeight: 500,
            letterSpacing: "0.04em",
            textShadow: "0 1px 2px rgba(255,255,255,0.75)",
            marginBottom: "3px",
          }}
        >
          画廊访客
        </h1>
        <p
          style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: "12px",
            color: "rgba(110,90,68,0.62)",
            letterSpacing: "0.05em",
            fontWeight: 300,
            textShadow: "0 1px 1px rgba(255,255,255,0.55)",
          }}
        >
          记录情绪，收藏人生
        </p>
      </motion.div>

      {/* ── Stats ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        className="relative flex-shrink-0 px-5 mb-5 z-10"
      >
        <div className="flex gap-2.5">
          <StatCard number={12} label="作品" delay={0.25} />
          <StatCard number={48} label="记录" delay={0.3} />
          <StatCard number={156} label="收藏" delay={0.35} />
        </div>
      </motion.div>

      {/* ── Menu ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.38 }}
        className="relative flex-1 px-5 pb-24 z-10"
        style={{ display: "flex", flexDirection: "column", gap: "9px" }}
      >
        <MenuItem
          icon={<Sparkles size={17} strokeWidth={1.6} />}
          title="分身管理"
          description="管理你的虚拟分身与人格"
          onClick={() => onAvatarManagement?.()}
          delay={0.42}
        />
        <MenuItem
          icon={<Clock size={17} strokeWidth={1.6} />}
          title="时光回顾"
          description="回顾过往的情绪瞬间"
          onClick={() => {}}
          delay={0.47}
        />
        <MenuItem
          icon={<Users size={17} strokeWidth={1.6} />}
          title="到访记录"
          description="查看访客与互动历史"
          onClick={() => {}}
          delay={0.52}
        />
        <MenuItem
          icon={<Settings size={17} strokeWidth={1.6} />}
          title="设置"
          description="偏好设置与账户管理"
          onClick={() => {}}
          delay={0.57}
        />
        <MenuItem
          icon={<Bell size={17} strokeWidth={1.6} />}
          title="通知"
          description="查看系统消息与提醒"
          onClick={() => {}}
          delay={0.62}
        />
      </motion.div>
      </div>  {/* end scrollable content layer */}
    </div>
  );
}

function StatCard({ number, label, delay }: { number: number; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay }}
      className="flex-1 relative overflow-hidden"
      style={{
        borderRadius: "18px",
        padding: "14px 12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "3px",
        background: "rgba(255,252,245,0.62)",
        backdropFilter: "blur(28px) saturate(1.25)",
        WebkitBackdropFilter: "blur(28px) saturate(1.25)",
        border: "1.5px solid rgba(255,255,255,0.86)",
        boxShadow: "0 6px 24px rgba(120,90,60,0.07), 0 2px 6px rgba(120,90,60,0.04), inset 0 1.5px 0 rgba(255,255,255,0.95), inset 0 -1.5px 3px rgba(200,170,140,0.08)",
      }}
    >
      {/* Top glass sheen */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "52%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.06) 70%, transparent 100%)",
          borderRadius: "18px 18px 0 0",
        }}
      />
      <div
        style={{
          fontFamily: "'Noto Serif SC', serif",
          fontSize: "22px",
          color: "rgba(132,104,74,0.93)",
          fontWeight: 500,
          lineHeight: 1,
          letterSpacing: "0.01em",
          position: "relative",
        }}
      >
        {number}
      </div>
      <div
        style={{
          fontFamily: "'Noto Sans SC', sans-serif",
          fontSize: "11px",
          color: "rgba(125,100,76,0.58)",
          letterSpacing: "0.07em",
          fontWeight: 300,
          position: "relative",
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

function MenuItem({
  icon,
  title,
  description,
  onClick,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  delay: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.38, delay }}
      onClick={onClick}
      className="w-full flex items-center gap-3.5 transition-all duration-200 active:scale-[0.983] relative overflow-hidden group"
      style={{
        borderRadius: "16px",
        padding: "12px 14px",
        background: "rgba(255,252,245,0.56)",
        backdropFilter: "blur(32px) saturate(1.2)",
        WebkitBackdropFilter: "blur(32px) saturate(1.2)",
        border: "1.5px solid rgba(255,255,255,0.8)",
        boxShadow: "0 4px 20px rgba(120,90,60,0.06), 0 1px 6px rgba(120,90,60,0.03), inset 0 1.5px 0 rgba(255,255,255,0.9), inset 0 -1px 2px rgba(200,170,140,0.07)",
      }}
    >
      {/* Top glass sheen */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "60%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 60%, transparent 100%)",
          borderRadius: "16px 16px 0 0",
        }}
      />
      {/* Active glow */}
      <div
        className="absolute inset-0 opacity-0 group-active:opacity-100 transition-opacity duration-150 pointer-events-none"
        style={{ background: "radial-gradient(circle at center, rgba(215,185,145,0.1) 0%, transparent 70%)" }}
      />

      {/* Icon pill */}
      <div
        className="relative flex-shrink-0 flex items-center justify-center overflow-hidden"
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "11px",
          background: "rgba(248,244,234,0.72)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1.5px solid rgba(255,255,255,0.72)",
          color: "rgba(138,112,84,0.88)",
          boxShadow: "0 2px 8px rgba(120,90,60,0.06), inset 0 1.5px 0 rgba(255,255,255,0.82)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(130deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.08) 50%, transparent 70%)" }}
        />
        <div className="relative z-10">{icon}</div>
      </div>

      {/* Text */}
      <div className="flex-1 text-left relative z-10 min-w-0">
        <div
          style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: "14px",
            color: "rgba(60,48,36,0.92)",
            fontWeight: 500,
            letterSpacing: "0.01em",
            lineHeight: 1.35,
            marginBottom: "1px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: "11px",
            color: "rgba(125,100,76,0.52)",
            letterSpacing: "0.02em",
            fontWeight: 300,
            lineHeight: 1.3,
          }}
        >
          {description}
        </div>
      </div>

      {/* Chevron */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="flex-shrink-0 relative z-10 transition-transform duration-200 group-active:translate-x-0.5"
      >
        <path
          d="M6 4l4 4-4 4"
          stroke="rgba(130,105,80,0.42)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}
