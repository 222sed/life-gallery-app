import { artworks, styleLabel } from "./mockData";
import doorThresholdImg from "../../imports/_____20260608023451_3917_642.png";

interface Props {
  onBack: () => void;
  onToLifeGallery: () => void;
  onToSketchRoom: () => void;
}

export function ArtworkDetail({ onBack, onToLifeGallery, onToSketchRoom }: Props) {
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
        <div className="flex items-center justify-between px-6 pt-11 pb-2">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: "rgba(60,35,15,0.1)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(80,50,20,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <p className="text-[12px]" style={{ color: "rgba(100,70,35,0.5)", fontFamily: "'Noto Sans SC', sans-serif" }}>生成作品</p>
          <div className="w-9" />
        </div>

        {/* Artwork on gallery wall — with frame */}
        <div className="px-10 mb-3 flex justify-center">
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
              <img
                src={artworks[0].imageUrl.includes('_____20260608023451_3917_642.png') ? doorThresholdImg : artworks[0].imageUrl}
                alt={artworks[0].title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            {/* Mat label */}
            <div className="mt-2 text-center">
              <p style={{ fontSize: "10px", color: "rgba(100,70,35,0.4)", fontFamily: "'Noto Serif SC', serif", letterSpacing: "0.1em" }}>
                {artworks[0].title} · {styleLabel[artworks[0].style]}
              </p>
            </div>
          </div>
        </div>

        {/* Info card — cream colored */}
        <div
          className="mx-6 px-5 py-4 rounded-3xl mb-2"
          style={{
            background: "rgba(250,244,232,0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(180,140,80,0.18)",
            boxShadow: "0 2px 16px rgba(60,35,10,0.1)",
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-[26px]" style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 600, color: "rgba(42,28,16,0.9)" }}>
              {artworks[0].title}
            </h2>
            <p className="text-[11px] mt-2" style={{ color: "rgba(100,70,35,0.5)", fontFamily: "'Noto Sans SC', sans-serif" }}>
              {artworks[0].date}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {artworks[0].emotionTags.map((tag) => (
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
            {artworks[0].description}
          </p>
        </div>

        {/* Privacy */}
        <div className="mx-6 mb-3">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: "rgba(240,230,210,0.6)", border: "1px solid rgba(180,140,80,0.14)" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(120,80,35,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <p className="flex-1 text-[13px]" style={{ color: "rgba(100,68,30,0.55)", fontFamily: "'Noto Sans SC', sans-serif" }}>
              仅自己可见
            </p>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(120,80,35,0.3)" strokeWidth="1.5" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-28 flex flex-col gap-3">
          <button
            onClick={onToLifeGallery}
            className="w-full py-4 rounded-2xl text-[15px] transition-all duration-200 active:scale-98"
            style={{
              background: "linear-gradient(135deg, #5a3520 0%, #3d2410 100%)",
              color: "rgba(245,225,190,0.95)",
              fontFamily: "'Noto Sans SC', sans-serif",
              fontWeight: 500,
              boxShadow: "0 4px 20px rgba(90,53,32,0.4)",
            }}
          >
            挂入人生画廊
          </button>
          <button
            onClick={onToSketchRoom}
            className="w-full py-4 rounded-2xl text-[14px] transition-all duration-200 active:scale-98"
            style={{
              background: "rgba(240,228,210,0.7)",
              border: "1px solid rgba(180,140,80,0.2)",
              color: "rgba(90,60,25,0.7)",
              fontFamily: "'Noto Sans SC', sans-serif",
              backdropFilter: "blur(12px)",
            }}
          >
            存入日常速写间
          </button>
        </div>
      </div>
    </div>
  );
}
