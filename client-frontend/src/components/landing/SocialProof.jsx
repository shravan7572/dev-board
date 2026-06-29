const PROFILES = [
  {
    initials: "AR",
    name: "Aditi Rao",
    title: "Frontend engineer",
    skills: ["React", "TypeScript", "CSS"],
    projects: 12,
    contributions: 318,
    username: "aditi",
  },
  {
    initials: "JL",
    name: "Jordan Lee",
    title: "Platform engineer",
    skills: ["Go", "Kubernetes", "gRPC"],
    projects: 8,
    contributions: 472,
    username: "jordanl",
  },
  {
    initials: "MK",
    name: "Maya Khan",
    title: "ML engineer",
    skills: ["Python", "PyTorch", "Rust"],
    projects: 15,
    contributions: 256,
    username: "maya",
  },
]

function SocialProof() {
  return (
    <section id="profiles" className="mx-auto max-w-6xl px-6 py-24">
      <p className="font-mono text-[11px] uppercase tracking-widest text-gray-400">built by developers</p>
      <h2 className="mt-3 text-[32px] font-medium tracking-[-0.01em] text-black">
        See what others have built
      </h2>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {PROFILES.map((p) => (
          <div key={p.username}>
            <a
              href="#"
              className="block rounded-[8px] border border-gray-100 bg-white p-5 transition-colors duration-150 hover:border-gray-300"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-[13px] font-medium text-gray-600">
                  {p.initials}
                </div>
                <div>
                  <p className="text-[14px] font-medium text-black">{p.name}</p>
                  <p className="text-[13px] text-gray-500">{p.title}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-gray-100 px-2.5 py-1 font-mono text-[12px] text-gray-600"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-4 font-mono text-[12px] text-gray-400">
                <span>{p.projects} projects</span>
                <span className="text-gray-300">·</span>
                <span>{p.contributions} commits this month</span>
              </div>
            </a>
            <p className="mt-2 font-mono text-[12px] text-gray-400">devboard.app/{p.username}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SocialProof
