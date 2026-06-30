import { useEffect, useRef, useState } from "react";

const INITIAL_LINES = [
  { type: "system",  text: `Last login: ${new Date().toUTCString().split(" ").slice(0, 4).join(" ")} on ttys001` },
  { type: "system",  text: "Restoring session..." },
  { type: "error",   text: "zsh: error 404: route not found" },
  { type: "warning", text: "Available commands: help, clear, date, whoami, ls, sudo" },
];

export default function Notfound404({ className }) {
  const inputRef   = useRef(null);
  const termRef    = useRef(null);
  const [bootDone, setBootDone] = useState(false);
  const [input,    setInput]    = useState("");
  const [lines,    setLines]    = useState(INITIAL_LINES);

  useEffect(() => {
    const t = setTimeout(() => setBootDone(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (bootDone && inputRef.current) inputRef.current.focus({ preventScroll: true });
  }, [bootDone]);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [lines]);

  const push = (line) => setLines((prev) => [...prev, line]);

  const COMMANDS = {
    help:   () => push({ type: "output",  text: "Available commands: help, clear, date, whoami, ls, sudo" }),
    clear:  () => setLines([]),
    date:   () => push({ type: "output",  text: new Date().toString() }),
    whoami: () => push({ type: "output",  text: "guest@macbook-pro" }),
    ls:     () => push({ type: "output",  text: "Applications  Documents  Downloads  Public  Desktop  .hidden_404_key" }),
    sudo:   () => push({ type: "error",   text: "Nice try, but you don't have root access to this void." }),
  };

  const runCommand = (raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    push({ type: "command", text: raw.trim() });
    if (COMMANDS[cmd]) {
      COMMANDS[cmd]();
    } else {
      push({ type: "error", text: `zsh: command not found: ${cmd}` });
    }
    setInput("");
  };

  return (
    <main
      className={className}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #ebecef 0%, #f6f6f4 100%)",
        fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace",
        position: "relative",
        overflow: "hidden",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      {/* subtle ambient blobs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-10%", right: "-10%", width: 420, height: 420, background: "rgba(120,100,220,0.07)", borderRadius: "50%", filter: "blur(90px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-10%", width: 420, height: 420, background: "rgba(40,100,200,0.07)", borderRadius: "50%", filter: "blur(90px)" }} />
      </div>

      <div style={{ width: "100%", maxWidth: 760, position: "relative", zIndex: 1, animation: "fadeInScale 0.75s cubic-bezier(0.16,1,0.3,1) forwards", opacity: 0 }}>
        {/* window chrome */}
        <div style={{ borderRadius: 14, overflow: "hidden", border: "0.5px solid rgba(0,0,0,0.13)", boxShadow: "0 24px 72px rgba(0,0,0,0.13), 0 4px 14px rgba(0,0,0,0.07)", background: "rgba(248,246,242,0.94)", backdropFilter: "blur(24px)" }}>

          {/* title bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "rgba(0,0,0,0.04)", borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", gap: 7 }}>
              {["#ff5f57", "#febc2e", "#28c840"].map((bg) => (
                <div key={bg} style={{ width: 13, height: 13, borderRadius: "50%", background: bg }} />
              ))}
            </div>
            <span style={{ fontSize: 12, color: "rgba(0,0,0,0.35)", fontWeight: 500, letterSpacing: "0.02em" }}>
              guest — zsh — 80×24
            </span>
            <div style={{ width: 48 }} />
          </div>

          {/* terminal body */}
          <div
            ref={termRef}
            onClick={() => inputRef.current?.focus()}
            style={{ padding: "20px 24px", height: 420, overflowY: "auto", fontSize: 13, lineHeight: 1.7, cursor: "text", background: "rgba(250,249,246,0.97)" }}
          >
            {lines.map((line, i) => (
              <div key={i} style={{ marginBottom: 3, animation: "fadeInLeft 0.18s ease-out forwards" }}>
                {line.type === "command" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#1c7a37", fontWeight: 700 }}>➜</span>
                    <span style={{ color: "#0a6fa8", fontWeight: 700 }}>~</span>
                    <span style={{ color: "#1a1a1a", wordBreak: "break-all" }}>{line.text}</span>
                  </div>
                )}
                {line.type === "output" && (
                  <div style={{ color: "rgba(0,0,0,0.7)", paddingLeft: 22, wordBreak: "break-word" }}>{line.text}</div>
                )}
                {line.type === "system" && (
                  <div style={{ color: "rgba(0,0,0,0.38)", fontStyle: "italic", wordBreak: "break-word" }}>{line.text}</div>
                )}
                {line.type === "error" && (
                  <div style={{ color: "#c0392b", paddingLeft: 22, fontWeight: 500, wordBreak: "break-word" }}>{line.text}</div>
                )}
                {line.type === "warning" && (
                  <div style={{ color: "#a05c00", paddingLeft: 22, wordBreak: "break-word" }}>{line.text}</div>
                )}
              </div>
            ))}

            {bootDone && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <span style={{ color: "#1c7a37", fontWeight: 700 }}>➜</span>
                <span style={{ color: "#0a6fa8", fontWeight: 700 }}>~</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runCommand(input)}
                  style={{ background: "transparent", border: "none", outline: "none", flex: 1, fontFamily: "inherit", fontSize: 13, color: "#1a1a1a", caretColor: "#1c7a37", minWidth: 0 }}
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: translateY(32px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-4px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        div[style*="overflow-y: auto"]::-webkit-scrollbar        { width: 7px; }
        div[style*="overflow-y: auto"]::-webkit-scrollbar-track  { background: transparent; }
        div[style*="overflow-y: auto"]::-webkit-scrollbar-thumb  { background: rgba(0,0,0,0.12); border-radius: 10px; }
        div[style*="overflow-y: auto"]::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.22); }
      `}</style>
    </main>
  );
}
