import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AvatarFigure } from "./AvatarShaping";
import type { AvatarConfig } from "../types/avatar";
import { DEFAULT_AVATAR_CONFIG } from "../types/avatar";

interface Props {
  onNext: () => void;
  avatarConfig?: AvatarConfig;
}

const questions = [
  {
    sub: "我想更了解你一点",
    prompt: "面对压力，你更倾向于？",
    options: ["一个人消化", "找人说出来", "做点什么转移注意力", "写下来或画出来"],
  },
  {
    sub: "我想更了解你一点",
    prompt: "情绪低落时，你希望被理解的方式？",
    options: ["安静陪伴", "真诚倾听", "提供建议", "鼓励行动"],
  },
  {
    sub: "我想更了解你一点",
    prompt: "表达情绪时，你最需要的是？",
    options: ["安全感", "尊重和接纳", "及时反馈", "私密性"],
  },
  {
    sub: "最后一个问题",
    prompt: "如果 AI 用画作记录情绪，你希望？",
    options: ["强调视觉情绪氛围", "精准表达心理状态", "能回顾与比较情绪变化", "可与分身互动"],
  },
];

function buildResult(answers: string[]) {
  const emotionMap: Record<string, string> = {
    "一个人消化": "内敛型", "找人说出来": "表达型",
    "做点什么转移注意力": "行动型", "写下来或画出来": "沉淀型",
  };
  const styleMap: Record<string, string> = {
    "安静陪伴": "共情感受", "真诚倾听": "被动接收",
    "提供建议": "理性分析", "鼓励行动": "外向驱动",
  };
  const emotionType = emotionMap[answers[0]] ?? "复合型";
  const expressStyle = styleMap[answers[1]] ?? "感受型";
  const intensity = answers[2] === "安全感" || answers[2] === "私密性" ? "温和内敛" : "细腻敏感";
  return { emotionType, expressStyle, intensity };
}

const galleryBg = "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&h=1200&fit=crop&auto=format";

export function PersonalityDialogue({ onNext, avatarConfig = DEFAULT_AVATAR_CONFIG }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<"questions" | "result">("questions");

  const current = questions[step];
  const isLast = step === questions.length - 1;

  const handleSelect = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    const next = [...answers, opt];
    setTimeout(() => {
      if (isLast) {
        setAnswers(next);
        setPhase("result");
      } else {
        setAnswers(next);
        setStep((s) => s + 1);
        setSelected(null);
      }
    }, 500);
  };

  const result = phase === "result" ? buildResult(answers) : null;

  return (
    <div className="h-full relative overflow-hidden flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `url(${galleryBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(10px) brightness(1.06) saturate(0.85)",
        transform: "scale(1.06)",
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(250,246,238,0.84)" }} />
      {/* Ceiling light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{
        width: "300px", height: "260px",
        background: "radial-gradient(ellipse 150px 130px at 50% 0%, rgba(255,252,244,0.42) 0%, transparent 70%)",
        filter: "blur(22px)",
      }} />

      <AnimatePresence mode="wait">
        {phase === "questions" ? (
          <motion.div
            key="questions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 flex flex-col h-full"
          >
            {/* ── Progress bar ── */}
            <div className="px-6 pt-14 flex items-center gap-3">
              <div className="flex gap-1.5 flex-1">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: "2.5px",
                      borderRadius: "2px",
                      flex: 1,
                      transition: "background 0.35s ease",
                      background: i < step
                        ? "rgba(140,108,62,0.55)"
                        : i === step
                        ? "rgba(140,108,62,0.85)"
                        : "rgba(190,162,118,0.2)",
                    }}
                  />
                ))}
              </div>
              <p style={{
                fontFamily: "'Noto Sans SC', sans-serif",
                fontSize: "10px",
                color: "rgba(140,108,62,0.38)",
                letterSpacing: "0.04em",
                fontWeight: 300,
                flexShrink: 0,
              }}>
                {step + 1} / {questions.length}
              </p>
            </div>

            {/* ── Avatar — visual center ── */}
            <div className="flex flex-col items-center mt-8 mb-6">
              {/* Outer soft glow ring */}
              <div style={{ position: "relative", width: "160px", height: "160px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* Breathing aura */}
                <motion.div
                  animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.62, 0.4] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    width: "150px", height: "150px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(200,172,118,0.28) 0%, rgba(212,185,135,0.12) 55%, transparent 75%)",
                    pointerEvents: "none",
                  }}
                />
                {/* Secondary subtle ring */}
                <motion.div
                  animate={{ scale: [1, 1.14, 1], opacity: [0.18, 0.32, 0.18] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                  style={{
                    position: "absolute",
                    width: "150px", height: "150px",
                    borderRadius: "50%",
                    border: "1px solid rgba(180,148,90,0.22)",
                    pointerEvents: "none",
                  }}
                />

                {/* Avatar circle — 120px */}
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    width: "120px", height: "120px",
                    borderRadius: "50%",
                    background: "rgba(255,252,245,0.68)",
                    backdropFilter: "blur(24px) saturate(1.25)",
                    WebkitBackdropFilter: "blur(24px) saturate(1.25)",
                    border: "1.5px solid rgba(255,255,255,0.9)",
                    boxShadow: "0 8px 32px rgba(120,90,50,0.12), 0 2px 8px rgba(120,90,50,0.06), inset 0 1.5px 0 rgba(255,255,255,0.95)",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {/* Top highlight */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0,
                    height: "46%",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, transparent 100%)",
                    borderRadius: "50%",
                    pointerEvents: "none",
                  }} />
                  {/* Bottom fade */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    height: "28%",
                    background: "linear-gradient(0deg, rgba(248,242,230,0.5) 0%, transparent 100%)",
                    pointerEvents: "none",
                  }} />
                  {/* Avatar SVG — show head to waist */}
                  <svg
                    width="120" height="120"
                    viewBox="8 2 84 88"
                    style={{ display: "block" }}
                  >
                    <AvatarFigure config={avatarConfig} />
                  </svg>
                </motion.div>
              </div>

              {/* Status text */}
              <motion.p
                animate={{ opacity: [0.45, 0.75, 0.45] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  fontFamily: "'Noto Sans SC', sans-serif",
                  fontSize: "11px",
                  color: "rgba(140,108,62,0.55)",
                  letterSpacing: "0.12em",
                  fontWeight: 300,
                  marginTop: "10px",
                }}
              >
                正在了解你
              </motion.p>
            </div>

            {/* ── Question ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex flex-col items-center px-6 mb-5"
              >
                <p style={{
                  fontFamily: "'Noto Sans SC', sans-serif",
                  fontSize: "11px",
                  color: "rgba(140,108,62,0.42)",
                  letterSpacing: "0.06em",
                  fontWeight: 300,
                  marginBottom: "6px",
                }}>
                  {current.sub}
                </p>
                <p style={{
                  fontFamily: "'Noto Serif SC', serif",
                  fontSize: "17px",
                  lineHeight: 1.7,
                  color: "rgba(45,33,15,0.88)",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  textAlign: "center",
                }}>
                  {current.prompt}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* ── Options ── */}
            <div className="px-5 flex flex-col gap-2 flex-1">
              <AnimatePresence mode="popLayout">
                {current.options.map((opt, i) => {
                  const isSelected = selected === opt;
                  return (
                    <motion.button
                      key={`${step}-${opt}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.24, delay: i * 0.06 }}
                      onClick={() => handleSelect(opt)}
                      className="text-left px-5 py-3.5 rounded-2xl transition-all duration-200 active:scale-[0.983] relative overflow-hidden"
                      style={{
                        background: isSelected
                          ? "rgba(140,108,62,0.12)"
                          : "rgba(255,252,245,0.52)",
                        backdropFilter: "blur(20px) saturate(1.2)",
                        WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                        border: isSelected
                          ? "1.5px solid rgba(160,122,72,0.45)"
                          : "1.5px solid rgba(255,255,255,0.78)",
                        boxShadow: isSelected
                          ? "0 3px 14px rgba(140,100,50,0.1), inset 0 1px 0 rgba(255,255,255,0.5)"
                          : "0 2px 8px rgba(100,78,52,0.05), inset 0 1.5px 0 rgba(255,255,255,0.85)",
                      }}
                    >
                      <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
                        height: "50%",
                        background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)",
                        borderRadius: "16px 16px 0 0",
                      }} />
                      <div className="flex items-center gap-3 relative">
                        <div style={{
                          width: "5px", height: "5px", borderRadius: "50%", flexShrink: 0,
                          background: isSelected ? "rgba(140,108,62,0.82)" : "rgba(190,162,118,0.3)",
                          transition: "background 0.2s ease",
                        }} />
                        <p style={{
                          fontFamily: "'Noto Sans SC', sans-serif",
                          fontSize: "13px",
                          lineHeight: 1.5,
                          color: isSelected ? "rgba(60,42,15,0.92)" : "rgba(85,65,38,0.62)",
                          fontWeight: isSelected ? 500 : 400,
                          transition: "color 0.2s ease",
                        }}>
                          {opt}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Skip */}
            <div className="px-5 pb-10 pt-4 flex justify-center flex-shrink-0">
              <button
                onClick={onNext}
                className="transition-all active:scale-95"
                style={{
                  fontFamily: "'Noto Sans SC', sans-serif",
                  fontSize: "11px",
                  color: "rgba(140,108,62,0.3)",
                  letterSpacing: "0.04em",
                  fontWeight: 300,
                }}
              >
                先跳过，以后再说
              </button>
            </div>
          </motion.div>
        ) : (
          /* ── Result phase ── */
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.48 }}
            className="relative z-10 flex flex-col h-full px-5 pt-14"
          >
            {/* Avatar + completion */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="flex flex-col items-center mb-7"
            >
              <div style={{
                width: "88px", height: "88px", borderRadius: "50%",
                background: "rgba(255,252,245,0.65)",
                backdropFilter: "blur(24px) saturate(1.25)",
                WebkitBackdropFilter: "blur(24px) saturate(1.25)",
                border: "1.5px solid rgba(255,255,255,0.88)",
                boxShadow: "0 6px 24px rgba(120,90,50,0.1), inset 0 1.5px 0 rgba(255,255,255,0.92)",
                position: "relative", overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)", borderRadius: "50%", pointerEvents: "none" }} />
                <svg width="88" height="88" viewBox="8 2 84 88">
                  <AvatarFigure config={avatarConfig} />
                </svg>
              </div>
              <p style={{
                fontFamily: "'Noto Sans SC', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.1em",
                color: "rgba(140,108,62,0.42)",
                marginTop: "10px",
                marginBottom: "3px",
              }}>
                情绪定位完成
              </p>
              <p style={{
                fontFamily: "'Noto Serif SC', serif",
                fontSize: "19px",
                fontWeight: 500,
                color: "rgba(50,38,22,0.9)",
                letterSpacing: "0.03em",
              }}>
                我大致了解你了。
              </p>
            </motion.div>

            {/* Result card */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="rounded-3xl overflow-hidden relative mb-5"
              style={{
                background: "rgba(255,252,245,0.62)",
                backdropFilter: "blur(28px) saturate(1.25)",
                WebkitBackdropFilter: "blur(28px) saturate(1.25)",
                border: "1.5px solid rgba(255,255,255,0.85)",
                boxShadow: "0 8px 32px rgba(100,78,52,0.1), inset 0 1.5px 0 rgba(255,255,255,0.92)",
              }}
            >
              <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
                height: "40%",
                background: "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, transparent 100%)",
              }} />
              <div className="relative p-5 flex flex-col gap-4">
                {[
                  { label: "情绪类型", value: result?.emotionType ?? "", icon: "◈" },
                  { label: "表达方式倾向", value: result?.expressStyle ?? "", icon: "◇" },
                  { label: "情绪强度特征", value: result?.intensity ?? "", icon: "◉" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.32 + i * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div style={{
                      width: "38px", height: "38px", borderRadius: "12px", flexShrink: 0,
                      background: "rgba(248,243,232,0.8)",
                      border: "1.5px solid rgba(255,255,255,0.75)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ fontSize: "14px", color: "rgba(140,108,62,0.65)" }}>{item.icon}</span>
                    </div>
                    <div>
                      <p style={{
                        fontFamily: "'Noto Sans SC', sans-serif",
                        fontSize: "10px",
                        color: "rgba(140,108,62,0.45)",
                        fontWeight: 300,
                        letterSpacing: "0.04em",
                        marginBottom: "2px",
                      }}>
                        {item.label}
                      </p>
                      <p style={{
                        fontFamily: "'Noto Serif SC', serif",
                        fontSize: "15px",
                        color: "rgba(55,40,18,0.88)",
                        fontWeight: 500,
                        letterSpacing: "0.03em",
                      }}>
                        {item.value}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(180,148,100,0.2) 30%, rgba(180,148,100,0.2) 70%, transparent)" }} />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.65 }}
                  style={{
                    fontFamily: "'Noto Sans SC', sans-serif",
                    fontSize: "12px",
                    lineHeight: 1.8,
                    color: "rgba(110,82,40,0.52)",
                    fontWeight: 300,
                  }}
                >
                  基于你的回答，画廊将为你匹配更契合的情绪表达风格，每一幅作品都会更懂你。
                </motion.p>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.72 }}
              onClick={onNext}
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
                borderRadius: "16px 16px 0 0",
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
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              className="text-center mt-auto pb-10"
              style={{
                fontFamily: "'Noto Serif SC', serif",
                fontSize: "11px",
                color: "rgba(140,108,62,0.28)",
                letterSpacing: "0.06em",
                lineHeight: 2,
                fontWeight: 300,
              }}
            >
              你的感受，值得被好好看见。
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
