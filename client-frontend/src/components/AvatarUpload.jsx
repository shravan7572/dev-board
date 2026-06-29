import { useRef, useState } from "react"
import { uploadAvatar } from "../api/profile"

/**
 * AvatarUpload
 * - Click the circle to open a hidden file input
 * - Shows a preview immediately on file pick
 * - Calls POST /api/profile/upload-avatar with FormData
 * - Displays uploading / success / error states inline
 */
export default function AvatarUpload({ currentPhoto, username, onSuccess }) {
    const inputRef = useRef(null)
    const [preview, setPreview] = useState(currentPhoto || null)
    const [status, setStatus] = useState("idle") // idle | uploading | success | error
    const [errorMsg, setErrorMsg] = useState("")

    function handleClick() {
        inputRef.current?.click()
    }

    async function handleFileChange(e) {
        const file = e.target.files?.[0]
        if (!file) return

        // Immediate local preview
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)
        setStatus("uploading")
        setErrorMsg("")

        try {
            const res = await uploadAvatar(file)
            setStatus("success")
            // Pass the real Cloudinary URL up to the parent so the profile card updates
            onSuccess?.(res.data.photo)
            // Fade success indicator back to idle after 2s
            setTimeout(() => setStatus("idle"), 2000)
        } catch (err) {
            setStatus("error")
            setErrorMsg(err.response?.data?.message || "Upload failed")
            // Revert preview to original on error
            setPreview(currentPhoto || null)
        }
    }

    const initials = username
        ? username.slice(0, 2).toUpperCase()
        : "?"

    return (
        <div className="avatar-upload-wrap">
            {/* Hidden native file input */}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
            />

            {/* Clickable avatar circle */}
            <button
                type="button"
                onClick={handleClick}
                disabled={status === "uploading"}
                className="avatar-circle"
                title="Click to change avatar"
            >
                {preview ? (
                    <img
                        src={preview}
                        alt="Avatar preview"
                        className="avatar-img"
                    />
                ) : (
                    <span className="avatar-initials">{initials}</span>
                )}

                {/* Overlay shown on hover */}
                <span className="avatar-overlay">
                    {status === "uploading" ? (
                        <span className="avatar-spinner" />
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                    )}
                </span>
            </button>

            {/* Status text below avatar */}
            <div className="avatar-status-row">
                {status === "uploading" && (
                    <span className="avatar-status-uploading">Uploading…</span>
                )}
                {status === "success" && (
                    <span className="avatar-status-success">
                        ✓ Photo updated
                    </span>
                )}
                {status === "error" && (
                    <span className="avatar-status-error">{errorMsg}</span>
                )}
                {status === "idle" && (
                    <span className="avatar-status-hint">Click to upload photo</span>
                )}
            </div>
        </div>
    )
}
