import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useProflie, useUpdateProfile } from "../hooks/useprofile"
import { useSkills, useAddSkill, useDeleteSkill, useUpdateSkill } from "../hooks/useskill"
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
    const [editingSkill, setEditingSkill] = useState(null)
    const [showSkillModal, setShowSkillModal] = useState(false)
    const [deletingSkillId, setDeletingSkillId] = useState(null)
    const [deletingProjectId, setDeletingProjectId] = useState(null)

    const { data: skillsdata, isLoading: skillsLoading, isError: skillsError } = useSkills(username)
    const addskillmutation = useAddSkill(username)
    const deleteskillmutation = useDeleteSkill(username)
    const updateSkillMutation = useUpdateSkill(username)

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
        const sections = ["stats", "profile", "skills", "projects", "analytics"]
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
        analytics: useRef(null),
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

    function openAddSkill() {
        setEditingSkill(null)
        setSkillname("")
        setSkilllevel("")
        setSkillcategory("")
        setSkillYearsExp("")
        setSkillFeatured(false)
        setShowSkillModal(true)
    }

    function openEditSkill(skill) {
        setEditingSkill(skill)
        setSkillname(skill.name || "")
        setSkilllevel(skill.level || "")
        setSkillcategory(skill.category || "")
        setSkillYearsExp(skill.yearsExp || "")
        setSkillFeatured(skill.featured || false)
        setShowSkillModal(true)
    }

    function closeSkillModal() {
        setShowSkillModal(false)
        setEditingSkill(null)
        setSkillname("")
        setSkilllevel("")
        setSkillcategory("")
        setSkillYearsExp("")
        setSkillFeatured(false)
    }

    function handleSaveSkill(e) {
        e?.preventDefault()
        if (editingSkill) {
            updateSkillMutation.mutate(
                {
                    id: editingSkill._id,
                    data: {
                        name: skillname,
                        level: skilllevel,
                        category: skillcategory,
                        yearsExp: skillYearsExp ? Number(skillYearsExp) : undefined,
                        featured: skillFeatured,
                    },
                },
                {
                    onSuccess: () => {
                        closeSkillModal()
                    },
                }
            )
        } else {
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
                        closeSkillModal()
                    },
                }
            )
        }
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

    function handleUpdateProject(e) {
        e?.preventDefault()
        const formData = new FormData()
        formData.append("title", title)
        formData.append("description", desc)
        formData.append("techstack", techstack)
        formData.append("liveurl", liveurl)
        formData.append("githuburl", githuburl)
        formData.append("featured", projectFeatured)
        if (thumbnail) formData.append("thumbnail", thumbnail)

        updateprojectmutation.mutate(
            {
                id: editingProject._id,
                data: formData,
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
                            { key: "analytics", label: "Analytics" },
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

                    {/* ── SKILLS ─────────────────────────────────────────── */}
                    <section
                        ref={sectionRefs.skills}
                        className={`mt-10 border-t border-border pt-10 ${sectionClass("skills")}`}
                        style={{ animationDelay: "200ms" }}
                        onClick={() => setActiveSection("skills")}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <h2 className="text-[15px] font-medium">Skills</h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Add the technologies you work with.
                                </p>
                            </div>
                            <button
                                onClick={openAddSkill}
                                className="rounded-[6px] border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted"
                            >
                                + Add skill
                            </button>
                        </div>

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
                                onCta={openAddSkill}
                            />
                        )}

                        {skills.length > 0 && (
                            <div className="mt-6 max-w-2xl flex flex-wrap gap-2">
                                {skills.map((skill) => {
                                    const isDeleting = deletingSkillId === skill._id;
                                    return (
                                        <div
                                            key={skill._id}
                                            className={`skill-pill item-animate${skill.featured ? " featured" : ""}${isDeleting ? " deleting" : ""}`}
                                        >
                                            {isDeleting ? (
                                                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 500 }}>Confirm?</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            deleteskillmutation.mutate(skill._id);
                                                            setDeletingSkillId(null);
                                                        }}
                                                        style={{ fontSize: 11, fontWeight: 600, color: "#ef4444", background: "none", border: "none", padding: 0, cursor: "pointer" }}
                                                    >
                                                        Yes
                                                    </button>
                                                    <span style={{ opacity: 0.3 }}>|</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeletingSkillId(null)}
                                                        style={{ fontSize: 11, fontWeight: 500, color: "#6b7280", background: "none", border: "none", padding: 0, cursor: "pointer" }}
                                                    >
                                                        No
                                                    </button>
                                                </span>
                                            ) : (
                                                <>
                                                    <span onClick={() => openEditSkill(skill)} style={{ cursor: "pointer" }}>
                                                        {skill.name}
                                                        {skill.level && <span style={{ opacity: 0.6 }}> · {skill.level}</span>}
                                                        {skill.yearsExp && <span style={{ opacity: 0.6 }}> · {skill.yearsExp}y</span>}
                                                    </span>
                                                    <div className="skill-actions">
                                                        {/* Edit icon */}
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditSkill(skill)}
                                                            title={`Edit ${skill.name}`}
                                                            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                                                        >
                                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                            </svg>
                                                        </button>
                                                        {/* Delete icon */}
                                                        <button
                                                            type="button"
                                                            className="skill-remove animate-none opacity-100 hover:opacity-100 p-0 m-0 ml-0 border-none bg-none h-auto w-auto"
                                                            onClick={() => setDeletingSkillId(skill._id)}
                                                            title={`Remove ${skill.name}`}
                                                            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
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

                                                {/* Hover-reveal edit + delete buttons or Inline Confirm */}
                                                {deletingProjectId === project._id ? (
                                                    <div style={{ display: "flex", gap: 6, alignItems: "center", background: "#fef2f2", padding: "4px 8px", borderRadius: 6, border: "1px solid #fca5a5", flexShrink: 0 }}>
                                                        <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 500 }}>Confirm?</span>
                                                        <button
                                                            onClick={() => {
                                                                deleteprojectmutation.mutate(project._id);
                                                                setDeletingProjectId(null);
                                                            }}
                                                            className="text-xs font-semibold text-red-600 hover:underline"
                                                            style={{ border: "none", background: "none", padding: 0, cursor: "pointer" }}
                                                        >
                                                            Yes
                                                        </button>
                                                        <span style={{ opacity: 0.3, fontSize: 11 }}>|</span>
                                                        <button
                                                            onClick={() => setDeletingProjectId(null)}
                                                            className="text-xs font-medium text-gray-500 hover:underline"
                                                            style={{ border: "none", background: "none", padding: 0, cursor: "pointer" }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
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
                                                            onClick={() => setDeletingProjectId(project._id)}
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
                                                )}
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                    </section>

                    {/* ── VISITOR INSIGHTS ─────────────────────────────── */}
                    <section
                        ref={sectionRefs.analytics}
                        className={`mt-10 border-t border-border pt-10 ${sectionClass("analytics")}`}
                        style={{ animationDelay: "400ms" }}
                        onClick={() => setActiveSection("analytics")}
                    >
                        <h2 className="text-[15px] font-medium">Visitor Insights</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            An analysis of your profile visitors based on user-agent detection.
                        </p>

                        <div className="analytics-grid mt-6 grid gap-6 md:grid-cols-3">
                            {/* Browsers Card */}
                            <div className="analytics-card">
                                <h3 className="analytics-card-title">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }}>
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="2" y1="12" x2="22" y2="12" />
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                    </svg>
                                    Browsers
                                </h3>
                                <div className="analytics-rows mt-4">
                                    {statsData?.browserbreakdown && statsData.browserbreakdown.length > 0 ? (
                                        statsData.browserbreakdown.map((b) => {
                                            const total = statsData.browserbreakdown.reduce((sum, item) => sum + item.count, 0);
                                            const percentage = total > 0 ? Math.round((b.count / total) * 100) : 0;
                                            return (
                                                <div key={b._id} className="analytics-row">
                                                    <div className="analytics-row-info">
                                                        <span className="analytics-name">{b._id || "Unknown"}</span>
                                                        <span className="analytics-value">{b.count} ({percentage}%)</span>
                                                    </div>
                                                    <div className="analytics-progress-bg">
                                                        <div className="analytics-progress-bar bg-browser" style={{ width: `${percentage}%` }} />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-xs text-muted-foreground">No browser data logged yet.</p>
                                    )}
                                </div>
                            </div>

                            {/* Operating Systems Card */}
                            <div className="analytics-card">
                                <h3 className="analytics-card-title">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }}>
                                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                        <line x1="8" y1="21" x2="16" y2="21" />
                                        <line x1="12" y1="17" x2="12" y2="21" />
                                    </svg>
                                    Operating Systems
                                </h3>
                                <div className="analytics-rows mt-4">
                                    {statsData?.osbreakdown && statsData.osbreakdown.length > 0 ? (
                                        statsData.osbreakdown.map((o) => {
                                            const total = statsData.osbreakdown.reduce((sum, item) => sum + item.count, 0);
                                            const percentage = total > 0 ? Math.round((o.count / total) * 100) : 0;
                                            return (
                                                <div key={o._id} className="analytics-row">
                                                    <div className="analytics-row-info">
                                                        <span className="analytics-name">{o._id || "Unknown"}</span>
                                                        <span className="analytics-value">{o.count} ({percentage}%)</span>
                                                    </div>
                                                    <div className="analytics-progress-bg">
                                                        <div className="analytics-progress-bar bg-os" style={{ width: `${percentage}%` }} />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-xs text-muted-foreground">No OS data logged yet.</p>
                                    )}
                                </div>
                            </div>

                            {/* Device Types Card */}
                            <div className="analytics-card">
                                <h3 className="analytics-card-title">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }}>
                                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                                        <line x1="12" y1="18" x2="12.01" y2="18" />
                                    </svg>
                                    Devices
                                </h3>
                                <div className="analytics-rows mt-4">
                                    {statsData?.devicebreakdown && statsData.devicebreakdown.length > 0 ? (
                                        statsData.devicebreakdown.map((d) => {
                                            const total = statsData.devicebreakdown.reduce((sum, item) => sum + item.count, 0);
                                            const percentage = total > 0 ? Math.round((d.count / total) * 100) : 0;
                                            return (
                                                <div key={d._id} className="analytics-row">
                                                    <div className="analytics-row-info">
                                                        <span className="analytics-name" style={{ textTransform: "capitalize" }}>{d._id || "Desktop"}</span>
                                                        <span className="analytics-value">{d.count} ({percentage}%)</span>
                                                    </div>
                                                    <div className="analytics-progress-bg">
                                                        <div className="analytics-progress-bar bg-device" style={{ width: `${percentage}%` }} />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-xs text-muted-foreground">No device data logged yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
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

            {/* ── SKILL MODAL ─────────────────────────────────────────── */}
            {showSkillModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    onClick={closeSkillModal}
                >
                    <div
                        className="modal-animate w-full max-w-lg rounded-[8px] border border-border bg-background p-8 shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                            <h2 className="text-[15px] font-medium">
                                {editingSkill ? "Edit skill" : "Add skill"}
                            </h2>
                            <button
                                onClick={closeSkillModal}
                                className="rounded-[6px] p-1.5 text-muted-foreground hover:bg-muted"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <form
                            onSubmit={handleSaveSkill}
                            className="grid gap-4 sm:grid-cols-2"
                        >
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
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                                    <input
                                        type="checkbox"
                                        checked={skillFeatured}
                                        onChange={(e) => setSkillFeatured(e.target.checked)}
                                        style={{ width: 15, height: 15, cursor: "pointer" }}
                                    />
                                    Featured skill
                                </label>
                            </div>

                            <div className="sm:col-span-2" style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8 }}>
                                <SaveButton
                                    type="submit"
                                    label={editingSkill ? "Save changes" : "Add skill"}
                                    isPending={editingSkill ? updateSkillMutation.isPending : addskillmutation.isPending}
                                    isSuccess={editingSkill ? updateSkillMutation.isSuccess : addskillmutation.isSuccess}
                                    isError={editingSkill ? updateSkillMutation.isError : addskillmutation.isError}
                                />
                                <button
                                    type="button"
                                    onClick={closeSkillModal}
                                    className="rounded-[6px] px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                                >
                                    Cancel
                                </button>
                            </div>
                            {(editingSkill ? updateSkillMutation : addskillmutation).isError && (
                                <div className="sm:col-span-2">
                                    <p className="text-xs text-red-500">
                                        {(editingSkill ? updateSkillMutation : addskillmutation).error?.response?.data?.message || "Failed to save skill"}
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
