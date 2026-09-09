import { useState } from "react";
import { motion } from "motion/react";

interface Props {
  onLogin: () => void;
  onSignup: () => void;
}

const galleryBg = "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&h=1200&fit=crop&auto=format";

const glassInput: React.CSSProperties = {
  background: "rgba(255,252,245,0.52)",
  backdropFilter: "blur(20px) saturate(1.2)",
  WebkitBackdropFilter: "blur(20px) saturate(1.2)",
  border: "1.5px solid rgba(255,255,255,0.78)",
  boxShadow: "0 3px 12px rgba(100,78,52,0.06), inset 0 1px 0 rgba(255,255,255,0.88)",
};

export function LoginScreen({ onLogin, onSignup }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="h-full relative overflow-hidden flex flex-col">
      {/* Background — fixed, same as ProfilePage */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `url(${galleryBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(10px) brightness(1.06) saturate(0.85)",
        transform: "scale(1.06)",
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "rgba(250,246,238,0.82)",
      }} />
      {/* Ceiling light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{
        width: "260px", height: "200px",
        background: "radial-gradient(ellipse 130px 100px at 50% 0%, rgba(255,252,244,0.35) 0%, transparent 70%)",
        filter: "blur(20px)",
      }} />

      {/* Top brand area */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center pt-20 pb-8 flex-shrink-0"
      >
        {/* Logo mark */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{
          background: "rgba(255,252,245,0.62)",
          backdropFilter: "blur(28px) saturate(1.25)",
          WebkitBackdropFilter: "blur(28px) saturate(1.25)",
          border: "1.5px solid rgba(255,255,255,0.85)",
          boxShadow: "0 8px 28px rgba(100,78,52,0.1), inset 0 1.5px 0 rgba(255,255,255,0.92)",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7.5" height="9" rx="1.5" fill="rgba(140,108,62,0.22)" stroke="rgba(140,108,62,0.6)" strokeWidth="1.2" />
            <rect x="13.5" y="3" width="7.5" height="6" rx="1.5" fill="rgba(140,108,62,0.14)" stroke="rgba(140,108,62,0.42)" strokeWidth="1.2" />
            <rect x="13.5" y="12" width="7.5" height="9" rx="1.5" fill="rgba(140,108,62,0.18)" stroke="rgba(140,108,62,0.5)" strokeWidth="1.2" />
            <rect x="3" y="15" width="7.5" height="6" rx="1.5" fill="rgba(140,108,62,0.1)" stroke="rgba(140,108,62,0.35)" strokeWidth="1.2" />
          </svg>
        </div>

        <p style={{
          fontFamily: "'Noto Serif SC', serif",
          fontSize: "22px",
          fontWeight: 500,
          color: "rgba(50,38,22,0.92)",
          letterSpacing: "0.08em",
          marginBottom: "5px",
        }}>
          人生画廊
        </p>
        <p style={{
          fontFamily: "'Noto Sans SC', sans-serif",
          fontSize: "11px",
          color: "rgba(140,108,62,0.45)",
          letterSpacing: "0.06em",
          fontWeight: 300,
        }}>
          Life Gallery
        </p>
      </motion.div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.48, delay: 0.14 }}
        className="relative z-10 mx-5 rounded-3xl overflow-hidden"
        style={{
          background: "rgba(255,252,245,0.62)",
          backdropFilter: "blur(32px) saturate(1.3)",
          WebkitBackdropFilter: "blur(32px) saturate(1.3)",
          border: "1.5px solid rgba(255,255,255,0.85)",
          boxShadow: "0 12px 48px rgba(100,78,52,0.1), 0 4px 16px rgba(100,78,52,0.06), inset 0 1.5px 0 rgba(255,255,255,0.95)",
        }}
      >
        {/* Card sheen */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
          height: "40%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)",
        }} />

        <div className="relative px-6 pt-7 pb-7">
          <p style={{
            fontFamily: "'Noto Serif SC', serif",
            fontSize: "20px",
            fontWeight: 500,
            color: "rgba(50,38,22,0.9)",
            letterSpacing: "0.02em",
            marginBottom: "4px",
          }}>
            欢迎回来
          </p>
          <p style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: "12px",
            color: "rgba(140,108,62,0.48)",
            fontWeight: 300,
            letterSpacing: "0.03em",
            marginBottom: "24px",
          }}>
            我还在这里，替你守着那些画。
          </p>

          {/* Username input */}
          <div className="mb-3">
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl" style={glassInput}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(140,108,62,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              <input
                type="text"
                placeholder="邮箱或用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 bg-transparent outline-none"
                style={{
                  fontSize: "13px",
                  color: "rgba(60,44,20,0.82)",
                  fontFamily: "'Noto Sans SC', sans-serif",
                  fontWeight: 300,
                }}
              />
            </div>
          </div>

          {/* Password input */}
          <div className="mb-6">
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl" style={glassInput}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(140,108,62,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={showPass ? "text" : "password"}
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent outline-none"
                style={{
                  fontSize: "13px",
                  color: "rgba(60,44,20,0.82)",
                  fontFamily: "'Noto Sans SC', sans-serif",
                  fontWeight: 300,
                }}
              />
              <button onClick={() => setShowPass(!showPass)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(140,108,62,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  {showPass
                    ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                  }
                </svg>
              </button>
            </div>
          </div>

          {/* Primary button */}
          <button
            onClick={onLogin}
            className="w-full py-4 rounded-2xl transition-all duration-200 active:scale-[0.983] relative overflow-hidden mb-4"
            style={{
              background: "linear-gradient(135deg, rgba(120,90,40,0.88) 0%, rgba(90,65,22,0.92) 100%)",
              border: "1.5px solid rgba(160,120,55,0.4)",
              boxShadow: "0 6px 24px rgba(100,72,22,0.2), 0 2px 8px rgba(100,72,22,0.12), inset 0 1.5px 0 rgba(255,235,180,0.18)",
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
              进入画廊
            </span>
          </button>

          {/* Footer links */}
          <div className="flex items-center justify-center gap-3">
            <button onClick={onSignup} style={{
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: "11px",
              color: "rgba(140,108,62,0.45)",
              fontWeight: 300,
              letterSpacing: "0.02em",
            }}>
              还没有画廊？创建一个
            </button>
            <span style={{ color: "rgba(180,148,100,0.25)", fontSize: "11px" }}>·</span>
            <button style={{
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: "11px",
              color: "rgba(140,108,62,0.45)",
              fontWeight: 300,
              letterSpacing: "0.02em",
            }}>
              忘记密码
            </button>
          </div>
        </div>
      </motion.div>

      {/* Bottom quote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="relative z-10 text-center mt-auto mb-10 px-8"
        style={{
          fontFamily: "'Noto Serif SC', serif",
          fontSize: "11px",
          color: "rgba(140,108,62,0.32)",
          letterSpacing: "0.06em",
          lineHeight: 2,
          fontWeight: 300,
        }}
      >
        每一件作品，<br />都是你留下的证明。
      </motion.p>
    </div>
  );
}
