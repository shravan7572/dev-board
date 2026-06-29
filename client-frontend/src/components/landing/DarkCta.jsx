function DarkCta({ name, setName, onClaim }) {
  return (
    <section id="changelog" className="bg-black">
      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="text-[32px] font-medium tracking-[-0.01em] text-balance text-white md:text-[40px]">
          Your profile should be this good.
        </h2>
        <p className="mt-3 text-[14px] text-gray-400">
          Free. No design skills needed. Takes 3 minutes.
        </p>

        <div className="mx-auto mt-8 flex max-w-md flex-col items-stretch gap-2 sm:flex-row">
          <div className="flex h-11 flex-1 items-center rounded-[6px] bg-white px-3 font-mono text-[14px] text-black">
            <span className="text-gray-400">devboard.app/</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.replace(/\s/g, ""))}
              placeholder="yourname"
              className="ml-0.5 w-full bg-transparent text-black placeholder:text-gray-400 focus:outline-none"
              aria-label="Choose your devboard username"
            />
          </div>
          <button
            onClick={onClaim}
            className="h-11 shrink-0 rounded-[6px] bg-white px-4 text-[14px] font-medium text-black transition-colors duration-150 hover:bg-gray-200"
          >
            Claim profile
          </button>
        </div>

        <p className="mt-4 font-mono text-[12px] text-gray-500">
          devboard.app/yourname · always free
        </p>
      </div>
    </section>
  )
}

export default DarkCta
