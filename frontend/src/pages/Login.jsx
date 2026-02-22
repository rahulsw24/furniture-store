import React from "react"
import { useForm } from "react-hook-form"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Mail, Lock, ArrowRight } from "lucide-react"

const Login = () => {
    const { register, handleSubmit } = useForm()
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const redirectTo = location.state?.from || "/"

    const onSubmit = async data => {
        const success = await login(data.email, data.password)
        if (success) {
            navigate(redirectTo, { replace: true })
        } else {
            alert("Invalid credentials")
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

                {/* Form Section */}
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
                                className="w-full px-6 py-5 rounded-2xl border border-gray-100 bg-[#F9F9F9] text-sm focus:outline-none focus:border-black transition-all placeholder:text-gray-300"
                                required
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
                                className="w-full px-6 py-5 rounded-2xl border border-gray-100 bg-[#F9F9F9] text-sm focus:outline-none focus:border-black transition-all placeholder:text-gray-300"
                                required
                            />
                            <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="group w-full bg-black text-white py-5 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-gray-800 transition-all flex items-center justify-center gap-3 transform active:scale-[0.98] shadow-xl shadow-black/5 mt-8"
                    >
                        Sign In
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                </form>

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

export default Login