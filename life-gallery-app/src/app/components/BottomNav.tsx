type NavScreen = "life-gallery" | "sketch-room" | "create" | "visitor" | "profile";

interface Props {
  active: NavScreen | null;
  onNavigate: (screen: NavScreen) => void;
}

// Solid fill icons for each tab
function IconGallery({ lit }: { lit: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="7" height="7" rx="1.5" opacity={lit ? 1 : 0.9} />
      <rect x="14" y="3" width="7" height="7" rx="1.5" opacity={lit ? 1 : 0.9} />
      <rect x="3" y="14" width="7" height="7" rx="1.5" opacity={lit ? 1 : 0.9} />
      <rect x="14" y="14" width="7" height="7" rx="1.5" opacity={lit ? 1 : 0.9} />
    </svg>
  );
}

function IconSketch({ lit }: { lit: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 17.46V21h3.54l10.45-10.45-3.54-3.54L3 17.46zm16.71-9.63a1 1 0 0 0 0-1.41l-2.12-2.12a1 1 0 0 0-1.41 0l-1.65 1.65 3.53 3.53 1.65-1.65z" opacity={lit ? 1 : 0.9} />
    </svg>
  );
}

function IconExplore({ lit }: { lit: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" opacity={lit ? 1 : 0.9} />
    </svg>
  );
}

function IconPerson({ lit }: { lit: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="7" r="4" opacity={lit ? 1 : 0.9} />
      <path d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8H4z" opacity={lit ? 1 : 0.9} />
    </svg>
  );
}

const tabs: { id: NavScreen; icon: (p: { lit: boolean }) => JSX.Element; label: string }[] = [
  { id: "life-gallery", icon: IconGallery,  label: "展厅" },
  { id: "sketch-room",  icon: IconSketch,   label: "速写间" },
  { id: "visitor",      icon: IconExplore,  label: "逛逛" },
  { id: "profile",      icon: IconPerson,   label: "个人" },
];

export function BottomNav({ active, onNavigate }: Props) {
  const fabActive = active === "create";

  return (
    <div
      className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30"
      style={{ width: "334px" }}
    >
      {/* Ambient glow behind entire nav from FAB */}
      <div style={{
        position: "absolute",
        bottom: "-8px", left: "50%",
        transform: "translateX(-50%)",
        width: "180px", height: "80px",
        background: "radial-gradient(ellipse 90px 50px at 50% 100%, rgba(185,130,50,0.28) 0%, transparent 70%)",
        pointerEvents: "none",
        filter: "blur(6px)",
      }} />

      {/* Capsule + FAB wrapper — extra top padding so FAB has room to protrude */}
      <div className="relative" style={{ paddingTop: "30px" }}>

        {/* ── FAB — airy warm-gold frosted glass ── */}
        <button
          onClick={() => onNavigate("create")}
          className="absolute left-1/2 flex items-center justify-center rounded-full transition-all duration-250 active:scale-90 overflow-hidden"
          style={{
            width: "58px",
            height: "58px",
            top: "30px",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
            background: fabActive
              ? "radial-gradient(circle at 42% 36%, rgba(255,248,224,0.52) 0%, rgba(220,178,98,0.32) 50%, rgba(190,148,62,0.28) 100%)"
              : "radial-gradient(circle at 42% 36%, rgba(255,250,232,0.46) 0%, rgba(218,172,88,0.26) 52%, rgba(185,142,55,0.22) 100%)",
            backdropFilter: "blur(28px) saturate(1.4)",
            WebkitBackdropFilter: "blur(28px) saturate(1.4)",
            border: "1.5px solid rgba(255,240,200,0.55)",
            boxShadow: fabActive
              ? [
                  "0 0 0 3px rgba(255,248,235,0.9)",
                  "0 6px 22px rgba(180,138,50,0.18)",
                  "0 2px 8px rgba(160,120,40,0.12)",
                  "inset 0 1.5px 0 rgba(255,255,240,0.7)",
                  "inset 0 -1px 0 rgba(190,148,60,0.12)",
                ].join(", ")
              : [
                  "0 0 0 3px rgba(255,248,235,0.9)",
                  "0 4px 16px rgba(180,138,50,0.13)",
                  "0 1px 4px rgba(160,120,40,0.08)",
                  "inset 0 1.5px 0 rgba(255,255,240,0.62)",
                  "inset 0 -1px 0 rgba(190,148,60,0.08)",
                ].join(", "),
            transition: "all 0.28s ease",
          }}
        >
          {/* Top arc highlight — thin bright crescent */}
          <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
            height: "48%",
            background: "linear-gradient(180deg, rgba(255,255,248,0.55) 0%, rgba(255,252,230,0.18) 55%, transparent 100%)",
            borderRadius: "50%",
          }} />
          {/* Amber edge glow — bottom-right rim */}
          <div className="absolute inset-0 pointer-events-none" style={{
            borderRadius: "50%",
            background: "radial-gradient(circle at 72% 78%, rgba(210,158,52,0.18) 0%, transparent 55%)",
          }} />

          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke={fabActive ? "rgba(120,88,28,0.88)" : "rgba(140,100,35,0.78)"}
            strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ position: "relative", zIndex: 1 }}>
            <path d="M12 5v14M5 12h14" />
          </svg>

          {fabActive && (
            <div style={{
              position: "absolute", inset: "-6px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(220,180,80,0.12) 0%, transparent 65%)",
              pointerEvents: "none",
            }} />
          )}
        </button>

        {/* ── Liquid glass capsule ── */}
        <div
          className="relative w-full flex items-center rounded-full overflow-hidden"
          style={{
            height: "56px",
            background: "rgba(255,252,245,0.68)",
            backdropFilter: "blur(32px) saturate(1.25)",
            WebkitBackdropFilter: "blur(32px) saturate(1.25)",
            border: "1.5px solid rgba(255,255,255,0.85)",
            boxShadow: [
              "0 8px 32px rgba(100,80,52,0.14)",
              "0 3px 12px rgba(100,80,52,0.08)",
              "inset 0 1.5px 0 rgba(255,255,255,0.92)",
            ].join(", "),
          }}
        >
          {/* Top glass sheen */}
          <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
            height: "52%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.06) 65%, transparent 100%)",
          }} />
          {/* Left two tabs */}
          <div className="flex flex-1 items-center justify-around">
            {tabs.slice(0, 2).map((tab) => {
              const lit = active === tab.id;
              return (
                <TabButton key={tab.id} lit={lit} onClick={() => onNavigate(tab.id)}>
                  <tab.icon lit={lit} />
                </TabButton>
              );
            })}
          </div>

          {/* Center gap for FAB */}
          <div style={{ width: "66px", flexShrink: 0 }} />

          {/* Right two tabs */}
          <div className="flex flex-1 items-center justify-around">
            {tabs.slice(2).map((tab) => {
              const lit = active === tab.id;
              return (
                <TabButton key={tab.id} lit={lit} onClick={() => onNavigate(tab.id)}>
                  <tab.icon lit={lit} />
                </TabButton>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  lit,
  onClick,
  children,
}: {
  lit: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center rounded-full transition-all duration-250 active:scale-90"
      style={{ width: "52px", height: "44px" }}
    >
      {/* Spotlight bar + cone when selected */}
      {lit && (
        <>
          {/* Top bar — the "spotlight fixture" */}
          <div style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "28px",
            height: "2.5px",
            borderRadius: "0 0 3px 3px",
            background: "rgba(175,125,50,0.95)",
            boxShadow: "0 0 6px rgba(200,150,60,0.8), 0 0 14px rgba(200,145,50,0.45)",
          }} />
          {/* Cone of light spreading downward */}
          <div style={{
            position: "absolute",
            top: "2px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "56px",
            height: "42px",
            background: "radial-gradient(ellipse 75% 100% at 50% 0%, rgba(215,165,70,0.32) 0%, rgba(210,155,55,0.14) 45%, transparent 75%)",
            pointerEvents: "none",
          }} />
        </>
      )}

      {/* Icon */}
      <span style={{
        color: lit ? "rgba(100,60,12,0.9)" : "rgba(130,90,40,0.38)",
        transition: "color 0.25s ease",
        position: "relative",
      }}>
        {children}
      </span>
    </button>
  );
}
