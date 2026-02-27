import React, { useState } from "react" // Added useState
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"
import { Package, MapPin, LogOut, User as UserIcon, ChevronRight, Loader2 } from "lucide-react" // Added Loader2

const Account = () => {
    const { user, logout } = useAuth()
    const [isLoggingOut, setIsLoggingOut] = useState(false) // New state

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            await logout()
            // The AuthContext usually handles redirection, but we keep the loader 
            // active until the component unmounts.
        } catch (err) {
            console.error("Logout failed", err)
            setIsLoggingOut(false)
        }
    }

    return (
        <div className="bg-white min-h-[85vh]">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-20">

                {/* --- HEADER SECTION --- */}
                <div className="mb-16 border-b border-gray-100 pb-12">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-4">
                        Dashboard
                    </p>
                    <h1 className="text-5xl md:text-6xl font-serif text-gray-900">
                        My Account
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* --- LEFT: USER OVERVIEW PILL --- */}
                    <div className="lg:col-span-4 bg-[#F9F9F9] rounded-[2.5rem] p-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <UserIcon size={32} className="text-gray-300" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">{user?.name || "Member"}</h2>
                        <p className="text-sm text-gray-500 mb-8">{user?.email}</p>

                        <button className="w-full py-4 bg-white border border-gray-200 rounded-full text-[10px] font-bold uppercase tracking-widest hover:border-black transition-all">
                            Edit Profile
                        </button>
                    </div>

                    {/* --- RIGHT: NAVIGATION GRID --- */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">

                        <AccountCard
                            to="/orders"
                            icon={<Package size={24} />}
                            title="Order History"
                            desc="Track, return, or buy items again"
                        />

                        <AccountCard
                            to="/addresses"
                            icon={<MapPin size={24} />}
                            title="Addresses"
                            desc="Edit, remove or set default addresses"
                        />

                        {/* --- LOGOUT AS A DISTINCT ACTION --- */}
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className={`group p-8 rounded-[2rem] border border-gray-100 text-left transition-all flex flex-col justify-between min-h-[200px] ${isLoggingOut ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-red-100 hover:bg-red-50/30'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isLoggingOut ? 'bg-white text-gray-400' : 'bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-red-500'
                                }`}>
                                {isLoggingOut ? <Loader2 size={24} className="animate-spin" /> : <LogOut size={24} />}
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold mb-2 transition-colors ${isLoggingOut ? 'text-gray-400' : 'text-gray-900 group-hover:text-red-600'
                                    }`}>
                                    {isLoggingOut ? "Signing out..." : "Logout"}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {isLoggingOut ? "Ending your session safely" : "Sign out of your current session"}
                                </p>
                            </div>
                        </button>

                    </div>
                </div>
            </div>
        </div>
    )
}

/* --- REUSABLE ACCOUNT CARD --- */
const AccountCard = ({ to, icon, title, desc }) => (
    <Link to={to} className="group p-8 rounded-[2rem] border border-gray-100 hover:border-black hover:shadow-xl hover:shadow-gray-500/5 transition-all flex flex-col justify-between min-h-[200px] bg-white">
        <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-[#F9F9F9] rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
                {icon}
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
        </div>
        <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
        </div>
    </Link>
)

export default Account