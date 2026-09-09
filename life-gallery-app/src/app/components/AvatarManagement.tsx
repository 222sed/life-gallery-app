import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import type { AvatarConfig } from "../types/avatar";

interface AvatarManagementProps {
  avatarConfig: AvatarConfig;
  onBack: () => void;
  onEditAvatar: () => void;
}

const SKIN: Record<string, string> = {
  ivory: "#f2d9c4", warm: "#e6bf9e", tan: "#c99672", deep: "#8b5e3c",
};
const HAIR: Record<string, string> = {
  black: "#2c2220", brown: "#6b4226", ash: "#8a7a72",
  pink: "#c4919a", flax: "#c4a870", silver: "#a8a4a0",
};
const OUTFIT_C: Record<string, { body: string; lower: string }> = {
  sketch:   { body: "#d8d0c0", lower: "#aba398" },
  curator:  { body: "#bebab0", lower: "#86807a" },
  studio:   { body: "#ccc4b4", lower: "#a49a84" },
  ceremony: { body: "#ece8e0", lower: "#e0dbd3" },
};
const AURA_C: Record<string, { glow: string }> = {
  quiet:     { glow: "rgba(185,175,215,0.4)" },
  gentle:    { glow: "rgba(230,198,168,0.4)" },
  rational:  { glow: "rgba(165,190,165,0.4)" },
  sensitive: { glow: "rgba(210,172,180,0.4)" },
  free:      { glow: "rgba(165,202,222,0.4)" },
  uncertain: { glow: "rgba(192,188,184,0.4)" },
};

function SimpleAvatarFigure({ config }: { config: AvatarConfig }) {
  const skin  = SKIN[config.skinTone];
  const hairC = HAIR[config.hairColor];
  const oc    = OUTFIT_C[config.outfit];
  const body  = oc.body;
  const lower = oc.lower;
  const aura  = AURA_C[config.aura];

  // Face dimensions based on face shape
  const faceDimensions: Record<AvatarConfig["faceShape"], [number, number]> = {
    soft: [16, 18],
    slim: [13, 20],
    round: [18, 16],
    neutral: [15, 17],
  };
  const [frx, fry] = faceDimensions[config.faceShape];

  const hx = 50, hy = 28;
  const chin = hy + fry;
  const sw = chin + 15;

  // Hair path based on hair style
  const hairBackPaths: Record<AvatarConfig["hairStyle"], string> = {
    short: `M ${hx - frx - 2} ${hy} Q ${hx - frx - 3} ${hy - fry - 9} ${hx} ${hy - fry - 7} Q ${hx + frx + 3} ${hy - fry - 9} ${hx + frx + 2} ${hy} Q ${hx + frx + 1} ${hy + 7} ${hx} ${hy + 8} Q ${hx - frx - 1} ${hy + 7} ${hx - frx - 2} ${hy} Z`,
    medium: `M ${hx - frx - 2} ${hy} Q ${hx - frx - 4} ${hy - fry - 11} ${hx} ${hy - fry - 8} Q ${hx + frx + 4} ${hy - fry - 11} ${hx + frx + 2} ${hy} Q ${hx + frx + 9} ${hy + 28} ${hx + 9} ${sw + 16} Q ${hx} ${sw + 20} ${hx - 9} ${sw + 16} Q ${hx - frx - 9} ${hy + 28} ${hx - frx - 2} ${hy} Z`,
    long: `M ${hx - frx - 2} ${hy} Q ${hx - frx - 4} ${hy - fry - 11} ${hx} ${hy - fry - 8} Q ${hx + frx + 4} ${hy - fry - 11} ${hx + frx + 2} ${hy} Q ${hx + frx + 10} ${hy + 44} ${hx + 11} ${sw + 54} Q ${hx} ${sw + 58} ${hx - 11} ${sw + 54} Q ${hx - frx - 10} ${hy + 44} ${hx - frx - 2} ${hy} Z`,
    curly: `M ${hx - frx - 2} ${hy} Q ${hx - frx - 6} ${hy - fry - 13} ${hx} ${hy - fry - 9} Q ${hx + frx + 6} ${hy - fry - 13} ${hx + frx + 2} ${hy} Q ${hx + frx + 12} ${hy + 16} ${hx + frx + 10} ${hy + 36} Q ${hx} ${hy + 40} ${hx - frx - 10} ${hy + 36} Q ${hx - frx - 12} ${hy + 16} ${hx - frx - 2} ${hy} Z`,
    updo: `M ${hx - frx - 1} ${hy} Q ${hx - frx - 3} ${hy - fry - 8} ${hx} ${hy - fry - 6} Q ${hx + frx + 3} ${hy - fry - 8} ${hx + frx + 1} ${hy} Q ${hx + 2} ${hy + 6} ${hx} ${hy + 7} Q ${hx - 2} ${hy + 6} ${hx - frx - 1} ${hy} Z`,
  };
  const hairBackPath = hairBackPaths[config.hairStyle];

  return (
    <svg width="97" height="160" viewBox="0 0 100 165" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="av-aura-mgmt" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={aura.glow} />
          <stop offset="65%"  stopColor={aura.glow.replace(",0.4)", ",0.1)")} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="88" rx="58" ry="62" fill="url(#av-aura-mgmt)" />
      <path d={hairBackPath} fill={hairC} />

      {/* Outfit rendering based on config */}
      {config.outfit === "ceremony" ? (
        <>
          {/* Dress */}
          <path d={`M ${hx - 20} ${sw} Q ${hx - 22} ${sw + 22} ${hx - 18} ${sw + 46} L ${hx + 18} ${sw + 46} Q ${hx + 22} ${sw + 22} ${hx + 20} ${sw} Q ${hx + 11} ${sw - 4} ${hx} ${sw - 4} Q ${hx - 11} ${sw - 4} ${hx - 20} ${sw} Z`} fill={body} />
          <path d={`M ${hx - 20} ${sw + 6} Q ${hx - 27} ${sw + 22} ${hx - 25} ${sw + 40} L ${hx - 18} ${sw + 38} Q ${hx - 20} ${sw + 22} ${hx - 16} ${sw + 7} Z`} fill={body} />
          <path d={`M ${hx + 20} ${sw + 6} Q ${hx + 27} ${sw + 22} ${hx + 25} ${sw + 40} L ${hx + 18} ${sw + 38} Q ${hx + 20} ${sw + 22} ${hx + 16} ${sw + 7} Z`} fill={body} />
          <path d={`M ${hx - 18} ${sw + 44} Q ${hx - 28} ${sw + 72} ${hx - 36} ${sw + 100} L ${hx + 36} ${sw + 100} Q ${hx + 28} ${sw + 72} ${hx + 18} ${sw + 44} Z`} fill={lower} />
          <ellipse cx={hx - 10} cy={sw + 104} rx="7" ry="4.5" fill="rgba(208,203,196,0.65)" />
          <ellipse cx={hx + 10} cy={sw + 104} rx="7" ry="4.5" fill="rgba(208,203,196,0.65)" />
        </>
      ) : (
        <>
          {/* Torso */}
          <path d={`M ${hx - 22} ${sw} Q ${hx - 24} ${sw + 22} ${hx - 22} ${sw + 48} L ${hx + 22} ${sw + 48} Q ${hx + 24} ${sw + 22} ${hx + 22} ${sw} Q ${hx + 11} ${sw - 4} ${hx} ${sw - 4} Q ${hx - 11} ${sw - 4} ${hx - 22} ${sw} Z`} fill={body} />
          {/* Arms */}
          <path d={`M ${hx - 22} ${sw + 6} Q ${hx - 29} ${sw + 24} ${hx - 27} ${sw + 52} L ${hx - 20} ${sw + 50} Q ${hx - 22} ${sw + 24} ${hx - 18} ${sw + 7} Z`} fill={body} />
          <path d={`M ${hx + 22} ${sw + 6} Q ${hx + 29} ${sw + 24} ${hx + 27} ${sw + 52} L ${hx + 20} ${sw + 50} Q ${hx + 22} ${sw + 24} ${hx + 18} ${sw + 7} Z`} fill={body} />
          {/* Coat flaps + lapel for curator */}
          {config.outfit === "curator" && (
            <>
              <path d={`M ${hx - 22} ${sw + 46} Q ${hx - 24} ${sw + 66} ${hx - 22} ${sw + 90} L ${hx - 10} ${sw + 90} Q ${hx - 9} ${sw + 66} ${hx - 10} ${sw + 46} Z`} fill={body} />
              <path d={`M ${hx + 22} ${sw + 46} Q ${hx + 24} ${sw + 66} ${hx + 22} ${sw + 90} L ${hx + 10} ${sw + 90} Q ${hx + 9} ${sw + 66} ${hx + 10} ${sw + 46} Z`} fill={body} />
              <path d={`M ${hx} ${sw - 3} L ${hx - 7} ${sw + 16} L ${hx} ${sw + 14} L ${hx + 7} ${sw + 16} Z`} fill="rgba(136,126,114,0.28)" />
            </>
          )}
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
        </>
      )}

      {/* Neck */}
      <rect x={hx - 3.5} y={chin - 1} width="7" height="14" rx="2" fill={skin} />
      {/* Face */}
      <ellipse cx={hx} cy={hy} rx={frx} ry={fry} fill={skin} />
      <ellipse cx={hx - 4} cy={hy - 6} rx={frx * 0.5} ry={fry * 0.42} fill="rgba(255,242,225,0.2)" />

      {/* Eyes - gentle */}
      <path d={`M ${hx - 10.5} ${hy - 0.8} Q ${hx - 6.5} ${hy - 4.8} ${hx - 2.5} ${hy - 0.8} Q ${hx - 6.5} ${hy + 1.1} ${hx - 10.5} ${hy - 0.8} Z`} fill="rgba(26,16,8,0.84)" />
      <path d={`M ${hx + 2.5}  ${hy - 0.8} Q ${hx + 6.5} ${hy - 4.8} ${hx + 10.5} ${hy - 0.8} Q ${hx + 6.5} ${hy + 1.1} ${hx + 2.5}  ${hy - 0.8} Z`} fill="rgba(26,16,8,0.84)" />
      <circle cx={hx - 5}  cy={hy - 2.3} r="0.8"  fill="rgba(255,255,255,0.82)" />
      <circle cx={hx + 8}  cy={hy - 2.3} r="0.8"  fill="rgba(255,255,255,0.82)" />

      {/* Eyebrows */}
      <path d={`M ${hx - 10} ${hy - 8} Q ${hx - 6.5} ${hy - 10.5} ${hx - 3} ${hy - 9}`} fill="none" stroke="rgba(52,34,16,0.3)" strokeWidth="1.1" strokeLinecap="round" />
      <path d={`M ${hx + 3}  ${hy - 9} Q ${hx + 6.5} ${hy - 10.5} ${hx + 10} ${hy - 8}`} fill="none" stroke="rgba(52,34,16,0.3)" strokeWidth="1.1" strokeLinecap="round" />

      {/* Nose */}
      <path d={`M ${hx} ${hy + 3} Q ${hx + 2.5} ${hy + 8} ${hx + 0.5} ${hy + 10} Q ${hx - 1} ${hy + 8} ${hx} ${hy + 3}`} fill="none" stroke="rgba(80,50,30,0.16)" strokeWidth="0.9" strokeLinecap="round" />

      {/* Mouth */}
      <path d={`M ${hx - 5} ${hy + fry - 6} Q ${hx} ${hy + fry - 2} ${hx + 5} ${hy + fry - 6}`} fill="none" stroke="rgba(162,100,68,0.55)" strokeWidth="1.3" strokeLinecap="round" />

      {/* Hair front based on style */}
      {config.hairStyle === "short" && (
        <path d={`M ${hx - frx + 4} ${hy - fry + 4} Q ${hx - 3} ${hy - fry - 3} ${hx} ${hy - fry - 1} Q ${hx + 3} ${hy - fry - 3} ${hx + frx - 4} ${hy - fry + 4}`} fill={hairC} />
      )}
      {(config.hairStyle === "medium" || config.hairStyle === "long") && (
        <path d={`M ${hx - frx + 2} ${hy - fry + 4} Q ${hx - 5} ${hy - fry - 5} ${hx} ${hy - fry - 3} Q ${hx + 5} ${hy - fry - 5} ${hx + frx - 2} ${hy - fry + 4} Q ${hx + frx} ${hy - fry + 11} ${hx + frx - 3} ${hy - fry + 17} Q ${hx + 2} ${hy - fry + 10} ${hx} ${hy - fry + 12} Q ${hx - 2} ${hy - fry + 10} ${hx - frx + 3} ${hy - fry + 17} Q ${hx - frx} ${hy - fry + 11} ${hx - frx + 2} ${hy - fry + 4} Z`} fill={hairC} />
      )}
      {config.hairStyle === "curly" && (
        <>
          <circle cx={hx - 9} cy={hy - fry + 5} r="7.5" fill={hairC} />
          <circle cx={hx + 9} cy={hy - fry + 5} r="7.5" fill={hairC} />
          <circle cx={hx} cy={hy - fry + 2} r="7" fill={hairC} />
          <circle cx={hx - frx + 5} cy={hy - fry + 12} r="5.5" fill={hairC} />
          <circle cx={hx + frx - 5} cy={hy - fry + 12} r="5.5" fill={hairC} />
        </>
      )}
      {config.hairStyle === "updo" && (
        <>
          <ellipse cx={hx} cy={hy - fry - 10} rx="9.5" ry="8.5" fill={hairC} />
          <path d={`M ${hx - frx + 3} ${hy - fry + 5} Q ${hx - 2} ${hy - fry} ${hx} ${hy - fry + 2} Q ${hx + 2} ${hy - fry} ${hx + frx - 3} ${hy - fry + 5}`} fill={hairC} />
        </>
      )}

      {/* Accessories */}
      {config.accessory === "glasses" && (
        <>
          <circle cx={hx - 6.5} cy={hy - 2} r="5.5" fill="none" stroke="rgba(42,28,12,0.42)" strokeWidth="1.1" />
          <circle cx={hx + 6.5} cy={hy - 2} r="5.5" fill="none" stroke="rgba(42,28,12,0.42)" strokeWidth="1.1" />
          <line x1={hx - 1} y1={hy - 2} x2={hx + 1} y2={hy - 2} stroke="rgba(42,28,12,0.42)" strokeWidth="1" />
          <line x1={hx - 12.3} y1={hy - 2} x2={hx - frx} y2={hy - 2} stroke="rgba(42,28,12,0.3)" strokeWidth="0.8" />
          <line x1={hx + 12.3} y1={hy - 2} x2={hx + frx} y2={hy - 2} stroke="rgba(42,28,12,0.3)" strokeWidth="0.8" />
        </>
      )}
      {config.accessory === "earring" && (
        <>
          <circle cx={hx - frx + 2} cy={hy + 8} r="2.5" fill="rgba(212,183,110,0.9)" />
          <circle cx={hx + frx - 2} cy={hy + 8} r="2.5" fill="rgba(212,183,110,0.9)" />
        </>
      )}
      {config.accessory === "scarf" && (
        <path d={`M ${hx - 22} ${chin + 3} Q ${hx - 16} ${chin + 8} ${hx} ${chin + 7} Q ${hx + 16} ${chin + 8} ${hx + 22} ${chin + 3} Q ${hx + 20} ${chin + 17} ${hx + 22} ${chin + 23} Q ${hx + 8} ${chin + 19} ${hx} ${chin + 21} Q ${hx - 8} ${chin + 19} ${hx - 22} ${chin + 23} Q ${hx - 20} ${chin + 17} ${hx - 22} ${chin + 3} Z`} fill="rgba(188,150,108,0.52)" />
      )}
      {config.accessory === "brooch" && (
        <>
          <circle cx={hx + 10} cy={sw + 17} r="4.5" fill="rgba(208,180,112,0.8)" />
          <circle cx={hx + 10} cy={sw + 17} r="2.2" fill="rgba(255,244,196,0.95)" />
          <circle cx={hx + 10} cy={sw + 17} r="0.8" fill="rgba(200,165,88,0.9)" />
        </>
      )}
    </svg>
  );
}

const AURA_LABELS: Record<AvatarConfig["aura"], string> = {
  quiet: "安静的我",
  gentle: "温柔的我",
  rational: "理性的我",
  sensitive: "敏感的我",
  free: "自由的我",
  uncertain: "还没想清楚",
};

const OUTFIT_LABELS: Record<AvatarConfig["outfit"], string> = {
  sketch: "日常速写",
  curator: "私人馆长",
  studio: "梦境画室",
  ceremony: "纪念日礼服",
};

export function AvatarManagement({ avatarConfig, onBack, onEditAvatar }: AvatarManagementProps) {
  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #f5f2ed 0%, #ebe6dd 100%)",
      }}
    >
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 pt-12 pb-4">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 active:scale-90"
          style={{
            background: "rgba(181, 150, 122, 0.1)",
            border: "1px solid rgba(181, 150, 122, 0.15)",
          }}
        >
          <ChevronLeft size={20} strokeWidth={2} style={{ color: "#b5967a" }} />
        </button>
        <h1
          className="text-lg"
          style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            color: "#4a4237",
            fontWeight: 500,
            letterSpacing: "0.05em",
          }}
        >
          分身管理
        </h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Avatar card */}
          <div
            className="relative rounded-3xl overflow-hidden mb-6"
            style={{
              background: "linear-gradient(160deg, #f8f5f0 0%, #f2ede5 100%)",
              border: "1px solid rgba(181, 150, 122, 0.18)",
              boxShadow: "0 8px 32px rgba(149, 119, 90, 0.12), 0 2px 8px rgba(149, 119, 90, 0.08)",
            }}
          >
            {/* Gallery background elements */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Ceiling light */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2"
                style={{
                  width: "200px",
                  height: "140px",
                  background: "radial-gradient(ellipse 100px 70px at 50% 0%, rgba(255,246,224,0.5) 0%, transparent 70%)",
                }}
              />
              {/* Subtle vertical light shaft */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(90deg, rgba(255,248,235,0.0) 0%, rgba(255,248,235,0.06) 50%, rgba(255,248,235,0.0) 100%)",
                }}
              />
            </div>

            {/* Avatar display area */}
            <div className="relative z-10 flex flex-col items-center pt-12 pb-8">
              {/* Ambient glow */}
              <div
                className="absolute"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "240px",
                  height: "240px",
                  background: `radial-gradient(ellipse 120px 120px at 50% 50%, ${AURA_C[avatarConfig.aura].glow.replace(",0.4)", ",0.15)")} 0%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />

              {/* Avatar figure */}
              <div className="relative z-10 flex flex-col items-center">
                <SimpleAvatarFigure config={avatarConfig} />
                {/* Pedestal */}
                <div
                  style={{
                    width: "140px",
                    height: "16px",
                    background: "rgba(232,226,214,0.85)",
                    borderRadius: "5px 5px 3px 3px",
                    marginTop: "-6px",
                    boxShadow: "0 4px 18px rgba(80,58,28,0.12), inset 0 1px 2px rgba(255,255,255,0.4)",
                    border: "1px solid rgba(200,185,155,0.45)",
                  }}
                />
              </div>

              {/* Info */}
              <div className="mt-6 text-center px-6">
                <h2
                  className="text-lg mb-1"
                  style={{
                    fontFamily: "'Noto Serif SC', serif",
                    color: "#4a4237",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                  }}
                >
                  我的数字分身
                </h2>
                <p
                  className="text-sm"
                  style={{
                    fontFamily: "'Noto Sans SC', sans-serif",
                    color: "#9d8f7f",
                    letterSpacing: "0.03em",
                  }}
                >
                  {AURA_LABELS[avatarConfig.aura]} · {OUTFIT_LABELS[avatarConfig.outfit]}
                </p>
              </div>
            </div>
          </div>

          {/* Edit button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={onEditAvatar}
            className="w-full py-4 rounded-full transition-all duration-200 active:scale-98"
            style={{
              background: "linear-gradient(135deg, #b5967a 0%, #9d8366 100%)",
              color: "#ffffff",
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: "15px",
              fontWeight: 500,
              letterSpacing: "0.05em",
              boxShadow: "0 4px 20px rgba(149, 119, 90, 0.25), 0 2px 8px rgba(149, 119, 90, 0.15)",
            }}
          >
            修改分身形象
          </motion.button>

          {/* Hint text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-4 text-xs"
            style={{
              fontFamily: "'Noto Sans SC', sans-serif",
              color: "#b5a596",
              letterSpacing: "0.02em",
            }}
          >
            你的分身会在画廊中代替你守候
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
