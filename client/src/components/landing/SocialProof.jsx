const PROFILES = [
  {
    initials: "AR",
    color: "#dbeafe",
    textColor: "#1d4ed8",
    name: "Aditi Rao",
    title: "Frontend engineer · Bengaluru",
    skills: ["React", "TypeScript", "Figma"],
    projects: 12,
    commits: 318,
    username: "aditi",
    quote: "Got 3 interview calls the week I launched my devboard.",
  },
  {
    initials: "JL",
    color: "#dcfce7",
    textColor: "#15803d",
    name: "Jordan Lee",
    title: "Platform engineer · San Francisco",
    skills: ["Go", "Kubernetes", "gRPC"],
    projects: 8,
    commits: 472,
    username: "jordanl",
    quote: "My devboard replaced my portfolio site entirely.",
  },
  {
    initials: "MK",
    color: "#fce7f3",
    textColor: "#be185d",
    name: "Maya Khan",
    title: "ML engineer · London",
    skills: ["Python", "PyTorch", "Rust"],
    projects: 15,
    commits: 256,
    username: "maya",
    quote: "The GitHub chart alone made my profile 10× more impressive.",
  },
]

function SocialProof() {
  return (
    <section id="profiles" className="social-proof-section" id="profile-preview">
      <div className="social-proof-inner">
        <p className="section-eyebrow">developers love it</p>
        <h2 className="section-heading">Real profiles, real developers</h2>
        <p className="section-sub">
          The modern workspace for developers.
        </p>

        <div className="proof-grid" >
          {PROFILES.map((p) => (
            <div key={p.username} className="proof-card">
              {/* quote */}
              <p className="proof-quote">"{p.quote}"</p>

              {/* divider */}
              <div className="proof-divider" />

              {/* profile row */}
              <div className="proof-profile-row">
                <div
                  className="proof-avatar"
                  style={{ background: p.color, color: p.textColor }}
                >
                  {p.initials}
                </div>
                <div>
                  <p className="proof-name">{p.name}</p>
                  <p className="proof-title">{p.title}</p>
                </div>
              </div>

              {/* skills */}
              <div className="proof-skills">
                {p.skills.map((s) => (
                  <span key={s} className="proof-skill">{s}</span>
                ))}
              </div>

              {/* stats */}
              <div className="proof-stats">
                <span>{p.projects} projects</span>
                <span className="proof-dot">·</span>
                <span>{p.commits} commits</span>
              </div>

              {/* url */}
              <a href="#" className="proof-url">devboard.app/{p.username} ↗</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SocialProof
