import { useState, useEffect } from "react"
import heroBg from "../../assets/devboard_hero_bg.jpg"

const TAKEN = ["vercel", "github", "admin", "dan", "lee", "sarah"]

// Floating glassmorphic card preview
function FloatingCard() {
  const [tab, setTab] = useState("Projects")

  const tabs = ["Projects", "Skills", "GitHub"]
  const content = {
    Projects: [
      { name: "devboard", lang: "MERN", stars: "1.2k" },
      { name: "Snap-Url", lang: "React", stars: "340" },
      { name: "Jan-ken-pon", lang: "React", stars: "88" },
    ],
    Skills: [
      { name: "React", years: "1y", featured: true },
      { name: "Node js", years: "1.5", featured: true },
      { name: "Mongodb", years: "1y", featured: false },
      { name: "Java Script", years: "1y", featured: false },
      { name: "Express.js", years: "1y", featured: false },
      { name: "Python", years: "2y", featured: false },
      { name: "C", years: "3y", featured: false },
      { name: "C++", years: "3y", featured: false },

    ],
    GitHub: null,
  }

  const shades = ["rgba(0,0,0,0.06)", "rgba(34,197,94,0.15)", "rgba(34,197,94,0.4)", "rgba(34,197,94,0.7)", "rgba(34,197,94,0.95)"]
  const cells = Array.from({ length: 7 * 15 }, (_, i) => shades[Math.floor(((i * 7 + (i % 5)) % 5))])

  return (
    <div className="hero-floating-card">
      {/* card header */}
      <div className="hero-card-header">
        <div className="hero-card-avatar">SC</div>
        <div>
          <div className="hero-card-name">Shravan Choudhary</div>
          <div className="hero-card-handle">@shravan · Full-stack dev</div>
        </div>
        <span className="hero-card-badge">open to work</span>
      </div>

      {/* tabs */}
      <div className="hero-card-tabs">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`hero-card-tab${tab === t ? " active" : ""}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* content */}
      <div className="hero-card-body">
        {tab === "Projects" &&
          content.Projects.map((p, i) => (
            <div key={p.name} className={`hero-card-row${i > 0 ? " bordered" : ""}`}>
              <div>
                <span className="hero-card-row-title">{p.name}</span>
                <span className="hero-card-row-lang">{p.lang}</span>
              </div>
              <span className="hero-card-row-meta">⭐ {p.stars}</span>
            </div>
          ))}

        {tab === "Skills" && (
          <div className="hero-card-skills">
            {content.Skills.map((s) => (
              <span key={s.name} className={`hero-card-skill${s.featured ? " featured" : ""}`}>
                {s.name} <span className="hero-card-skill-yr">{s.years}</span>
              </span>
            ))}
          </div>
        )}

        {tab === "GitHub" && (
          <div>
            <div className="hero-card-gh-grid">
              {cells.map((c, i) => (
                <span key={i} className="hero-card-gh-cell" style={{ background: c }} />
              ))}
            </div>
            <div className="hero-card-gh-meta">318 contributions this year</div>
          </div>
        )}
      </div>

      {/* footer url */}
      <div className="hero-card-url">devboard.app/shravan</div>
    </div>
  )
}

function Hero({ claimName, setClaimName, onClaim }) {
  const clean = (claimName || "").trim().toLowerCase()
  const taken = clean.length > 0 && TAKEN.includes(clean)
  const available = clean.length > 0 && !taken

  return (
    <section className="hero-section-new" >
      {/* Set generated image as background on the right, blended nicely */}
      <div className="hero-bg-image-wrapper">
        <img src={heroBg} alt="" className="hero-bg-img" />
        <div className="hero-bg-overlay-light" />
      </div>

      <div className="hero-container-new">
        {/* Left Side: Headline & URL Claimer */}
        <div className="hero-content-left">
          {/* Eyebrow badge */}
          <div className="hero-eyebrow-new">
            <span className="hero-eyebrow-dot-new" />
            <span>Free for developers · Always</span>
          </div>

          {/* Bold Heading */}
          <h1 className="hero-heading-new">
            Your work,<br />
            one link.
          </h1>

          {/* Subtext */}
          <p className="hero-subtext-new">
            Projects, GitHub activity, skills, and contact — all on a single
            beautiful profile built for developers who ship.
          </p>
    
          {/* Beautiful Embedded URL Claimer Capsule */}
          <div className="hero-claimer-wrap">
            
            <div className={`hero-claimer-input-box ${available ? "available" : taken ? "taken" : ""}`}>
              <span className="hero-claimer-prefix">devboard.app/</span>
              <input
                value={claimName || ""}
                onChange={(e) => setClaimName(e.target.value.replace(/\s/g, ""))}
                placeholder="yourname"
                className="hero-claimer-input"
                aria-label="Claim your devboard handle"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                onClick={onClaim}
                disabled={taken || clean.length === 0}
                className="hero-claimer-btn"
              >
                Claim URL →
              </button>
            </div>

            {clean.length > 0 && (
              <p className={`hero-claimer-status ${taken ? "taken" : "free"}`}>
                {taken
                  ? `✕ devboard.app/${clean} is taken`
                  : `✓ devboard.app/${clean} is available — grab it now!`}
              </p>
            )}
          </div>


    
        </div>

        {/* Right Side: Floating Mock Profile */}
        <div className="hero-content-right">
          <FloatingCard />
        </div>
      </div>
    </section>
  )
}

export default Hero
