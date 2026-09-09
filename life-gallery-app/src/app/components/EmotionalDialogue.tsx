import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { emotionCtx, setConfirmedEmotion } from "../store/emotionCtx";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

interface Message {
  role: "assistant" | "user";
  content: string;
}

type Phase = "loading" | "choosing" | "custom-input" | "error";

const SUPABASE_URL = "https://ufhirlwxamwffkrwsnmi.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmaGlybHd4YW13ZmZrcndzbm1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MTcyOTIsImV4cCI6MjEwNDE5MzI5Mn0.5jPikD2ROpxWo-KMSSpFkHQ7241C-Gq1DUh4SrF-xVM";
const MAX_ROUNDS = 3;
const CONFIRM_ROUND = 3;

const galleryBg = "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&h=1200&fit=crop&auto=format";

function hasAllOptions(text: string) {
  return text.includes("①") && text.includes("②") && text.includes("③");
}

function extractOption(text: string, index: 1 | 2 | 3): string {
  const markers = ["①", "②", "③"];
  const start = text.indexOf(markers[index - 1]);
  if (start < 0) return `第${index}种感受`;
  const nextMarker = markers[index];
  const end = nextMarker ? text.indexOf(nextMarker) : text.length;
  return text.slice(start, end > start ? end : text.length).trim();
}

function narrativePart(text: string): string {
  const firstMarker = text.indexOf("①");
  return firstMarker > 0 ? text.slice(0, firstMarker).trim() : text.trim();
}

async function fetchDialogue(
  messages: Message[],
  round: number,
  emotionLabel: string,
  intensity: number,
  description: string
): Promise<string> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 45000);
  let res: Response;
  try {
    res = await fetch(`${SUPABASE_URL}/functions/v1/server/dialogue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ANON_KEY}`,
        "apikey": ANON_KEY,
      },
      body: JSON.stringify({ messages, round, emotionLabel, intensity, description }),
      signal: controller.signal,
    });
  } catch (error) {
    throw new Error(error instanceof DOMException && error.name === "AbortError" ? "请求超时，请重试" : "网络连接失败");
  } finally {
    window.clearTimeout(timeout);
  }
  let data: Record<string, unknown> = {};
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

export function EmotionalDialogue({ onNext, onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAiText, setCurrentAiText] = useState("");
  const [phase, setPhase] = useState<Phase>("loading");
  const [round, setRound] = useState(1);
  const [customText, setCustomText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 80);
  };

  const loadAi = useCallback(async (msgs: Message[], r: number) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setPhase("loading");
    setErrorMsg("");
    try {
      const reply = await fetchDialogue(
        msgs,
        r,
        emotionCtx.label,
        emotionCtx.intensity,
        emotionCtx.description
      );
      setCurrentAiText(reply);
      setPhase("choosing");
      scrollToBottom();
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "网络请求失败");
      setPhase("error");
    } finally {
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => { loadAi([], 1); }, []);

  const finishConfirmation = (text: string) => {
    const confirmedText = text.trim();
    const confirmedEmotion = confirmedText.replace(/^[①②③]\s*/, "").split(/[：:]/)[0].trim();
    setConfirmedEmotion(confirmedEmotion || "自定义", confirmedText);
    setMessages((current) => [
      ...current,
      { role: "assistant", content: currentAiText },
      { role: "user", content: "旁观者确认：" + confirmedText },
    ]);
    setTimeout(onNext, 320);
  };

  const advance = (userMsg: string, currentMsgs: Message[], currentRound: number) => {
    const newMessages: Message[] = [
      ...currentMsgs,
      { role: "assistant", content: currentAiText },
      { role: "user", content: "旁观者补充：" + userMsg },
    ];
    setMessages(newMessages);
    setCustomText("");

    if (currentRound >= MAX_ROUNDS) {
      finishConfirmation(userMsg);
      return;
    }
    const next = currentRound + 1;
    setRound(next);
    loadAi(newMessages, next);
  };

  const handleChoose = (index: 1 | 2 | 3) => {
    if (phase !== "choosing") return;
    const chosen = extractOption(currentAiText, index);
    if (round >= CONFIRM_ROUND) {
      finishConfirmation(chosen);
      return;
    }
    advance("分身的这一段更像是：" + chosen, messages, round);
  };

  const handleCustomSubmit = () => {
    if (!customText.trim() || isLoadingRef.current) return;
    if (round >= CONFIRM_ROUND) {
      finishConfirmation(customText);
      return;
    }
    advance(customText.trim(), messages, round);
  };
  const handleRetry = () => { loadAi(messages, round); };

  const pillCount = Math.min(round, 3);
  const showButtons = (phase === "choosing" || phase === "custom-input") && hasAllOptions(currentAiText);
  const isConfirming = round >= CONFIRM_ROUND;

  // Pair up history: [assistant, user, assistant, user, ...]
  const historyPairs: { ai: string; user: string }[] = [];
  for (let i = 0; i + 1 < messages.length; i += 2) {
    if (messages[i].role === "assistant" && messages[i + 1]?.role === "user") {
      historyPairs.push({ ai: messages[i].content, user: messages[i + 1].content });
    }
  }

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `url(${galleryBg})`,
        backgroundSize: "cover", backgroundPosition: "center",
        filter: "blur(10px) brightness(1.06) saturate(0.85)",
        transform: "scale(1.06)",
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(180deg, rgba(252,249,243,0.64) 0%, rgba(248,244,236,0.72) 55%, rgba(244,239,228,0.76) 100%)",
      }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{
        width: "260px", height: "180px",
        background: "radial-gradient(ellipse 130px 90px at 50% 0%, rgba(255,252,244,0.3) 0%, transparent 70%)",
        filter: "blur(20px)",
      }} />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38 }}
          className="flex items-center justify-between px-5 pt-14 pb-3 flex-shrink-0"
        >
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all active:scale-90"
            style={{
              background: "rgba(255,252,245,0.58)",
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              border: "1.5px solid rgba(255,255,255,0.82)",
              boxShadow: "0 3px 12px rgba(100,80,52,0.08), inset 0 1px 0 rgba(255,255,255,0.88)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="rgba(100,78,52,0.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Progress pills — capped at 3 */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((r) => (
              <div
                key={r}
                style={{
                  width: r === pillCount ? "20px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background: r < pillCount
                    ? "rgba(140,108,62,0.55)"
                    : r === pillCount
                    ? "rgba(140,108,62,0.78)"
                    : "rgba(190,165,130,0.28)",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          <div style={{ width: "32px" }} />
        </motion.div>

        {/* Scrollable chat */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col gap-4"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Historical exchange pairs */}
          {historyPairs.map((pair, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32 }}
              className="flex flex-col gap-2.5"
            >
              <AiBubble text={narrativePart(pair.ai)} dimmed />
              <UserBubble text={pair.user} />
            </motion.div>
          ))}

          {/* Current AI turn */}
          <AnimatePresence mode="wait">
            {phase === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
                className="flex items-start gap-2.5"
              >
                <AiAvatar />
                <div
                  className="px-4 py-3.5 rounded-2xl rounded-tl-md"
                  style={{
                    background: "rgba(255,252,245,0.68)",
                    backdropFilter: "blur(24px) saturate(1.25)", WebkitBackdropFilter: "blur(24px) saturate(1.25)",
                    border: "1.5px solid rgba(255,255,255,0.85)",
                    boxShadow: "0 4px 18px rgba(100,78,52,0.08), inset 0 1.5px 0 rgba(255,255,255,0.92)",
                  }}
                >
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.16, ease: "easeInOut" }}
                        style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(140,108,62,0.55)" }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {(phase === "choosing" || phase === "custom-input") && currentAiText && (
              <motion.div
                key={`ai-${round}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, delay: 0.06 }}
                className="flex items-start gap-2.5"
              >
                <AiAvatar />
                <div
                  className="rounded-2xl rounded-tl-md px-4 py-3.5 relative overflow-hidden"
                  style={{
                    background: "rgba(255,252,245,0.75)",
                    backdropFilter: "blur(24px) saturate(1.25)", WebkitBackdropFilter: "blur(24px) saturate(1.25)",
                    border: "1.5px solid rgba(255,255,255,0.9)",
                    boxShadow: "0 4px 20px rgba(100,78,52,0.09), inset 0 1.5px 0 rgba(255,255,255,0.95)",
                    maxWidth: "calc(100% - 36px)",
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "40%", background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)" }} />
                  <p style={{
                    fontFamily: "'Noto Sans SC', 'PingFang SC', sans-serif",
                    fontSize: "13px",
                    lineHeight: 1.8,
                    letterSpacing: "0.03em",
                    color: "rgba(48,34,14,0.88)",
                    fontWeight: 400,
                    position: "relative",
                    whiteSpace: "pre-wrap",
                  }}>
                    {currentAiText}
                  </p>
                </div>
              </motion.div>
            )}

            {phase === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
                className="flex items-start gap-2.5"
              >
                <AiAvatar />
                <div
                  className="px-4 py-3.5 rounded-2xl rounded-tl-md"
                  style={{
                    background: "rgba(255,248,244,0.75)",
                    border: "1.5px solid rgba(200,120,80,0.25)",
                    boxShadow: "0 4px 16px rgba(180,80,40,0.06)",
                  }}
                >
                  <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "12px", color: "rgba(160,80,40,0.8)", marginBottom: "8px", letterSpacing: "0.03em" }}>
                    连接画廊失败{errorMsg ? `（${errorMsg}）` : ""}，请重试
                  </p>
                  <button
                    onClick={handleRetry}
                    style={{
                      fontFamily: "'Noto Sans SC', sans-serif",
                      fontSize: "11px",
                      color: "rgba(160,80,40,0.82)",
                      background: "rgba(255,240,232,0.85)",
                      border: "1px solid rgba(200,120,80,0.25)",
                      borderRadius: "10px",
                      padding: "4px 12px",
                      cursor: "pointer",
                      letterSpacing: "0.03em",
                    }}
                  >
                    重试
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fixed bottom interaction area */}
        <div className="flex-shrink-0 px-5 pb-10">
          {/* Divider */}
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(180,148,100,0.2) 30%, rgba(180,148,100,0.2) 70%, transparent)", marginBottom: "12px" }} />

          {/* Expandable custom input */}
          <AnimatePresence>
            {phase === "custom-input" && (
              <motion.div
                key="custom-input"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="overflow-hidden mb-2.5"
              >
                <div className="relative">
                  <textarea
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="补充说说，或者两种都有点像…"
                    rows={3}
                    autoFocus
                    className="w-full resize-none outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && customText.trim()) {
                        e.preventDefault();
                        handleCustomSubmit();
                      }
                    }}
                    style={{
                      fontFamily: "'Noto Sans SC', sans-serif",
                      fontSize: "13px",
                      lineHeight: 1.65,
                      color: "rgba(50,38,24,0.87)",
                      background: "rgba(255,252,245,0.68)",
                      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                      border: "1.5px solid rgba(180,148,100,0.38)",
                      borderRadius: "14px",
                      padding: "12px 44px 12px 14px",
                      boxShadow: "0 2px 10px rgba(100,80,52,0.06), inset 0 1.5px 0 rgba(255,255,255,0.88)",
                    }}
                  />
                  {customText.trim() && (
                    <button
                      onClick={handleCustomSubmit}
                      style={{
                        position: "absolute", bottom: "10px", right: "10px",
                        width: "28px", height: "28px", borderRadius: "50%",
                        background: "rgba(140,108,62,0.88)",
                        border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M4 8h8M9 5l3 3-3 3" stroke="rgba(255,248,228,0.95)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Four fixed choice buttons — 2×2 grid */}
          <AnimatePresence mode="wait">
            {showButtons && (
              <motion.div
                key={`btns-${round}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 gap-2"
              >
                {([1, 2, 3] as const).map((idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChoose(idx)}
                    className="py-3.5 rounded-2xl transition-all duration-200 active:scale-95 relative overflow-hidden"
                    style={{
                      fontFamily: "'Noto Sans SC', sans-serif",
                      fontSize: "13px",
                      color: isConfirming ? "rgba(100,72,30,0.88)" : "rgba(70,50,22,0.78)",
                      fontWeight: isConfirming ? 500 : 400,
                      background: isConfirming
                        ? "rgba(140,108,62,0.12)"
                        : "rgba(255,252,245,0.68)",
                      backdropFilter: "blur(20px) saturate(1.2)", WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                      border: isConfirming
                        ? "1.5px solid rgba(160,122,72,0.32)"
                        : "1.5px solid rgba(255,255,255,0.82)",
                      boxShadow: isConfirming
                        ? "0 3px 14px rgba(140,108,62,0.12), inset 0 1.5px 0 rgba(255,255,255,0.7)"
                        : "0 2px 10px rgba(100,80,52,0.05), inset 0 1.5px 0 rgba(255,255,255,0.9)",
                      cursor: "pointer",
                      letterSpacing: "0.04em",
                    }}
                  >
                    <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)", borderRadius: "16px 16px 0 0" }} />
                    <span style={{ position: "relative" }}>第{["一", "二", "三"][idx - 1]}种</span>
                  </button>
                ))}

                {/* 都不太像 — toggles custom input */}
                <button
                  onClick={() => setPhase(phase === "custom-input" ? "choosing" : "custom-input")}
                  className="py-3.5 rounded-2xl transition-all duration-200 active:scale-95 relative overflow-hidden"
                  style={{
                    fontFamily: "'Noto Sans SC', sans-serif",
                    fontSize: "13px",
                    color: phase === "custom-input" ? "rgba(140,108,62,0.92)" : "rgba(130,105,78,0.52)",
                    background: phase === "custom-input" ? "rgba(140,108,62,0.1)" : "rgba(255,252,245,0.52)",
                    backdropFilter: "blur(20px) saturate(1.2)", WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                    border: phase === "custom-input"
                      ? "1.5px solid rgba(160,122,72,0.32)"
                      : "1.5px solid rgba(255,255,255,0.72)",
                    boxShadow: "0 2px 10px rgba(100,80,52,0.04), inset 0 1.5px 0 rgba(255,255,255,0.82)",
                    cursor: "pointer",
                    letterSpacing: "0.04em",
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)", borderRadius: "16px 16px 0 0" }} />
                  <span style={{ position: "relative" }}>都不太像</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* No format fallback: if AI returned text but missing ①②③ */}
          {(phase === "choosing" || phase === "custom-input") && currentAiText && !hasAllOptions(currentAiText) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "11px", color: "rgba(140,115,80,0.45)", marginBottom: "10px", letterSpacing: "0.04em" }}>
                正在重新整理…
              </p>
              <button
                onClick={handleRetry}
                style={{
                  fontFamily: "'Noto Sans SC', sans-serif", fontSize: "12px",
                  color: "rgba(140,108,62,0.75)",
                  background: "rgba(255,252,245,0.65)",
                  border: "1.5px solid rgba(180,148,100,0.28)",
                  borderRadius: "14px", padding: "8px 20px", cursor: "pointer",
                }}
              >
                重新生成
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function AiBubble({ text, dimmed = false }: { text: string; dimmed?: boolean }) {
  return (
    <div className="flex items-start gap-2.5">
      <AiAvatar />
      <div
        className="rounded-2xl rounded-tl-md px-4 py-3 relative overflow-hidden"
        style={{
          background: dimmed ? "rgba(255,252,245,0.48)" : "rgba(255,252,245,0.68)",
          backdropFilter: "blur(20px) saturate(1.2)", WebkitBackdropFilter: "blur(20px) saturate(1.2)",
          border: "1.5px solid rgba(255,255,255,0.78)",
          boxShadow: "0 3px 14px rgba(100,78,52,0.06), inset 0 1px 0 rgba(255,255,255,0.88)",
          maxWidth: "calc(100% - 36px)",
        }}
      >
        <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, transparent 100%)" }} />
        <p style={{
          fontFamily: "'Noto Sans SC', 'PingFang SC', sans-serif",
          fontSize: "13px",
          lineHeight: 1.8,
          letterSpacing: "0.03em",
          color: dimmed ? "rgba(60,44,24,0.5)" : "rgba(55,40,18,0.82)",
          position: "relative",
          whiteSpace: "pre-wrap",
        }}>
          {text}
        </p>
      </div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div
        className="rounded-2xl rounded-tr-md px-4 py-3 relative overflow-hidden"
        style={{
          background: "rgba(140,108,62,0.12)",
          backdropFilter: "blur(20px) saturate(1.2)", WebkitBackdropFilter: "blur(20px) saturate(1.2)",
          border: "1.5px solid rgba(180,148,100,0.28)",
          boxShadow: "0 3px 12px rgba(100,78,52,0.05), inset 0 1px 0 rgba(255,255,255,0.5)",
          maxWidth: "75%",
        }}
      >
        <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)" }} />
        <p style={{
          fontFamily: "'Noto Sans SC', 'PingFang SC', sans-serif",
          fontSize: "13px",
          lineHeight: 1.75,
          letterSpacing: "0.03em",
          color: "rgba(75,52,22,0.82)",
          position: "relative",
        }}>
          {text}
        </p>
      </div>
    </div>
  );
}

function AiAvatar() {
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 relative overflow-hidden"
      style={{
        background: "rgba(255,252,245,0.65)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: "1.5px solid rgba(255,255,255,0.85)",
        boxShadow: "0 3px 10px rgba(100,78,52,0.09), inset 0 1px 0 rgba(255,255,255,0.9)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "55%", background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)", borderRadius: "50%" }} />
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ position: "relative" }}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" fill="rgba(140,108,62,0.18)" stroke="rgba(140,108,62,0.65)" strokeWidth="1.2" />
      </svg>
    </div>
  );
}
