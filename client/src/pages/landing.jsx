import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { login, signup, verifyOtp } from "../api/auth"
import "./landing.css"
import LandingNav from "../components/landing/LandingNav"
import Hero from "../components/landing/Hero"
import UrlClaimer from "../components/landing/UrlClaimer"
import ProfilePreview from "../components/landing/ProfilePreview"
import FeatureBreakdown from "../components/landing/FeatureBreakdown"
import SocialProof from "../components/landing/SocialProof"
import DarkCta from "../components/landing/DarkCta"
import LandingFooter from "../components/landing/LandingFooter"

function Landing() {
  const [showModal, setshowModal] = useState(null)
  const [claimName, setClaimName] = useState("")
  const [username, setusername] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [otp, setotp] = useState("")
  const [error, seterror] = useState("")

  const navigate = useNavigate()

  const loginmutation = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("username", res.data.username)
      navigate("/dashboard")
    },
    onError: (err) => {
      const errMsg = err.response?.data?.message || "login failed";
      seterror(errMsg)
      if (err.response?.status === 403) {
        setshowModal("otp-verify")
      }
    },
  })

  const signuomutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      setshowModal("otp-verify")
      seterror("")
    },
    onError: (err) => {
      seterror(err.response?.data?.message || "signup failed")
    },
  })

  const otpverifyhydration = useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => {
      setshowModal("login")
      seterror("Email verified successfully! Please log in.")
      setotp("")
    },
    onError: (err) => {
      seterror(err.response?.data?.message || "Verification failed")
    },
  })

  function handlesignup() {
    signuomutation.mutate({ username, email, password })
  }

  function handlelogin() {
    loginmutation.mutate({ email, password })
  }

  function handleVerifyOtp() {
    otpverifyhydration.mutate({ email, otp })
  }

  function openModal(type) {
    seterror("")
    // prefill the signup username from whatever they typed into a claimer
    if (type === "signup" && claimName && !username) {
      setusername(claimName.trim().toLowerCase())
    }
    setshowModal(type)
  }

  function closeModal() {
    setshowModal(null)
    seterror("")
    setotp("")
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <LandingNav onClaim={() => openModal("signup")} />

      <main className="bg-gray-50">
        <Hero claimName={claimName} setClaimName={setClaimName} onClaim={() => openModal("signup")} />

        <div className="bg-white">
          <UrlClaimer name={claimName} setName={setClaimName} onClaim={() => openModal("signup")} />
        </div>

        <div id="profiles">
          <ProfilePreview name={claimName} />
        </div>

        <div id="features" className="bg-white">
          <FeatureBreakdown />
        </div>

        <SocialProof />

        <DarkCta name={claimName} setName={setClaimName} onClaim={() => openModal("signup")} />
      </main>

      <LandingFooter />

      {/* AUTH MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-[400px] rounded-[8px] border border-gray-200 bg-white p-8 shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 text-center">
              <div className="font-mono text-[15px] font-medium text-black">devboard</div>
              <h2 className="mt-2 text-[18px] font-medium text-black">
                {showModal === "signup" ? "Create your account" : showModal === "otp-verify" ? "Verify your email" : "Welcome back"}
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              {showModal === "otp-verify" ? (
                <>
                  <p className="text-center text-[13px] text-gray-500">
                    We sent a verification code to <strong>{email}</strong>.
                  </p>
                  <input
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => setotp(e.target.value)}
                    maxLength={6}
                    className="h-10 w-full rounded-[6px] border border-gray-200 px-3 text-center font-mono text-[16px] tracking-[0.25em] text-black placeholder:text-gray-400 focus:border-black focus:outline-none"
                  />

                  {error && <p className="text-[13px] text-red-500">{error}</p>}

                  <button
                    onClick={handleVerifyOtp}
                    disabled={otpverifyhydration.isPending}
                    className="mt-1 h-9 w-full rounded-[6px] bg-black text-[14px] font-medium text-white transition-colors duration-150 hover:bg-gray-800 disabled:opacity-60"
                  >
                    {otpverifyhydration.isPending ? "Verifying..." : "Verify OTP"}
                  </button>
                </>
              ) : (
                <>
                  {showModal === "signup" && (
                    <input
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setusername(e.target.value)}
                      className="h-9 w-full rounded-[6px] border border-gray-200 px-3 text-[14px] text-black placeholder:text-gray-400 focus:border-black focus:outline-none"
                    />
                  )}
                  <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    className="h-9 w-full rounded-[6px] border border-gray-200 px-3 text-[14px] text-black placeholder:text-gray-400 focus:border-black focus:outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    className="h-9 w-full rounded-[6px] border border-gray-200 px-3 text-[14px] text-black placeholder:text-gray-400 focus:border-black focus:outline-none"
                  />

                  {error && <p className="text-[13px] text-red-500">{error}</p>}

                  <button
                    onClick={showModal === "signup" ? handlesignup : handlelogin}
                    disabled={signuomutation.isPending || loginmutation.isPending}
                    className="mt-1 h-9 w-full rounded-[6px] bg-black text-[14px] font-medium text-white transition-colors duration-150 hover:bg-gray-800 disabled:opacity-60"
                  >
                    {showModal === "signup"
                      ? signuomutation.isPending
                        ? "Creating account..."
                        : "Create account"
                      : loginmutation.isPending
                        ? "Signing in..."
                        : "Log in"}
                  </button>
                </>
              )}
            </div>

            <p className="mt-5 text-center text-[13px] text-gray-500">
              {showModal === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => openModal("login")}
                    className="font-medium text-black hover:underline"
                  >
                    Log in
                  </button>
                </>
              ) : showModal === "otp-verify" ? (
                <>
                  Back to{" "}
                  <button
                    onClick={() => openModal("signup")}
                    className="font-medium text-black hover:underline"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  New to DevBoard?{" "}
                  <button
                    onClick={() => openModal("signup")}
                    className="font-medium text-black hover:underline"
                  >
                    Create an account
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Landing
