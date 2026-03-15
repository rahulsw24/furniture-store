import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react"

const Login = () => {
    const { register, handleSubmit } = useForm()
    const { login, loginWithGoogle } = useAuth() // loginWithGoogle added from AuthContext
    const navigate = useNavigate()
    const location = useLocation()

    const [isLoading, setIsLoading] = useState(false)

    const redirectTo = location.state?.from || "/"

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        try {
            await loginWithGoogle()
            // Supabase handles the redirect automatically
        } catch (error) {
            console.error(error)
            alert(error.message || "Google sign in failed")
            setIsLoading(false)
        }
    }

    const onSubmit = async data => {
        setIsLoading(true)
        try {
            const success = await login(data.email, data.password)
            if (success) {
                navigate(redirectTo, { replace: true })
            } else {
                alert("Invalid credentials")
                setIsLoading(false)
            }
        } catch (error) {
            console.error(error)
            alert("An error occurred during sign in")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-6 py-20 bg-white">
            <div className="w-full max-w-[440px]">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
                        Welcome back
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
                        Sign in to your account
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Google Login Button */}
                    <GoogleButton
                        text="Continue with Google"
                        onClick={handleGoogleLogin}
                        isLoading={isLoading}
                    />

                    {/* Minimalist Divider */}
                    <div className="relative flex items-center justify-center py-2">
                        <div className="flex-grow border-t border-gray-100"></div>
                        <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest bg-white px-2">
                            Or use email
                        </span>
                        <div className="flex-grow border-t border-gray-100"></div>
                    </div>

                    {/* Email Form Section */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 ml-5">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    {...register("email")}
                                    type="email"
                                    placeholder="email@example.com"
                                    className="w-full px-6 py-5 rounded-2xl border border-gray-100 bg-[#F9F9F9] text-sm focus:outline-none focus:border-black transition-all placeholder:text-gray-300 disabled:opacity-50"
                                    required
                                    disabled={isLoading}
                                />
                                <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-5 mr-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900">
                                    Password
                                </label>
                                <Link to="/forgot-password" size={10} className="text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-black transition-colors">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    {...register("password")}
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full px-6 py-5 rounded-2xl border border-gray-100 bg-[#F9F9F9] text-sm focus:outline-none focus:border-black transition-all placeholder:text-gray-300 disabled:opacity-50"
                                    required
                                    disabled={isLoading}
                                />
                                <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group w-full bg-black text-white py-5 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 transform active:scale-[0.98] shadow-xl shadow-black/5 mt-8 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    <span>Authenticating...</span>
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Link */}
                <div className="mt-12 pt-8 border-t border-gray-50 text-center">
                    <p className="text-[13px] text-gray-500 font-medium">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-black font-bold underline underline-offset-8 decoration-gray-200 hover:decoration-black transition-all ml-1">
                            Create one
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    )
}

/** * Reusable Google Button Component 
 */
const GoogleButton = ({ text, onClick, isLoading }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border border-gray-100 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
    >
        <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        {text}
    </button>
);

export default Login