import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { artworks, dailySketches, styleLabel } from "./mockData";
import useEmblaCarousel from "embla-carousel-react";
import doorThresholdImg from "../../imports/_____20260608023451_3917_642.png";

export type GalleryType = "main" | "daily";

// Helper function to get image source
const getImageSrc = (imageUrl: string) => {
  if (imageUrl.includes("_____20260608023451_3917_642.png")) {
    return doorThresholdImg;
  }
  return imageUrl;
};

interface Props {
  galleryType?: GalleryType;
  onSwitchGallery: (type: GalleryType) => void;
  onArtworkDetail: () => void;
}

const artworkSizes = [
  { w: 200, h: 260 },
  { w: 240, h: 190 },
  { w: 215, h: 215 },
  { w: 180, h: 250 },
  { w: 250, h: 200 },
  { w: 205, h: 235 },
];

// Recent works for the panel — combine life + daily, interleaved
const recentWorks = [
  ...artworks.filter((a) => a.isLifeGallery),
  ...artworks.filter((a) => a.isDailyGallery),
  ...dailySketches.map((d) => ({
    id: d.id,
    title: d.title,
    date: d.date,
    style: d.style,
    imageUrl: d.imageUrl,
    emotionTags: [`#${d.emotionTag}`],
    description: "",
    isLifeGallery: false,
    isDailyGallery: false,
  })),
];

// Split into two columns for masonry layout
const col1 = recentWorks.filter((_, i) => i % 2 === 0);
const col2 = recentWorks.filter((_, i) => i % 2 === 1);

// Thumbnail heights that alternate to create natural masonry variance
const thumbHeights = [120, 90, 110, 80, 130, 95, 105, 85];

export function LifeGalleryHall({ galleryType = "main", onSwitchGallery, onArtworkDetail }: Props) {
  const galleryArtworks = artworks.filter((a) =>
    galleryType === "main" ? a.isLifeGallery : a.isDailyGallery
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [spotlightOn, setSpotlightOn] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const [spotMode, setSpotMode] = useState<"rise" | "fade" | "cut">("cut");
  const spotTransition =
    spotMode === "rise" ? "opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1)" :
    spotMode === "fade" ? "opacity 0.3s cubic-bezier(0.4, 0, 1, 1)" :
                         "opacity 0.08s ease";

  // Swipe-up detection refs
  const swipeStartY = useRef(0);
  const swipeStartX = useRef(0);
  const swipeDir = useRef<"h" | "v" | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "center" });
  const floorPlaneRef = useRef<HTMLDivElement>(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
    setSpotMode("cut");
    setSpotlightOn(false);
    setInfoOpen(false);
    setDropdownOpen(false);
  }, [emblaApi]);

  const onScrollFloor = useCallback(() => {
    if (!emblaApi) return;
    const progress = emblaApi.scrollProgress();
    const totalSlides = galleryType === "main"
      ? artworks.filter((a) => a.isLifeGallery).length
      : artworks.filter((a) => a.isDailyGallery).length;
    const span = Math.max(1, totalSlides - 1);

    // Floor parallax
    if (floorPlaneRef.current) {
      const offsetX = -progress * 72 * span;
      const p = `${offsetX}px 0px`;
      // 6 layers: 4 pattern layers parallax, color-vary parallax, base fixed
      floorPlaneRef.current.style.backgroundPosition = `${p}, ${p}, ${p}, ${p}, ${p}, 0 0`;
    }

  }, [emblaApi, galleryType]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", onScrollFloor);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("scroll", onScrollFloor);
    };
  }, [emblaApi, onSelect, onScrollFloor]);

  useEffect(() => {
    setCurrentIndex(0);
    setSpotlightOn(false);
    setInfoOpen(false);
    setPanelOpen(false);
    emblaApi?.scrollTo(0, true);
    if (floorPlaneRef.current) floorPlaneRef.current.style.backgroundPosition = "";
  }, [galleryType, emblaApi]);

  // ── Swipe-up gesture handlers ──
  const onRootTouchStart = (e: React.TouchEvent) => {
    if (panelOpen) return;
    swipeStartY.current = e.touches[0].clientY;
    swipeStartX.current = e.touches[0].clientX;
    swipeDir.current = null;
  };
  const onRootTouchMove = (e: React.TouchEvent) => {
    if (panelOpen || swipeDir.current === "h") return;
    const dy = Math.abs(e.touches[0].clientY - swipeStartY.current);
    const dx = Math.abs(e.touches[0].clientX - swipeStartX.current);
    if (swipeDir.current === null && (dx > 5 || dy > 5)) {
      swipeDir.current = dx > dy ? "h" : "v";
    }
  };
  const onRootTouchEnd = (e: React.TouchEvent) => {
    if (panelOpen || swipeDir.current !== "v") return;
    const dy = e.changedTouches[0].clientY - swipeStartY.current;
    if (dy < -55) setPanelOpen(true);
  };


  const galleryTitle = galleryType === "main" ? "人生画廊·主展厅" : "人生画廊·日常展厅";

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col"
      onTouchStart={onRootTouchStart}
      onTouchMove={onRootTouchMove}
      onTouchEnd={onRootTouchEnd}
    >

      {/* ── GALLERY WALL (Warm White Exhibition Space) ── */}
      {galleryType === "main" ? (<>
        {/* Base wall: warm white / cream / soft beige */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, #faf8f3 0%, #f7f4ee 35%, #f4f0e8 50%, #f0ebe2 68%, #d8c8a8 72%, #c4b088 80%, #8a7050 90%)",
        }} />
        {/* Very subtle wall texture */}
        <svg className="absolute pointer-events-none" style={{ top: 0, left: 0, width: "100%", height: "72%", opacity: 0.012 }}>
          <filter id="soft-plaster-m"><feTurbulence type="fractalNoise" baseFrequency="0.42 0.58" numOctaves="3" seed="9" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
          <rect width="100%" height="100%" filter="url(#soft-plaster-m)"/>
        </svg>
        {/* Warm ceiling light wash */}
        {[25, 50, 75].map((x, i) => (
          <div key={i} className="absolute pointer-events-none" style={{
            top: "2%", left: `${x}%`, transform: "translateX(-50%)",
            width: "220px", height: "300px",
            background: `radial-gradient(ellipse 100px 180px at 50% 0%, rgba(255,250,238,${i===1?0.28:0.18}) 0%, rgba(255,245,220,${i===1?0.08:0.04}) 50%, transparent 100%)`,
            filter: "blur(20px)",
          }} />
        ))}
        {/* Very subtle wainscoting hint (thin, barely visible) */}
        <div className="absolute left-0 right-0 pointer-events-none" style={{
          top: "calc(52% - 1px)", height: "1px",
          background: "rgba(210,195,170,0.15)",
        }} />
      </>) : (<>
        {/* Daily gallery: same warm white palette */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, #fdfcf8 0%, #f9f7f1 40%, #f5f2ea 68%, #dccba8 72%, #c8b590 82%, #a08860 92%)",
        }} />
        <svg className="absolute pointer-events-none" style={{ top: 0, left: 0, width: "100%", height: "72%", opacity: 0.015 }}>
          <filter id="soft-wall-d"><feTurbulence type="fractalNoise" baseFrequency="0.38 0.52" numOctaves="3" seed="5" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
          <rect width="100%" height="100%" filter="url(#soft-wall-d)"/>
        </svg>
        <div className="absolute pointer-events-none" style={{ top: 0, left: 0, right: 0, height: "35%", background: "linear-gradient(180deg, rgba(255,252,245,0.25) 0%, transparent 100%)" }} />
      </>)}

      {/* Wood floor — soft, light wood tone with subtle blur */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{
        height: "28%",
        perspective: "180px",
        perspectiveOrigin: "50% 0%",
      }}>
        <div ref={floorPlaneRef} style={{
          position: "absolute", top: 0,
          left: "-50%",
          width: "200%",
          height: "230%",
          transformOrigin: "50% 0%",
          transform: "rotateX(44deg)",
          backgroundImage: `
            repeating-linear-gradient(90deg,
              rgba(120,95,65,0.06) 0px, rgba(120,95,65,0.06) 1px,
              transparent 1px, transparent 28px),
            repeating-linear-gradient(0deg,
              rgba(105,82,55,0.04) 0px, rgba(105,82,55,0.04) 1px,
              transparent 1px, transparent 180px),
            linear-gradient(180deg, #e8dcc8 0%, #d8ccb8 30%, #c8b8a0 60%, #a8906a 90%)
          `,
          filter: "blur(0.5px)",
        }}>
          {/* Soft ceiling light reflection on floor */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: "40%",
            background: "linear-gradient(180deg, rgba(255,250,240,0.35) 0%, rgba(255,245,228,0.12) 50%, transparent 100%)",
            pointerEvents: "none",
          }} />
          {/* Subtle depth fade */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: "45%",
            background: "linear-gradient(0deg, rgba(100,80,52,0.25) 0%, transparent 100%)",
            pointerEvents: "none",
          }} />
        </div>
      </div>

      {/* Subtle baseboard hint */}
      <div className="absolute left-0 right-0" style={{
        top: "72%", height: "8px",
        background: "linear-gradient(180deg, #c8b088 0%, #a89870 100%)",
        boxShadow: "0 2px 6px rgba(80,60,35,0.12)",
        opacity: 0.6,
      }} />

      {/* Very subtle side vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(90deg, rgba(180,160,130,0.04) 0%, transparent 20%, transparent 80%, rgba(180,160,130,0.04) 100%)",
      }} />

      {/* Ceiling track rail */}
      <div className="absolute top-0 left-0 right-0 flex items-start justify-center pt-0.5 pointer-events-none">
        <div className="w-[85%] h-[4px] rounded-b-sm" style={{
          background: galleryType === "main"
            ? "linear-gradient(90deg, transparent, rgba(90,75,52,0.38) 15%, rgba(100,82,56,0.44) 50%, rgba(90,75,52,0.38) 85%, transparent)"
            : "linear-gradient(90deg, transparent, rgba(150,144,136,0.28) 15%, rgba(158,152,144,0.32) 50%, rgba(150,144,136,0.28) 85%, transparent)",
        }} />
      </div>

      {/* Track light fixtures */}
      {[20, 50, 80].map((x, i) => (
        <div key={i} className="absolute top-0 pointer-events-none flex flex-col items-center"
          style={{ left: `${x}%`, transform: "translateX(-50%)" }}>
          <div style={{
            width: galleryType === "main" ? "8px" : "6px",
            height: "12px",
            background: galleryType === "main"
              ? "linear-gradient(180deg, rgba(80,65,42,0.85) 0%, rgba(58,45,28,0.9) 100%)"
              : "rgba(188,184,178,0.55)",
            borderRadius: "0 0 4px 4px", marginTop: "4px",
            boxShadow: galleryType === "main"
              ? "inset 0 1px 0 rgba(200,170,100,0.35), 0 2px 6px rgba(0,0,0,0.3)"
              : "inset 0 1px 0 rgba(255,255,255,0.4)",
          }} />
          {/* Cone beam visible on wall */}
          <div style={{
            width: 0, height: 0,
            borderLeft: "28px solid transparent", borderRight: "28px solid transparent",
            borderTop: galleryType === "main"
              ? `80px solid rgba(255,234,172,${i === 1 ? 0.18 : 0.11})`
              : `90px solid rgba(255,252,242,${i === 1 ? 0.12 : 0.08})`,
            filter: "blur(5px)", marginTop: "-1px",
          }} />
        </div>
      ))}

      {/* Ambient dimming — create contrast for spotlight */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 45% 50% at 50% 30%, transparent 0%, rgba(60,50,38,0.42) 100%)",
        opacity: spotlightOn ? 1 : 0, transition: spotTransition,
      }} />
      {/* Side dimming for contrast */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(90deg, rgba(70,58,45,0.35) 0%, transparent 25%, transparent 75%, rgba(70,58,45,0.35) 100%)",
        opacity: spotlightOn ? 1 : 0, transition: spotTransition,
      }} />
      {/* Top & bottom dimming */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(180deg, rgba(65,54,42,0.22) 0%, transparent 20%, transparent 68%, rgba(55,45,35,0.38) 100%)",
        opacity: spotlightOn ? 1 : 0, transition: spotTransition,
      }} />

      {/* Main spotlight cone — outer soft glow */}
      <div className="absolute pointer-events-none" style={{
        top: 0, left: "50%", transform: "translateX(-50%)",
        width: "360px", height: "580px",
        background: "radial-gradient(ellipse 125px 360px at 50% 0%, rgba(255,248,230,0.88) 0%, rgba(255,245,220,0.58) 25%, rgba(252,240,210,0.32) 45%, rgba(248,235,200,0.12) 65%, transparent 80%)",
        filter: "blur(16px)", opacity: spotlightOn ? 1 : 0, transition: spotTransition,
      }} />
      {/* Spotlight cone — crisp bright inner beam */}
      <div className="absolute pointer-events-none" style={{
        top: 0, left: "50%", transform: "translateX(-50%)",
        width: "220px", height: "520px",
        background: "radial-gradient(ellipse 72px 310px at 50% 0%, rgba(255,252,245,0.98) 0%, rgba(255,250,238,0.78) 18%, rgba(255,248,230,0.52) 38%, rgba(255,245,220,0.22) 58%, transparent 75%)",
        filter: "blur(4px)", opacity: spotlightOn ? 1 : 0, transition: spotTransition,
      }} />
      {/* Core beam — sharp center */}
      <div className="absolute pointer-events-none" style={{
        top: 0, left: "50%", transform: "translateX(-50%)",
        width: "140px", height: "480px",
        background: "radial-gradient(ellipse 45px 260px at 50% 0%, rgba(255,253,248,1) 0%, rgba(255,251,242,0.85) 15%, rgba(255,248,235,0.45) 42%, transparent 68%)",
        filter: "blur(1px)", opacity: spotlightOn ? 1 : 0, transition: spotTransition,
      }} />
      {/* Wall spotlight — bright warm oval where beam hits */}
      <div className="absolute pointer-events-none" style={{
        top: "65px", left: "50%", transform: "translateX(-50%)",
        width: "340px", height: "300px",
        background: "radial-gradient(ellipse 140px 165px at 50% 45%, rgba(255,252,242,0.72) 0%, rgba(255,248,235,0.48) 30%, rgba(255,245,225,0.22) 55%, rgba(252,240,215,0.08) 72%, transparent 85%)",
        filter: "blur(20px)", opacity: spotlightOn ? 1 : 0, transition: spotTransition,
      }} />

      {/* ── HEADER (Liquid Glass) ── */}
      <div className="relative z-20 flex items-center justify-center px-6 pt-11 pb-2">
        <button
          onClick={() => { setDropdownOpen((o) => !o); if (!dropdownOpen) setPanelOpen(false); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-200 active:scale-95 relative overflow-hidden"
          style={{
            background: "rgba(255,252,245,0.55)",
            backdropFilter: "blur(20px) saturate(1.15)",
            WebkitBackdropFilter: "blur(20px) saturate(1.15)",
            border: "1.5px solid rgba(255,255,255,0.75)",
            boxShadow: dropdownOpen
              ? "0 6px 20px rgba(100,80,52,0.12), inset 0 1px 0 rgba(255,255,255,0.85)"
              : "0 3px 12px rgba(100,80,52,0.08), inset 0 1px 0 rgba(255,255,255,0.85)",
          }}
        >
          <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
            height: "60%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, transparent 100%)",
            borderRadius: "12px 12px 0 0",
          }} />
          <p style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "13px", fontWeight: 500, color: "rgba(60,48,36,0.85)", letterSpacing: "0.05em", position: "relative", zIndex: 1 }}>
            {galleryTitle}
          </p>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"
            style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease", flexShrink: 0, position: "relative", zIndex: 1 }}>
            <path d="M1 1L5 5L9 1" stroke="rgba(130,105,80,0.48)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* ── DROPDOWN (Liquid Glass) ── */}
      {dropdownOpen && (
        <>
          <div className="absolute inset-0 z-20" onClick={() => setDropdownOpen(false)} />
          <div className="absolute z-30 overflow-hidden" style={{
            top: "82px", left: "50%", transform: "translateX(-50%)",
            background: "rgba(255,252,245,0.68)",
            backdropFilter: "blur(28px) saturate(1.25)",
            WebkitBackdropFilter: "blur(28px) saturate(1.25)",
            border: "1.5px solid rgba(255,255,255,0.8)",
            borderRadius: "14px",
            boxShadow: "0 8px 32px rgba(100,80,52,0.12), 0 3px 12px rgba(100,80,52,0.06), inset 0 1.5px 0 rgba(255,255,255,0.9)",
            minWidth: "180px",
          }}>
            <button onClick={() => { onSwitchGallery("main"); setDropdownOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-3 transition-all duration-150"
              style={{ background: galleryType === "main" ? "rgba(180,150,110,0.12)" : "transparent", borderBottom: "1px solid rgba(220,200,170,0.2)" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0, background: galleryType === "main" ? "rgba(140,110,75,0.75)" : "rgba(180,155,120,0.35)" }} />
              <span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "13px", color: galleryType === "main" ? "rgba(60,48,36,0.9)" : "rgba(100,82,60,0.58)", fontWeight: galleryType === "main" ? 500 : 400, letterSpacing: "0.02em" }}>人生画廊·主展厅</span>
            </button>
            <button onClick={() => { onSwitchGallery("daily"); setDropdownOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-3 transition-all duration-150"
              style={{ background: galleryType === "daily" ? "rgba(180,150,110,0.12)" : "transparent", borderBottom: "1px solid rgba(220,200,170,0.2)" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0, background: galleryType === "daily" ? "rgba(140,110,75,0.75)" : "rgba(180,155,120,0.35)" }} />
              <span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "13px", color: galleryType === "daily" ? "rgba(60,48,36,0.9)" : "rgba(100,82,60,0.58)", fontWeight: galleryType === "daily" ? 500 : 400, letterSpacing: "0.02em" }}>人生画廊·日常展厅</span>
            </button>
            <button disabled className="w-full flex items-center gap-2.5 px-4 py-3" style={{ background: "transparent", cursor: "default" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0, background: "rgba(180,155,120,0.2)" }} />
              <span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "13px", color: "rgba(140,115,85,0.32)", letterSpacing: "0.02em" }}>秘密房间</span>
              <span style={{ marginLeft: "auto", fontFamily: "'Noto Sans SC', sans-serif", fontSize: "10px", color: "rgba(140,115,85,0.28)", letterSpacing: "0.04em" }}>即将开放</span>
            </button>
          </div>
        </>
      )}

      {/* ── PROGRESS DOTS (Liquid Glass) ── */}
      <div className="relative z-20 flex justify-center gap-2 mt-1 mb-2">
        {galleryArtworks.map((_, i) => (
          <button key={i} onClick={() => emblaApi?.scrollTo(i)} className="overflow-hidden" style={{
            width: i === currentIndex ? "24px" : "6px",
            height: "6px",
            borderRadius: "3px",
            background: i === currentIndex
              ? "rgba(160,130,95,0.65)"
              : "rgba(220,200,170,0.35)",
            backdropFilter: i === currentIndex ? "blur(8px)" : "none",
            border: i === currentIndex ? "1px solid rgba(255,255,255,0.45)" : "1px solid rgba(255,255,255,0.25)",
            boxShadow: i === currentIndex ? "0 2px 8px rgba(100,80,52,0.15), inset 0 0.5px 0 rgba(255,255,255,0.5)" : "none",
            transition: "all 0.35s ease",
          }} />
        ))}
      </div>

      {/* ── CAROUSEL ── */}
      <div ref={emblaRef} className="relative z-10 flex-1 overflow-hidden" style={{ cursor: "grab" }}>
        <div className="flex h-full">
          {galleryArtworks.map((aw, i) => {
            const isActive = i === currentIndex;
            const size = artworkSizes[i % artworkSizes.length];
            return (
              <div key={aw.id} className="flex-none w-full h-full flex flex-col items-center justify-center" style={{ minWidth: "100%" }}>
                <div className="flex flex-col items-center" style={{
                  transform: infoOpen && isActive ? "translateY(-72px)" : "translateY(0)",
                  transition: "transform 0.42s cubic-bezier(0.32, 0.72, 0, 1)",
                }}>
                  {/* Frame — embossed for main, silver for daily */}
                  <div
                    onClick={() => {
                      if (!isActive) return;
                      if (infoOpen) { setInfoOpen(false); setSpotMode("fade"); setSpotlightOn(false); }
                      else { setInfoOpen(true); setSpotMode("rise"); setSpotlightOn(true); }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {galleryType === "main" ? (
                      /* White plaster embossed frame */
                      <div style={{
                        position: "relative",
                        background: "linear-gradient(145deg, #ffffff 0%, #f5f4f1 18%, #edecea 42%, #f2f1ef 58%, #fafaf9 78%, #f8f7f5 100%)",
                        padding: "18px", borderRadius: "1px",
                        boxShadow: isActive
                          ? "inset 3px 3px 0 rgba(255,255,255,0.95), inset -3px -3px 0 rgba(180,174,165,0.45), inset 6px 6px 12px rgba(200,196,190,0.20), inset -6px -6px 12px rgba(140,134,125,0.18), 0 22px 55px rgba(40,35,28,0.22), 0 8px 20px rgba(40,35,28,0.12)"
                          : "inset 2px 2px 0 rgba(255,255,255,0.88), inset -2px -2px 0 rgba(175,168,158,0.38), inset 4px 4px 8px rgba(200,196,190,0.14), inset -4px -4px 8px rgba(140,134,125,0.12), 0 10px 30px rgba(40,35,28,0.14), 0 4px 10px rgba(40,35,28,0.08)",
                        transition: "box-shadow 0.5s ease",
                      }}>
                        {/* Plaster surface texture */}
                        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.055, pointerEvents: "none", borderRadius: "1px" }}>
                          <filter id={`plaster-frame-${aw.id}`}><feTurbulence type="fractalNoise" baseFrequency="0.82 0.95" numOctaves="3" seed="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
                          <rect width="100%" height="100%" filter={`url(#plaster-frame-${aw.id})`}/>
                        </svg>
                        {/* Outer raised molding line */}
                        <div style={{ position: "absolute", inset: "4px", border: "1px solid rgba(255,255,255,0.9)", pointerEvents: "none" }} />
                        <div style={{ position: "absolute", inset: "6px", border: "1px solid rgba(155,148,138,0.22)", pointerEvents: "none" }} />
                        {/* Inner shadow lip */}
                        <div style={{ padding: "3px", background: "linear-gradient(145deg, rgba(155,150,142,0.28) 0%, rgba(200,196,190,0.10) 50%, rgba(155,150,142,0.22) 100%)", boxShadow: "inset 1px 1px 3px rgba(0,0,0,0.18), inset -1px -1px 2px rgba(255,255,255,0.7)" }}>
                          <div style={{ width: `${size.w}px`, height: `${size.h}px`, position: "relative", overflow: "hidden", display: "block" }}>
                            <img src={getImageSrc(aw.imageUrl)} alt={aw.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                            <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.03 }} xmlns="http://www.w3.org/2000/svg">
                              <filter id={`grain-${aw.id}`}><feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
                              <rect width="100%" height="100%" filter={`url(#grain-${aw.id})`} />
                            </svg>
                            {/* Warm spotlight glow on artwork */}
                            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(255,252,245,0.68) 0%, rgba(255,250,238,0.42) 32%, rgba(255,248,230,0.18) 58%, transparent 78%)", opacity: spotlightOn && isActive ? 1 : 0, transition: spotTransition }} />
                            {/* Frame edge highlight from overhead light */}
                            <div style={{ position: "absolute", inset: "-3px", background: "linear-gradient(135deg, rgba(255,253,248,0.52) 0%, transparent 28%, transparent 72%, rgba(255,251,245,0.28) 100%)", opacity: spotlightOn && isActive ? 1 : 0, transition: spotTransition, pointerEvents: "none" }} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Silver frame for daily gallery */
                      <div style={{
                        position: "relative",
                        background: "linear-gradient(145deg, #e8e4de 0%, #d0cbc4 20%, #b8b2aa 50%, #cac5be 75%, #dedad4 100%)",
                        padding: "14px", borderRadius: "2px",
                        boxShadow: isActive
                          ? "inset 2px 2px 0 rgba(255,255,255,0.7), inset -2px -2px 0 rgba(60,55,50,0.3), 0 20px 52px rgba(75,60,44,0.3), 0 6px 18px rgba(75,60,44,0.16)"
                          : "inset 2px 2px 0 rgba(255,255,255,0.55), inset -2px -2px 0 rgba(60,55,50,0.25), 0 8px 24px rgba(75,60,44,0.14), 0 3px 8px rgba(75,60,44,0.08)",
                        transition: "box-shadow 0.5s ease",
                      }}>
                      <div style={{ padding: "2px", background: "rgba(30,28,25,0.5)", boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.5), inset -1px -1px 1px rgba(255,255,255,0.15)" }}>
                        <div style={{ width: `${size.w}px`, height: `${size.h}px`, position: "relative", overflow: "hidden", display: "block" }}>
                          <img src={getImageSrc(aw.imageUrl)} alt={aw.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.03 }} xmlns="http://www.w3.org/2000/svg">
                            <filter id={`grain-${aw.id}`}><feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
                            <rect width="100%" height="100%" filter={`url(#grain-${aw.id})`} />
                          </svg>
                          {/* Warm spotlight glow on artwork */}
                          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(255,250,240,0.65) 0%, rgba(255,248,232,0.40) 32%, rgba(255,245,225,0.16) 58%, transparent 78%)", opacity: spotlightOn && isActive ? 1 : 0, transition: spotTransition }} />
                          {/* Frame edge highlight from overhead light */}
                          <div style={{ position: "absolute", inset: "-2px", background: "linear-gradient(135deg, rgba(255,253,248,0.48) 0%, transparent 25%, transparent 75%, rgba(255,251,245,0.25) 100%)", opacity: spotlightOn && isActive ? 1 : 0, transition: spotTransition, pointerEvents: "none" }} />
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,240,200,0.07) 0%, transparent 45%)", pointerEvents: "none" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  </div>

                  {/* Label */}
                  <div className="mt-4 flex items-center gap-2" style={{ padding: "4px 8px", pointerEvents: "none", userSelect: "none" }}>
                    <p style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "13px", fontWeight: 500, color: galleryType === "main" ? "rgba(32,44,54,0.72)" : "rgba(38,28,14,0.72)", letterSpacing: "0.04em" }}>《{aw.title}》</p>
                    <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "11px", color: galleryType === "main" ? "rgba(60,78,92,0.48)" : "rgba(75,55,24,0.48)" }}>{aw.date}</p>
                  </div>
                </div>

                {/* Info panel */}
                <div style={{
                  opacity: infoOpen && isActive ? 1 : 0,
                  transform: infoOpen && isActive ? "translateY(0)" : "translateY(10px)",
                  transition: "opacity 0.42s ease, transform 0.42s ease",
                  pointerEvents: infoOpen && isActive ? "auto" : "none",
                  marginTop: "18px", width: "296px",
                  background: "rgba(250,246,238,0.97)", borderRadius: "10px",
                  border: "1px solid rgba(200,185,158,0.35)",
                  boxShadow: "0 2px 12px rgba(30,16,4,0.1), 0 8px 32px rgba(30,16,4,0.07), inset 0 1px 0 rgba(255,252,244,0.9)",
                  overflow: "hidden", position: "relative",
                }}>
                  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.028, pointerEvents: "none", borderRadius: "10px" }}>
                    <filter id="paper"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
                    <rect width="100%" height="100%" filter="url(#paper)" />
                  </svg>
                  <div style={{ display: "flex", position: "relative" }}>
                    <div style={{ width: "96px", flexShrink: 0, padding: "18px 14px 14px 16px", borderRight: "1px solid rgba(180,160,125,0.18)", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "20px", fontWeight: 700, color: "rgba(28,20,10,0.88)", lineHeight: 1.15, letterSpacing: "-0.01em" }}>{aw.title}</p>
                      <div style={{ height: "1px", background: "rgba(140,110,70,0.22)", width: "100%" }} />
                      <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "10px", fontWeight: 500, color: "rgba(110,80,38,0.55)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{styleLabel[aw.style]}</p>
                      <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "10px", color: "rgba(130,100,55,0.4)", letterSpacing: "0.02em", marginTop: "auto" }}>{aw.date}</p>
                    </div>
                    <div style={{ flex: 1, padding: "18px 16px 14px 14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "12px", lineHeight: 1.75, color: "rgba(45,32,14,0.68)", fontWeight: 400 }}>{aw.description}</p>
                      <div style={{ height: "1px", background: "rgba(140,110,70,0.15)", width: "100%" }} />
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                        {aw.emotionTags.map((tag) => (
                          <span key={tag} style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "10px", color: "rgba(100,72,28,0.5)", letterSpacing: "0.02em" }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={onArtworkDetail} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", width: "100%", padding: "10px 0", background: "rgba(100,68,24,0.06)", borderTop: "1px solid rgba(180,155,110,0.18)", cursor: "pointer", border: "none" }}>
                    <span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "11px", color: "rgba(90,62,18,0.55)", letterSpacing: "0.08em" }}>查看完整作品</span>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="rgba(90,62,18,0.45)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SIDE NAV ARROWS ── */}
      {currentIndex > 0 && (
        <button onClick={() => emblaApi?.scrollPrev()} className="absolute z-20 flex items-center justify-center transition-all duration-200 active:scale-90"
          style={{ left: "10px", top: "50%", transform: "translateY(-50%)", width: "32px", height: "56px", background: "transparent", border: "none", padding: 0 }}>
          <svg width="14" height="28" viewBox="0 0 14 28" fill="none">
            <line x1="7" y1="0" x2="7" y2="28" stroke="rgba(100,88,70,0.14)" strokeWidth="1" />
            <path d="M10 10 L4 14 L10 18" stroke="rgba(80,65,45,0.42)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>
      )}
      {currentIndex < galleryArtworks.length - 1 && (
        <button onClick={() => emblaApi?.scrollNext()} className="absolute z-20 flex items-center justify-center transition-all duration-200 active:scale-90"
          style={{ right: "10px", top: "50%", transform: "translateY(-50%)", width: "32px", height: "56px", background: "transparent", border: "none", padding: 0 }}>
          <svg width="14" height="28" viewBox="0 0 14 28" fill="none">
            <line x1="7" y1="0" x2="7" y2="28" stroke="rgba(100,88,70,0.14)" strokeWidth="1" />
            <path d="M4 10 L10 14 L4 18" stroke="rgba(80,65,45,0.42)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>
      )}

      {/* ── SWIPE-UP HINT ── */}
      {!panelOpen && !spotlightOn && (
        <motion.div
          className="absolute left-0 right-0 flex flex-col items-center gap-1.5 pointer-events-none z-20"
          style={{ bottom: "96px" }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="18" height="11" viewBox="0 0 20 12" fill="none">
            <path d="M3 9L10 3L17 9" stroke="rgba(130,105,80,0.42)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 12L10 6L17 12" stroke="rgba(130,105,80,0.22)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "10px", color: "rgba(100,80,60,0.5)", letterSpacing: "0.08em" }}>
            上滑浏览展厅
          </span>
        </motion.div>
      )}

      {/* ── GALLERY DETAIL PANEL ── */}
      <AnimatePresence mode="sync">
          {panelOpen && (
            <motion.div
              className="absolute bottom-0 left-0 right-0"
              style={{ height: "78%", zIndex: 30 }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 300, mass: 0.9 }}
            >
              {/* Panel background */}
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(248,243,234,0.98)",
                borderRadius: "20px 20px 0 0",
                boxShadow: "0 -6px 40px rgba(20,10,2,0.16), 0 -1px 0 rgba(190,165,120,0.2)",
                backdropFilter: "blur(24px)",
              }} />

              {/* Paper grain */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.022, pointerEvents: "none", borderRadius: "20px 20px 0 0" }}>
                <filter id="panel-grain"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
                <rect width="100%" height="100%" filter="url(#panel-grain)" />
              </svg>

              {/* Panel content */}
              <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%" }}>

                {/* Drag handle */}
                <div style={{ paddingTop: "12px", paddingBottom: "6px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                  <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "rgba(150,120,70,0.25)" }} />
                  <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
                    <div style={{ width: "32px" }} />
                    <p style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "12px", color: "rgba(80,55,18,0.45)", letterSpacing: "0.1em" }}>画廊导览</p>
                    <button
                      onClick={() => setPanelOpen(false)}
                      style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        background: "rgba(100,68,28,0.08)",
                        border: "1px solid rgba(150,110,55,0.14)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", flexShrink: 0,
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(100,68,28,0.14)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "rgba(100,68,28,0.08)")}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 2L10 10M10 2L2 10" stroke="rgba(90,58,18,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Scrollable body */}
                <div style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain", paddingBottom: "100px" }}>

                  {/* ── THREE GALLERY ENTRY BUTTONS ── */}
                  <div style={{ padding: "4px 20px 20px", display: "flex", gap: "10px" }}>
                    {/* 人生画廊 */}
                    <button
                      onClick={() => { setPanelOpen(false); onSwitchGallery("main"); }}
                      style={{
                        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                        padding: "16px 8px 14px",
                        background: "rgba(255,250,240,0.9)",
                        border: "1px solid rgba(190,158,100,0.3)",
                        borderRadius: "14px",
                        boxShadow: "0 2px 12px rgba(30,14,2,0.07), inset 0 1px 0 rgba(255,252,242,0.8)",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #c8a060 0%, #a07838 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 10px rgba(100,60,10,0.25)" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,242,215,0.95)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      </div>
                      <span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "11px", color: "rgba(70,45,12,0.75)", letterSpacing: "0.04em", fontWeight: 500 }}>人生画廊</span>
                    </button>

                    {/* 日常速写间 */}
                    <button
                      onClick={() => { setPanelOpen(false); onSwitchGallery("daily"); }}
                      style={{
                        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                        padding: "16px 8px 14px",
                        background: "rgba(255,250,240,0.9)",
                        border: "1px solid rgba(190,158,100,0.3)",
                        borderRadius: "14px",
                        boxShadow: "0 2px 12px rgba(30,14,2,0.07), inset 0 1px 0 rgba(255,252,242,0.8)",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #b89050 0%, #906830 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 10px rgba(100,60,10,0.22)" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,242,215,0.95)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </div>
                      <span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "11px", color: "rgba(70,45,12,0.75)", letterSpacing: "0.04em", fontWeight: 500 }}>日常速写间</span>
                    </button>

                    {/* 秘密房间 */}
                    <button
                      disabled
                      style={{
                        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                        padding: "16px 8px 14px",
                        background: "rgba(245,240,232,0.6)",
                        border: "1px solid rgba(190,158,100,0.15)",
                        borderRadius: "14px",
                        boxShadow: "0 1px 6px rgba(30,14,2,0.04)",
                        cursor: "default", opacity: 0.6,
                      }}
                    >
                      <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #a08870 0%, #806858 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 8px rgba(60,40,20,0.15)" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,242,215,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "11px", color: "rgba(70,45,12,0.4)", letterSpacing: "0.04em" }}>秘密房间</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div style={{ margin: "0 20px 16px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(170,138,85,0.2) 30%, rgba(170,138,85,0.2) 70%, transparent)" }} />

                  {/* ── 近期收录 ── */}
                  <div style={{ padding: "0 20px 16px", display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <p style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "13px", fontWeight: 500, color: "rgba(60,40,12,0.72)", letterSpacing: "0.08em" }}>近期收录</p>
                    <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "10px", color: "rgba(120,90,40,0.38)", letterSpacing: "0.04em" }}>{recentWorks.length} 件</p>
                  </div>

                  {/* Masonry — two columns */}
                  <div style={{ padding: "0 20px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    {/* Column 1 */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
                      {col1.map((aw, i) => {
                        const h = thumbHeights[i % thumbHeights.length];
                        return (
                          <button
                            key={aw.id}
                            onClick={onArtworkDetail}
                            style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
                          >
                            <div style={{
                              borderRadius: "8px", overflow: "hidden",
                              boxShadow: "0 2px 10px rgba(20,10,2,0.12), 0 1px 3px rgba(20,10,2,0.08)",
                              border: "1px solid rgba(200,175,130,0.2)",
                            }}>
                              <img src={getImageSrc(aw.imageUrl)} alt={aw.title} style={{ width: "100%", height: `${h}px`, objectFit: "cover", display: "block" }} />
                            </div>
                            <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "10px", color: "rgba(65,42,12,0.55)", letterSpacing: "0.02em", marginTop: "5px", paddingLeft: "2px" }}>{aw.title}</p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Column 2 */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px", marginTop: "18px" }}>
                      {col2.map((aw, i) => {
                        const h = thumbHeights[(i + 3) % thumbHeights.length];
                        return (
                          <button
                            key={aw.id}
                            onClick={onArtworkDetail}
                            style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
                          >
                            <div style={{
                              borderRadius: "8px", overflow: "hidden",
                              boxShadow: "0 2px 10px rgba(20,10,2,0.12), 0 1px 3px rgba(20,10,2,0.08)",
                              border: "1px solid rgba(200,175,130,0.2)",
                            }}>
                              <img src={getImageSrc(aw.imageUrl)} alt={aw.title} style={{ width: "100%", height: `${h}px`, objectFit: "cover", display: "block" }} />
                            </div>
                            <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "10px", color: "rgba(65,42,12,0.55)", letterSpacing: "0.02em", marginTop: "5px", paddingLeft: "2px" }}>{aw.title}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

    </div>
  );
}
