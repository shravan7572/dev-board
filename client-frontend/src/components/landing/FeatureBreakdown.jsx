function ContributionGraph() {
  // deterministic intensity pattern, grayscale to match the palette
  const shades = ["bg-gray-100", "bg-gray-300", "bg-gray-500", "bg-black"]
  const cells = Array.from({ length: 7 * 14 }, (_, i) => shades[(i * 7 + (i % 5)) % 4])
  return (
    <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
      {cells.map((c, i) => (
        <span key={i} className={`h-[10px] w-[10px] rounded-[2px] ${c}`} />
      ))}
    </div>
  )
}

function SkillBars() {
  const skills = [
    { name: "TypeScript", pct: "90%" },
    { name: "Go", pct: "70%" },
    { name: "Rust", pct: "45%" },
  ]
  return (
    <div className="flex w-56 flex-col gap-3">
      {skills.map((s) => (
        <div key={s.name}>
          <div className="mb-1 flex justify-between font-mono text-[12px] text-gray-500">
            <span>{s.name}</span>
            <span>{s.pct}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-100">
            <div className="h-1.5 rounded-full bg-black" style={{ width: s.pct }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function BlogRows() {
  const posts = [
    { title: "Why I stopped using ORMs", meta: "4 min" },
    { title: "Shipping on the edge", meta: "7 min" },
  ]
  return (
    <div className="w-64">
      {posts.map((p, i) => (
        <div
          key={p.title}
          className={`flex items-center justify-between py-2 ${i > 0 ? "border-t border-gray-100" : ""}`}
        >
          <span className="text-[13px] text-black">{p.title}</span>
          <span className="font-mono text-[12px] text-gray-400">{p.meta}</span>
        </div>
      ))}
    </div>
  )
}

function Reactions() {
  const items = [
    { icon: "👍", count: 24 },
    { icon: "🔥", count: 18 },
    { icon: "🧠", count: 9 },
  ]
  return (
    <div className="flex items-center gap-2">
      {items.map((r) => (
        <span
          key={r.icon}
          className="flex items-center gap-1.5 rounded-full border border-gray-200 px-2.5 py-1 font-mono text-[12px] text-gray-600"
        >
          <span aria-hidden="true">{r.icon}</span>
          {r.count}
        </span>
      ))}
    </div>
  )
}

const FEATURES = [
  {
    title: "GitHub activity",
    desc: "Live contribution graph and pinned repos, synced automatically.",
    snippet: <ContributionGraph />,
  },
  {
    title: "Skills & stack",
    desc: "Tag-based, searchable, self-reported. Show what you actually use.",
    snippet: <SkillBars />,
  },
  {
    title: "Learning journey",
    desc: "A timeline of what you are currently learning and building.",
    snippet: <BlogRows />,
  },
  {
    title: "Blog & writing",
    desc: "Markdown posts with reactions from other developers.",
    snippet: <Reactions />,
  },
]

function FeatureBreakdown() {
  return (
    <section id="docs" className="mx-auto max-w-6xl px-6 py-24">
      <p className="font-mono text-[11px] uppercase tracking-widest text-gray-400">what&apos;s included</p>
      <h2 className="mt-3 max-w-xl text-[32px] font-medium tracking-[-0.01em] text-balance text-black">
        Everything a developer&apos;s profile should have
      </h2>

      <div className="mt-10">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className={`flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between ${
              i > 0 ? "border-t border-gray-100" : ""
            }`}
          >
            <div className="max-w-sm">
              <h3 className="text-[16px] font-medium text-black">{f.title}</h3>
              <p className="mt-1 text-[14px] leading-relaxed text-gray-500">{f.desc}</p>
            </div>
            <div className="shrink-0">{f.snippet}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeatureBreakdown
