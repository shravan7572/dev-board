const TAKEN = ["vercel", "github", "admin", "dan", "lee", "sarah"]

function UrlClaimer({ name, setName, onClaim }) {
  const clean = name.trim().toLowerCase()
  const taken = clean.length > 0 && TAKEN.includes(clean)
  const display = clean || "yourname"
  const available = clean.length > 0 && !taken

  return (
    <section id="hero" className="url-claimer-section">
      <div className="url-claimer-inner">
        <p className="section-eyebrow">your link</p>
        <h2 className="section-heading">
          Claim your URL<br />before it's gone
        </h2>
        <p className="section-sub">
                  Simple, memorable, yours. Forever free.
        </p>

        <div className="url-claimer-input-wrap">
          <div className={`url-claimer-input-box${available ? " available" : taken ? " taken" : ""}`}>
            <span className="url-claimer-prefix">devboard.app/</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.replace(/\s/g, ""))}
              placeholder="yourname"
              className="url-claimer-input"
              aria-label="Choose your devboard username"
              autoComplete="off"
              spellCheck={false}
            />
            {available && <span className="url-claimer-check">✓</span>}
            {taken && <span className="url-claimer-x">✕</span>}
          </div>

          <p className={`url-claimer-status ${clean.length === 0 ? "neutral" : taken ? "taken" : "free"}`}>
            {clean.length === 0
              ? "Type a username to check availability"
              : taken
                ? `devboard.app/${clean} is taken`
                : `✓ devboard.app/${clean} is available — grab it free`}
          </p>

          <button
            onClick={onClaim}
            disabled={taken}
            className="url-claimer-btn"
          >
            Claim devboard.app/{display} →
          </button>
        </div>
      </div>
    </section>
  )
}

export default UrlClaimer
