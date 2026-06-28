import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useProflie, useUpdateProfile } from "../hooks/useprofile"
import { useSkills, useAddSkill, useDeleteSkill } from "../hooks/useskill"
import { useProject, useAddProject, useUpdateProject, usedeleteProject } from "../hooks/useproject"

function Dashboard() {
    const username = localStorage.getItem("username");
    const navigate = useNavigate();
    //useState for profile
    const { data, isLoading } = useProflie(username);
    const updateMutation = useUpdateProfile();
    const [bio, setBio] = useState("")
    const [github, setGithub] = useState("")
    const [linkedin, setlinkedin] = useState("")
    const [twitter, settwitter] = useState("")
    //useState for skills
    const [skillname, setskillname] = useState("")
    const [skilllevel, setskilllevel] = useState("")
    const [skillcategory, setskillcategory] = useState("")
    //mutation
    const { data: skillsdata } = useSkills(username)
    const addskillmutation = useAddSkill(username);
    const deleteskillmutation = useDeleteSkill(username);
    //useState for project
    const [title, settitle] = useState("")
    const [desc, setdesc] = useState("")
    const [techstack, settechstack] = useState("")
    const [liveurl, setliveurl] = useState("")
    const [githuburl, setgithuburl] = useState("")
    const [thumbnail, setThumbnail] = useState(null)

    //mutation
    const { data: projectsdata } = useProject(username);
    const addprojectmutation = useAddProject(username)
    const updateprojectmutation = useUpdateProfile(username)
    const deleteprojectmutation = usedeleteProject(username)

    //function handler for profile
    function handleUpdate() {
        updateMutation.mutate({ bio, github, linkedin, twitter })
    }
    if (isLoading) return <p>Loading...</p>

    //function handler for skills
    function handleAddSkill() {
        addskillmutation.mutate({
            name: skillname,
            level: skilllevel,
            category: skillcategory
        })
    }
    function handleDeleteSkill(id) {
        deleteskillmutation.mutate(id)
    }

    //function handler for project
    function handleaddproject() {
            console.log("ADDING PROJECT")
    console.log("title:", title)
    console.log("thumbnail:", thumbnail)
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
            githuburl: githuburl
        })
    }

    function handledeleteproject(id) {
        deleteprojectmutation.mutate(id)
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <input placeholder="bio" onChange={(e) => setBio(e.target.value)} />
            <input placeholder="github" onChange={(e) => setGithub(e.target.value)} />
            <input placeholder="linkedin" onChange={(e) => setlinkedin(e.target.value)} />
            <input placeholder="twitter" onChange={(e) => settwitter(e.target.value)} />
            <button onClick={handleUpdate}>Save Profile</button>


            <div>
                <h2>Skills</h2>

                {/* Add skill form */}
                <input placeholder="Skill name"
                    onChange={(e) => setskillname(e.target.value)} />
                <input placeholder="Level (Beginner/Intermediate/Expert)"
                    onChange={(e) => setskilllevel(e.target.value)} />
                <input placeholder="Category (Frontend/Backend/Database)"
                    onChange={(e) => setskillcategory(e.target.value)} />
                <button onClick={handleAddSkill}>Add Skill</button>

                {/* Skills list */}
                {skillsdata?.data?.checkandgetallskills?.map(skill => (
                    <div key={skill._id}>
                        <p>{skill.name} → {skill.level}</p>
                        <button onClick={() => handleDeleteSkill(skill._id)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
            <div>
                <h2>Projects</h2>
                <input placeholder="Title" onChange={(e) => settitle(e.target.value)} />
                <input placeholder="Description" onChange={(e) => setdesc(e.target.value)} />
                <input placeholder="Tech Stack" onChange={(e) => settechstack(e.target.value)} />
                <input placeholder="Live URL" onChange={(e) => setliveurl(e.target.value)} />
                <input placeholder="GitHub URL" onChange={(e) => setgithuburl(e.target.value)} />
                <button onClick={handleaddproject}>Add Project</button>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnail(e.target.files[0])}
                />
                {projectsdata?.data?.projectdetailshow?.map(project => (
                    <div key={project._id}>
                        <p>{project.title}</p>
                        <p>{project.description}</p>
                        <button onClick={() => handledeleteproject(project._id)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>

    )




}

export default Dashboard