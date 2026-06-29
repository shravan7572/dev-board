const TAKEN = ["vercel", "github", "admin", "dan", "lee", "sarah"]

function UrlClaimer({ name, setName, onClaim }) {
  const clean = name.trim().toLowerCase()
  const taken = clean.length > 0 && TAKEN.includes(clean)
  const display = clean || "yourname"

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <p className="font-mono text-[11px] uppercase tracking-widest text-gray-400">claim it</p>
      <h2 className="mt-3 text-[32px] font-medium tracking-[-0.01em] text-black">
        Your URL is waiting
      </h2>

      <div className="mt-8 max-w-2xl">
        <div className="flex h-14 w-full items-center rounded-[6px] bg-black px-4 font-mono text-[18px] text-white">
          <span className="text-gray-400">devboard.app/</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value.replace(/\s/g, ""))}
            placeholder="yourname"
            className="ml-0.5 w-full bg-transparent text-white placeholder:text-gray-600 focus:outline-none"
            aria-label="Choose your devboard username"
          />
        </div>

        <p
          className={`mt-3 font-mono text-[13px] ${
            clean.length === 0 ? "text-gray-400" : taken ? "text-red-500" : "text-green-600"
          }`}
        >
          {clean.length === 0
            ? "type a name to check availability"
            : taken
              ? `devboard.app/${clean} is taken`
              : `devboard.app/${clean} is available`}
        </p>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClaim}
            disabled={taken}
            className="rounded-[6px] bg-black px-4 py-2.5 text-[14px] font-medium text-white transition-colors duration-150 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Claim devboard.app/{display} →
          </button>
        </div>
      </div>
    </section>
  )
}

export default UrlClaimer
