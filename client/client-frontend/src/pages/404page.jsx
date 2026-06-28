import { Navigate, useNavigate } from "react-router-dom"

function NotFound404(){
const navigate=useNavigate()
    function returntohome(){

        return navigate("/")
            
        }
    return(
        <div>
            <h1>404 page not found</h1>
            <button onClick={returntohome}>go back home</button>
        </div>
    )
}

export default NotFound404