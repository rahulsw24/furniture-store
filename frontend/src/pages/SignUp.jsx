import React from "react"
import { useForm } from "react-hook-form"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { User, Mail, Phone, Lock, ArrowRight } from "lucide-react"

const Signup = () => {
    const { register, handleSubmit } = useForm()
    const { signup } = useAuth()
    const navigate = useNavigate()

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
                        Join the unfnshed community
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    <InputGroup label="Full Name" icon={<User size={18} />}>
                        <input {...register("name")} placeholder="Rahul Swarup" className="pill-input" required />
                    </InputGroup>

                    <InputGroup label="Email Address" icon={<Mail size={18} />}>
                        <input {...register("email")} type="email" placeholder="rahul@example.com" className="pill-input" required />
                    </InputGroup>

                    <InputGroup label="Phone Number" icon={<Phone size={18} />}>
                        <input {...register("phone")} placeholder="+91 ..." className="pill-input" />
                    </InputGroup>

                    <InputGroup label="Password" icon={<Lock size={18} />}>
                        <input {...register("password")} type="password" placeholder="••••••••" className="pill-input" required />
                    </InputGroup>

                    <button type="submit" className="group w-full bg-black text-white py-5 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-gray-800 transition-all flex items-center justify-center gap-3 mt-8 shadow-xl shadow-black/5">
                        Create Account
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

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

// Small helper for the clean "Pill" look
const InputGroup = ({ label, icon, children }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 ml-5">{label}</label>
        <div className="relative">
            {React.cloneElement(children, {
                className: "w-full px-6 py-5 rounded-2xl border border-gray-100 bg-[#F9F9F9] text-sm focus:outline-none focus:border-black transition-all placeholder:text-gray-300"
            })}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300">{icon}</div>
        </div>
    </div>
)

export default Signup