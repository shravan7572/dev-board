import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useProflie } from "../hooks/useprofile"
import { useSkills } from "../hooks/useskill"
import { useProject } from "../hooks/useproject"
import { useReactions, useToggleReaction } from "../hooks/usereaction"
import { trackView } from "../api/analytics"
import { sendContact } from "../api/contact"
import { extractGithubUsername, getgithubdata } from "../api/github"

const formatUrl = (url) => {
    if (!url) return "#";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
};

// ─── helpers ────────────────────────────────────────────────────────────────
function getInitials(name) {
    if (!name) return "?"
    const parts = name.trim().split(/\s+/)
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "")
}

function SocialLink({ href, label, icon }) {
    if (!href) return null
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="profile-social-link"
        >
            {icon}
            <span>{label}</span>
        </a>
    )
}

// GitHub SVG icon
const GithubIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
)

const LinkedinIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
)

const TwitterIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
)

const StarIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#f59e0b" }}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
)

// ─── GitHub Contribution Chart Component ─────────────────────────────────────
function GithubChart({ githubUsername }) {
    const [imgError, setImgError] = useState(false)
    const [imgLoaded, setImgLoaded] = useState(false)

    if (!githubUsername) return null

    // ghchart.rshah.org provides SVG contribution charts — lightweight, no auth needed
    const chartUrl = `https://ghchart.rshah.org/${githubUsername}`

    return (
        <div className="github-chart-wrap">
            <div className="github-chart-header">
                <span className="github-chart-label">Contribution Activity</span>
                <a
                    href={`https://github.com/${githubUsername}`}
                    target="_blank"
                    rel="noreferrer"
                    className="github-chart-link"
                >
                    @{githubUsername} ↗
                </a>
            </div>
            {!imgError ? (
                <div className="github-chart-frame">
                    {!imgLoaded && (
                        <div className="github-chart-skeleton">
                            <div className="skeleton-pulse" style={{ height: 112, borderRadius: 6 }} />
                        </div>
                    )}
                    <img
                        src={chartUrl}
                        alt={`${githubUsername}'s GitHub contributions`}
                        className="github-chart-img"
                        style={{ display: imgLoaded ? "block" : "none" }}
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgError(true)}
                    />
                </div>
            ) : (
                <div className="github-chart-error">
                    Could not load contribution chart for @{githubUsername}
                </div>
            )}
        </div>
    )
}

// ─── Reaction button ─────────────────────────────────────────────────────────
const reactionEmoji = { fire: "🔥", heart: "❤️", clap: "👏" }

function ReactionButton({ type, count, onClick, isPending }) {
    return (
        <button
            onClick={() => onClick(type)}
            disabled={isPending}
            className="reaction-btn"
            title={`React with ${type}`}
        >
            <span className="reaction-emoji">{reactionEmoji[type]}</span>
            <span className="reaction-count">{count || 0}</span>
        </button>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────
function PublicProfile() {
    const { username } = useParams()
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [sent, setSent] = useState(false)

    // ── data fetching ─────────────────────────────────────────────────────
    const { data: profileData, isLoading, isError: profileError } = useProflie(username)
    const { data: skillsData, isLoading: skillsLoading } = useSkills(username)
    const { data: projectsData, isLoading: projectsLoading } = useProject(username)
    const { data: reactionsData } = useReactions(username)

    const profile = profileData?.data?.checktheusername

    // Resolve github username: prefer explicit githubUsername field, fall back to extracting from github URL
    const resolvedGithubUsername = profile?.githubUsername
        || extractGithubUsername(profile?.github)
        || null

    const { data: githubData, isLoading: githubLoading, isError: githubError } = useQuery({
        queryKey: ["github", resolvedGithubUsername],
        queryFn: () => getgithubdata(resolvedGithubUsername),
        enabled: !!resolvedGithubUsername,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    })

    // Track view on mount
    useEffect(() => {
        if (username) trackView(username).catch(() => { })
    }, [username])

    const toggleReaction = useToggleReaction(username)

    const contactMutation = useMutation({
        mutationFn: () => sendContact(username, { name, email, message }),
        onSuccess: () => setSent(true),
    })

    // ── loading / error states ─────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="profile-loading">
                <div className="profile-loading-dot" />
                <div className="profile-loading-dot" style={{ animationDelay: "150ms" }} />
                <div className="profile-loading-dot" style={{ animationDelay: "300ms" }} />
            </div>
        )
    }

    if (profileError || !profile) {
        return (
            <div className="profile-error-wrap">
                <div className="profile-error-code">404</div>
                <p className="profile-error-msg">This profile doesn't exist yet.</p>
                <button onClick={() => navigate("/")} className="profile-error-cta">
                    Create yours →
                </button>
            </div>
        )
    }

    const skills = skillsData?.data?.checkandgetallskills || []
    const projects = projectsData?.data?.projectdetailshow || []
    const reactions = reactionsData?.data?.counts || {}
    const github = githubData?.data || null
    const featuredProjects = projects.filter(p => p.featured)
    const otherProjects = projects.filter(p => !p.featured)
    const orderedProjects = [...featuredProjects, ...otherProjects]

    return (
        <div className="profile-page">
            {/* ── NAV ──────────────────────────────────────────────────── */}
            <header className="profile-nav">
                <nav className="profile-nav-inner">
                    <button onClick={() => navigate("/")} className="profile-nav-logo">
                        devboard
                    </button>
                    <button onClick={() => navigate("/")} className="profile-nav-cta">
                        Create yours →
                    </button>
                </nav>
            </header>

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <div className="profile-hero">
                <div className="profile-hero-inner">
                    {/* Avatar */}
                    <div className="profile-avatar-wrap">
                        {profile.photo ? (
                            <img src={profile.photo} alt={profile.username} className="profile-avatar-img" />
                        ) : (
                            <div className="profile-avatar-initials">
                                {getInitials(profile.name || profile.username)}
                            </div>
                        )}
                        {resolvedGithubUsername && github?.avatar_url && (
                            <div className="profile-avatar-badge" title="GitHub">
                                <GithubIcon />
                            </div>
                        )}
                    </div>

                    {/* Name + handle + bio */}
                    <div className="profile-hero-text">
                        <h1 className="profile-name">{profile.name || profile.username}</h1>
                        <p className="profile-handle">@{profile.username}</p>
                        {profile.bio && (
                            <p className="profile-bio">{profile.bio}</p>
                        )}

                        {/* Social links */}
                        <div className="profile-socials">
                            <SocialLink href={profile.github} label="GitHub" icon={<GithubIcon />} />
                            <SocialLink href={profile.linkedin} label="LinkedIn" icon={<LinkedinIcon />} />
                            <SocialLink href={profile.twitter} label="Twitter" icon={<TwitterIcon />} />
                        </div>

                        {/* Reactions */}
                        <div className="profile-reactions">
                            {["fire", "heart", "clap"].map(type => (
                                <ReactionButton
                                    key={type}
                                    type={type}
                                    count={reactions[type]}
                                    onClick={(t) => toggleReaction.mutate(t)}
                                    isPending={toggleReaction.isPending}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
            <main className="profile-main">

                {/* ── GITHUB SECTION ─────────────────────────────────── */}
                {resolvedGithubUsername && (
                    <section className="profile-section">
                        <div className="profile-section-header">
                            <GithubIcon />
                            <h2 className="profile-section-title">GitHub</h2>
                        </div>

                        {/* Stats row */}
                        {github && !githubError && (
                            <div className="github-stats-row">
                                <div className="github-stat">
                                    <span className="github-stat-num">{github.public_repos}</span>
                                    <span className="github-stat-label">Repos</span>
                                </div>
                                <div className="github-stat-divider" />
                                <div className="github-stat">
                                    <span className="github-stat-num">{github.followers}</span>
                                    <span className="github-stat-label">Followers</span>
                                </div>
                                <div className="github-stat-divider" />
                                <div className="github-stat">
                                    <span className="github-stat-num">{github.following}</span>
                                    <span className="github-stat-label">Following</span>
                                </div>
                            </div>
                        )}

                        {/* Contribution chart — always shown if username is set */}
                        <GithubChart githubUsername={resolvedGithubUsername} />

                        {/* Top repos */}
                        {github?.repos?.length > 0 && (
                            <div className="github-repos-grid">
                                {github.repos.slice(0, 6).map(repo => (
                                    <a
                                        key={repo.name}
                                        href={repo.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="github-repo-card"
                                    >
                                        <div className="github-repo-top">
                                            <span className="github-repo-name">{repo.name}</span>
                                            {repo.stars > 0 && (
                                                <span className="github-repo-stars">
                                                    <StarIcon /> {repo.stars}
                                                </span>
                                            )}
                                        </div>
                                        {repo.description && (
                                            <p className="github-repo-desc">{repo.description}</p>
                                        )}
                                        {repo.language && (
                                            <span className="github-repo-lang">{repo.language}</span>
                                        )}
                                    </a>
                                ))}
                            </div>
                        )}

                        {githubLoading && (
                            <div className="github-repos-grid">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="github-repo-card">
                                        <div className="skeleton-pulse" style={{ height: 14, width: "60%", borderRadius: 4, marginBottom: 8 }} />
                                        <div className="skeleton-pulse" style={{ height: 11, borderRadius: 4 }} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {githubError && (
                            <p className="profile-section-empty">
                                Could not load GitHub data for @{resolvedGithubUsername}
                            </p>
                        )}
                    </section>
                )}

                {/* ── SKILLS ─────────────────────────────────────────── */}
                {(skillsLoading || skills.length > 0) && (
                    <section className="profile-section">
                        <div className="profile-section-header">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                            <h2 className="profile-section-title">Skills</h2>
                            <span className="profile-section-count">{skills.length}</span>
                        </div>

                        {skillsLoading ? (
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="skeleton-pulse" style={{ height: 28, width: 72 + i * 12, borderRadius: 999 }} />
                                ))}
                            </div>
                        ) : (
                            <div className="skills-grid">
                                {skills.map(skill => (
                                    <span
                                        key={skill._id}
                                        className={`skill-chip${skill.featured ? " featured" : ""}`}
                                        title={skill.category || undefined}
                                    >
                                        <span className="skill-chip-name">{skill.name}</span>
                                        {skill.level && (
                                            <span className="skill-chip-level">{skill.level}</span>
                                        )}
                                        {skill.yearsExp && (
                                            <span className="skill-chip-years">{skill.yearsExp}y</span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* ── PROJECTS ───────────────────────────────────────── */}
                {(projectsLoading || projects.length > 0) && (
                    <section className="profile-section">
                        <div className="profile-section-header">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <path d="M3 9h18M9 21V9" />
                            </svg>
                            <h2 className="profile-section-title">Projects</h2>
                            <span className="profile-section-count">{projects.length}</span>
                        </div>

                        {projectsLoading ? (
                            <div className="projects-grid">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="project-card-pub">
                                        <div className="skeleton-pulse" style={{ height: 140 }} />
                                        <div style={{ padding: 16 }}>
                                            <div className="skeleton-pulse" style={{ height: 14, width: "50%", borderRadius: 4, marginBottom: 8 }} />
                                            <div className="skeleton-pulse" style={{ height: 11, borderRadius: 4 }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="projects-grid">
                                {orderedProjects.map(project => {
                                    const tags = Array.isArray(project.techstack)
                                        ? project.techstack
                                        : (project.techstack || "").split(",").map(s => s.trim()).filter(Boolean)
                                    return (
                                        <div key={project._id} className="project-card-pub">
                                            {project.thumbnail && (
                                                <div className="project-card-pub-thumb">
                                                    <img
                                                        src={project.thumbnail}
                                                        alt={project.title}
                                                        className="project-card-pub-img"
                                                    />
                                                </div>
                                            )}
                                            <div className="project-card-pub-body">
                                                <div className="project-card-pub-top">
                                                    <h3 className="project-card-pub-title">{project.title}</h3>
                                                    <div style={{ display: "flex", gap: 4 }}>
                                                        {project.featured && (
                                                            <span className="project-pub-badge featured">★ Featured</span>
                                                        )}
                                                        {project.liveurl ? (
                                                            <span className="project-pub-badge live">Live</span>
                                                        ) : (
                                                            <span className="project-pub-badge wip">WIP</span>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* {console} */}
                                                {project.description && (
                                                    <p className="project-card-pub-desc">{project.description}</p>
                                                )}
                                                {tags.length > 0 && (
                                                    <div className="project-card-pub-tags">
                                                        {tags.map((t, i) => (
                                                            <span key={i} className="project-pub-tag">{t}</span>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="project-card-pub-links">
                                                    {project.liveurl && (
                                                        <a
                                                            href={formatUrl(project.liveurl)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="project-pub-link primary"
                                                        >
                                                            Live demo
                                                        </a>
                                                    )}
                                                    {project.githuburl && (
                                                        <a href={project.githuburl} target="_blank" rel="noreferrer" className="project-pub-link secondary">
                                                            <GithubIcon />
                                                            Source
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </section>
                )}

                {/* ── CONTACT ────────────────────────────────────────── */}
                <section className="profile-section profile-contact-section">
                    <div className="profile-section-header">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <h2 className="profile-section-title">Get in touch</h2>
                    </div>
                    <p className="contact-subtext">
                        Send {profile.name || profile.username} a message.
                    </p>

                    {sent ? (
                        <div className="contact-success">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "#16a34a" }}>
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Message sent! They'll get back to you soon.
                        </div>
                    ) : (
                        <form
                            onSubmit={(e) => { e.preventDefault(); contactMutation.mutate() }}
                            className="contact-form"
                        >
                            {contactMutation.isError && (
                                <p className="contact-error">
                                    {contactMutation.error?.response?.data?.message || "Failed to send. Try again."}
                                </p>
                            )}
                            <div className="contact-row">
                                <div className="contact-field">
                                    <label className="contact-label">Name</label>
                                    <input
                                        className="contact-input"
                                        placeholder="Your name"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="contact-field">
                                    <label className="contact-label">Email</label>
                                    <input
                                        type="email"
                                        className="contact-input"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="contact-field">
                                <label className="contact-label">Message</label>
                                <textarea
                                    className="contact-textarea"
                                    placeholder="What's on your mind?"
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    required
                                    rows={5}
                                />
                            </div>
                            <div className="contact-submit-row">
                                <button
                                    type="submit"
                                    disabled={contactMutation.isPending}
                                    className="contact-submit-btn"
                                >
                                    {contactMutation.isPending ? (
                                        <><span className="spinner" />Sending…</>
                                    ) : "Send message →"}
                                </button>
                            </div>
                        </form>
                    )}
                </section>

            </main>

            {/* ── FOOTER ───────────────────────────────────────────────── */}
            <footer className="profile-footer">
                <span>Built with</span>
                <button onClick={() => navigate("/")} className="profile-footer-link">devboard</button>
            </footer>
        </div>
    )
}

export default PublicProfile
