import { useParams, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { useProflie } from "../hooks/useprofile"
import { useSkills } from "../hooks/useskill"
import { useProject } from "../hooks/useproject"
import { useReactions, useToggleReaction } from "../hooks/usereaction"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { trackView } from "../api/analytics"
import { sendContact } from "../api/contact"
import { extractGithubUsername, getgithubdata } from "../api/github"

const inputClass =
    "h-9 w-full rounded-[6px] border border-border px-3 text-sm placeholder:text-subtle focus:border-foreground focus:outline-none"

function getInitials(name) {
    if (!name) return "?"
    const parts = name.trim().split(/\s+/)
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "")
}

function PublicProfile() {
    const { username } = useParams()
    const navigate = useNavigate()

    // states for contact form
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [sent, setSent] = useState(false)

    // fetch all data
    const { data: profileData, isLoading, isError: profileError } = useProflie(username)
    const { data: skillsData, isLoading: skillsLoading, isError: skillsError } = useSkills(username)
    const { data: projectsData, isLoading: projectsLoading, isError: projectsError } = useProject(username)
    const { data: reactionsData, isError: reactionsError } = useReactions(username)

    const profile = profileData?.data?.checktheusername
    const githubUsername = extractGithubUsername(profile?.githubUsername || profile?.github)

    const { data: githubData, isError: githubError } = useQuery({
        queryKey: ["github", githubUsername],
        queryFn: () => getgithubdata(githubUsername),
        enabled: !!githubUsername,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    })

    useEffect(() => {
        if (username) {
            trackView(username).catch(() => {});
        }
    }, [username])

    // reactions
    const toggleReaction = useToggleReaction(username)

    // contact mutation
    const contactMutation = useMutation({
        mutationFn: () => sendContact(username, { name, email, message }),
        onSuccess: () => setSent(true),
    })

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
                Loading...
            </div>
        )
    }

    if (profileError) {
        return (
            <div className="flex min-h-screen items-center justify-center text-sm text-red-500">
                Failed to load profile. Please try again.
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
                Profile not found
            </div>
        )
    }

    const skills = skillsData?.data?.checkandgetallskills || []
    const projects = projectsData?.data?.projectdetailshow || []
    const reactions = reactionsData?.data?.counts || {}
    const github = githubData?.data || null

    const reactionItems = [
        { key: "fire", label: "Fire" },
        { key: "heart", label: "Heart" },
        { key: "clap", label: "Clap" },
    ]

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* NAVBAR */}
            <header className="border-b border-border">
                <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
                    <button
                        onClick={() => navigate("/")}
                        className="text-[15px] font-medium tracking-tight"
                    >
                        DevBoard
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="rounded-[6px] border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted"
                    >
                        Create your DevBoard
                    </button>
                </nav>
            </header>

            <main className="mx-auto max-w-5xl px-6 py-12">
                <div className="grid gap-12 md:grid-cols-[280px_1fr]">
                    {/* LEFT — PROFILE */}
                    <aside className="md:sticky md:top-12 md:self-start">
                        {profile.photo ? (
                            <img
                                src={profile.photo || "/placeholder.svg"}
                                alt={profile.name || profile.username}
                                className="h-16 w-16 rounded-full border border-border object-cover"
                            />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-lg font-medium uppercase text-muted-foreground">
                                {getInitials(profile.name || profile.username)}
                            </div>
                        )}
                        <h1 className="mt-4 text-xl font-medium tracking-tight">
                            {profile.name || profile.username}
                        </h1>
                        <p className="mt-0.5 text-sm text-muted-foreground">@{profile.username}</p>
                        {profile.bio && (
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                {profile.bio}
                            </p>
                        )}

                        <div className="mt-4 flex flex-col gap-2 text-sm">
                            {profile.github && (
                                <a href={profile.github} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                                    GitHub
                                </a>
                            )}
                            {profile.linkedin && (
                                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                                    LinkedIn
                                </a>
                            )}
                            {profile.twitter && (
                                <a href={profile.twitter} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                                    Twitter
                                </a>
                            )}
                        </div>

                        {/* REACTIONS */}
                        <div className="mt-6 flex flex-wrap gap-2">
                            {reactionsError && (
                                <p className="text-sm text-red-500">Reactions unavailable.</p>
                            )}
                            {reactionItems.map((r) => (
                                <button
                                    key={r.key}
                                    onClick={() => toggleReaction.mutate(r.key)}
                                    className="rounded-[6px] border border-border px-2.5 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                                >
                                    {r.label} {reactions[r.key] || 0}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* RIGHT — CONTENT */}
                    <div className="min-w-0">
                        {/* GITHUB */}
                        {github && !githubError && (
                            <section>
                                <h2 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                    GitHub
                                </h2>
                                <div className="mt-3 flex gap-8 text-sm">
                                    <div>
                                        <div className="text-lg font-medium">{github.public_repos}</div>
                                        <div className="text-muted-foreground">Repos</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-medium">{github.followers}</div>
                                        <div className="text-muted-foreground">Followers</div>
                                    </div>
                                </div>
                                <img
                                    src={`https://ghchart.rshah.org/${githubUsername}`}
                                    alt="GitHub contributions"
                                    className="mt-4 w-full rounded-[8px] border border-border p-3"
                                />
                                {github.repos?.length > 0 && (
                                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                                        {github.repos.map((repo) => (
                                            <li key={repo.name} className="rounded-[8px] border border-border p-4">
                                                <a href={repo.url} target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline">
                                                    {repo.name}
                                                </a>
                                                {repo.description && (
                                                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                                        {repo.description}
                                                    </p>
                                                )}
                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    {repo.stars} stars · {repo.language}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </section>
                        )}

                        {/* SKILLS */}
                        {skillsLoading && (
                            <p className="mt-3 text-sm text-muted-foreground">Loading skills...</p>
                        )}
                        {skillsError && (
                            <p className="mt-3 text-sm text-red-500">Failed to load skills.</p>
                        )}
                        {skills.length > 0 && (
                            <section className={github ? "mt-10 border-t border-border pt-10" : ""}>
                                <h2 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                    Skills
                                </h2>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {skills.map((skill) => (
                                        <span
                                            key={skill._id}
                                            className="rounded-[6px] border border-border px-2.5 py-1 text-sm"
                                        >
                                            {skill.name}
                                            <span className="text-muted-foreground"> · {skill.level}</span>
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* PROJECTS */}
                        {projectsLoading && (
                            <p className="mt-4 text-sm text-muted-foreground">Loading projects...</p>
                        )}
                        {projectsError && (
                            <p className="mt-4 text-sm text-red-500">Failed to load projects.</p>
                        )}
                        {projects.length > 0 && (
                            <section className="mt-10 border-t border-border pt-10">
                                <h2 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                    Projects
                                </h2>
                                <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                                    {projects.map((project) => (
                                        <li key={project._id} className="overflow-hidden rounded-[8px] border border-border">
                                            {project.thumbnail && (
                                                <img
                                                    src={project.thumbnail || "/placeholder.svg"}
                                                    alt={project.title}
                                                    className="aspect-video w-full border-b border-border object-cover"
                                                />
                                            )}
                                            <div className="p-4">
                                                <h3 className="text-sm font-medium">{project.title}</h3>
                                                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                                    {project.description}
                                                </p>
                                                {project.techstack?.length > 0 && (
                                                    <p className="mt-2 text-sm text-muted-foreground">
                                                        {Array.isArray(project.techstack)
                                                            ? project.techstack.join(", ")
                                                            : project.techstack}
                                                    </p>
                                                )}
                                                <div className="mt-3 flex gap-3 text-sm">
                                                    {project.liveurl && (
                                                        <a href={project.liveurl} target="_blank" rel="noreferrer" className="font-medium hover:underline">
                                                            Live
                                                        </a>
                                                    )}
                                                    {project.githuburl && (
                                                        <a href={project.githuburl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                                                            GitHub
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* CONTACT */}
                        <section className="mt-10 border-t border-border pt-10">
                            <h2 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                Contact
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Send {profile.username} a message.
                            </p>
                            {sent ? (
                                <p className="mt-4 text-sm text-muted-foreground">
                                    Message sent successfully.
                                </p>
                            ) : (
                                <div className="mt-4 max-w-md">
                                    {contactMutation.isError && (
                                        <p className="mb-3 text-sm text-red-500">
                                            {contactMutation.error?.response?.data?.message || "Failed to send message."}
                                        </p>
                                    )}
                                    <div className="flex flex-col gap-3">
                                        <input
                                            placeholder="Your name"
                                            className={inputClass}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        <input
                                            placeholder="Your email"
                                            className={inputClass}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <textarea
                                            placeholder="Your message"
                                            className="min-h-[120px] w-full rounded-[6px] border border-border px-3 py-2 text-sm placeholder:text-subtle focus:border-foreground focus:outline-none"
                                            onChange={(e) => setMessage(e.target.value)}
                                        />
                                    </div>
                                    <div className="mt-3 flex justify-end">
                                        <button
                                            onClick={() => contactMutation.mutate()}
                                            disabled={contactMutation.isPending}
                                            className="rounded-[6px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-zinc-800 disabled:opacity-60"
                                        >
                                            {contactMutation.isPending ? "Sending..." : "Send message"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default PublicProfile
