import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useProflie, useUpdateProfile } from "../hooks/useprofile"
import { useSkills, useAddSkill, useDeleteSkill } from "../hooks/useskill"
import { useProject, useAddProject, useUpdateProject, usedeleteProject } from "../hooks/useproject"

const inputClass =
    "h-9 w-full rounded-[6px] border border-border px-3 text-sm placeholder:text-subtle focus:border-foreground focus:outline-none"
const labelClass = "mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-muted-foreground"

function Dashboard() {
    const username = localStorage.getItem("username")
    const navigate = useNavigate()
    //useState for profile
    const { data, isLoading, isError: profileError } = useProflie(username)
    const updateMutation = useUpdateProfile()
    const [bio, setBio] = useState("")
    const [github, setGithub] = useState("")
    const [linkedin, setlinkedin] = useState("")
    const [twitter, settwitter] = useState("")
    //useState for skills
    const [skillname, setskillname] = useState("")
    const [skilllevel, setskilllevel] = useState("")
    const [skillcategory, setskillcategory] = useState("")
    //mutation
    const { data: skillsdata, isLoading: skillsLoading, isError: skillsError } = useSkills(username)
    const addskillmutation = useAddSkill(username)
    const deleteskillmutation = useDeleteSkill(username)
    //useState for project
    const [title, settitle] = useState("")
    const [desc, setdesc] = useState("")
    const [techstack, settechstack] = useState("")
    const [liveurl, setliveurl] = useState("")
    const [githuburl, setgithuburl] = useState("")
    const [thumbnail, setThumbnail] = useState(null)

    //mutation
    const { data: projectsdata, isLoading: projectsLoading, isError: projectsError } = useProject(username)
    const addprojectmutation = useAddProject(username)
    const updateprojectmutation = useUpdateProject(username)
    const deleteprojectmutation = usedeleteProject(username)

    //function handler for profile
    function handleUpdate() {
        updateMutation.mutate({ bio, github, linkedin, twitter })
    }

    //function handler for skills
    function handleAddSkill() {
        addskillmutation.mutate({
            name: skillname,
            level: skilllevel,
            category: skillcategory,
        })
    }
    function handleDeleteSkill(id) {
        deleteskillmutation.mutate(id)
    }

    //function handler for project
    function handleaddproject() {
        const formData = new FormData()
        formData.append("title", title)
        formData.append("description", desc)
        formData.append("techstack", techstack)
        formData.append("liveurl", liveurl)
        formData.append("githuburl", githuburl)
        if (thumbnail) formData.append("thumbnail", thumbnail)

        addprojectmutation.mutate(formData)
    }

    function handleupdateproject() {
        updateprojectmutation.mutate({
            title: title,
            description: desc,
            techstack: techstack,
            liveurl: liveurl,
            githuburl: githuburl,
        })
    }

    function handledeleteproject(id) {
        deleteprojectmutation.mutate(id)
    }

    function handleLogout() {
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        navigate("/")
    }

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

    const skills = skillsdata?.data?.checkandgetallskills || []
    const projects = projectsdata?.data?.projectdetailshow || []

    const stats = [
        { label: "Skills", value: skills.length },
        { label: "Projects", value: projects.length },
        { label: "Profile", value: data?.data ? "Active" : "—" },
    ]

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* TOP BAR */}
            <header className="border-b border-border">
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
                    <h1 className="text-[15px] font-medium tracking-tight">Dashboard</h1>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate(`/${username}`)}
                            className="rounded-[6px] px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                            View profile
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

            <main className="mx-auto max-w-5xl px-6 py-10">
                {/* STAT CARDS */}
                <div className="grid gap-4 sm:grid-cols-3">
                    {stats.map((s) => (
                        <div key={s.label} className="rounded-[8px] border border-border p-4">
                            <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                {s.label}
                            </div>
                            <div className="mt-2 text-2xl font-medium">{s.value}</div>
                        </div>
                    ))}
                </div>

                {/* PROFILE */}
                <section className="mt-10 border-t border-border pt-10">
                    <h2 className="text-[15px] font-medium">Profile</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Update your bio and social links.
                    </p>
                    <div className="mt-6 grid max-w-2xl gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className={labelClass}>Bio</label>
                            <input className={inputClass} placeholder="A short bio" onChange={(e) => setBio(e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>GitHub</label>
                            <input className={inputClass} placeholder="github username or url" onChange={(e) => setGithub(e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>LinkedIn</label>
                            <input className={inputClass} placeholder="linkedin url" onChange={(e) => setlinkedin(e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>Twitter</label>
                            <input className={inputClass} placeholder="twitter url" onChange={(e) => settwitter(e.target.value)} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={handleUpdate}
                            className="rounded-[6px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-zinc-800"
                        >
                            Save profile
                        </button>
                    </div>
                </section>

                {/* SKILLS */}
                <section className="mt-10 border-t border-border pt-10">
                    <h2 className="text-[15px] font-medium">Skills</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Add the technologies you work with.
                    </p>
                    <div className="mt-6 grid max-w-2xl gap-4 sm:grid-cols-3">
                        <div>
                            <label className={labelClass}>Name</label>
                            <input className={inputClass} placeholder="React" onChange={(e) => setskillname(e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>Level</label>
                            <input className={inputClass} placeholder="Beginner / Expert" onChange={(e) => setskilllevel(e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>Category</label>
                            <input className={inputClass} placeholder="Frontend" onChange={(e) => setskillcategory(e.target.value)} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={handleAddSkill}
                            className="rounded-[6px] border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
                        >
                            Add skill
                        </button>
                    </div>

                    {skillsLoading && (
                        <p className="mt-4 text-sm text-muted-foreground">Loading skills...</p>
                    )}
                    {skillsError && (
                        <p className="mt-4 text-sm text-red-500">Failed to load skills.</p>
                    )}
                    {skills.length > 0 && (
                        <ul className="mt-6 max-w-2xl divide-y divide-border rounded-[8px] border border-border">
                            {skills.map((skill) => (
                                <li key={skill._id} className="flex items-center justify-between px-4 py-3">
                                    <span className="text-sm">
                                        <span className="font-medium">{skill.name}</span>
                                        <span className="text-muted-foreground"> — {skill.level}</span>
                                    </span>
                                    <button
                                        onClick={() => handleDeleteSkill(skill._id)}
                                        className="rounded-[6px] px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* PROJECTS */}
                <section className="mt-10 border-t border-border pt-10">
                    <h2 className="text-[15px] font-medium">Projects</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Showcase the things you have built.
                    </p>
                    <div className="mt-6 grid max-w-2xl gap-4 sm:grid-cols-2">
                        <div>
                            <label className={labelClass}>Title</label>
                            <input className={inputClass} placeholder="Project title" onChange={(e) => settitle(e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>Tech stack</label>
                            <input className={inputClass} placeholder="React, Node" onChange={(e) => settechstack(e.target.value)} />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={labelClass}>Description</label>
                            <input className={inputClass} placeholder="What it does" onChange={(e) => setdesc(e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>Live URL</label>
                            <input className={inputClass} placeholder="https://" onChange={(e) => setliveurl(e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>GitHub URL</label>
                            <input className={inputClass} placeholder="https://github.com/" onChange={(e) => setgithuburl(e.target.value)} />
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
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={handleaddproject}
                            className="rounded-[6px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-zinc-800"
                        >
                            Add project
                        </button>
                    </div>

                    {projectsLoading && (
                        <p className="mt-4 text-sm text-muted-foreground">Loading projects...</p>
                    )}
                    {projectsError && (
                        <p className="mt-4 text-sm text-red-500">Failed to load projects.</p>
                    )}
                    {projects.length > 0 && (
                        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                            {projects.map((project) => (
                                <li key={project._id} className="rounded-[8px] border border-border p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-sm font-medium">{project.title}</h3>
                                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                                {project.description}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handledeleteproject(project._id)}
                                            className="shrink-0 rounded-[6px] px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </main>
        </div>
    )
}

export default Dashboard
