import { useState } from "react";
import type { AvatarConfig } from "../types/avatar";
import { DEFAULT_AVATAR_CONFIG } from "../types/avatar";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "intro" | "edit" | "done";
type TabId = "outline" | "hair" | "face" | "outfit" | "accessory" | "aura";

// ─── Color maps ───────────────────────────────────────────────────────────────

const SKIN: Record<string, string> = {
  ivory: "#f2d9c4", warm: "#e6bf9e", tan: "#c99672", deep: "#8b5e3c",
};
const HAIR: Record<string, string> = {
  black: "#2c2220", brown: "#6b4226", ash: "#8a7a72",
  pink: "#c4919a", flax: "#c4a870", silver: "#a8a4a0",
};
const OUTFIT_C: Record<string, { body: string; lower: string; name: string; desc: string }> = {
  sketch:   { body: "#d8d0c0", lower: "#aba398", name: "日常速写", desc: "针织衫 · 宽松长裤" },
  curator:  { body: "#bebab0", lower: "#86807a", name: "私人馆长", desc: "长外套 · 西装裤" },
  studio:   { body: "#ccc4b4", lower: "#a49a84", name: "梦境画室", desc: "围裙 · 宽松罩衫" },
  ceremony: { body: "#ece8e0", lower: "#e0dbd3", name: "纪念日礼服", desc: "浅色长裙 · 披肩" },
};
const AURA_C: Record<string, { glow: string; accent: string; label: string; sub: string }> = {
  quiet:     { glow: "rgba(185,175,215,0.4)", accent: "#b9afd7", label: "安静的我", sub: "喜欢独处与观察" },
  gentle:    { glow: "rgba(230,198,168,0.4)", accent: "#e6c6a8", label: "温柔的我", sub: "在意他人的感受" },
  rational:  { glow: "rgba(165,190,165,0.4)", accent: "#a5bea5", label: "理性的我", sub: "喜欢把事情想清楚" },
  sensitive: { glow: "rgba(210,172,180,0.4)", accent: "#d2acb4", label: "敏感的我", sub: "容易被细节打动" },
  free:      { glow: "rgba(165,202,222,0.4)", accent: "#a5cadc", label: "自由的我", sub: "不喜欢被定义" },
  uncertain: { glow: "rgba(192,188,184,0.4)", accent: "#c0bbb8", label: "还没想清楚", sub: "先看看再说" },
};

const TABS: { id: TabId; label: string }[] = [
  { id: "outline",   label: "轮廓" },
  { id: "hair",      label: "发型" },
  { id: "face",      label: "脸部" },
  { id: "outfit",    label: "衣物" },
  { id: "accessory", label: "配饰" },
  { id: "aura",      label: "气质" },
];

function randomizeConfig(): AvatarConfig {
  const p = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)];
  return {
    faceShape:  p(["soft", "slim", "round", "neutral"] as const),
    skinTone:   p(["ivory", "warm", "tan", "deep"] as const),
    hairStyle:  p(["short", "medium", "long", "curly", "updo"] as const),
    hairColor:  p(["black", "brown", "ash", "pink", "flax", "silver"] as const),
    eyes:       p(["calm", "gentle", "wide"] as const),
    expression: p(["peaceful", "soft_smile", "thoughtful", "sleepy"] as const),
    outfit:     p(["sketch", "curator", "studio", "ceremony"] as const),
    accessory:  p(["none", "glasses", "earring", "scarf", "brooch"] as const),
    aura:       p(["quiet", "gentle", "rational", "sensitive", "free", "uncertain"] as const),
  };
}

// ─── Avatar SVG Figure ────────────────────────────────────────────────────────

export function AvatarFigure({ config, ghost = false }: { config: AvatarConfig; ghost?: boolean }) {
  const skin  = ghost ? "rgba(85,75,65,0.22)" : SKIN[config.skinTone];
  const hairC = ghost ? "rgba(68,58,48,0.18)" : HAIR[config.hairColor];
  const oc    = OUTFIT_C[config.outfit];
  const body  = ghost ? "rgba(88,80,70,0.15)" : oc.body;
  const lower = ghost ? "rgba(72,65,56,0.13)" : oc.lower;
  const aura  = AURA_C[config.aura];

  const [frx, fry]: [number, number] = ({
    soft:    [16, 18] as [number, number],
    slim:    [13, 20] as [number, number],
    round:   [18, 16] as [number, number],
    neutral: [15, 17] as [number, number],
  })[config.faceShape];

  const hx = 50, hy = 28;
  const chin = hy + fry;
  const sw   = chin + 15;   // shoulder Y

  // Hair back layer paths
  const hairBackPath: Record<string, string> = {
    short:
      `M ${hx - frx - 2} ${hy} Q ${hx - frx - 3} ${hy - fry - 9} ${hx} ${hy - fry - 7} Q ${hx + frx + 3} ${hy - fry - 9} ${hx + frx + 2} ${hy} Q ${hx + frx + 1} ${hy + 7} ${hx} ${hy + 8} Q ${hx - frx - 1} ${hy + 7} ${hx - frx - 2} ${hy} Z`,
    medium:
      `M ${hx - frx - 2} ${hy} Q ${hx - frx - 4} ${hy - fry - 11} ${hx} ${hy - fry - 8} Q ${hx + frx + 4} ${hy - fry - 11} ${hx + frx + 2} ${hy} Q ${hx + frx + 9} ${hy + 28} ${hx + 9} ${sw + 16} Q ${hx} ${sw + 20} ${hx - 9} ${sw + 16} Q ${hx - frx - 9} ${hy + 28} ${hx - frx - 2} ${hy} Z`,
    long:
      `M ${hx - frx - 2} ${hy} Q ${hx - frx - 4} ${hy - fry - 11} ${hx} ${hy - fry - 8} Q ${hx + frx + 4} ${hy - fry - 11} ${hx + frx + 2} ${hy} Q ${hx + frx + 10} ${hy + 44} ${hx + 11} ${sw + 54} Q ${hx} ${sw + 58} ${hx - 11} ${sw + 54} Q ${hx - frx - 10} ${hy + 44} ${hx - frx - 2} ${hy} Z`,
    curly:
      `M ${hx - frx - 2} ${hy} Q ${hx - frx - 6} ${hy - fry - 13} ${hx} ${hy - fry - 9} Q ${hx + frx + 6} ${hy - fry - 13} ${hx + frx + 2} ${hy} Q ${hx + frx + 12} ${hy + 16} ${hx + frx + 10} ${hy + 36} Q ${hx} ${hy + 40} ${hx - frx - 10} ${hy + 36} Q ${hx - frx - 12} ${hy + 16} ${hx - frx - 2} ${hy} Z`,
    updo:
      `M ${hx - frx - 1} ${hy} Q ${hx - frx - 3} ${hy - fry - 8} ${hx} ${hy - fry - 6} Q ${hx + frx + 3} ${hy - fry - 8} ${hx + frx + 1} ${hy} Q ${hx + 2} ${hy + 6} ${hx} ${hy + 7} Q ${hx - 2} ${hy + 6} ${hx - frx - 1} ${hy} Z`,
  };

  const hairFront = (): React.ReactNode => {
    if (ghost) return null;
    const top = hy - fry;
    switch (config.hairStyle) {
      case "short":
        return <path d={`M ${hx - frx + 4} ${top + 4} Q ${hx - 3} ${top - 3} ${hx} ${top - 1} Q ${hx + 3} ${top - 3} ${hx + frx - 4} ${top + 4}`} fill={hairC} />;
      case "medium":
      case "long":
        return <path d={`M ${hx - frx + 2} ${top + 4} Q ${hx - 5} ${top - 5} ${hx} ${top - 3} Q ${hx + 5} ${top - 5} ${hx + frx - 2} ${top + 4} Q ${hx + frx} ${top + 11} ${hx + frx - 3} ${top + 17} Q ${hx + 2} ${top + 10} ${hx} ${top + 12} Q ${hx - 2} ${top + 10} ${hx - frx + 3} ${top + 17} Q ${hx - frx} ${top + 11} ${hx - frx + 2} ${top + 4} Z`} fill={hairC} />;
      case "curly":
        return <>
          <circle cx={hx - 9}       cy={top + 5}  r="7.5" fill={hairC} />
          <circle cx={hx + 9}       cy={top + 5}  r="7.5" fill={hairC} />
          <circle cx={hx}           cy={top + 2}  r="7"   fill={hairC} />
          <circle cx={hx - frx + 5} cy={top + 12} r="5.5" fill={hairC} />
          <circle cx={hx + frx - 5} cy={top + 12} r="5.5" fill={hairC} />
        </>;
      case "updo":
        return <>
          <ellipse cx={hx} cy={hy - fry - 10} rx="9.5" ry="8.5" fill={hairC} />
          <path d={`M ${hx - frx + 3} ${top + 5} Q ${hx - 2} ${top} ${hx} ${top + 2} Q ${hx + 2} ${top} ${hx + frx - 3} ${top + 5}`} fill={hairC} />
        </>;
      default: return null;
    }
  };

  const outfitPaths = (): React.ReactNode => {
    if (config.outfit === "ceremony") {
      return <>
        <path d={`M ${hx - 20} ${sw} Q ${hx - 22} ${sw + 22} ${hx - 18} ${sw + 46} L ${hx + 18} ${sw + 46} Q ${hx + 22} ${sw + 22} ${hx + 20} ${sw} Q ${hx + 11} ${sw - 4} ${hx} ${sw - 4} Q ${hx - 11} ${sw - 4} ${hx - 20} ${sw} Z`} fill={body} />
        <path d={`M ${hx - 20} ${sw + 6} Q ${hx - 27} ${sw + 22} ${hx - 25} ${sw + 40} L ${hx - 18} ${sw + 38} Q ${hx - 20} ${sw + 22} ${hx - 16} ${sw + 7} Z`} fill={body} />
        <path d={`M ${hx + 20} ${sw + 6} Q ${hx + 27} ${sw + 22} ${hx + 25} ${sw + 40} L ${hx + 18} ${sw + 38} Q ${hx + 20} ${sw + 22} ${hx + 16} ${sw + 7} Z`} fill={body} />
        <path d={`M ${hx - 18} ${sw + 44} Q ${hx - 28} ${sw + 72} ${hx - 36} ${sw + 100} L ${hx + 36} ${sw + 100} Q ${hx + 28} ${sw + 72} ${hx + 18} ${sw + 44} Z`} fill={lower} />
        <ellipse cx={hx - 10} cy={sw + 104} rx="7"   ry="4.5" fill={ghost ? lower : "rgba(208,203,196,0.65)"} />
        <ellipse cx={hx + 10} cy={sw + 104} rx="7"   ry="4.5" fill={ghost ? lower : "rgba(208,203,196,0.65)"} />
      </>;
    }

    const isCoat = config.outfit === "curator";
    return <>
      {/* Torso */}
      <path d={`M ${hx - 22} ${sw} Q ${hx - 24} ${sw + 22} ${hx - 22} ${sw + 48} L ${hx + 22} ${sw + 48} Q ${hx + 24} ${sw + 22} ${hx + 22} ${sw} Q ${hx + 11} ${sw - 4} ${hx} ${sw - 4} Q ${hx - 11} ${sw - 4} ${hx - 22} ${sw} Z`} fill={body} />
      {/* Arms */}
      <path d={`M ${hx - 22} ${sw + 6} Q ${hx - 29} ${sw + 24} ${hx - 27} ${sw + 52} L ${hx - 20} ${sw + 50} Q ${hx - 22} ${sw + 24} ${hx - 18} ${sw + 7} Z`} fill={body} />
      <path d={`M ${hx + 22} ${sw + 6} Q ${hx + 29} ${sw + 24} ${hx + 27} ${sw + 52} L ${hx + 20} ${sw + 50} Q ${hx + 22} ${sw + 24} ${hx + 18} ${sw + 7} Z`} fill={body} />
      {/* Coat flaps + lapel */}
      {isCoat && <>
        <path d={`M ${hx - 22} ${sw + 46} Q ${hx - 24} ${sw + 66} ${hx - 22} ${sw + 90} L ${hx - 10} ${sw + 90} Q ${hx - 9} ${sw + 66} ${hx - 10} ${sw + 46} Z`} fill={body} />
        <path d={`M ${hx + 22} ${sw + 46} Q ${hx + 24} ${sw + 66} ${hx + 22} ${sw + 90} L ${hx + 10} ${sw + 90} Q ${hx + 9} ${sw + 66} ${hx + 10} ${sw + 46} Z`} fill={body} />
        <path d={`M ${hx} ${sw - 3} L ${hx - 7} ${sw + 16} L ${hx} ${sw + 14} L ${hx + 7} ${sw + 16} Z`} fill="rgba(136,126,114,0.28)" />
      </>}
      {/* Studio apron */}
      {config.outfit === "studio" && (
        <path d={`M ${hx - 11} ${sw + 5} L ${hx + 11} ${sw + 5} L ${hx + 14} ${sw + 48} L ${hx - 14} ${sw + 48} Z`} fill="rgba(70,50,28,0.09)" />
      )}
      {/* Legs */}
      <path d={`M ${hx - 19} ${sw + 46} Q ${hx - 20} ${sw + 72} ${hx - 19} ${sw + 98} L ${hx - 8} ${sw + 98} Q ${hx - 7} ${sw + 72} ${hx - 8} ${sw + 46} Z`} fill={lower} />
      <path d={`M ${hx + 8}  ${sw + 46} Q ${hx + 7}  ${sw + 72} ${hx + 8}  ${sw + 98} L ${hx + 19} ${sw + 98} Q ${hx + 20} ${sw + 72} ${hx + 19} ${sw + 46} Z`} fill={lower} />
      {/* Feet */}
      <ellipse cx={hx - 13} cy={sw + 102} rx="8.5" ry="5" fill={lower} />
      <ellipse cx={hx + 13} cy={sw + 102} rx="8.5" ry="5" fill={lower} />
    </>;
  };

  const eyeNodes = (): React.ReactNode => {
    if (ghost) return null;
    const ey = hy - 2;
    const ec = "rgba(26,16,8,0.84)";
    switch (config.eyes) {
      case "calm":
        return <>
          <ellipse cx={hx - 6.5} cy={ey} rx="3.6" ry="2.1" fill={ec} />
          <ellipse cx={hx + 6.5} cy={ey} rx="3.6" ry="2.1" fill={ec} />
          <circle  cx={hx - 5}   cy={ey - 0.7} r="0.85" fill="rgba(255,255,255,0.82)" />
          <circle  cx={hx + 8}   cy={ey - 0.7} r="0.85" fill="rgba(255,255,255,0.82)" />
        </>;
      case "gentle":
        return <>
          <path d={`M ${hx - 10.5} ${ey + 1.2} Q ${hx - 6.5} ${ey - 2.8} ${hx - 2.5} ${ey + 1.2} Q ${hx - 6.5} ${ey + 3.1} ${hx - 10.5} ${ey + 1.2} Z`} fill={ec} />
          <path d={`M ${hx + 2.5}  ${ey + 1.2} Q ${hx + 6.5} ${ey - 2.8} ${hx + 10.5} ${ey + 1.2} Q ${hx + 6.5} ${ey + 3.1} ${hx + 2.5}  ${ey + 1.2} Z`} fill={ec} />
          <circle cx={hx - 5}  cy={ey - 0.3} r="0.8"  fill="rgba(255,255,255,0.82)" />
          <circle cx={hx + 8}  cy={ey - 0.3} r="0.8"  fill="rgba(255,255,255,0.82)" />
        </>;
      case "wide":
      default:
        return <>
          <circle cx={hx - 6.5} cy={ey} r="3.9" fill={ec} />
          <circle cx={hx + 6.5} cy={ey} r="3.9" fill={ec} />
          <circle cx={hx - 4.8} cy={ey - 1.2} r="1.15" fill="rgba(255,255,255,0.88)" />
          <circle cx={hx + 8.2} cy={ey - 1.2} r="1.15" fill="rgba(255,255,255,0.88)" />
        </>;
    }
  };

  const mouthD = (): string => {
    if (ghost) return "";
    const my = hy + fry - 6;
    switch (config.expression) {
      case "peaceful":   return `M ${hx - 4.5} ${my} Q ${hx} ${my + 0.5} ${hx + 4.5} ${my}`;
      case "soft_smile": return `M ${hx - 5}   ${my} Q ${hx} ${my + 4}   ${hx + 5}   ${my}`;
      case "thoughtful": return `M ${hx - 4.5} ${my + 1.5} Q ${hx} ${my} ${hx + 4.5} ${my}`;
      case "sleepy":     return `M ${hx - 4}   ${my} Q ${hx} ${my - 1}   ${hx + 4}   ${my}`;
      default:           return `M ${hx - 4.5} ${my} Q ${hx} ${my + 0.5} ${hx + 4.5} ${my}`;
    }
  };

  const accNodes = (): React.ReactNode => {
    if (ghost) return null;
    switch (config.accessory) {
      case "glasses":
        return <>
          <circle cx={hx - 6.5} cy={hy - 2} r="5.5" fill="none" stroke="rgba(42,28,12,0.42)" strokeWidth="1.1" />
          <circle cx={hx + 6.5} cy={hy - 2} r="5.5" fill="none" stroke="rgba(42,28,12,0.42)" strokeWidth="1.1" />
          <line x1={hx - 1}    y1={hy - 2} x2={hx + 1}    y2={hy - 2} stroke="rgba(42,28,12,0.42)" strokeWidth="1" />
          <line x1={hx - 12.3} y1={hy - 2} x2={hx - frx}  y2={hy - 2} stroke="rgba(42,28,12,0.3)"  strokeWidth="0.8" />
          <line x1={hx + 12.3} y1={hy - 2} x2={hx + frx}  y2={hy - 2} stroke="rgba(42,28,12,0.3)"  strokeWidth="0.8" />
        </>;
      case "earring":
        return <>
          <circle cx={hx - frx + 2} cy={hy + 8} r="2.5" fill="rgba(212,183,110,0.9)" />
          <circle cx={hx + frx - 2} cy={hy + 8} r="2.5" fill="rgba(212,183,110,0.9)" />
        </>;
      case "scarf": {
        const sy = chin + 3;
        return <path d={`M ${hx - 22} ${sy} Q ${hx - 16} ${sy + 5} ${hx} ${sy + 4} Q ${hx + 16} ${sy + 5} ${hx + 22} ${sy} Q ${hx + 20} ${sy + 14} ${hx + 22} ${sy + 20} Q ${hx + 8} ${sy + 16} ${hx} ${sy + 18} Q ${hx - 8} ${sy + 16} ${hx - 22} ${sy + 20} Q ${hx - 20} ${sy + 14} ${hx - 22} ${sy} Z`} fill="rgba(188,150,108,0.52)" />;
      }
      case "brooch":
        return <>
          <circle cx={hx + 10} cy={sw + 17} r="4.5" fill="rgba(208,180,112,0.8)" />
          <circle cx={hx + 10} cy={sw + 17} r="2.2" fill="rgba(255,244,196,0.95)" />
          <circle cx={hx + 10} cy={sw + 17} r="0.8" fill="rgba(200,165,88,0.9)" />
        </>;
      default: return null;
    }
  };

  return (
    <svg width="97" height="160" viewBox="0 0 100 165" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="av-aura" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={aura.glow} />
          <stop offset="65%"  stopColor={aura.glow.replace(",0.4)", ",0.1)")} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      {!ghost && <ellipse cx="50" cy="88" rx="58" ry="62" fill="url(#av-aura)" />}
      <path d={hairBackPath[config.hairStyle] ?? ""} fill={hairC} />
      {outfitPaths()}
      <rect x={hx - 3.5} y={chin - 1} width="7" height="14" rx="2" fill={skin} />
      <ellipse cx={hx} cy={hy} rx={frx} ry={fry} fill={skin} />
      {!ghost && <ellipse cx={hx - 4} cy={hy - 6} rx={frx * 0.5} ry={fry * 0.42} fill="rgba(255,242,225,0.2)" />}
      {eyeNodes()}
      {!ghost && <>
        <path d={`M ${hx - 10} ${hy - 8} Q ${hx - 6.5} ${hy - 10.5} ${hx - 3} ${hy - 9}`} fill="none" stroke="rgba(52,34,16,0.3)" strokeWidth="1.1" strokeLinecap="round" />
        <path d={`M ${hx + 3}  ${hy - 9} Q ${hx + 6.5} ${hy - 10.5} ${hx + 10} ${hy - 8}`} fill="none" stroke="rgba(52,34,16,0.3)" strokeWidth="1.1" strokeLinecap="round" />
        <path d={`M ${hx} ${hy + 3} Q ${hx + 2.5} ${hy + 8} ${hx + 0.5} ${hy + 10} Q ${hx - 1} ${hy + 8} ${hx} ${hy + 3}`} fill="none" stroke="rgba(80,50,30,0.16)" strokeWidth="0.9" strokeLinecap="round" />
      </>}
      {!ghost && mouthD() && <path d={mouthD()} fill="none" stroke="rgba(162,100,68,0.55)" strokeWidth="1.3" strokeLinecap="round" />}
      {hairFront()}
      {accNodes()}
    </svg>
  );
}

// ─── Option Card ──────────────────────────────────────────────────────────────

function OptionCard({
  selected, onClick, label, wide = false, children,
}: {
  selected: boolean; onClick: () => void; label: string; wide?: boolean; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-none flex flex-col items-center gap-2 transition-all duration-200 active:scale-95"
      style={{
        width: wide ? "96px" : "76px",
        padding: "10px 8px",
        background: selected ? "rgba(255,252,245,0.78)" : "rgba(255,252,245,0.52)",
        backdropFilter: "blur(20px) saturate(1.2)",
        WebkitBackdropFilter: "blur(20px) saturate(1.2)",
        borderRadius: "18px",
        border: selected
          ? "1.5px solid rgba(162,126,62,0.62)"
          : "1.5px solid rgba(255,255,255,0.75)",
        boxShadow: selected
          ? "0 4px 16px rgba(140,100,50,0.12), inset 0 1.5px 0 rgba(255,255,255,0.9)"
          : "0 2px 8px rgba(100,78,52,0.05), inset 0 1.5px 0 rgba(255,255,255,0.82)",
        position: "relative",
      }}
    >
      {selected && (
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "28px", height: "3px", borderRadius: "0 0 3px 3px",
          background: "rgba(162,126,62,0.85)",
          boxShadow: "0 0 8px rgba(185,145,65,0.5)",
        }} />
      )}
      <div style={{ width: wide ? "60px" : "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
      <span style={{
        fontSize: "11px",
        color: selected ? "rgba(98,70,26,0.9)" : "rgba(108,88,58,0.45)",
        fontFamily: "'Noto Sans SC', sans-serif",
        letterSpacing: "0.02em",
        lineHeight: 1.3,
        textAlign: "center",
      }}>
        {label}
      </span>
    </button>
  );
}

// ─── Tab Content ──────────────────────────────────────────────────────────────

function OutlinePanel({ config, update }: { config: AvatarConfig; update: (k: keyof AvatarConfig, v: string) => void }) {
  const faceOpts = [
    { id: "soft",    label: "柔和", rx: 15,  ry: 17 },
    { id: "slim",    label: "细长", rx: 12,  ry: 19 },
    { id: "round",   label: "圆润", rx: 17,  ry: 15 },
    { id: "neutral", label: "中性", rx: 14,  ry: 16 },
  ] as const;
  const skinOpts = [
    { id: "ivory", label: "象牙白" },
    { id: "warm",  label: "暖米色" },
    { id: "tan",   label: "小麦色" },
    { id: "deep",  label: "深棕色" },
  ] as const;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3 px-6 overflow-x-auto scrollbar-none pb-1">
        {faceOpts.map(opt => (
          <OptionCard key={opt.id} selected={config.faceShape === opt.id} onClick={() => update("faceShape", opt.id)} label={opt.label}>
            <svg viewBox="0 0 44 44" width="44" height="44">
              <ellipse cx="22" cy="21" rx={opt.rx} ry={opt.ry} fill="none" stroke={config.faceShape === opt.id ? "rgba(140,105,48,0.7)" : "rgba(120,95,58,0.38)"} strokeWidth="1.8" />
              <line x1={22 - opt.rx * 0.6} y1={21 + opt.ry - 1} x2={22 + opt.rx * 0.6} y2={21 + opt.ry - 1} stroke="rgba(120,95,58,0.2)" strokeWidth="1" />
            </svg>
          </OptionCard>
        ))}
      </div>
      <div className="flex items-center gap-4 px-6">
        <span style={{ fontSize: "11px", color: "rgba(108,85,48,0.45)", fontFamily: "'Noto Sans SC', sans-serif", flexShrink: 0 }}>肤色</span>
        {skinOpts.map((s) => {
          const sel = config.skinTone === s.id;
          return (
            <button key={s.id} onClick={() => update("skinTone", s.id)} className="flex flex-col items-center gap-1 transition-all duration-200" style={{ opacity: sel ? 1 : 0.6 }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: SKIN[s.id], boxShadow: sel ? `0 0 0 2px white, 0 0 0 4px rgba(162,126,62,0.62)` : "none", transition: "box-shadow 0.2s" }} />
              <span style={{ fontSize: "9px", color: "rgba(98,76,44,0.55)", fontFamily: "'Noto Sans SC', sans-serif" }}>{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HairPanel({ config, update }: { config: AvatarConfig; update: (k: keyof AvatarConfig, v: string) => void }) {
  const styleOpts = [
    { id: "short",  label: "短发" },
    { id: "medium", label: "中长发" },
    { id: "long",   label: "长发" },
    { id: "curly",  label: "卷发" },
    { id: "updo",   label: "扎发" },
  ] as const;
  const colorOpts = [
    { id: "black",  label: "黑茶" },
    { id: "brown",  label: "浅棕" },
    { id: "ash",    label: "灰棕" },
    { id: "pink",   label: "雾粉" },
    { id: "flax",   label: "亚麻" },
    { id: "silver", label: "银灰" },
  ] as const;
  const hairLengths: Record<string, number> = { short: 28, medium: 48, long: 62, curly: 44, updo: 22 };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3 px-6 overflow-x-auto scrollbar-none pb-1">
        {styleOpts.map(opt => {
          const len = hairLengths[opt.id];
          const isCurly = opt.id === "curly";
          const isUpdo  = opt.id === "updo";
          const c = config.hairStyle === opt.id ? "rgba(140,105,48,0.75)" : "rgba(108,85,52,0.38)";
          return (
            <OptionCard key={opt.id} selected={config.hairStyle === opt.id} onClick={() => update("hairStyle", opt.id)} label={opt.label}>
              <svg viewBox="0 0 44 44" width="44" height="44">
                <ellipse cx="22" cy="20" rx="10" ry="11" fill="rgba(200,185,162,0.3)" stroke={c} strokeWidth="1.2" />
                {isCurly ? (
                  <>
                    <circle cx="12" cy="14" r="6" fill={c} opacity="0.8" />
                    <circle cx="22" cy="10" r="6" fill={c} opacity="0.8" />
                    <circle cx="32" cy="14" r="6" fill={c} opacity="0.8" />
                  </>
                ) : isUpdo ? (
                  <>
                    <ellipse cx="22" cy="9" rx="6" ry="5.5" fill={c} />
                    <path d={`M 13 18 Q 16 10 22 10 Q 28 10 31 18`} fill={c} />
                  </>
                ) : (
                  <path d={`M 13 18 Q 11 12 22 9 Q 33 12 31 18 Q 34 ${18 + len * 0.3} ${32 - len * 0.1} ${18 + len * 0.55} Q 22 ${18 + len * 0.6} ${12 + len * 0.1} ${18 + len * 0.55} Q ${10 + len * 0.05} ${18 + len * 0.3} 13 18 Z`} fill={c} />
                )}
              </svg>
            </OptionCard>
          );
        })}
      </div>
      <div className="flex items-center gap-3 px-6">
        <span style={{ fontSize: "11px", color: "rgba(108,85,48,0.45)", fontFamily: "'Noto Sans SC', sans-serif", flexShrink: 0 }}>发色</span>
        {colorOpts.map(c => {
          const sel = config.hairColor === c.id;
          return (
            <button key={c.id} onClick={() => update("hairColor", c.id)} className="flex flex-col items-center gap-1 transition-all duration-200" style={{ opacity: sel ? 1 : 0.6 }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: HAIR[c.id], boxShadow: sel ? `0 0 0 2px white, 0 0 0 4px rgba(162,126,62,0.62)` : "none", transition: "box-shadow 0.2s" }} />
              <span style={{ fontSize: "9px", color: "rgba(98,76,44,0.55)", fontFamily: "'Noto Sans SC', sans-serif" }}>{c.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FacePanel({ config, update }: { config: AvatarConfig; update: (k: keyof AvatarConfig, v: string) => void }) {
  const eyeOpts = [
    { id: "calm",   label: "沉静" },
    { id: "gentle", label: "温柔" },
    { id: "wide",   label: "明亮" },
  ] as const;
  const exprOpts = [
    { id: "peaceful",   label: "平静" },
    { id: "soft_smile", label: "轻轻笑" },
    { id: "thoughtful", label: "若有所思" },
    { id: "sleepy",     label: "有点困" },
  ] as const;
  const ec = "rgba(26,16,8,0.75)";
  return (
    <div className="flex gap-3 px-6 overflow-x-auto scrollbar-none pb-1">
      {eyeOpts.map(opt => (
        <OptionCard key={opt.id} selected={config.eyes === opt.id} onClick={() => update("eyes", opt.id)} label={opt.label}>
          <svg viewBox="0 0 44 44" width="44" height="44">
            {opt.id === "calm" && <>
              <ellipse cx="16" cy="22" rx="5.5" ry="3.2" fill={ec} />
              <ellipse cx="28" cy="22" rx="5.5" ry="3.2" fill={ec} />
              <circle  cx="18" cy="21" r="1.2" fill="rgba(255,255,255,0.8)" />
              <circle  cx="30" cy="21" r="1.2" fill="rgba(255,255,255,0.8)" />
            </>}
            {opt.id === "gentle" && <>
              <path d="M 11 23 Q 16 18 21 23 Q 16 27 11 23 Z" fill={ec} />
              <path d="M 23 23 Q 28 18 33 23 Q 28 27 23 23 Z" fill={ec} />
              <circle cx="18" cy="21.5" r="1.1" fill="rgba(255,255,255,0.8)" />
              <circle cx="30" cy="21.5" r="1.1" fill="rgba(255,255,255,0.8)" />
            </>}
            {opt.id === "wide" && <>
              <circle cx="16" cy="22" r="5.8" fill={ec} />
              <circle cx="28" cy="22" r="5.8" fill={ec} />
              <circle cx="18" cy="20" r="1.6" fill="rgba(255,255,255,0.88)" />
              <circle cx="30" cy="20" r="1.6" fill="rgba(255,255,255,0.88)" />
            </>}
          </svg>
        </OptionCard>
      ))}
      {exprOpts.map(opt => {
        const mouthPaths: Record<string, string> = {
          peaceful:   "M 17 28 Q 22 28.5 27 28",
          soft_smile: "M 16 27 Q 22 32 28 27",
          thoughtful: "M 17 28.5 Q 22 27 27 27",
          sleepy:     "M 17 28 Q 22 27 27 28",
        };
        return (
          <OptionCard key={opt.id} selected={config.expression === opt.id} onClick={() => update("expression", opt.id)} label={opt.label}>
            <svg viewBox="0 0 44 44" width="44" height="44">
              <ellipse cx="22" cy="22" rx="14" ry="16" fill="rgba(220,200,175,0.25)" stroke="rgba(140,110,68,0.18)" strokeWidth="1" />
              <ellipse cx="16" cy="20" rx="3" ry="1.8" fill="rgba(26,16,8,0.62)" />
              <ellipse cx="28" cy="20" rx="3" ry="1.8" fill="rgba(26,16,8,0.62)" />
              <path d={mouthPaths[opt.id]} fill="none" stroke="rgba(160,100,65,0.62)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </OptionCard>
        );
      })}
    </div>
  );
}

function OutfitPanel({ config, update }: { config: AvatarConfig; update: (k: keyof AvatarConfig, v: string) => void }) {
  const opts = ["sketch", "curator", "studio", "ceremony"] as const;
  return (
    <div className="flex gap-3 px-6 overflow-x-auto scrollbar-none pb-1">
      {opts.map(id => {
        const oc = OUTFIT_C[id];
        return (
          <OptionCard key={id} selected={config.outfit === id} onClick={() => update("outfit", id)} label={oc.name} wide>
            <svg viewBox="0 0 60 44" width="60" height="44">
              {/* Body */}
              <path d={id === "ceremony"
                ? "M 20 10 Q 18 22 19 34 Q 25 42 30 42 Q 35 42 41 34 Q 42 22 40 10 Q 35 8 30 8 Q 25 8 20 10 Z"
                : "M 20 10 Q 18 22 19 32 L 30 32 L 41 32 Q 42 22 40 10 Q 35 8 30 8 Q 25 8 20 10 Z"
              } fill={oc.body} />
              {id !== "ceremony" && <>
                <path d="M 19 32 Q 21 42 22 42 L 28 42 Q 28 42 28 32 Z" fill={oc.lower} />
                <path d="M 41 32 Q 39 42 38 42 L 32 42 Q 32 42 32 32 Z" fill={oc.lower} />
              </>}
              {id === "curator" && <path d="M 30 9 L 26 18 L 30 17 L 34 18 Z" fill="rgba(120,110,100,0.3)" />}
              {id === "studio" && <path d="M 24 11 L 36 11 L 37 31 L 23 31 Z" fill="rgba(70,50,28,0.1)" />}
            </svg>
          </OptionCard>
        );
      })}
    </div>
  );
}

function AccessoryPanel({ config, update }: { config: AvatarConfig; update: (k: keyof AvatarConfig, v: string) => void }) {
  const opts: { id: AvatarConfig["accessory"]; label: string }[] = [
    { id: "none",    label: "无" },
    { id: "glasses", label: "眼镜" },
    { id: "earring", label: "耳饰" },
    { id: "scarf",   label: "围巾" },
    { id: "brooch",  label: "胸针" },
  ];
  const iconPaths: Record<string, React.ReactNode> = {
    none:    <circle cx="22" cy="22" r="8" fill="none" stroke="rgba(140,110,68,0.28)" strokeWidth="1.5" strokeDasharray="3 3" />,
    glasses: <>
      <circle cx="16" cy="22" r="6" fill="none" stroke="rgba(65,42,18,0.55)" strokeWidth="1.5" />
      <circle cx="28" cy="22" r="6" fill="none" stroke="rgba(65,42,18,0.55)" strokeWidth="1.5" />
      <line x1="22" y1="22" x2="22" y2="22" stroke="rgba(65,42,18,0.55)" strokeWidth="1.5" />
      <line x1="10" y1="22" x2="5"  y2="22" stroke="rgba(65,42,18,0.4)"  strokeWidth="1" />
      <line x1="34" y1="22" x2="39" y2="22" stroke="rgba(65,42,18,0.4)"  strokeWidth="1" />
    </>,
    earring: <>
      <circle cx="16" cy="22" r="3" fill="rgba(210,183,108,0.85)" />
      <circle cx="28" cy="22" r="3" fill="rgba(210,183,108,0.85)" />
    </>,
    scarf: <path d="M 8 18 Q 14 16 22 17 Q 30 16 36 18 Q 34 26 36 30 Q 28 28 22 30 Q 16 28 8 30 Q 10 26 8 18 Z" fill="rgba(188,150,108,0.5)" />,
    brooch: <>
      <circle cx="22" cy="22" r="6" fill="rgba(210,183,108,0.8)" />
      <circle cx="22" cy="22" r="3" fill="rgba(255,244,196,0.95)" />
      <circle cx="22" cy="22" r="1" fill="rgba(200,165,88,0.9)" />
    </>,
  };
  return (
    <div className="flex gap-3 px-6 overflow-x-auto scrollbar-none pb-1">
      {opts.map(opt => (
        <OptionCard key={opt.id} selected={config.accessory === opt.id} onClick={() => update("accessory", opt.id)} label={opt.label}>
          <svg viewBox="0 0 44 44" width="44" height="44">
            {iconPaths[opt.id]}
          </svg>
        </OptionCard>
      ))}
    </div>
  );
}

function AuraPanel({ config, update }: { config: AvatarConfig; update: (k: keyof AvatarConfig, v: string) => void }) {
  const opts = ["quiet", "gentle", "rational", "sensitive", "free", "uncertain"] as const;
  return (
    <div className="flex gap-3 px-6 overflow-x-auto scrollbar-none pb-1">
      {opts.map(id => {
        const a = AURA_C[id];
        return (
          <OptionCard key={id} selected={config.aura === id} onClick={() => update("aura", id)} label={a.label} wide>
            <svg viewBox="0 0 60 44" width="60" height="44">
              <defs>
                <radialGradient id={`aura-opt-${id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor={a.glow} />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>
              </defs>
              <circle cx="30" cy="22" r="20" fill={`url(#aura-opt-${id})`} />
              <circle cx="30" cy="22" r="9"  fill="none" stroke={a.accent} strokeWidth="1.4" opacity="0.7" />
              <circle cx="30" cy="22" r="4.5" fill={a.accent} opacity="0.6" />
            </svg>
          </OptionCard>
        );
      })}
    </div>
  );
}

// ─── Gallery Background ───────────────────────────────────────────────────────

const galleryBg = "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&h=1200&fit=crop&auto=format";

function GalleryBg() {
  return (
    <>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `url(${galleryBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(10px) brightness(1.06) saturate(0.85)",
        transform: "scale(1.06)",
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(250,246,238,0.82)" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{
        width: "260px", height: "220px",
        background: "radial-gradient(ellipse 130px 110px at 50% 0%, rgba(255,252,244,0.38) 0%, transparent 70%)",
        filter: "blur(20px)",
      }} />
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  initialConfig?: AvatarConfig;
  onNext: (config: AvatarConfig) => void;
}

export function AvatarShaping({ initialConfig, onNext }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [config, setConfig] = useState<AvatarConfig>(initialConfig || DEFAULT_AVATAR_CONFIG);
  const [activeTab, setActiveTab] = useState<TabId>("outline");

  const update = (k: keyof AvatarConfig, v: string) =>
    setConfig(prev => ({ ...prev, [k]: v }));

  const tabIndex = TABS.findIndex(t => t.id === activeTab);

  const tabContent = () => {
    switch (activeTab) {
      case "outline":   return <OutlinePanel   config={config} update={update} />;
      case "hair":      return <HairPanel      config={config} update={update} />;
      case "face":      return <FacePanel      config={config} update={update} />;
      case "outfit":    return <OutfitPanel    config={config} update={update} />;
      case "accessory": return <AccessoryPanel config={config} update={update} />;
      case "aura":      return <AuraPanel      config={config} update={update} />;
    }
  };

  const tabLabel: Record<TabId, string> = {
    outline:   "选择脸型与肤色",
    hair:      "设计发型与发色",
    face:      "调整眼神与表情",
    outfit:    "为分身选择服装",
    accessory: "添加配饰细节",
    aura:      "确定气质与基调",
  };

  // ── Intro ──
  if (phase === "intro") {
    return (
      <div className="relative w-full h-full overflow-hidden flex flex-col">
        <GalleryBg />
        <div className="relative z-10 flex flex-col h-full px-8 pt-14">
          {/* Step dots */}
          <div className="flex gap-1.5 mb-10">
            {TABS.map((_, i) => (
              <div key={i} className="h-0.5 flex-1 rounded-full" style={{ background: "rgba(140,108,62,0.18)" }} />
            ))}
          </div>

          {/* Avatar ghost — frosted glass frame */}
          <div className="flex flex-col items-center mb-8">
            <div
              style={{
                width: "160px", height: "195px", borderRadius: "28px", position: "relative", overflow: "hidden",
                background: "rgba(255,252,245,0.52)",
                backdropFilter: "blur(24px) saturate(1.2)",
                WebkitBackdropFilter: "blur(24px) saturate(1.2)",
                border: "1.5px solid rgba(255,255,255,0.82)",
                boxShadow: "0 8px 32px rgba(100,78,52,0.09), inset 0 1.5px 0 rgba(255,255,255,0.9)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(180deg, rgba(255,255,255,0.26) 0%, transparent 100%)", pointerEvents: "none" }} />
              <svg width="130" height="165" viewBox="0 0 100 165">
                <AvatarFigure config={config} ghost />
              </svg>
            </div>
          </div>

          <div>
            <p style={{
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              color: "rgba(140,108,62,0.45)",
              marginBottom: "10px",
            }}>
              分身塑形
            </p>
            <h2 style={{
              fontFamily: "'Noto Serif SC', serif",
              fontSize: "26px",
              fontWeight: 400,
              lineHeight: 1.65,
              color: "rgba(50,38,22,0.88)",
              letterSpacing: "0.03em",
              marginBottom: "12px",
            }}>
              这是我的<br />数字分身
            </h2>
            <p style={{
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: "13px",
              lineHeight: 1.9,
              color: "rgba(140,108,62,0.48)",
              fontWeight: 300,
              letterSpacing: "0.03em",
            }}>
              它会替我守着这里。<br />
              陪我记录，为访客讲述我的故事。
            </p>
          </div>

          <div className="mt-auto pb-10 flex flex-col gap-3">
            <button
              onClick={() => setPhase("edit")}
              className="w-full py-4 rounded-2xl transition-all duration-200 active:scale-[0.983] relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(120,90,40,0.88) 0%, rgba(90,65,22,0.92) 100%)",
                border: "1.5px solid rgba(160,120,55,0.4)",
                boxShadow: "0 6px 24px rgba(100,72,22,0.2), inset 0 1.5px 0 rgba(255,235,180,0.18)",
              }}
            >
              <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
                height: "50%",
                background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)",
                borderRadius: "14px 14px 0 0",
              }} />
              <span style={{
                fontFamily: "'Noto Sans SC', sans-serif",
                fontSize: "14px",
                color: "rgba(252,240,210,0.96)",
                fontWeight: 500,
                letterSpacing: "0.06em",
                position: "relative",
              }}>
                开始为它塑形
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Done ──
  if (phase === "done") {
    const aura = AURA_C[config.aura];
    return (
      <div className="relative w-full h-full overflow-hidden flex flex-col">
        <GalleryBg />
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 220px 280px at 50% 38%, ${aura.glow.replace(",0.4)", ",0.18)")} 0%, transparent 70%)` }} />

        <div className="relative z-10 flex flex-col h-full pt-14 pb-10 px-6">
          <div className="flex gap-1.5 w-full mb-8">
            {TABS.map((_, i) => (
              <div key={i} className="h-0.5 flex-1 rounded-full" style={{ background: "rgba(140,108,62,0.6)" }} />
            ))}
          </div>

          {/* Final avatar — frosted frame */}
          <div className="flex justify-center mb-6">
            <div style={{
              width: "160px", height: "195px", borderRadius: "28px", position: "relative", overflow: "hidden",
              background: "rgba(255,252,245,0.58)",
              backdropFilter: "blur(24px) saturate(1.25)",
              WebkitBackdropFilter: "blur(24px) saturate(1.25)",
              border: "1.5px solid rgba(255,255,255,0.85)",
              boxShadow: "0 10px 36px rgba(100,78,52,0.1), inset 0 1.5px 0 rgba(255,255,255,0.92)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "20%", background: "linear-gradient(0deg, rgba(248,242,230,0.45) 0%, transparent 100%)", pointerEvents: "none" }} />
              <svg width="130" height="165" viewBox="0 0 100 165">
                <AvatarFigure config={config} />
              </svg>
            </div>
          </div>

          {/* Info card */}
          <div
            className="rounded-3xl relative overflow-hidden mb-5"
            style={{
              background: "rgba(255,252,245,0.62)",
              backdropFilter: "blur(28px) saturate(1.25)",
              WebkitBackdropFilter: "blur(28px) saturate(1.25)",
              border: "1.5px solid rgba(255,255,255,0.85)",
              boxShadow: "0 6px 28px rgba(100,78,52,0.09), inset 0 1.5px 0 rgba(255,255,255,0.92)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "40%", background: "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, transparent 100%)" }} />
            <div className="relative px-5 py-5">
              <p style={{
                fontFamily: "'Noto Sans SC', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.08em",
                color: "rgba(140,108,62,0.45)",
                marginBottom: "4px",
              }}>
                塑形完成
              </p>
              <p style={{
                fontFamily: "'Noto Serif SC', serif",
                fontSize: "18px",
                fontWeight: 500,
                color: "rgba(50,38,22,0.9)",
                letterSpacing: "0.02em",
                marginBottom: "12px",
              }}>
                这是我的分身
              </p>
              <div className="flex items-center gap-2 mb-3">
                <div style={{
                  height: "1px",
                  flex: 1,
                  background: "linear-gradient(90deg, transparent, rgba(180,148,100,0.25) 40%, rgba(180,148,100,0.25) 60%, transparent)",
                }} />
              </div>
              <p style={{
                fontFamily: "'Noto Sans SC', sans-serif",
                fontSize: "12px",
                color: "rgba(140,108,62,0.5)",
                fontWeight: 300,
                letterSpacing: "0.04em",
              }}>
                {aura.label} · {OUTFIT_C[config.outfit].name}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNext(config)}
            className="w-full py-4 rounded-2xl transition-all duration-200 active:scale-[0.983] relative overflow-hidden mt-auto"
            style={{
              background: "linear-gradient(135deg, rgba(120,90,40,0.88) 0%, rgba(90,65,22,0.92) 100%)",
              border: "1.5px solid rgba(160,120,55,0.4)",
              boxShadow: "0 6px 24px rgba(100,72,22,0.2), inset 0 1.5px 0 rgba(255,235,180,0.18)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
              height: "50%",
              background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)",
              borderRadius: "14px 14px 0 0",
            }} />
            <span style={{
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: "14px",
              color: "rgba(252,240,210,0.96)",
              fontWeight: 500,
              letterSpacing: "0.06em",
              position: "relative",
            }}>
              进入我的画廊
            </span>
          </button>
        </div>
      </div>
    );
  }

  // ── Edit ──
  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      <GalleryBg />

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-6 pt-12 pb-2">
        <button
          onClick={() => setPhase("intro")}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-90"
          style={{
            background: "rgba(255,252,245,0.58)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1.5px solid rgba(255,255,255,0.8)",
            boxShadow: "0 2px 8px rgba(100,78,52,0.08)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(88,62,22,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div className="flex flex-col items-center gap-1">
          <p style={{ fontSize: "12px", color: "rgba(140,108,62,0.5)", fontFamily: "'Noto Sans SC', sans-serif", letterSpacing: "0.04em" }}>
            为我的分身塑形
          </p>
          <div className="flex gap-1.5">
            {TABS.map((_, i) => (
              <div key={i} style={{
                width: i === tabIndex ? "18px" : "5px", height: "3px", borderRadius: "2px",
                background: i <= tabIndex ? "rgba(140,108,62,0.7)" : "rgba(140,108,62,0.16)",
                transition: "width 0.3s ease, background 0.3s ease",
              }} />
            ))}
          </div>
        </div>
        <div className="w-9" />
      </div>

      {/* Avatar preview area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 200px 240px at 50% 48%, ${AURA_C[config.aura].glow.replace(",0.4)", ",0.16)")} 0%, transparent 70%)` }} />
        {/* Frosted portrait frame */}
        <div style={{
          width: "148px", height: "180px", borderRadius: "24px", position: "relative", overflow: "hidden",
          background: "rgba(255,252,245,0.52)",
          backdropFilter: "blur(20px) saturate(1.2)",
          WebkitBackdropFilter: "blur(20px) saturate(1.2)",
          border: "1.5px solid rgba(255,255,255,0.82)",
          boxShadow: "0 8px 30px rgba(100,78,52,0.09), inset 0 1.5px 0 rgba(255,255,255,0.9)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1,
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, transparent 100%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "18%", background: "linear-gradient(0deg, rgba(248,242,230,0.4) 0%, transparent 100%)", pointerEvents: "none" }} />
          <svg width="120" height="160" viewBox="0 0 100 165">
            <AvatarFigure config={config} />
          </svg>
        </div>
      </div>

      {/* Bottom options panel */}
      <div
        className="relative z-20 flex flex-col pb-2"
        style={{
          background: "rgba(255,252,245,0.72)",
          backdropFilter: "blur(32px) saturate(1.3)",
          WebkitBackdropFilter: "blur(32px) saturate(1.3)",
          borderTop: "1.5px solid rgba(255,255,255,0.82)",
          boxShadow: "0 -8px 32px rgba(100,78,52,0.06)",
        }}
      >
        {/* Active tab label */}
        <div className="px-6 pt-4 pb-3">
          <p style={{ fontSize: "12px", color: "rgba(140,108,62,0.48)", fontFamily: "'Noto Sans SC', sans-serif", letterSpacing: "0.03em" }}>
            {tabLabel[activeTab]}
          </p>
        </div>

        {/* Option cards */}
        <div className="pb-3">
          {tabContent()}
        </div>

        {/* Category tabs */}
        <div className="flex items-center justify-around px-4 pb-3 pt-1">
          {TABS.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center gap-0.5 transition-all duration-200 active:scale-90"
                style={{
                  padding: "6px 10px",
                  borderRadius: "20px",
                  background: active ? "rgba(140,108,62,0.1)" : "transparent",
                  position: "relative",
                }}
              >
                {active && (
                  <div style={{
                    position: "absolute", top: 2, left: "50%", transform: "translateX(-50%)",
                    width: "20px", height: "2.5px", borderRadius: "0 0 2px 2px",
                    background: "rgba(140,108,62,0.72)",
                  }} />
                )}
                <span style={{
                  fontSize: "12px",
                  color: active ? "rgba(80,58,22,0.88)" : "rgba(140,108,62,0.4)",
                  fontFamily: "'Noto Sans SC', sans-serif",
                  fontWeight: active ? 500 : 400,
                  transition: "color 0.2s",
                }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 px-5 pb-6 pt-1">
          <button
            onClick={() => { setConfig(randomizeConfig()); setActiveTab("aura"); }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 active:scale-95"
            style={{
              background: "rgba(255,252,245,0.7)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1.5px solid rgba(255,255,255,0.8)",
              boxShadow: "0 2px 8px rgba(100,78,52,0.06), inset 0 1px 0 rgba(255,255,255,0.88)",
              color: "rgba(98,72,28,0.65)",
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: "13px",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 4v6h6M23 20v-6h-6" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
            随机
          </button>
          <button
            onClick={() => {
              if (tabIndex < TABS.length - 1) {
                setActiveTab(TABS[tabIndex + 1].id);
              } else {
                setPhase("done");
              }
            }}
            className="flex-1 py-3 rounded-xl transition-all duration-200 active:scale-[0.983] relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(120,90,40,0.88) 0%, rgba(90,65,22,0.92) 100%)",
              border: "1.5px solid rgba(160,120,55,0.4)",
              boxShadow: "0 4px 18px rgba(100,72,22,0.18), inset 0 1.5px 0 rgba(255,235,180,0.18)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
              height: "50%",
              background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)",
              borderRadius: "10px 10px 0 0",
            }} />
            <span style={{
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: "13px",
              color: "rgba(252,240,210,0.96)",
              fontWeight: 500,
              letterSpacing: "0.04em",
              position: "relative",
            }}>
              {tabIndex < TABS.length - 1 ? `下一步 ${tabIndex + 2} / ${TABS.length}` : "完成塑形"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
