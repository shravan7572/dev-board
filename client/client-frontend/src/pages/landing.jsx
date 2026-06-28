import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { login, signup } from "../api/auth"

function Landing() {

    const [showModal, setshowModal] = useState(null);
    const [username, setusername] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [error, seterror] = useState("")

    const navigate = useNavigate();

    const loginmutation = useMutation({
        mutationFn: login,
        onSuccess: (res) => {
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("username", res.data.username)
            navigate("/dashboard")
        },
        onError: (err) => {
            seterror(err.response?.data?.message || "login failed")
        }
    })

   const signuomutation = useMutation({
    mutationFn: signup,
    onSuccess: (res) => {
        console.log("signup success:", res)  // ← add
        setshowModal("login")
        seterror("")
    },
    onError: (err) => {
        console.log("signup error:", err)    // ← add
        seterror(err.response?.data?.message || "signup failed")
    }
})

    function handlesignup() {
        signuomutation.mutate({
            username, email, password
        })
    }

    function handlelogin() {
        loginmutation.mutate({
            email, password
        })
    }

    return (
        <div>

            <h1>Dev board</h1>
            <br />


            <h1>Your developer profile</h1>
            <br />
            <span>One link. Everything.</span>
        <br />
        <button onClick={()=>setshowModal("login")}>login</button>
        <br />
        <button onClick={()=>setshowModal("signup")}>create your devboard</button>

        <br />

        {showModal ==="signup" &&(
            <>
            <input placeholder="username"
            value={username}
            onChange={(e)=>setusername(e.target.value)}/>

            <input placeholder="email"
            value={email}
            onChange={(e)=>setemail(e.target.value)}/>

            <input placeholder="passwrod"
            value={password}
            onChange={(e)=>setpassword(e.target.value)}/>


               <button onClick={handlesignup}>signup</button>   
            </>
        )}

         {showModal ==="login" &&(
            <>
            <input placeholder="email"
            value={email}
            onChange={(e)=>setemail(e.target.value)}/>

            <input placeholder="passwrod"
            value={password}
            onChange={(e)=>setpassword(e.target.value)}/>


               <button onClick={handlelogin}>login</button>   
            </>
        )}

        {error && <p style={{color: "red"}}>{error}</p>}


        </div>
    )
}
export default Landing