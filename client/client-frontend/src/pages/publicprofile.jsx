import { useParams, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { useProflie } from "../hooks/useprofile"
import { useSkills } from "../hooks/useskill"
import { useProject } from "../hooks/useproject"
import { useReactions, useToggleReaction } from "../hooks/usereaction"
import { trackView, getStats } from "../api/analytics"
import { sendContact as contactUser } from "../api/contact"
import { getgithubdata } from "../api/github"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import axios from "axios"

function PublicProfile() {
    const { username } = useParams()
    const navigate = useNavigate()

    // states for contact form
    const [name, setName]       = useState("")
    const [email, setEmail]     = useState("")
    const [message, setMessage] = useState("")
    const [sent, setSent]       = useState(false)

    // fetch all data
    const { data: profileData, isLoading } = useProflie(username)
    const { data: skillsData }             = useSkills(username)
    const { data: projectsData }           = useProject(username)
    const { data: reactionsData }          = useReactions(username)

    // fetch github data
    const profile = profileData?.data?.checktheusername
    const { data: githubData } = useQuery({
        queryKey: ["github", profile?.github],
        queryFn: () => axios.get(`${import.meta.env.VITE_BASE_URL}/api/fetch/${profile?.github}`),
        enabled: !!profile?.github,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false
    })

    // track view when page loads
    useEffect(() => {
        if(username) {
            axios.post(`${import.meta.env.VITE_BASE_URL}/api/view/${username}`)
        }
    }, [username])

    // reactions
    const toggleReaction = useToggleReaction(username)

    // contact mutation
    const contactMutation = useMutation({
        mutationFn: () => axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/contact/${username}`,
            { name, email, message }
        ),
        onSuccess: () => setSent(true)
    })

    if(isLoading) return <p>Loading...</p>
    if(!profile)  return <p>Profile not found!</p>

    const skills   = skillsData?.data?.checkandgetallskills   || []
    const projects = projectsData?.data?.projectdetailshow    || []
    const reactions = reactionsData?.data?.counts             || {}
    const github   = githubData?.data                         || null

    return (
        <div>
            {/* NAVBAR */}
            <nav>
                <div onClick={() => navigate("/")}>DevBoard</div>
                <button onClick={() => navigate("/")}>
                    Create your DevBoard
                </button>
            </nav>

            {/* PROFILE */}
            <div>
                {profile.photo && <img src={profile.photo} alt="avatar" width={100} />}
                <h1>{profile.name || profile.username}</h1>
                <p>@{profile.username}</p>
                <p>{profile.bio}</p>
                <div>
                    {profile.github   && <a href={profile.github}   target="_blank">GitHub</a>}
                    {profile.linkedin && <a href={profile.linkedin} target="_blank">LinkedIn</a>}
                    {profile.twitter  && <a href={profile.twitter}  target="_blank">Twitter</a>}
                </div>
            </div>

            {/* REACTIONS */}
            <div>
                <button onClick={() => toggleReaction.mutate("fire")}>
                    🔥 {reactions.fire || 0}
                </button>
                <button onClick={() => toggleReaction.mutate("heart")}>
                    ❤️ {reactions.heart || 0}
                </button>
                <button onClick={() => toggleReaction.mutate("clap")}>
                    👏 {reactions.clap || 0}
                </button>
            </div>

            {/* GITHUB */}
            {github && (
                <div>
                    <h2>GitHub</h2>
                    <p>Public Repos: {github.public_repos}</p>
                    <p>Followers: {github.followers}</p>
                    <img
                        src={`https://ghchart.rshah.org/${profile.github}`}
                        alt="GitHub contributions"
                        style={{width: "100%"}}
                    />
                    <div>
                        {github.repos?.map(repo => (
                            <div key={repo.name}>
                                <a href={repo.url} target="_blank">
                                    {repo.name}
                                </a>
                                <p>{repo.description}</p>
                                <p>⭐{repo.stars} · {repo.language}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SKILLS */}
            {skills.length > 0 && (
                <div>
                    <h2>Skills</h2>
                    {skills.map(skill => (
                        <span key={skill._id}>
                            {skill.name} — {skill.level}
                        </span>
                    ))}
                </div>
            )}

            {/* PROJECTS */}
            {projects.length > 0 && (
                <div>
                    <h2>Projects</h2>
                    {projects.map(project => (
                        <div key={project._id}>
                            {project.thumbnail && (
                                <img src={project.thumbnail} alt={project.title} width={200} />
                            )}
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <p>{project.techstack}</p>
                            {project.liveurl && (
                                <a href={project.liveurl} target="_blank">Live</a>
                            )}
                            {project.githuburl && (
                                <a href={project.githuburl} target="_blank">GitHub</a>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* CONTACT */}
            <div>
                <h2>Contact {profile.username}</h2>
                {sent ? (
                    <p>Message sent successfully! </p>
                ) : (
                    <div>
                        <input
                            placeholder="Your name"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            placeholder="Your email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <textarea
                            placeholder="Your message"
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button onClick={() => contactMutation.mutate()}>
                            {contactMutation.isPending ? "Sending..." : "Send Message"}
                        </button>
                    </div>
                )}
            </div>

        </div>
    )
}

export default PublicProfile