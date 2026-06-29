import { useState, useEffect } from "react"

function LandingNav({ onClaim }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <header className={`landing-header-wrap ${scrolled ? "scrolled" : ""}`}>
      <div className="landing-nav-container">
        {/* Logo */}
        <div className="landing-logo-wrap">
          <span className="landing-logo-icon">✦</span>
          <span className="landing-logo-text">devboard</span>
        </div>

        {/* Centered Capsule Links */}
        <div className="landing-nav-capsule">
          {["features", "profiles"].map((l) => (
            <a key={l} href={`#${l}`} className="landing-nav-capsule-link">
              {l}
            </a>
          ))}
        </div>

        {/* Action Button */}
        <div className="landing-nav-actions">
          <button onClick={onClaim} className="landing-nav-btn-pill">
            Get started →
          </button>
        </div>
      </div>
    </header>
  )
}

export default LandingNav
