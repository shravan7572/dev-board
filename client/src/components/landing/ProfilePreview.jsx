import { useState } from "react"

const TABS = ["Projects", "Skills", "Activity"]

const CONTENT = {
  Projects: [
    { title: "devboard", desc: "Public developer profiles, open source", meta: "TypeScript · 1.2k ★" },
    { title: "edge-cache", desc: "Tiny LRU cache for the edge runtime", meta: "Rust · 340 ★" },
    { title: "mdx-notes", desc: "Local-first markdown note taking", meta: "TypeScript · 88 ★" },
  ],
  Skills: [
    { title: "TypeScript", desc: "Daily driver, 5 years", meta: "expert" },
    { title: "Go", desc: "Backend services and CLIs", meta: "proficient" },
    { title: "PostgreSQL", desc: "Schema design, query tuning", meta: "proficient" },
    { title: "Rust", desc: "Systems and WASM targets", meta: "learning" },
  ],
  Activity: [
    { title: "Pushed to devboard", desc: "feat: live URL availability check", meta: "2 hrs ago" },
    { title: "Opened PR in edge-cache", desc: "perf: reduce allocations on read", meta: "yesterday" },
    { title: "Starred react-aria", desc: "Accessible UI primitives", meta: "3 days ago" },
  ],
}

function ProfilePreview({ name }) {
  const [tab, setTab] = useState("Projects")
  const handle = name.trim().toLowerCase() || "shravan"

  return (
    <section className="preview-section">
      <div className="preview-inner">
        <p className="section-eyebrow">profile preview</p>
        <h2 className="section-heading">What your board looks like</h2>
        <p className="section-sub">
          A clean, fast profile that shows off everything you've built.
        </p>

        {/* browser chrome mockup */}
        <div className="preview-browser">
          <div className="preview-browser-bar">
            <div className="preview-browser-dots">
              <span style={{ background: "#ef4444" }} />
              <span style={{ background: "#f59e0b" }} />
              <span style={{ background: "#22c55e" }} />
            </div>
            <div className="preview-browser-url">
              <span style={{ color: "#9ca3af" }}>devboard.app/</span>
              <span style={{ color: "#111", fontWeight: 500 }}>{handle}</span>
            </div>
          </div>

          {/* profile content inside browser */}
          <div className="preview-profile-wrap">
            {/* sidebar */}
            <div className="preview-sidebar">
              <div className="preview-avatar">SC</div>
              <div className="preview-name">Shravan Choudhary</div>
              <div className="preview-role">Full-stack developer</div>
              <div className="preview-location">Pune, India</div>

              <span className="preview-badge">open to work</span>

              <div className="preview-socials">
                <span>github.com/shravan7572</span>
                <span>twitter.com/shravan3107</span>
              </div>

              <div className="preview-reactions">
                <span>🔥 14</span>
                <span>❤️ 9</span>
                <span>👏 6</span>
              </div>
            </div>

            {/* main content */}
            <div className="preview-main">
              <div className="preview-tabs">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`preview-tab${tab === t ? " active" : ""}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="preview-content">
                {CONTENT[tab].map((item, i) => (
                  <div
                    key={item.title}
                    className={`preview-row${i > 0 ? " bordered" : ""}`}
                  >
                    <div>
                      <p className="preview-row-title">{item.title}</p>
                      <p className="preview-row-desc">{item.desc}</p>
                    </div>
                    <span className="preview-row-meta">{item.meta}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfilePreview
