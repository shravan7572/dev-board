function LandingNav({ onClaim }) {
  const links = ["profiles", "docs", "changelog"]

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <span className="font-mono text-[15px] font-medium text-black">devboard</span>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l}`}
              className="text-[13px] text-gray-500 transition-colors duration-150 hover:text-black"
            >
              {l}
            </a>
          ))}
        </div>

        <button
          onClick={onClaim}
          className="rounded-[6px] px-3 py-1.5 text-[13px] text-gray-600 transition-colors duration-150 hover:text-black"
        >
          claim yours →
        </button>
      </nav>
    </header>
  )
}

export default LandingNav
