import { useNavigate } from "react-router-dom"

function NotFound404() {
    const navigate = useNavigate()

    function returntohome() {
        return navigate("/")
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
            <h1 className="text-[32px] font-medium tracking-tight">Page not found</h1>
            <p className="mt-2 text-sm text-muted-foreground">
                The page you are looking for does not exist.
            </p>
            <button
                onClick={returntohome}
                className="mt-6 rounded-[6px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-zinc-800"
            >
                Go back home
            </button>
        </div>
    )
}

export default NotFound404
