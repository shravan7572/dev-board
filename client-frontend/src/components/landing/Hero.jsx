function Hero({ onClaim }) {
  const stats = ["4,200+ profiles", "GitHub sync", "Free forever"]

  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 pt-20 md:pb-32 md:pt-28">
      <p className="font-mono text-[12px] text-gray-400">[ public developer profiles ]</p>

      <h1 className="mt-6 max-w-2xl text-[40px] font-medium leading-[1.05] tracking-[-0.02em] text-balance text-black md:text-[56px]">
        Your work, at devboard.app/you
      </h1>

      <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-gray-500 text-pretty">
        One link for your projects, GitHub activity, skills, and writing. Built for developers who
        ship.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          onClick={onClaim}
          className="rounded-[6px] bg-black px-4 py-2.5 text-[14px] font-medium text-white transition-colors duration-150 hover:bg-gray-800"
        >
          Claim your profile
        </button>
        <button
          onClick={onClaim}
          className="rounded-[6px] border border-gray-200 px-4 py-2.5 text-[14px] font-medium text-black transition-colors duration-150 hover:bg-gray-50"
        >
          See an example →
        </button>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[13px] text-gray-400">
        {stats.map((s, i) => (
          <span key={s} className="flex items-center gap-5">
            {i > 0 && <span className="text-gray-300">·</span>}
            {s}
          </span>
        ))}
      </div>
    </section>
  )
}

export default Hero
