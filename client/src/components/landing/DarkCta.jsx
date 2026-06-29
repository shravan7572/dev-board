function DarkCta({ name, setName, onClaim }) {
  const clean = name.trim().toLowerCase()

  return (
    <section className="dark-cta-section">
      {/* subtle grid on dark bg */}
      <div className="dark-cta-grid" aria-hidden="true" />

      <div className="dark-cta-inner">
        <div className="dark-cta-badge">Free forever · No credit card</div>

        <h2 className="dark-cta-heading">
          Your profile is<br />waiting for you
        </h2>
        <p className="dark-cta-sub">
          Takes 3 minutes. Looks like you spent 3 days on it.
        </p>

        <div className="dark-cta-input-row">
          <div className="dark-cta-input-wrap">
            <span className="dark-cta-prefix">devboard.app/</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.replace(/\s/g, ""))}
              placeholder="yourname"
              className="dark-cta-input"
              aria-label="Choose your devboard username"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <button onClick={onClaim} className="dark-cta-btn">
            Claim yours →
          </button>
        </div>

        <p className="dark-cta-note">
          {clean ? `devboard.app/${clean}` : "devboard.app/yourname"} · always free · no ads
        </p>
      </div>
    </section>
  )
}

export default DarkCta
