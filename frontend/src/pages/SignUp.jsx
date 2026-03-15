import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { User, Mail, Phone, Lock, ArrowRight, Loader2 } from "lucide-react"

const Signup = () => {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm()
    const { signup, loginWithGoogle } = useAuth() // 👈 Added loginWithGoogle from context
    const navigate = useNavigate()

    const handleGoogleSignup = async () => {
        try {
            await loginWithGoogle()
            // Supabase handles the redirect automatically
        } catch (error) {
            console.error(error)
            alert(error.message || "Google signup failed")
        }
    }

    const onSubmit = async data => {
        try {
            const success = await signup(data)
            if (success) {
                navigate("/")
            }
        } catch (err) {
            alert(err.message || "Signup failed")
        }
    }

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-6 py-20 bg-white">
            <div className="w-full max-w-[440px]">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
                        Create account
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
                        Join the BoltLess community
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Google Signup Button */}
                    <GoogleButton
                        text="Sign up with Google"
                        onClick={handleGoogleSignup}
                        isLoading={isSubmitting}
                    />

                    {/* Minimalist Divider */}
                    <div className="relative flex items-center justify-center py-2">
                        <div className="flex-grow border-t border-gray-100"></div>
                        <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest bg-white px-2">
                            Or use email
                        </span>
                        <div className="flex-grow border-t border-gray-100"></div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <InputGroup label="Full Name" icon={<User size={18} />}>
                            <input {...register("name")} placeholder="Rahul Swarup" required />
                        </InputGroup>

                        <InputGroup label="Email Address" icon={<Mail size={18} />}>
                            <input {...register("email")} type="email" placeholder="rahul@example.com" required />
                        </InputGroup>

                        <InputGroup label="Phone Number" icon={<Phone size={18} />}>
                            <input {...register("phone")} placeholder="+91 ..." />
                        </InputGroup>

                        <InputGroup label="Password" icon={<Lock size={18} />}>
                            <input {...register("password")} type="password" placeholder="••••••••" required />
                        </InputGroup>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`group w-full bg-black text-white py-5 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 mt-8 shadow-xl shadow-black/5 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    PROCESSING <Loader2 size={14} className="animate-spin" />
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-50 text-center">
                    <p className="text-[13px] text-gray-500 font-medium">
                        Already have an account?{" "}
                        <Link to="/login" className="text-black font-bold underline underline-offset-8 decoration-gray-200 hover:decoration-black transition-all ml-1">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

/**
 * Reusable Google Button Component
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

const InputGroup = ({ label, icon, children }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 ml-5">{label}</label>
        <div className="relative">
            {React.cloneElement(children, {
                className: "w-full px-6 py-5 rounded-2xl border border-gray-100 bg-[#F9F9F9] text-sm focus:outline-none focus:border-black transition-all placeholder:text-gray-300 disabled:opacity-50"
            })}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300">{icon}</div>
        </div>
    </div>
)

export default Signup