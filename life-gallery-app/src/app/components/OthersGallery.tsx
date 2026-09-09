import { useState } from "react";
import { motion } from "motion/react";
import { styleLabel } from "./mockData";

interface Props {
  creator: {
    name: string;
    avatarUrl: string;
    bio: string;
  };
  artworks: Array<{
    id: string;
    title: string;
    author: string;
    date: string;
    mood: string;
    emotionTags: string[];
    description: string;
    style: string;
    imageUrl: string;
  }>;
  onArtworkClick: (artworkId: string) => void;
  onBack: () => void;
}

const galleryBg = "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&h=1200&fit=crop&auto=format";

export function OthersGallery({ creator, artworks, onArtworkClick, onBack }: Props) {
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);

  const handleArtworkClick = (artworkId: string) => {
    setSelectedArtworkId(artworkId);
    onArtworkClick(artworkId);
  };

  return (
    <div className="h-full relative overflow-hidden">
      {/* Background */}
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
          background: "radial-gradient(ellipse 130px 90px at 50% 0%, rgba(255,252,244,0.3) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Scrollable Content */}
      <div className="absolute inset-0 z-10 overflow-y-auto flex flex-col" style={{ scrollbarWidth: "none" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="px-5 pt-14 pb-5"
        >
          <div className="flex items-center justify-between mb-4">
            <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: "rgba(255,252,245,0.6)", border: "1.5px solid rgba(255,255,255,0.8)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(80,50,20,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>
            <div className="flex-1" />
          </div>

          {/* Creator info */}
          <div className="flex items-center gap-4 mb-3">
            <div
              className="w-16 h-16 rounded-full overflow-hidden"
              style={{
                border: "2.5px solid rgba(255,255,255,0.9)",
                boxShadow: "0 4px 16px rgba(120,90,60,0.15), inset 0 1px 0 rgba(255,255,255,0.5)",
              }}
            >
              <img src={creator.avatarUrl} alt={creator.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h1 style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "20px", color: "rgba(55,44,32,0.95)", fontWeight: 500, letterSpacing: "0.02em", textShadow: "0 1px 2px rgba(255,255,255,0.7)", marginBottom: "3px" }}>
                {creator.name}的画廊
              </h1>
              <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "11px", color: "rgba(110,90,68,0.55)", letterSpacing: "0.03em", fontWeight: 300 }}>
                {creator.bio}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div
            className="flex items-center gap-4 px-4 py-3 rounded-2xl"
            style={{
              background: "rgba(255,252,245,0.58)",
              backdropFilter: "blur(28px) saturate(1.25)",
              WebkitBackdropFilter: "blur(28px) saturate(1.25)",
              border: "1.5px solid rgba(255,255,255,0.82)",
              boxShadow: "0 2px 8px rgba(120,90,60,0.04), inset 0 1.5px 0 rgba(255,255,255,0.92)",
            }}
          >
            <div className="flex-1 text-center">
              <p style={{ fontSize: "16px", fontWeight: 600, color: "rgba(75,58,40,0.88)", fontFamily: "'Noto Sans SC', sans-serif", marginBottom: "2px" }}>
                {artworks.length}
              </p>
              <p style={{ fontSize: "10px", color: "rgba(130,105,78,0.5)", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 300 }}>
                作品
              </p>
            </div>
            <div className="w-px h-8" style={{ background: "rgba(180,155,118,0.22)" }} />
            <div className="flex-1 text-center">
              <p style={{ fontSize: "16px", fontWeight: 600, color: "rgba(75,58,40,0.88)", fontFamily: "'Noto Sans SC', sans-serif", marginBottom: "2px" }}>
                12
              </p>
              <p style={{ fontSize: "10px", color: "rgba(130,105,78,0.5)", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 300 }}>
                观众
              </p>
            </div>
            <div className="w-px h-8" style={{ background: "rgba(180,155,118,0.22)" }} />
            <div className="flex-1 text-center">
              <p style={{ fontSize: "16px", fontWeight: 600, color: "rgba(75,58,40,0.88)", fontFamily: "'Noto Sans SC', sans-serif", marginBottom: "2px" }}>
                38
              </p>
              <p style={{ fontSize: "10px", color: "rgba(130,105,78,0.5)", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 300 }}>
                收藏
              </p>
            </div>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.18 }}
          className="px-5 pb-24"
        >
          <div className="grid grid-cols-2 gap-3">
            {artworks.map((artwork, index) => (
              <motion.button
                key={artwork.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.24 + index * 0.05 }}
                onClick={() => handleArtworkClick(artwork.id)}
                className="relative rounded-2xl overflow-hidden text-left transition-all duration-200 active:scale-[0.97]"
                style={{
                  aspectRatio: "1",
                  boxShadow: "0 4px 16px rgba(80,55,28,0.1), 0 1px 4px rgba(80,55,28,0.06)",
                  border: "1.5px solid rgba(255,255,255,0.72)",
                }}
              >
                <img src={artwork.imageUrl} alt={artwork.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 38%, rgba(30,20,8,0.72) 100%)" }} />

                {/* Mood badge */}
                <div className="absolute top-2 right-2">
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
                    {artwork.mood}
                  </span>
                </div>

                {/* Style badge */}
                <div className="absolute top-2 left-2">
                  <div
                    className="px-1.5 py-0.5 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,252,245,0.52)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.65)" }}
                  >
                    <p style={{ fontSize: "8px", color: "rgba(107,80,48,0.75)", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 400 }}>
                      {styleLabel[artwork.style]}
                    </p>
                  </div>
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <p style={{ fontSize: "12px", color: "rgba(245,232,210,0.94)", fontFamily: "'Noto Serif SC', serif", fontWeight: 400, marginBottom: "2px" }}>
                    {artwork.title}
                  </p>
                  <p style={{ fontSize: "9px", color: "rgba(210,185,148,0.65)", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 300 }}>
                    {artwork.date}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
