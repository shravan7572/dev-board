import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useProflie, useUpdateProfile } from "../hooks/useprofile"
import { useSkills, useAddSkill, useDeleteSkill } from "../hooks/useskill"
import { useProject, useAddProject, useUpdateProject, usedeleteProject } from "../hooks/useproject"
import { getStats } from "../api/analytics"
import { getreaction } from "../api/reaction"
import AvatarUpload from "../components/AvatarUpload"

// ─── shared input/label styles ────────────────────────────────────────────────
const inputClass =
    "h-9 w-full rounded-[6px] border border-border px-3 text-sm placeholder:text-subtle focus:border-foreground focus:outline-none"
const labelClass =
    "mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-muted-foreground"

// ─── SaveButton — handles loading / success / error states ───────────────────
function SaveButton({ isPending, isSuccess, isError, label = "Save changes", onClick, type = "button" }) {
    const [showSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        if (isSuccess) {
            setShowSuccess(true)
            const t = setTimeout(() => setShowSuccess(false), 2000)
            return () => clearTimeout(t)
        }
    }, [isSuccess])

    let content
    if (isPending) {
        content = <><span className="spinner" />Saving…</>
    } else if (showSuccess) {
        content = <span className="check-animate" style={{ color: "#16a34a" }}>Saved ✓</span>
    } else if (isError) {
        content = <span style={{ color: "#ef4444" }}>Failed — retry</span>
    } else {
        content = label
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isPending}
            className="btn-save rounded-[6px] border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
            {content}
        </button>
    )
}

// ─── Empty state placeholder ─────────────────────────────────────────────────
function EmptyState({ icon, title, cta, onCta }) {
    return (
        <div className="empty-state mt-6 max-w-2xl">
            <div className="empty-state-icon">{icon}</div>
            <p className="empty-state-title">{title}</p>
            <button className="empty-state-link" onClick={onCta}>{cta}</button>
        </div>
    )
}

// ─── Confirm delete wrapper ───────────────────────────────────────────────────
function useConfirmDelete(mutation) {
    return (id, label = "this item") => {
        if (window.confirm(`Delete ${label}? This cannot be undone.`)) {
            mutation.mutate(id)
        }
    }
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
function Dashboard() {
    const username = localStorage.getItem("username")
    const navigate = useNavigate()

    // ── profile ──────────────────────────────────────────────────────────────
    const { data, isLoading, isError: profileError } = useProflie(username)
    const updateMutation = useUpdateProfile()
    const [bio, setBio] = useState("")
    const [github, setGithub] = useState("")
    const [linkedin, setLinkedin] = useState("")
    const [twitter, setTwitter] = useState("")
    const [githubUsername, setGithubUsername] = useState("")
    const [theme, setTheme] = useState("default")
    const [avatarPhoto, setAvatarPhoto] = useState(null)

    // Pre-populate profile fields when data loads
    useEffect(() => {
        if (data?.data?.checktheusername) {
            const u = data.data.checktheusername
            setBio(u.bio || "")
            setGithub(u.github || "")
            setLinkedin(u.linkedin || "")
            setTwitter(u.twitter || "")
            setGithubUsername(u.githubUsername || "")
            setTheme(u.theme || "default")
            setAvatarPhoto(u.photo || null)
        }
    }, [data])

    // ── skills ───────────────────────────────────────────────────────────────
    const [skillname, setSkillname] = useState("")
    const [skilllevel, setSkilllevel] = useState("")
    const [skillcategory, setSkillcategory] = useState("")
    const [skillYearsExp, setSkillYearsExp] = useState("")
    const [skillFeatured, setSkillFeatured] = useState(false)

    const { data: skillsdata, isLoading: skillsLoading, isError: skillsError } = useSkills(username)
    const addskillmutation = useAddSkill(username)
    const deleteskillmutation = useDeleteSkill(username)
    const confirmDeleteSkill = useConfirmDelete(deleteskillmutation)

    // ── projects ──────────────────────────────────────────────────────────────
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [techstack, setTechstack] = useState("")
    const [liveurl, setLiveurl] = useState("")
    const [githuburl, setGithuburl] = useState("")
    const [thumbnail, setThumbnail] = useState(null)
    const [projectFeatured, setProjectFeatured] = useState(false)
    // Issue 5 fix: track which project is being edited
    const [editingProject, setEditingProject] = useState(null)
    const [showProjectModal, setShowProjectModal] = useState(false)

    const { data: projectsdata, isLoading: projectsLoading, isError: projectsError } = useProject(username)
    const addprojectmutation = useAddProject(username)
    const updateprojectmutation = useUpdateProject(username)
    const deleteprojectmutation = usedeleteProject(username)
    const confirmDeleteProject = useConfirmDelete(deleteprojectmutation)

    // ── analytics / stats ──────────────────────────────────────────────────
    // Issue 3 fix: call getStats() on mount
    const [statsData, setStatsData] = useState(null)
    const [reactionsTotal, setReactionsTotal] = useState(null)

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await getStats()
                setStatsData(res.data)
            } catch {
                // silently fail — stats are non-critical
            }
        }
        fetchStats()
    }, [])

    useEffect(() => {
        if (!username) return
        async function fetchReactions() {
            try {
                const res = await getreaction(username)
                const c = res.data?.counts || {}
                setReactionsTotal((c.fire || 0) + (c.heart || 0) + (c.clap || 0))
            } catch {
                // non-critical
            }
        }
        fetchReactions()
    }, [username])

    // ── section animation ─────────────────────────────────────────────────
    const [visibleSections, setVisibleSections] = useState([])
    useEffect(() => {
        const sections = ["stats", "profile", "skills", "projects"]
        sections.forEach((s, i) => {
            setTimeout(() => setVisibleSections((prev) => [...prev, s]), i * 100)
        })
    }, [])
    function sectionClass(name) {
        return `section-animate${visibleSections.includes(name) ? " visible" : ""}`
    }

    // ── active sidebar section (scroll-spy) ───────────────────────────────
    const [activeSection, setActiveSection] = useState("stats")
    const sectionRefs = {
        stats: useRef(null),
        profile: useRef(null),
        skills: useRef(null),
        projects: useRef(null),
    }
    function scrollTo(section) {
        sectionRefs[section]?.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        setActiveSection(section)
    }

    // ── handlers ──────────────────────────────────────────────────────────

    function handleUpdate(e) {
        e?.preventDefault()
        updateMutation.mutate({ bio, github, linkedin, twitter, githubUsername, theme })
    }

    function handleAddSkill(e) {
        e?.preventDefault()
        addskillmutation.mutate(
            {
                name: skillname,
                level: skilllevel,
                category: skillcategory,
                yearsExp: skillYearsExp ? Number(skillYearsExp) : undefined,
                featured: skillFeatured,
            },
            {
                onSuccess: () => {
                    // Reset skill form fields after successful add
                    setSkillname("")
                    setSkilllevel("")
                    setSkillcategory("")
                    setSkillYearsExp("")
                    setSkillFeatured(false)
                },
            }
        )
    }

    // Populate edit form when pencil is clicked
    function openEditProject(project) {
        setEditingProject(project)
        setTitle(project.title || "")
        setDesc(project.description || "")
        setTechstack(Array.isArray(project.techstack) ? project.techstack.join(", ") : project.techstack || "")
        setLiveurl(project.liveurl || "")
        setGithuburl(project.githuburl || "")
        setProjectFeatured(project.featured || false)
        setThumbnail(null)
        setShowProjectModal(true)
    }

    function openAddProject() {
        setEditingProject(null)
        setTitle("")
        setDesc("")
        setTechstack("")
        setLiveurl("")
        setGithuburl("")
        setProjectFeatured(false)
        setThumbnail(null)
        setShowProjectModal(true)
    }

    function closeProjectModal() {
        setShowProjectModal(false)
        setEditingProject(null)
    }

    function handleAddProject(e) {
        e?.preventDefault()
        const formData = new FormData()
        formData.append("title", title)
        formData.append("description", desc)
        formData.append("techstack", techstack)
        formData.append("liveurl", liveurl)
        formData.append("githuburl", githuburl)
        formData.append("featured", projectFeatured)
        if (thumbnail) formData.append("thumbnail", thumbnail)
        addprojectmutation.mutate(formData, { onSuccess: closeProjectModal })
    }

    // Issue 5 fix: pass { id, data } so the hook can call updatedproject(id, data)
    function handleUpdateProject(e) {
        e?.preventDefault()
        updateprojectmutation.mutate(
            {
                id: editingProject._id,
                data: {
                    title,
                    description: desc,
                    techstack,
                    liveurl,
                    githuburl,
                    featured: projectFeatured,
                },
            },
            { onSuccess: closeProjectModal }
        )
    }

    function handleLogout() {
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        navigate("/")
    }

    // ── derived data ──────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
                Loading…
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

    const skills = skillsdata?.data?.checkandgetallskills || []
    const projects = projectsdata?.data?.projectdetailshow || []

    // ── active project/skill mutations ────────────────────────────────────
    const projectMutation = editingProject ? updateprojectmutation : addprojectmutation

    // ─────────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-background text-foreground" style={{ display: "flex", flexDirection: "column" }}>

            {/* ── TOP BAR ──────────────────────────────────────────────── */}
            <header className="border-b border-border sticky top-0 z-30 bg-background">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
                    <span className="font-mono text-[14px] font-medium tracking-tight">devboard</span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate(`/${username}`)}
                            className="rounded-[6px] px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                            View profile ↗
                        </button>
                        <button
                            onClick={handleLogout}
                            className="rounded-[6px] px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </header>

            <div className="mx-auto flex w-full max-w-6xl flex-1 px-6">

                {/* ── SIDEBAR ──────────────────────────────────────────── */}
                <aside
                    style={{
                        width: 200,
                        flexShrink: 0,
                        borderRight: "1px solid #e5e7eb",
                        paddingTop: 32,
                        paddingRight: 24,
                        paddingBottom: 32,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {[
                            { key: "stats", label: "Overview" },
                            { key: "profile", label: "Profile" },
                            { key: "skills", label: "Skills" },
                            { key: "projects", label: "Projects" },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => scrollTo(key)}
                                className={`sidebar-nav-item${activeSection === key ? " active" : ""}`}
                            >
                                {label}
                            </button>
                        ))}
                    </nav>

                    {/* Bottom: avatar + name + edit link */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                                width: 30, height: 30, borderRadius: "50%",
                                background: "#f4f4f5", border: "1px solid #e5e7eb",
                                overflow: "hidden", flexShrink: 0, display: "flex",
                                alignItems: "center", justifyContent: "center",
                                fontSize: 12, color: "#6b7280", fontWeight: 500,
                            }}>
                                {avatarPhoto
                                    ? <img src={avatarPhoto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    : (username || "?").slice(0, 2).toUpperCase()}
                            </div>
                            <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>{username}</span>
                        </div>
                        <button
                            onClick={() => scrollTo("profile")}
                            style={{ fontSize: 11, color: "#000", textDecoration: "underline", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
                        >
                            Edit profile →
                        </button>
                    </div>
                </aside>

                {/* ── MAIN CONTENT ─────────────────────────────────────── */}
                <main style={{ flex: 1, paddingLeft: 40, paddingTop: 32, paddingBottom: 40 }}>

                    {/* ── STAT CARDS (Issue 3) ──────────────────────────── */}
                    <div
                        ref={sectionRefs.stats}
                        className={sectionClass("stats")}
                        style={{ animationDelay: "0ms" }}
                        onClick={() => setActiveSection("stats")}
                    >
                        <h1 className="text-[15px] font-medium mb-6">Overview</h1>
                        <div className="grid gap-4 sm:grid-cols-3">

                            {/* Profile views — from getStats() */}
                            <div className="stat-card">
                                <div className="stat-number">
                                    {statsData?.totalviews ?? "—"}
                                </div>
                                <div className="stat-label">Profile Views</div>
                                <div className="stat-trend">all time</div>
                            </div>

                            {/* Reactions — from reaction API */}
                            <div className="stat-card">
                                <div className="stat-number">
                                    {reactionsTotal ?? "—"}
                                </div>
                                <div className="stat-label">Reactions</div>
                                <div className="stat-trend">🔥 ❤️ 👏 total</div>
                            </div>

                            {/* Projects count */}
                            <div className="stat-card">
                                <div className="stat-number">
                                    {projectsLoading ? "—" : projects.length}
                                </div>
                                <div className="stat-label">Projects</div>
                                <div className="stat-trend">{skills.length} skills added</div>
                            </div>
                        </div>
                    </div>

                    {/* ── PROFILE (Issues 1 + 2) ───────────────────────── */}
                    <section
                        ref={sectionRefs.profile}
                        className={`mt-10 border-t border-border pt-10 ${sectionClass("profile")}`}
                        style={{ animationDelay: "100ms" }}
                        onClick={() => setActiveSection("profile")}
                    >
                        <h2 className="text-[15px] font-medium">Profile</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Update your bio, social links, and avatar.
                        </p>

                        {/* Issue 2: Avatar upload */}
                        <div className="mt-6">
                            <label className={labelClass}>Photo</label>
                            <AvatarUpload
                                currentPhoto={avatarPhoto}
                                username={username}
                                onSuccess={(url) => setAvatarPhoto(url)}
                            />
                        </div>

                        <form onSubmit={handleUpdate} className="mt-6 grid max-w-2xl gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Bio</label>
                                <input
                                    className={inputClass}
                                    placeholder="A short bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>GitHub</label>
                                <input
                                    className={inputClass}
                                    placeholder="github username or url"
                                    value={github}
                                    onChange={(e) => setGithub(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>LinkedIn</label>
                                <input
                                    className={inputClass}
                                    placeholder="linkedin url"
                                    value={linkedin}
                                    onChange={(e) => setLinkedin(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Twitter</label>
                                <input
                                    className={inputClass}
                                    placeholder="twitter url"
                                    value={twitter}
                                    onChange={(e) => setTwitter(e.target.value)}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className={labelClass}>GitHub Username</label>
                                <input
                                    className={inputClass}
                                    placeholder="e.g. torvalds"
                                    value={githubUsername}
                                    onChange={(e) => setGithubUsername(e.target.value)}
                                />
                                <p style={{ marginTop: 6, fontSize: 11, color: "#9ca3af" }}>
                                    Used to show your GitHub contribution chart on your public profile.
                                </p>
                            </div>

                            {/* Issue 1: Theme selector */}
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Theme</label>
                                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                                    {["default", "minimal", "dark"].map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setTheme(t)}
                                            className={`theme-pill${theme === t ? " selected" : ""}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <SaveButton
                                    type="submit"
                                    label="Save profile"
                                    isPending={updateMutation.isPending}
                                    isSuccess={updateMutation.isSuccess}
                                    isError={updateMutation.isError}
                                />
                                {updateMutation.isError && (
                                    <p className="mt-2 text-xs text-red-500">
                                        {updateMutation.error?.response?.data?.message || "Failed to save profile"}
                                    </p>
                                )}
                            </div>
                        </form>
                    </section>

                    {/* ── SKILLS (Issue 4) ─────────────────────────────── */}
                    <section
                        ref={sectionRefs.skills}
                        className={`mt-10 border-t border-border pt-10 ${sectionClass("skills")}`}
                        style={{ animationDelay: "200ms" }}
                        onClick={() => setActiveSection("skills")}
                    >
                        <h2 className="text-[15px] font-medium">Skills</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Add the technologies you work with.
                        </p>

                        <form onSubmit={handleAddSkill} className="mt-6 grid max-w-2xl gap-4 sm:grid-cols-3">
                            <div>
                                <label className={labelClass}>Name</label>
                                <input
                                    className={inputClass}
                                    placeholder="React"
                                    value={skillname}
                                    onChange={(e) => setSkillname(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Level</label>
                                <input
                                    className={inputClass}
                                    placeholder="Beginner / Expert"
                                    value={skilllevel}
                                    onChange={(e) => setSkilllevel(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Category</label>
                                <input
                                    className={inputClass}
                                    placeholder="Frontend"
                                    value={skillcategory}
                                    onChange={(e) => setSkillcategory(e.target.value)}
                                />
                            </div>
                            {/* Issue 4: yearsExp + featured */}
                            <div>
                                <label className={labelClass}>Years exp.</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    className={inputClass}
                                    placeholder="1–20"
                                    value={skillYearsExp}
                                    onChange={(e) => setSkillYearsExp(e.target.value)}
                                />
                            </div>
                            <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 4 }}>
                                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                                    <input
                                        type="checkbox"
                                        checked={skillFeatured}
                                        onChange={(e) => setSkillFeatured(e.target.checked)}
                                        style={{ width: 15, height: 15, cursor: "pointer" }}
                                    />
                                    Featured
                                </label>
                            </div>

                            <div className="sm:col-span-3">
                                <SaveButton
                                    type="submit"
                                    label="Add skill"
                                    isPending={addskillmutation.isPending}
                                    isSuccess={addskillmutation.isSuccess}
                                    isError={addskillmutation.isError}
                                />
                                {addskillmutation.isError && (
                                    <p className="mt-2 text-xs text-red-500">
                                        {addskillmutation.error?.response?.data?.message || "Failed to add skill"}
                                    </p>
                                )}
                            </div>
                        </form>

                        {skillsLoading && (
                            <p className="mt-4 text-sm text-muted-foreground">Loading skills…</p>
                        )}
                        {skillsError && (
                            <p className="mt-4 text-sm text-red-500">Failed to load skills.</p>
                        )}

                        {!skillsLoading && skills.length === 0 && (
                            <EmptyState
                                icon={
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                }
                                title="No skills added yet."
                                cta="Add your first skill →"
                                onCta={() => document.querySelector("[placeholder='React']")?.focus()}
                            />
                        )}

                        {skills.length > 0 && (
                            <div className="mt-6 max-w-2xl flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <div key={skill._id} className={`skill-pill item-animate${skill.featured ? " featured" : ""}`}>
                                        <span>
                                            {skill.name}
                                            {skill.level && <span style={{ opacity: 0.6 }}> · {skill.level}</span>}
                                            {skill.yearsExp && <span style={{ opacity: 0.6 }}> · {skill.yearsExp}y</span>}
                                        </span>
                                        <button
                                            className="skill-remove"
                                            onClick={() => confirmDeleteSkill(skill._id, skill.name)}
                                            title={`Remove ${skill.name}`}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* ── PROJECTS (Issues 4 + 5) ──────────────────────── */}
                    <section
                        ref={sectionRefs.projects}
                        className={`mt-10 border-t border-border pt-10 ${sectionClass("projects")}`}
                        style={{ animationDelay: "300ms" }}
                        onClick={() => setActiveSection("projects")}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <h2 className="text-[15px] font-medium">Projects</h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Showcase the things you have built.
                                </p>
                            </div>
                            <button
                                onClick={openAddProject}
                                className="rounded-[6px] border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted"
                            >
                                + Add project
                            </button>
                        </div>

                        {projectsLoading && (
                            <p className="mt-4 text-sm text-muted-foreground">Loading projects…</p>
                        )}
                        {projectsError && (
                            <p className="mt-4 text-sm text-red-500">Failed to load projects.</p>
                        )}

                        {!projectsLoading && projects.length === 0 && (
                            <EmptyState
                                icon={
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <path d="M3 9h18M9 21V9" />
                                    </svg>
                                }
                                title="No projects added yet."
                                cta="Add your first project →"
                                onCta={openAddProject}
                            />
                        )}

                        {projects.length > 0 && (
                            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                                {projects.map((project) => {
                                    const tags = Array.isArray(project.techstack)
                                        ? project.techstack
                                        : (project.techstack || "").split(",").map(s => s.trim()).filter(Boolean)

                                    return (
                                        <li key={project._id} className="project-card item-animate">
                                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                                        <h3 className="text-sm font-medium truncate">{project.title}</h3>
                                                        {project.liveurl ? (
                                                            <span className="project-status-badge badge-live">live</span>
                                                        ) : (
                                                            <span className="project-status-badge badge-wip">wip</span>
                                                        )}
                                                        {project.featured && (
                                                            <span className="project-status-badge" style={{ background: "#f5f5f5", color: "#374151" }}>★</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                                                        {project.description}
                                                    </p>
                                                    {tags.length > 0 && (
                                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                                                            {tags.map((t, i) => (
                                                                <span key={i} className="tech-tag">{t}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Hover-reveal edit + delete buttons (Issue 5 UI) */}
                                                <div className="project-actions" style={{ flexShrink: 0 }}>
                                                    {/* Pencil — edit */}
                                                    <button
                                                        onClick={() => openEditProject(project)}
                                                        title="Edit project"
                                                        className="rounded-[6px] p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                    </button>
                                                    {/* Trash — delete */}
                                                    <button
                                                        onClick={() => confirmDeleteProject(project._id, `"${project.title}"`)}
                                                        title="Delete project"
                                                        className="rounded-[6px] p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="3 6 5 6 21 6" />
                                                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                            <path d="M10 11v6M14 11v6" />
                                                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                    </section>
                </main>
            </div>

            {/* ── PROJECT MODAL (Issue 5: add + edit) ──────────────────── */}
            {showProjectModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    onClick={closeProjectModal}
                >
                    <div
                        className="modal-animate w-full max-w-lg rounded-[8px] border border-border bg-background p-8 shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                            <h2 className="text-[15px] font-medium">
                                {editingProject ? "Edit project" : "Add project"}
                            </h2>
                            <button
                                onClick={closeProjectModal}
                                className="rounded-[6px] p-1.5 text-muted-foreground hover:bg-muted"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <form
                            onSubmit={editingProject ? handleUpdateProject : handleAddProject}
                            className="grid gap-4 sm:grid-cols-2"
                        >
                            <div>
                                <label className={labelClass}>Title</label>
                                <input
                                    className={inputClass}
                                    placeholder="Project title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Tech stack</label>
                                <input
                                    className={inputClass}
                                    placeholder="React, Node (comma-separated)"
                                    value={techstack}
                                    onChange={(e) => setTechstack(e.target.value)}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Description</label>
                                <input
                                    className={inputClass}
                                    placeholder="What it does"
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Live URL</label>
                                <input
                                    className={inputClass}
                                    placeholder="https://"
                                    value={liveurl}
                                    onChange={(e) => setLiveurl(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>GitHub URL</label>
                                <input
                                    className={inputClass}
                                    placeholder="https://github.com/"
                                    value={githuburl}
                                    onChange={(e) => setGithuburl(e.target.value)}
                                />
                            </div>
                            {/* Issue 4: featured toggle for projects */}
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                                    <input
                                        type="checkbox"
                                        checked={projectFeatured}
                                        onChange={(e) => setProjectFeatured(e.target.checked)}
                                        style={{ width: 15, height: 15, cursor: "pointer" }}
                                    />
                                    Featured project
                                </label>
                            </div>
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Thumbnail</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setThumbnail(e.target.files[0])}
                                    className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-[6px] file:border file:border-border file:bg-background file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-muted"
                                />
                            </div>
                            <div className="sm:col-span-2" style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                <SaveButton
                                    type="submit"
                                    label={editingProject ? "Save changes" : "Add project"}
                                    isPending={projectMutation.isPending}
                                    isSuccess={projectMutation.isSuccess}
                                    isError={projectMutation.isError}
                                />
                                <button
                                    type="button"
                                    onClick={closeProjectModal}
                                    className="rounded-[6px] px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                                >
                                    Cancel
                                </button>
                            </div>
                            {projectMutation.isError && (
                                <div className="sm:col-span-2">
                                    <p className="text-xs text-red-500">
                                        {projectMutation.error?.response?.data?.message || "Failed to save project"}
                                    </p>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
