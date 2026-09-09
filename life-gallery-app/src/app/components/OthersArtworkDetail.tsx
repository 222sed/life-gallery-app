import { styleLabel } from "./mockData";

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
  onViewGallery: () => void;
  onBack: () => void;
}

export function OthersArtworkDetail({ artwork, onViewGallery, onBack }: Props) {
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
        <div className="px-10 mb-6 flex justify-center">
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
              <h2 className="text-[26px] mb-1" style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 600, color: "rgba(42,28,16,0.9)" }}>
                {artwork.title}
              </h2>
              <p className="text-[13px]" style={{ color: "rgba(100,70,35,0.65)", fontFamily: "'Noto Sans SC', sans-serif" }}>
                {artwork.author}
              </p>
            </div>
            <p className="text-[11px] mt-2" style={{ color: "rgba(100,70,35,0.5)", fontFamily: "'Noto Sans SC', sans-serif" }}>
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

        {/* View gallery button */}
        <div className="px-6 pb-10 flex flex-col gap-3">
          <button
            onClick={onViewGallery}
            className="w-full py-4 rounded-2xl text-[15px] transition-all duration-200 active:scale-98 flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #5a3520 0%, #3d2410 100%)",
              color: "rgba(245,225,190,0.95)",
              fontFamily: "'Noto Sans SC', sans-serif",
              fontWeight: 500,
              boxShadow: "0 4px 20px rgba(90,53,32,0.4)",
            }}
          >
            <span>查看{artwork.author.split(" · ")[0]}的画廊</span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="rgba(245,225,190,0.95)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
