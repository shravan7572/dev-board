const COLUMNS = [
  { heading: "Product", links: ["Profiles", "Features", "Changelog", "Pricing"] },
  { heading: "Developers", links: ["Docs", "API", "GitHub sync", "Status"] },
  { heading: "Company", links: ["About", "Blog", "Careers", "Contact"] },
  { heading: "Connect", links: ["GitHub", "Twitter", "Discord", "RSS"] },
]

function LandingFooter() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-[13px] font-medium text-black">{col.heading}</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-[13px] text-gray-500 transition-colors duration-150 hover:text-black"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-6">
          <span className="text-[13px] text-gray-500">© 2025 DevBoard</span>
          <span className="font-mono text-[13px] text-gray-400">Made for developers</span>
        </div>
      </div>
    </footer>
  )
}

export default LandingFooter
