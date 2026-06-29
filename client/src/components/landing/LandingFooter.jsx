function LandingFooter() {
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
              { heading: "Product", links: ["Features", "Changelog", "Pricing", "Status"] },
              { heading: "Developers", links: ["Docs", "API", "GitHub sync", "Examples"] },
              { heading: "Connect", links: ["GitHub", "Twitter", "Discord", "Contact"] },
            ].map((col) => (
              <div key={col.heading}>
                <h3 className="landing-footer-col-heading">{col.heading}</h3>
                <ul className="landing-footer-links">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="landing-footer-link">{l}</a>
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
