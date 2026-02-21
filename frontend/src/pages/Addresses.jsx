import React, { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { MapPin, Plus, Trash2, Check, ChevronLeft, Home, Briefcase, PlusCircle } from "lucide-react"
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

    useEffect(() => {
        if (user?.addresses) setAddresses(user.addresses)
    }, [user])

    const handleChange = e => {
        const { name, value, type, checked } = e.target
        setForm({ ...form, [name]: type === "checkbox" ? checked : value })
    }

    const saveAddress = async e => {
        e.preventDefault()
        let updated = [...addresses]
        if (form.is_default) updated = updated.map(a => ({ ...a, is_default: false }))
        updated.push(form)

        await fetch(`${API_URL}/api/users/${user.id}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ addresses: updated }),
        })
        await refreshUser()
        setForm(emptyForm)
        setShowForm(false)
    }

    const deleteAddress = async index => {
        const updated = addresses.filter((_, i) => i !== index)
        await fetch(`${API_URL}/api/users/${user.id}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ addresses: updated }),
        })
        await refreshUser()
    }

    const setDefault = async index => {
        const updated = addresses.map((a, i) => ({ ...a, is_default: i === index }))
        await fetch(`${API_URL}/api/users/${user.id}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ addresses: updated }),
        })
        await refreshUser()
    }

    return (
        <div className="bg-white min-h-[85vh]">
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
                            <p className="text-gray-500 font-medium italic">No addresses saved yet.</p>
                        ) : (
                            addresses.map((a, i) => (
                                <div key={i} className="group relative bg-white border border-gray-100 p-8 rounded-[2.5rem] hover:border-black transition-all">
                                    <div className="flex items-start gap-6">
                                        <div className="w-12 h-12 bg-[#F9F9F9] rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
                                            {a.label?.toLowerCase().includes('home') ? <Home size={20} /> : a.label?.toLowerCase().includes('office') ? <Briefcase size={20} /> : <MapPin size={20} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">
                                                    {a.label || "Address"} {a.is_default && <span className="ml-3 text-green-600 tracking-tighter normal-case">(Default)</span>}
                                                </h3>
                                                <button onClick={() => deleteAddress(i)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
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
                                            onClick={() => setDefault(i)}
                                            className="absolute bottom-8 right-8 text-[10px] font-bold uppercase tracking-widest underline underline-offset-4 decoration-gray-200 hover:decoration-black transition-all"
                                        >
                                            Set as default
                                        </button>
                                    )}
                                </div>
                            ))
                        )}

                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="flex items-center gap-3 px-8 py-4 bg-[#F9F9F9] rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                        >
                            {showForm ? <Minus size={16} /> : <Plus size={16} />}
                            {showForm ? "Cancel Entry" : "Add New Address"}
                        </button>
                    </div>

                    {/* --- RIGHT: FORM SECTION --- */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32">
                        {showForm ? (
                            <div className="bg-[#F9F9F9] rounded-[2.5rem] p-10 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                                <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 mb-8">New Address</h2>
                                <form onSubmit={saveAddress} className="space-y-6">
                                    <InputGroup label="Label (e.g. Home)" name="label" placeholder="Home" onChange={handleChange} />
                                    <InputGroup label="Full Name" name="full_name" placeholder="Rahul Swarup" required onChange={handleChange} />
                                    <InputGroup label="Phone" name="phone" placeholder="+91 ..." required onChange={handleChange} />
                                    <InputGroup label="Address Line 1" name="line1" placeholder="House No, Street" required onChange={handleChange} />
                                    <InputGroup label="Line 2 (Optional)" name="line2" placeholder="Floor, Landmark" onChange={handleChange} />

                                    <div className="grid grid-cols-2 gap-4">
                                        <InputGroup label="City" name="city" placeholder="Gurugram" required onChange={handleChange} />
                                        <InputGroup label="State" name="state" placeholder="Haryana" required onChange={handleChange} />
                                    </div>

                                    <div className="flex items-center justify-between pt-4">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" name="is_default" onChange={handleChange} className="w-4 h-4 rounded border-gray-300 focus:ring-black" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">Set as default</span>
                                        </label>
                                        <button className="px-10 py-5 bg-black text-white rounded-full text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-black/5 hover:bg-gray-800 transition-all active:scale-[0.98]">
                                            Save Address
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="p-12 text-center border-2 border-dashed border-gray-100 rounded-[3rem] text-gray-300">
                                <PlusCircle size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="text-sm font-medium">Select 'Add New Address' to create a new delivery location.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

/* Helper Component */
const InputGroup = ({ label, ...props }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 ml-5">{label}</label>
        <input {...props} className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-white text-sm focus:outline-none focus:border-black transition-all placeholder:text-gray-300" />
    </div>
)

export default Addresses