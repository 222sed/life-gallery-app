import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { setEmotionCtx } from "../store/emotionCtx";

interface Props {
  onConfirm: (emotion: string, intensity: number) => void;
  onBack: () => void;
}

const emotions = [
  { id: "joy",        label: "喜悦", emoji: "😊", color: "#F5B84E", trackColor: "rgba(245,184,78,0.55)"  },
  { id: "calm",       label: "平静", emoji: "🌿", color: "#5BAB82", trackColor: "rgba(91,171,130,0.55)"  },
  { id: "warm",       label: "温暖", emoji: "❤️",  color: "#E0743A", trackColor: "rgba(224,116,58,0.55)"  },
  { id: "low",        label: "低落", emoji: "🌧️", color: "#7A9AB0", trackColor: "rgba(122,154,176,0.55)" },
  { id: "angry",      label: "愤怒", emoji: "🔥", color: "#C04040", trackColor: "rgba(192,64,64,0.55)"   },
  { id: "anxious",    label: "不安", emoji: "🌫️", color: "#9B88B4", trackColor: "rgba(155,136,180,0.55)" },
  { id: "tired",      label: "疲惫", emoji: "🌙", color: "#A09080", trackColor: "rgba(160,144,128,0.55)" },
  { id: "anticipate", label: "期待", emoji: "✨", color: "#D4A030", trackColor: "rgba(212,160,48,0.55)"  },
];

function intensityLabel(v: number) {
  if (v < 25) return "轻微";
  if (v < 50) return "慢慢积累";
  if (v < 75) return "占据脑海";
  return "快要溢出";
}

const SUPABASE_URL = "https://ufhirlwxamwffkrwsnmi.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmaGlybHd4YW13ZmZrcndzbm1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MTcyOTIsImV4cCI6MjEwNDE5MzI5Mn0.5jPikD2ROpxWo-KMSSpFkHQ7241C-Gq1DUh4SrF-xVM";

async function fetchAIReply(emotion: string, emotionLabel: string, intensity: number, userMessage: string): Promise<string> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 45000);
  let res: Response;
  try {
    res = await fetch(`${SUPABASE_URL}/functions/v1/server/ai-chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ANON_KEY}`,
        "apikey": ANON_KEY,
      },
      body: JSON.stringify({ emotion, emotionLabel, intensity, userMessage }),
      signal: controller.signal,
    });
  } catch (error) {
    throw new Error(error instanceof DOMException && error.name === "AbortError" ? "请求超时，请重试" : "网络连接失败");
  } finally {
    window.clearTimeout(timeout);
  }  let data: Record<string, unknown> = {};
  try { data = await res.json(); } catch (_) { throw new Error("网络连接失败"); }
  if (!res.ok || data.error) {
    const msg =
      data.errorType === "network" ? "网络连接失败" :
      data.errorType === "busy" ? "免费模型当前繁忙，请稍后重试" :
      data.errorType === "empty_reply" ? "模型返回空内容，请重试" :
      data.errorType === "format_error" ? "回复格式不完整，请重新生成" :
      data.errorType === "api_error" ? "模型服务请求失败" :
      String(data.error ?? `请求失败（HTTP ${res.status}）`);
    throw new Error(msg);
  }
  const reply = data.reply as string;
  if (!reply?.trim()) throw new Error("模型返回空内容，请重试");
  return reply;
}

const galleryBg = "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&h=1200&fit=crop&auto=format";

function getShakeAmplitude(v: number): number {
  if (v <= 30) return 0;
  if (v <= 70) return (v - 30) / 40;
  return 1 + ((v - 70) / 30) * 2;
}

function getShakeFrequency(v: number): number {
  if (v <= 30) return 8;
  if (v <= 70) return 8 + ((v - 30) / 40) * 4;
  return 12 + ((v - 70) / 30) * 8;
}

type Phase = "compose" | "loading" | "replied" | "error";

export function EmotionConfirmation({ onConfirm, onBack }: Props) {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(30);
  const [isDragging, setIsDragging] = useState(false);
  const [shakeOffset, setShakeOffset] = useState(0);
  const [userText, setUserText] = useState("");
  const [phase, setPhase] = useState<Phase>("compose");
  const [aiReply, setAiReply] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const trackRef = useRef<HTMLDivElement>(null);
  const intensityRef = useRef(30);
  const isDraggingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const shakePhaseRef = useRef(0);
  const ampRef = useRef(0);
  const reducedMotion = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  useEffect(() => { intensityRef.current = intensity; }, [intensity]);
  useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);

  useEffect(() => {
    if (reducedMotion.current) return;
    function tick(time: number) {
      const dt = lastTimeRef.current ? Math.min((time - lastTimeRef.current) / 1000, 0.05) : 0;
      lastTimeRef.current = time;
      const v = intensityRef.current;
      const dragging = isDraggingRef.current;
      const targetAmp = dragging ? getShakeAmplitude(v) : 0;
      const k = dragging ? 8 : 11.5;
      ampRef.current += (targetAmp - ampRef.current) * Math.min(1, dt * k);
      if (ampRef.current < 0.02) ampRef.current = 0;
      shakePhaseRef.current += getShakeFrequency(v) * 2 * Math.PI * dt;
      const offset = ampRef.current > 0.02 ? Math.sin(shakePhaseRef.current) * ampRef.current : 0;
      setShakeOffset(offset);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
    };
  }, []);

  const currentEmotion = emotions.find((e) => e.id === selectedEmotion) ?? emotions[0];
  const accentColor = currentEmotion.color;

  const updateFromPointer = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    setIntensity(Math.round(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)) * 100));
  };

  const onTrackPointerDown = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateFromPointer(e.clientX);
  }, []);

  const onTrackPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    updateFromPointer(e.clientX);
  }, [isDragging]);

  const onTrackPointerUp = useCallback(() => setIsDragging(false), []);

  const thumbX = intensity;
  const today = new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
  const canSubmit = !!selectedEmotion && userText.trim().length > 0 && phase === "compose";

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setPhase("loading");
    setErrorMsg("");
    try {
      const reply = await fetchAIReply(selectedEmotion!, currentEmotion.label, intensity, userText.trim());
      setAiReply(reply);
      setPhase("replied");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "网络请求失败");
      setPhase("error");
    }
  };

  const handleRetry = () => { setPhase("compose"); setErrorMsg(""); };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `url(${galleryBg})`,
        backgroundSize: "cover", backgroundPosition: "center",
        filter: "blur(10px) brightness(1.06) saturate(0.82)", transform: "scale(1.06)",
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(180deg, rgba(253,250,244,0.72) 0%, rgba(249,245,237,0.78) 55%, rgba(245,240,230,0.82) 100%)",
      }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{
        width: "260px", height: "180px",
        background: "radial-gradient(ellipse 130px 90px at 50% 0%, rgba(255,252,244,0.32) 0%, transparent 70%)",
        filter: "blur(20px)",
      }} />

      <div className="relative z-10 flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38 }}
          className="flex items-center gap-3 px-5 pt-14 pb-2 flex-shrink-0">
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full transition-all active:scale-90"
            style={{ background: "rgba(255,252,245,0.58)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1.5px solid rgba(255,255,255,0.82)", boxShadow: "0 3px 12px rgba(100,80,52,0.08), inset 0 1px 0 rgba(255,255,255,0.88)" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="rgba(100,78,52,0.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div>
            <p style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "17px", color: "rgba(50,38,24,0.92)", fontWeight: 500, letterSpacing: "0.04em" }}>情绪确认</p>
            <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "10px", color: "rgba(130,105,78,0.5)", letterSpacing: "0.04em", marginTop: "1px" }}>{today}</p>
          </div>
        </motion.div>

        {/* Emotion question */}
        <motion.p initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.36, delay: 0.1 }}
          className="px-6 mt-5 mb-4 flex-shrink-0"
          style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "13px", color: "rgba(65,48,28,0.72)", letterSpacing: "0.04em", fontWeight: 400 }}>
          此刻的情绪是？
        </motion.p>

        {/* Emotion grid */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: 0.14 }}
          className="grid grid-cols-4 gap-3 px-5 mb-7 flex-shrink-0">
          {emotions.map((em, idx) => {
            const selected = selectedEmotion === em.id;
            return (
              <motion.button key={em.id}
                onClick={() => { if (phase === "compose") setSelectedEmotion(em.id); }}
                initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.16 + idx * 0.04 }}
                className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all duration-200 active:scale-95 relative overflow-hidden"
                style={{
                  background: selected ? "rgba(248,242,228,0.88)" : "rgba(255,252,245,0.55)",
                  backdropFilter: "blur(20px) saturate(1.2)", WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                  border: selected ? `1.5px solid ${em.color}55` : "1.5px solid rgba(255,255,255,0.82)",
                  boxShadow: selected
                    ? `0 4px 16px ${em.color}22, 0 2px 6px rgba(100,80,52,0.06), inset 0 1.5px 0 rgba(255,255,255,0.9)`
                    : "0 2px 10px rgba(100,80,52,0.05), inset 0 1.5px 0 rgba(255,255,255,0.88)",
                }}>
                <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)", borderRadius: "16px 16px 0 0" }} />
                {selected && <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 110%, ${em.color}18 0%, transparent 65%)` }} />}
                <span style={{ fontSize: "22px", lineHeight: 1 }}>{em.emoji}</span>
                <span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "11px", color: selected ? "rgba(50,35,14,0.85)" : "rgba(100,80,55,0.6)", letterSpacing: "0.02em", fontWeight: selected ? 500 : 400, position: "relative" }}>
                  {em.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Intensity section */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: 0.32 }}
          className="px-6 mb-5 flex-shrink-0">
          <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "13px", color: "rgba(65,48,28,0.72)", letterSpacing: "0.04em", fontWeight: 400, marginBottom: "20px" }}>强烈程度</p>
          <div className="relative" style={{ paddingTop: "32px", paddingBottom: "32px" }}>
            <div ref={trackRef} className="relative rounded-full cursor-pointer"
              style={{ height: "5px", background: "rgba(200,180,148,0.28)" }}
              onPointerDown={onTrackPointerDown} onPointerMove={onTrackPointerMove}
              onPointerUp={onTrackPointerUp} onPointerLeave={onTrackPointerUp}>
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0, width: `${thumbX}%`, borderRadius: "999px",
                background: `linear-gradient(90deg, ${accentColor}88 0%, ${accentColor} 100%)`,
                transition: isDragging ? "none" : "width 0.15s ease",
              }} />
              <div style={{
                position: "absolute", top: "50%", left: `${thumbX}%`,
                transform: `translate(calc(-50% + ${shakeOffset}px), -50%)`,
                width: "22px", height: "22px", borderRadius: "50%",
                background: `radial-gradient(circle at 38% 36%, rgba(255,255,255,0.95) 0%, ${accentColor} 60%, ${accentColor}cc 100%)`,
                border: "2.5px solid rgba(255,255,255,0.92)",
                boxShadow: `0 3px ${14 + Math.round((intensity / 100) * 18)}px ${accentColor}${Math.round(85 + (intensity / 100) * 85).toString(16).padStart(2, "0")}, 0 1px 4px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.7)`,
                cursor: "grab", transition: isDragging ? "none" : "left 0.1s ease", zIndex: 2,
              }} />
            </div>
            <div className="flex justify-between mt-3">
              <span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "10px", color: "rgba(130,105,78,0.45)", letterSpacing: "0.03em" }}>轻微</span>
              <span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "10px", color: "rgba(130,105,78,0.45)", letterSpacing: "0.03em" }}>强烈</span>
            </div>
            <div className="flex justify-center mt-2">
              <AnimatePresence mode="wait">
                {(() => {
                  const label = intensityLabel(intensity);
                  const isOverflow = label === "快要溢出";
                  return (
                    <motion.span key={label}
                      initial={{ opacity: 0, y: 4, scale: isOverflow ? 0.88 : 1 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 1 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "12px", color: accentColor, letterSpacing: "0.06em", fontWeight: 500, textShadow: `0 0 ${isOverflow ? 18 : 12}px ${accentColor}${isOverflow ? "88" : "44"}`, display: "inline-block" }}>
                      {label}
                    </motion.span>
                  );
                })()}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Text input */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: 0.4 }}
          className="px-6 mb-5 flex-shrink-0">
          <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "13px", color: "rgba(65,48,28,0.72)", letterSpacing: "0.04em", fontWeight: 400, marginBottom: "12px" }}>
            用一句话描述此刻
          </p>
          <div className="relative">
            <textarea
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              disabled={phase !== "compose"}
              placeholder="譬如：工作上又出了一点问题，我有些担心…"
              maxLength={120}
              rows={3}
              className="w-full resize-none outline-none transition-all duration-200"
              style={{
                fontFamily: "'Noto Sans SC', sans-serif", fontSize: "13px", lineHeight: "1.7",
                color: "rgba(50,38,24,0.85)",
                background: "rgba(255,252,245,0.62)",
                backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                border: userText.length > 0 ? `1.5px solid ${accentColor}44` : "1.5px solid rgba(255,255,255,0.82)",
                borderRadius: "16px", padding: "14px 16px",
                boxShadow: "0 2px 12px rgba(100,80,52,0.06), inset 0 1.5px 0 rgba(255,255,255,0.88)",
              }}
            />
            {userText.length > 80 && (
              <span style={{ position: "absolute", bottom: "10px", right: "14px", fontFamily: "'Noto Sans SC', sans-serif", fontSize: "10px", color: "rgba(130,105,78,0.4)" }}>
                {userText.length}/120
              </span>
            )}
          </div>
        </motion.div>

        {/* AI Reply / Loading / Error */}
        <AnimatePresence mode="wait">
          {phase === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }} className="mx-6 mb-5 flex-shrink-0">
              <div className="flex items-center gap-3 px-5 py-4 rounded-2xl" style={{
                background: "rgba(255,252,245,0.68)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                border: "1.5px solid rgba(255,255,255,0.82)", boxShadow: "0 4px 18px rgba(100,80,52,0.08), inset 0 1.5px 0 rgba(255,255,255,0.9)",
              }}>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
                      style={{ width: "6px", height: "6px", borderRadius: "50%", background: accentColor, opacity: 0.7 }} />
                  ))}
                </div>
                <span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "12px", color: "rgba(100,78,52,0.55)", letterSpacing: "0.04em" }}>
                  画廊正在聆听…
                </span>
              </div>
            </motion.div>
          )}

          {phase === "replied" && (
            <motion.div key="replied" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.38, ease: "easeOut" }} className="mx-6 mb-5 flex-shrink-0">
              <div className="relative overflow-hidden rounded-2xl px-5 py-4" style={{
                background: "rgba(255,252,245,0.82)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
                border: `1.5px solid ${accentColor}30`,
                boxShadow: `0 6px 24px ${accentColor}18, 0 2px 8px rgba(100,80,52,0.06), inset 0 1.5px 0 rgba(255,255,255,0.92)`,
              }}>
                <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "40%", background: "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, transparent 100%)" }} />
                <div className="flex items-center gap-2.5 mb-3">
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: `radial-gradient(circle at 38% 36%, rgba(255,255,255,0.9) 0%, ${accentColor}88 100%)`, border: "1.5px solid rgba(255,255,255,0.88)", boxShadow: `0 2px 8px ${accentColor}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>🎨</div>
                  <span style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "11px", color: accentColor, letterSpacing: "0.06em", fontWeight: 500 }}>人生画廊</span>
                </div>
                <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "13px", lineHeight: "1.85", color: "rgba(45,34,18,0.88)", letterSpacing: "0.03em", position: "relative" }}>
                  {aiReply}
                </p>
                <button onClick={handleRetry} className="mt-3 flex items-center gap-1"
                  style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "11px", color: "rgba(130,105,78,0.45)", letterSpacing: "0.04em", background: "none", border: "none", cursor: "pointer" }}>
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8a6 6 0 0 1 10.5-4M14 8a6 6 0 0 1-10.5 4" stroke="rgba(130,105,78,0.45)" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M12.5 4V7H9.5" stroke="rgba(130,105,78,0.45)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  重新输入
                </button>
              </div>
            </motion.div>
          )}

          {phase === "error" && (
            <motion.div key="error" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }} className="mx-6 mb-5 flex-shrink-0">
              <div className="flex items-center justify-between px-5 py-4 rounded-2xl" style={{
                background: "rgba(255,248,244,0.75)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                border: "1.5px solid rgba(200,120,80,0.25)", boxShadow: "0 4px 16px rgba(180,80,40,0.06)",
              }}>
                <div>
                  <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "12px", color: "rgba(160,80,40,0.8)", letterSpacing: "0.04em" }}>连接画廊失败，请稍后重试</p>
                  {errorMsg && <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "10px", color: "rgba(160,80,40,0.45)", marginTop: "2px" }}>{errorMsg}</p>}
                </div>
                <button onClick={handleRetry} className="px-3 py-1.5 rounded-xl transition-all active:scale-95"
                  style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "11px", color: "rgba(160,80,40,0.8)", background: "rgba(255,240,232,0.8)", border: "1px solid rgba(200,120,80,0.25)", cursor: "pointer", letterSpacing: "0.04em" }}>
                  重试
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action button */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: 0.48 }}
          className="px-6 mt-auto mb-10 flex-shrink-0">
          {phase === "replied" ? (
            <button onClick={() => { setEmotionCtx(currentEmotion.label, intensity, userText, aiReply); onConfirm(currentEmotion.label, intensity); }}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl transition-all duration-200 active:scale-[0.976] relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${accentColor}cc 0%, ${accentColor} 100%)`, border: `1.5px solid ${accentColor}55`, boxShadow: `0 8px 28px ${accentColor}44, 0 3px 10px ${accentColor}22, inset 0 1.5px 0 rgba(255,255,255,0.35)`, cursor: "pointer" }}>
              <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)", borderRadius: "16px 16px 0 0" }} />
              <span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "14px", fontWeight: 500, letterSpacing: "0.08em", color: "rgba(255,248,232,0.96)", position: "relative" }}>开始深入对谈</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ position: "relative" }}>
                <path d="M4 8h8M9 5l3 3-3 3" stroke="rgba(255,248,232,0.88)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={!canSubmit}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl transition-all duration-200 active:scale-[0.976] relative overflow-hidden"
              style={{
                background: canSubmit ? `linear-gradient(135deg, ${accentColor}cc 0%, ${accentColor} 100%)` : "rgba(200,180,150,0.28)",
                border: canSubmit ? `1.5px solid ${accentColor}55` : "1.5px solid rgba(200,175,140,0.3)",
                boxShadow: canSubmit ? `0 8px 28px ${accentColor}44, 0 3px 10px ${accentColor}22, inset 0 1.5px 0 rgba(255,255,255,0.35)` : "none",
                backdropFilter: canSubmit ? undefined : "blur(16px)",
                WebkitBackdropFilter: canSubmit ? undefined : "blur(16px)",
                cursor: canSubmit ? "pointer" : "default",
                opacity: phase === "loading" ? 0.6 : 1,
              }}>
              <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)", borderRadius: "16px 16px 0 0" }} />
              <span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "14px", fontWeight: 500, letterSpacing: "0.08em", color: canSubmit ? "rgba(255,248,232,0.96)" : "rgba(140,115,80,0.45)", position: "relative" }}>
                {phase === "loading" ? "聆听中…" : "向画廊倾诉"}
              </span>
              {canSubmit && phase !== "loading" && (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ position: "relative" }}>
                  <path d="M4 8h8M9 5l3 3-3 3" stroke="rgba(255,248,232,0.88)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          )}
          {!selectedEmotion && phase === "compose" && (
            <p style={{ textAlign: "center", marginTop: "10px", fontFamily: "'Noto Sans SC', sans-serif", fontSize: "10px", color: "rgba(140,115,80,0.38)", letterSpacing: "0.04em" }}>
              请先选择此刻的情绪
            </p>
          )}
          {selectedEmotion && !userText.trim() && phase === "compose" && (
            <p style={{ textAlign: "center", marginTop: "10px", fontFamily: "'Noto Sans SC', sans-serif", fontSize: "10px", color: "rgba(140,115,78,0.38)", letterSpacing: "0.04em" }}>
              再写一句话，让画廊更了解你
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
