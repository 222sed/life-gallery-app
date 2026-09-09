import { motion } from "motion/react";
import { artworks, styleLabel } from "./mockData";

interface Props {
  onRecord: () => void;
  onLifeGallery: () => void;
  onSketchRoom: () => void;
}

const galleryBg = "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&h=1200&fit=crop&auto=format";

const glassCard: React.CSSProperties = {
  background: "rgba(255,252,245,0.58)",
  backdropFilter: "blur(28px) saturate(1.25)",
  WebkitBackdropFilter: "blur(28px) saturate(1.25)",
  border: "1.5px solid rgba(255,255,255,0.82)",
  boxShadow: "0 6px 24px rgba(120,90,60,0.07), 0 2px 8px rgba(120,90,60,0.04), inset 0 1.5px 0 rgba(255,255,255,0.92)",
};

export function GalleryHome({ onRecord, onLifeGallery, onSketchRoom }: Props) {
  const lifeWorks = artworks.filter((a) => a.isLifeGallery).slice(0, 3);

  return (
    <div className="h-full relative overflow-hidden">
      {/* Background — fixed */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `url(${galleryBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(10px) brightness(1.06) saturate(0.85)",
        transform: "scale(1.06)",
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(250,246,238,0.82)" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{
        width: "260px", height: "180px",
        background: "radial-gradient(ellipse 130px 90px at 50% 0%, rgba(255,252,244,0.3) 0%, transparent 70%)",
        filter: "blur(20px)",
      }} />

      {/* Scrollable content */}
      <div className="absolute inset-0 z-10 overflow-y-auto flex flex-col" style={{ scrollbarWidth: "none" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="px-5 pt-14 pb-2"
        >
          <p style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: "11px",
            color: "rgba(140,108,62,0.45)",
            letterSpacing: "0.05em",
            marginBottom: "5px",
          }}>
            {new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
          </p>
          <p style={{
            fontFamily: "'Noto Serif SC', serif",
            fontSize: "22px",
            fontWeight: 500,
            color: "rgba(50,38,22,0.92)",
            letterSpacing: "0.03em",
          }}>
            今天想留下些什么？
          </p>
        </motion.div>

        {/* AI hint card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.1 }}
          className="mx-5 mt-5 mb-5 px-4 py-3.5 rounded-2xl relative overflow-hidden"
          style={glassCard}
        >
          <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
            height: "50%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.24) 0%, transparent 100%)",
            borderRadius: "16px 16px 0 0",
          }} />
          <div className="flex items-center gap-3 relative">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{
              background: "rgba(255,252,245,0.7)",
              border: "1.5px solid rgba(255,255,255,0.85)",
              boxShadow: "0 2px 8px rgba(100,78,52,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(140,108,62,0.7)" strokeWidth="1.6" strokeLinecap="round">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" fill="rgba(140,108,62,0.15)" stroke="rgba(140,108,62,0.6)" strokeWidth="1.2" />
              </svg>
            </div>
            <p style={{
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: "12px",
              lineHeight: 1.7,
              color: "rgba(85,65,35,0.62)",
              fontWeight: 300,
            }}>
              我今天好像有点什么……你来告诉我发生了什么？
            </p>
          </div>
        </motion.div>

        {/* Section cards */}
        <div className="px-5 flex flex-col gap-3 mb-5">
          {/* 人生画廊 */}
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.36, delay: 0.18 }}
            onClick={onLifeGallery}
            className="text-left px-5 py-5 rounded-3xl transition-all duration-200 active:scale-[0.983] relative overflow-hidden"
            style={glassCard}
          >
            <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
              height: "50%",
              background: "linear-gradient(180deg, rgba(255,255,255,0.26) 0%, transparent 100%)",
              borderRadius: "24px 24px 0 0",
            }} />
            <div className="flex items-start justify-between relative">
              <div>
                <p style={{
                  fontFamily: "'Noto Sans SC', sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(140,108,62,0.48)",
                  marginBottom: "5px",
                }}>
                  主展厅
                </p>
                <p style={{
                  fontFamily: "'Noto Serif SC', serif",
                  fontSize: "18px",
                  fontWeight: 500,
                  color: "rgba(50,38,22,0.88)",
                  letterSpacing: "0.02em",
                  marginBottom: "4px",
                }}>
                  人生画廊
                </p>
                <p style={{
                  fontFamily: "'Noto Sans SC', sans-serif",
                  fontSize: "11px",
                  color: "rgba(130,100,60,0.45)",
                  fontWeight: 300,
                }}>
                  {lifeWorks.length} 件作品在等你
                </p>
              </div>
              <div className="flex gap-1.5 mt-1">
                {lifeWorks.map((w) => (
                  <div key={w.id} className="w-9 h-11 rounded-xl overflow-hidden" style={{
                    boxShadow: "0 2px 8px rgba(80,60,30,0.12)",
                    border: "1px solid rgba(255,255,255,0.7)",
                  }}>
                    <img src={w.imageUrl} alt={w.title} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </motion.button>

          {/* 情绪工作台 */}
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.36, delay: 0.25 }}
            onClick={onSketchRoom}
            className="text-left px-5 py-5 rounded-3xl transition-all duration-200 active:scale-[0.983] relative overflow-hidden"
            style={{
              ...glassCard,
              background: "rgba(255,252,245,0.44)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
              height: "50%",
              background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)",
              borderRadius: "24px 24px 0 0",
            }} />
            <div className="flex items-start justify-between relative">
              <div>
                <p style={{
                  fontFamily: "'Noto Sans SC', sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(140,108,62,0.38)",
                  marginBottom: "5px",
                }}>
                  草稿间
                </p>
                <p style={{
                  fontFamily: "'Noto Serif SC', serif",
                  fontSize: "18px",
                  fontWeight: 500,
                  color: "rgba(55,42,22,0.72)",
                  letterSpacing: "0.02em",
                  marginBottom: "4px",
                }}>
                  情绪工作台
                </p>
                <p style={{
                  fontFamily: "'Noto Sans SC', sans-serif",
                  fontSize: "11px",
                  color: "rgba(130,100,60,0.38)",
                  fontWeight: 300,
                }}>
                  最近记录：昨天
                </p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(140,108,62,0.3)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: "6px" }}>
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
          </motion.button>
        </div>

        {/* Recent artworks */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36, delay: 0.32 }}
          className="px-5 mb-32"
        >
          <p style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: "11px",
            color: "rgba(140,108,62,0.42)",
            letterSpacing: "0.05em",
            marginBottom: "12px",
            fontWeight: 300,
          }}>
            最近的作品
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {artworks.slice(0, 3).map((w) => (
              <div key={w.id} className="flex flex-col gap-1.5">
                <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden relative" style={{
                  boxShadow: "0 3px 12px rgba(80,60,30,0.12), 0 1px 3px rgba(80,60,30,0.08)",
                  border: "1.5px solid rgba(255,255,255,0.72)",
                }}>
                  <img src={w.imageUrl} alt={w.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(40,28,10,0.38) 100%)" }} />
                  <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-full text-[8.5px]" style={{
                    background: "rgba(255,252,245,0.45)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.55)",
                    color: "rgba(80,58,22,0.72)",
                    fontFamily: "'Noto Sans SC', sans-serif",
                  }}>
                    {styleLabel[w.style]}
                  </span>
                </div>
                <p className="truncate" style={{
                  fontFamily: "'Noto Sans SC', sans-serif",
                  fontSize: "10px",
                  color: "rgba(100,78,42,0.55)",
                  paddingLeft: "1px",
                }}>
                  {w.title}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Floating CTA */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          onClick={onRecord}
          className="flex items-center gap-2.5 px-7 py-4 rounded-full transition-all duration-200 active:scale-95 relative overflow-hidden"
          style={{
            background: "rgba(255,252,245,0.72)",
            backdropFilter: "blur(28px) saturate(1.3)",
            WebkitBackdropFilter: "blur(28px) saturate(1.3)",
            border: "1.5px solid rgba(255,255,255,0.88)",
            boxShadow: "0 8px 32px rgba(100,78,42,0.14), 0 3px 10px rgba(100,78,42,0.08), inset 0 1.5px 0 rgba(255,255,255,0.95)",
          }}
        >
          <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
            height: "55%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)",
            borderRadius: "999px",
          }} />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(120,90,40,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ position: "relative" }}>
            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <span style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: "14px",
            color: "rgba(80,58,22,0.88)",
            fontWeight: 500,
            letterSpacing: "0.04em",
            position: "relative",
          }}>
            记录今天
          </span>
        </motion.button>
      </div>
    </div>
  );
}
