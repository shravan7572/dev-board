import { useNavigate } from "react-router-dom"

function LandingFooter() {
  const navigate = useNavigate()

  const linkActions = {
    "Features":  () => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }),
    "Profile":   () => document.getElementById("profile")?.scrollIntoView({ behavior: "smooth" }),
    "Claim Url": () => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" }),
    "Preview":   () => document.getElementById("preview")?.scrollIntoView({ behavior: "smooth" }),
    "GitHub":    () => window.open("https://github.com/shravan7572/dev-board", "_blank"),
    "Twitter":   () => window.open("https://twitter.com/Shravann3107", "_blank"),
    "Contact":   () => navigate("/shraventest"),
  }

  return (
    <footer className="landing-footer">
      <div className="landing-footer-inner">
        <div className="landing-footer-top">
          <div>
            <span className="landing-footer-logo">devboard</span>
            <p className="landing-footer-tagline">
              Public developer profiles for people who build things.
            </p>
          </div>

          <div className="landing-footer-cols">
            {[
              { heading: "Product", links: ["Features", "Profile", "Claim Url", "Preview"] },
              { heading: "Connect", links: ["GitHub", "Twitter", "Contact"] },
            ].map((col) => (
              <div key={col.heading}>
                <h3 className="landing-footer-col-heading">{col.heading}</h3>
                <ul className="landing-footer-links">
                  {col.links.map((l) => (
                    <li key={l}>
                      
                       <a href="#"
                        className="landing-footer-link"
                        onClick={(e) => {
                          e.preventDefault()
                          linkActions[l]?.()
                        }}
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="landing-footer-bottom">
          <span>© 2026 DevBoard. All rights reserved.</span>
          <span>Made for developers</span>
        </div>
      </div>
    </footer>
  )
}

export default LandingFooter