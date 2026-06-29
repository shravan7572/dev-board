import { useState } from "react"

const TABS = ["Projects", "Skills", "Activity", "Writing"]

const CONTENT = {
  Projects: [
    { title: "devboard", desc: "Public developer profiles, open source", meta: "TypeScript · 1.2k ★" },
    { title: "edge-cache", desc: "Tiny LRU cache for the edge runtime", meta: "Rust · 340 ★" },
    { title: "mdx-notes", desc: "Local-first markdown note taking", meta: "TypeScript · 88 ★" },
  ],
  Skills: [
    { title: "TypeScript", desc: "Daily driver for 5 years", meta: "expert" },
    { title: "Go", desc: "Backend services and CLIs", meta: "proficient" },
    { title: "PostgreSQL", desc: "Schema design, query tuning", meta: "proficient" },
  ],
  Activity: [
    { title: "Pushed to devboard", desc: "feat: live URL availability check", meta: "2 hours ago" },
    { title: "Opened PR in edge-cache", desc: "perf: reduce allocations on read", meta: "yesterday" },
    { title: "Starred react-aria", desc: "Accessible UI primitives", meta: "3 days ago" },
  ],
  Writing: [
    { title: "Why I stopped using ORMs", desc: "Notes on raw SQL and type safety", meta: "Apr 2025 · 4 min" },
    { title: "Shipping on the edge", desc: "Cold starts, caching, and tradeoffs", meta: "Mar 2025 · 7 min" },
  ],
}

function ProfilePreview({ name }) {
  const [tab, setTab] = useState("Projects")
  const handle = (name.trim().toLowerCase() || "shravan")

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <p className="font-mono text-[11px] uppercase tracking-widest text-gray-400">profile preview</p>
      <h2 className="mt-3 text-[32px] font-medium tracking-[-0.01em] text-black">
        What your board looks like
      </h2>

      <div className="mt-8 grid gap-px overflow-hidden rounded-[8px] border border-gray-100 bg-gray-100 md:grid-cols-[260px_1fr]">
        {/* Left: profile card */}
        <div className="bg-white p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-600">
            SK
          </div>
          <h3 className="mt-4 text-[16px] font-medium text-black">Shravan Kumar</h3>
          <p className="text-[14px] text-gray-500">Full-stack developer</p>
          <p className="mt-1 text-[13px] text-gray-400">Bengaluru, India</p>

          <span className="mt-4 inline-block rounded-full bg-black px-2.5 py-1 text-[11px] font-medium text-white">
            open to work
          </span>

          <div className="mt-5 flex flex-col gap-2 font-mono text-[13px] text-gray-500">
            <a href="#" className="transition-colors duration-150 hover:text-black">github.com/shravan</a>
            <a href="#" className="transition-colors duration-150 hover:text-black">twitter.com/shravan</a>
          </div>
        </div>

        {/* Right: tabbed content */}
        <div className="bg-white p-6">
          <div className="flex items-center gap-5 border-b border-gray-100">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`-mb-px border-b pb-2.5 text-[14px] transition-colors duration-150 ${
                  tab === t
                    ? "border-black font-medium text-black"
                    : "border-transparent text-gray-500 hover:text-black"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-col">
            {CONTENT[tab].map((item, i) => (
              <div
                key={item.title}
                className={`flex items-start justify-between gap-4 py-3 ${
                  i > 0 ? "border-t border-gray-100" : ""
                }`}
              >
                <div>
                  <p className="text-[14px] font-medium text-black">{item.title}</p>
                  <p className="text-[13px] text-gray-500">{item.desc}</p>
                </div>
                <span className="shrink-0 font-mono text-[12px] text-gray-400">{item.meta}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 font-mono text-[12px] text-gray-400">This is devboard.app/{handle}</p>
    </section>
  )
}

export default ProfilePreview
