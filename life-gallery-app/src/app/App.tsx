import { useState, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SplashScreen } from "./components/SplashScreen";
import { LoginScreen } from "./components/LoginScreen";
import { AvatarShaping } from "./components/AvatarShaping";
import { PersonalityDialogue } from "./components/PersonalityDialogue";
import { GalleryHome } from "./components/GalleryHome";
import { EmotionConfirmation } from "./components/EmotionConfirmation";
import { EmotionalDialogue } from "./components/EmotionalDialogue";
import { ArtworkGenerating } from "./components/ArtworkGenerating";
import { ArtworkDetail } from "./components/ArtworkDetail";
import { DailySketchRoom } from "./components/DailySketchRoom";
import { LifeGalleryHall } from "./components/LifeGalleryHall";
import type { GalleryType } from "./components/LifeGalleryHall";
import { VisitorGallery } from "./components/VisitorGallery";
import { ProfilePage } from "./components/ProfilePage";
import { AvatarManagement } from "./components/AvatarManagement";
import { BottomNav } from "./components/BottomNav";
import { OthersArtworkDetail } from "./components/OthersArtworkDetail";
import { OthersGallery } from "./components/OthersGallery";
import { OthersArtworkDetailWithGuide } from "./components/OthersArtworkDetailWithGuide";
import type { AvatarConfig } from "./types/avatar";
import { DEFAULT_AVATAR_CONFIG } from "./types/avatar";
import { othersArtworks, creators } from "./components/mockData";

type Screen =
  | "splash"
  | "login"
  | "avatar"
  | "avatar-management"
  | "avatar-edit"
  | "personality"
  | "gallery-home"
  | "profile"
  | "emotion-confirm"
  | "emotional-dialogue"
  | "generating"
  | "artwork-detail"
  | "sketch-room"
  | "life-gallery"
  | "daily-gallery"
  | "visitor"
  | "others-artwork-detail"
  | "others-gallery"
  | "others-artwork-with-guide";

const mainScreens: Screen[] = ["profile", "sketch-room", "life-gallery", "daily-gallery", "visitor"];

const screenDepth: Record<Screen, number> = {
  splash: 0,
  login: 1,
  avatar: 2,
  personality: 3,
  "gallery-home": 4,
  profile: 5,
  "avatar-management": 6,
  "avatar-edit": 7,
  "sketch-room": 5,
  "life-gallery": 5,
  "daily-gallery": 5,
  visitor: 5,
  "emotion-confirm": 6,
  "emotional-dialogue": 7,
  generating: 8,
  "artwork-detail": 9,
  "others-artwork-detail": 6,
  "others-gallery": 7,
  "others-artwork-with-guide": 8,
};

type NavScreen = "life-gallery" | "sketch-room" | "create" | "visitor" | "profile";

function toNavActive(screen: Screen): NavScreen | null {
  if (screen === "life-gallery" || screen === "daily-gallery") return "life-gallery";
  if (screen === "sketch-room") return "sketch-room";
  if (screen === "visitor") return "visitor";
  if (screen === "profile") return "profile";
  if (screen === "emotion-confirm" || screen === "emotional-dialogue" || screen === "generating" || screen === "artwork-detail") return "create";
  return null;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const prevScreen = useRef<Screen>("splash");
  // Derive galleryType from screen to keep them always in sync
  const galleryType: GalleryType = screen === "daily-gallery" ? "daily" : "main";
  // Track which gallery was active when navigating to artwork-detail
  const lastGalleryScreen = useRef<"life-gallery" | "daily-gallery">("life-gallery");
  // Avatar configuration state
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(DEFAULT_AVATAR_CONFIG);
  // Track current viewed artwork and creator
  const [currentArtworkId, setCurrentArtworkId] = useState<string | null>(null);
  const [currentCreatorId, setCurrentCreatorId] = useState<string | null>(null);

  const go = (s: Screen) => {
    prevScreen.current = screen;
    // Set default artwork and creator for testing navigation
    if (s === "others-artwork-detail" && !currentArtworkId) {
      setCurrentArtworkId("h1");
    }
    if (s === "others-gallery" && !currentCreatorId) {
      setCurrentCreatorId("creator1");
      setCurrentArtworkId("h1");
    }
    if (s === "others-artwork-with-guide" && !currentArtworkId) {
      setCurrentArtworkId("h1");
      setCurrentCreatorId("creator1");
    }
    setScreen(s);
  };

  const direction = screenDepth[screen] >= screenDepth[prevScreen.current] ? 1 : -1;
  const showNav = mainScreens.includes(screen);

  const handleSwitchGallery = (type: GalleryType) => {
    const target: Screen = type === "main" ? "life-gallery" : "daily-gallery";
    go(target);
  };

  const handleArtworkDetail = () => {
    if (screen === "life-gallery" || screen === "daily-gallery") {
      lastGalleryScreen.current = screen;
    }
    go("artwork-detail");
  };

  const handleViewOthersArtwork = (artworkId: string) => {
    setCurrentArtworkId(artworkId);
    go("others-artwork-detail");
  };

  const handleViewOthersGallery = () => {
    const artwork = othersArtworks.find((a) => a.id === currentArtworkId);
    if (artwork) {
      const creator = creators.find((c) => c.artworkIds.includes(artwork.id));
      if (creator) {
        setCurrentCreatorId(creator.id);
        go("others-gallery");
      }
    }
  };

  const handleOthersGalleryArtworkClick = (artworkId: string) => {
    setCurrentArtworkId(artworkId);
    go("others-artwork-with-guide");
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ background: "#100c07" }}
    >
      {/* Screen index bar - desktop only */}
      <div
        className="hidden flex-col gap-1 mr-6"
        style={{ minWidth: "160px" }}
      >
        <p className="text-[11px] uppercase tracking-widest mb-3" style={{ color: "rgba(200,155,80,0.25)", fontFamily: "'Noto Sans SC', sans-serif" }}>
          人生画廊
        </p>
        {(
          [
            ["splash", "01 启动仪式"],
            ["login", "02 登录"],
            ["avatar", "03 分身塑形"],
            ["personality", "04 人格对话"],
            ["gallery-home", "05 画廊首页"],
            ["emotion-confirm", "06 情绪确认"],
            ["emotional-dialogue", "07 情绪对谈"],
            ["generating", "08 生成中"],
            ["artwork-detail", "09 作品展示"],
            ["sketch-room", "09 速写间"],
            ["life-gallery", "10 主展厅"],
            ["daily-gallery", "11 日常展厅"],
            ["visitor", "12 访客参观"],
            ["profile", "13 个人页面"],
            ["avatar-management", "14 分身管理"],
            ["avatar-edit", "15 编辑分身"],
            ["others-artwork-detail", "16 他人作品详情"],
            ["others-gallery", "17 他人画廊"],
            ["others-artwork-with-guide", "18 AI导览"],
          ] as [Screen, string][]
        ).map(([s, label]) => (
          <button
            key={s}
            onClick={() => go(s)}
            className="text-left px-3 py-1.5 rounded-lg text-[11px] transition-all duration-150"
            style={{
              background: screen === s ? "rgba(184,122,74,0.15)" : "transparent",
              color: screen === s ? "rgba(201,145,90,0.92)" : "rgba(200,155,80,0.3)",
              fontFamily: "'Noto Sans SC', sans-serif",
              border: screen === s ? "1px solid rgba(184,122,74,0.22)" : "1px solid transparent",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Mobile frame */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{
          width: "390px",
          height: "844px",
          borderRadius: "44px",
          background: "#0e1218",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06), inset 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 h-11 flex items-center justify-between px-8 z-50 pointer-events-none">
          <span className="text-[12px] text-white/40" style={{ fontFamily: "SF Pro, sans-serif" }}>9:41</span>
          <div className="flex items-center gap-1.5">
            <svg width="14" height="10" viewBox="0 0 14 10" fill="rgba(255,255,255,0.35)">
              <rect x="0" y="6" width="2" height="4" rx="0.5" />
              <rect x="3" y="4" width="2" height="6" rx="0.5" />
              <rect x="6" y="2" width="2" height="8" rx="0.5" />
              <rect x="9" y="0" width="2" height="10" rx="0.5" />
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2">
              <path d="M1 4.5C3.3 2.2 6 1 8 1s4.7 1.2 7 3.5" /><path d="M3 7C4.7 5.3 6.3 4.5 8 4.5S11.3 5.3 13 7" /><circle cx="8" cy="9.5" r="1" fill="rgba(255,255,255,0.35)" stroke="none" />
            </svg>
            <div className="flex items-center gap-0.5">
              <div className="w-5 h-2.5 rounded-sm border border-white/35 flex items-center justify-end pr-px">
                <div className="w-3.5 h-1.5 rounded-sm bg-white/35" />
              </div>
            </div>
          </div>
        </div>

        {/* Screen content */}
        <div className="absolute inset-0" style={{ overflow: "hidden" }}>
          <AnimatePresence mode="sync" custom={direction} initial={false}>
            <motion.div
              key={screen}
              custom={direction}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 18 }),
                center: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: d * -18 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.22,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{ position: "absolute", inset: 0, willChange: "transform, opacity" }}
            >
              {screen === "splash" && <SplashScreen onEnter={() => go("login")} />}
              {screen === "login" && <LoginScreen onLogin={() => go("avatar")} onSignup={() => go("avatar")} />}
              {screen === "avatar" && (
                <AvatarShaping
                  initialConfig={avatarConfig}
                  onNext={(config) => {
                    setAvatarConfig(config);
                    go("personality");
                  }}
                />
              )}
              {screen === "personality" && <PersonalityDialogue onNext={() => go("life-gallery")} avatarConfig={avatarConfig} />}
              {screen === "gallery-home" && (
                <GalleryHome
                  onRecord={() => go("emotion-confirm")}
                  onLifeGallery={() => go("life-gallery")}
                  onSketchRoom={() => go("sketch-room")}
                />
              )}
              {screen === "emotion-confirm" && (
                <EmotionConfirmation
                  onConfirm={() => go("emotional-dialogue")}
                  onBack={() => go(prevScreen.current as Screen)}
                />
              )}
              {screen === "emotional-dialogue" && (
                <EmotionalDialogue onNext={() => go("generating")} onBack={() => go("emotion-confirm")} />
              )}
              {screen === "generating" && <ArtworkGenerating onComplete={() => go("artwork-detail")} />}
              {screen === "artwork-detail" && (
                <ArtworkDetail
                  onBack={() => go(lastGalleryScreen.current)}
                  onToLifeGallery={() => go("life-gallery")}
                  onToSketchRoom={() => go("sketch-room")}
                />
              )}
              {screen === "sketch-room" && <DailySketchRoom onBack={() => go("life-gallery")} />}
              {(screen === "life-gallery" || screen === "daily-gallery") && (
                <LifeGalleryHall
                  galleryType={galleryType}
                  onSwitchGallery={handleSwitchGallery}
                  onArtworkDetail={handleArtworkDetail}
                />
              )}
              {screen === "visitor" && (
                <VisitorGallery
                  onBack={() => go("gallery-home")}
                  onArtworkClick={handleViewOthersArtwork}
                />
              )}
              {screen === "others-artwork-detail" && currentArtworkId && (() => {
                const artwork = othersArtworks.find((a) => a.id === currentArtworkId);
                return artwork ? (
                  <OthersArtworkDetail
                    artwork={artwork}
                    onViewGallery={handleViewOthersGallery}
                    onBack={() => go("visitor")}
                  />
                ) : null;
              })()}
              {screen === "others-gallery" && currentCreatorId && (() => {
                const creator = creators.find((c) => c.id === currentCreatorId);
                if (!creator) return null;
                const creatorArtworks = othersArtworks.filter((a) => creator.artworkIds.includes(a.id));
                return (
                  <OthersGallery
                    creator={creator}
                    artworks={creatorArtworks}
                    onArtworkClick={handleOthersGalleryArtworkClick}
                    onBack={() => go("others-artwork-detail")}
                  />
                );
              })()}
              {screen === "others-artwork-with-guide" && currentArtworkId && (() => {
                const artwork = othersArtworks.find((a) => a.id === currentArtworkId);
                if (!artwork) return null;
                const creator = creators.find((c) => c.artworkIds.includes(artwork.id));
                if (!creator) return null;
                return (
                  <OthersArtworkDetailWithGuide
                    artwork={artwork}
                    creatorAvatar={{
                      ...DEFAULT_AVATAR_CONFIG,
                      hairColor: "brown",
                      eyes: "gentle",
                      expression: "soft_smile",
                    }}
                    onBack={() => go("others-gallery")}
                  />
                );
              })()}
              {screen === "profile" && <ProfilePage onAvatarManagement={() => go("avatar-management")} />}
              {screen === "avatar-management" && (
                <AvatarManagement
                  avatarConfig={avatarConfig}
                  onBack={() => go("profile")}
                  onEditAvatar={() => go("avatar-edit")}
                />
              )}
              {screen === "avatar-edit" && (
                <AvatarShaping
                  initialConfig={avatarConfig}
                  onNext={(config) => {
                    setAvatarConfig(config);
                    go("avatar-management");
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom nav */}
        {showNav && (
          <BottomNav
            active={toNavActive(screen)}
            onNavigate={(s: NavScreen) => {
              if (s === "create") go("emotion-confirm");
              else go(s as Screen);
            }}
          />
        )}

        {/* Home indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full bg-white/20 z-50" />
      </div>
    </div>
  );
}
