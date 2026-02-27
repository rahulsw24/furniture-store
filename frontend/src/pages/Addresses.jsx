import React, { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { MapPin, Plus, Trash2, ChevronLeft, Home, Briefcase, PlusCircle, Minus, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL

const emptyForm = {
    label: "",
    full_name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    is_default: false,
}

const Addresses = () => {
    const { user, refreshUser } = useAuth()
    const [addresses, setAddresses] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(emptyForm)

    // Loading States
    const [isSaving, setIsSaving] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)

    // Initial sync and global update listener
    useEffect(() => {
        if (user) {
            if (user.addresses) {
                setAddresses(user.addresses)
            } else {
                setAddresses([])
            }
            setInitialLoading(false)
        }
    }, [user])

    const handleChange = e => {
        const { name, value, type, checked } = e.target
        setForm({ ...form, [name]: type === "checkbox" ? checked : value })
    }

    const saveAddress = async e => {
        e.preventDefault()
        setIsSaving(true)
        try {
            let updated = [...addresses]

            if (form.is_default) {
                updated = updated.map(a => ({ ...a, is_default: false }))
            }

            const newEntry = { ...form, is_default: updated.length === 0 ? true : form.is_default }
            updated.push(newEntry)

            const res = await fetch(`${API_URL}/api/users/${user.id}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ addresses: updated }),
            })

            if (res.ok) {
                setAddresses(updated)
                await refreshUser()
                setForm(emptyForm)
                setShowForm(false)
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }
        } catch (err) {
            console.error("Failed to save address:", err)
        } finally {
            setIsSaving(false)
        }
    }

    const deleteAddress = async index => {
        setIsUpdating(true)
        const updated = addresses.filter((_, i) => i !== index)
        try {
            const res = await fetch(`${API_URL}/api/users/${user.id}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ addresses: updated }),
            })

            if (res.ok) {
                setAddresses(updated)
                await refreshUser()
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }
        } catch (err) {
            console.error("Failed to delete address:", err)
        } finally {
            setIsUpdating(false)
        }
    }

    const setDefault = async index => {
        setIsUpdating(true)
        const updated = addresses.map((a, i) => ({ ...a, is_default: i === index }))
        try {
            const res = await fetch(`${API_URL}/api/users/${user.id}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ addresses: updated }),
            })

            if (res.ok) {
                setAddresses(updated)
                await refreshUser()
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }
        } catch (err) {
            console.error("Failed to update default address:", err)
        } finally {
            setIsUpdating(false)
        }
    }

    // Full Page Initial Loader
    if (initialLoading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-black" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Loading your profile</p>
            </div>
        )
    }

    return (
        <div className="bg-white min-h-[85vh] relative">

            {/* ACTION OVERLAY LOADER (For Delete/Set Default) */}
            {isUpdating && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-[2px] animate-in fade-in duration-300">
                    <div className="bg-black text-white p-6 rounded-[2rem] shadow-2xl flex items-center gap-4">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Updating Addresses...</span>
                    </div>
                </div>
            )}

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 md:py-20">

                {/* --- HEADER --- */}
                <div className="mb-16">
                    <Link to="/account" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all mb-8 group">
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Account Dashboard
                    </Link>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-4">Location Management</p>
                    <h1 className="text-5xl md:text-6xl font-serif text-gray-900">Your Addresses</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* --- LEFT: ADDRESS LIST --- */}
                    <div className="lg:col-span-7 space-y-6">
                        {addresses.length === 0 ? (
                            <div className="py-20 text-center border border-dashed border-gray-200 rounded-[3rem]">
                                <p className="text-gray-400 font-medium italic">No addresses saved yet.</p>
                            </div>
                        ) : (
                            addresses.map((a, i) => (
                                <div key={i} className={`group relative bg-white border p-8 rounded-[2.5rem] transition-all ${a.is_default ? 'border-black shadow-sm' : 'border-gray-100 hover:border-gray-300'}`}>
                                    <div className="flex items-start gap-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${a.is_default ? 'bg-black text-white' : 'bg-[#F9F9F7] text-gray-400'}`}>
                                            {a.label?.toLowerCase().includes('home') ? <Home size={20} /> : a.label?.toLowerCase().includes('office') ? <Briefcase size={20} /> : <MapPin size={20} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">
                                                    {a.label || "Address"} {a.is_default && <span className="ml-3 text-green-600 tracking-tighter normal-case">(Primary)</span>}
                                                </h3>
                                                <button
                                                    disabled={isUpdating}
                                                    onClick={() => deleteAddress(i)}
                                                    className="p-2 text-gray-300 hover:text-red-500 transition-colors disabled:opacity-30"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <p className="font-bold text-gray-900 mb-1">{a.full_name}</p>
                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                {a.line1}, {a.line2 && `${a.line2}, `} <br />
                                                {a.city}, {a.state} {a.postal_code}, {a.country}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-4 font-medium">{a.phone}</p>
                                        </div>
                                    </div>
                                    {!a.is_default && (
                                        <button
                                            disabled={isUpdating}
                                            onClick={() => setDefault(i)}
                                            className="absolute bottom-8 right-8 text-[10px] font-bold uppercase tracking-widest underline underline-offset-4 decoration-gray-200 hover:decoration-black transition-all disabled:opacity-30"
                                        >
                                            Set as default
                                        </button>
                                    )}
                                </div>
                            ))
                        )}

                        <button
                            onClick={() => {
                                setShowForm(!showForm)
                                if (!showForm) window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            className="flex items-center gap-3 px-10 py-5 bg-[#1A1A1A] text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/5"
                        >
                            {showForm ? <Minus size={16} /> : <Plus size={16} />}
                            {showForm ? "Cancel Entry" : "Add New Address"}
                        </button>
                    </div>

                    {/* --- RIGHT: FORM SECTION --- */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32">
                        {showForm ? (
                            <div className="bg-[#F9F9F9] rounded-[2.5rem] p-10 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                                <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 mb-8">New Delivery Location</h2>
                                <form onSubmit={saveAddress} className="space-y-6">
                                    <InputGroup label="Label (e.g. Home, Work)" name="label" value={form.label} placeholder="Home" onChange={handleChange} />
                                    <InputGroup label="Full Name" name="full_name" value={form.full_name} placeholder="Your Name" required onChange={handleChange} />
                                    <InputGroup label="Phone" name="phone" value={form.phone} placeholder="+91 ..." required onChange={handleChange} />
                                    <InputGroup label="Address Line 1" name="line1" value={form.line1} placeholder="House No, Street" required onChange={handleChange} />
                                    <InputGroup label="Line 2 (Optional)" name="line2" value={form.line2} placeholder="Floor, Landmark" onChange={handleChange} />

                                    <div className="grid grid-cols-2 gap-4">
                                        <InputGroup label="City" name="city" value={form.city} placeholder="City" required onChange={handleChange} />
                                        <InputGroup label="State" name="state" value={form.state} placeholder="State" required onChange={handleChange} />
                                    </div>
                                    <InputGroup label="Postal Code" name="postal_code" value={form.postal_code} placeholder="Pincode" required onChange={handleChange} />

                                    <div className="flex items-center justify-between pt-4">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" name="is_default" checked={form.is_default} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">Set as primary</span>
                                        </label>
                                        <button
                                            disabled={isSaving || isUpdating}
                                            className="px-10 py-5 bg-black text-white rounded-full text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-black/5 hover:bg-gray-800 transition-all flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {isSaving ? <Loader2 size={14} className="animate-spin" /> : "Save Location"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="p-12 text-center border-2 border-dashed border-gray-100 rounded-[3rem] text-gray-300 flex flex-col items-center justify-center min-h-[300px]">
                                <PlusCircle size={48} className="mb-4 opacity-20" />
                                <p className="text-sm font-medium max-w-[200px] leading-relaxed">Select 'Add New Address' to store a delivery location.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const InputGroup = ({ label, ...props }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 ml-5">{label}</label>
        <input {...props} className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-white text-sm focus:outline-none focus:border-black transition-all placeholder:text-gray-200 text-black" />
    </div>
)

export default Addresses