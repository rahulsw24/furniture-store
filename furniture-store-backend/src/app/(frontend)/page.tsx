import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'
import config from '@payload-config'

// Define types for our sub-components
interface StatusCardProps {
  label: string
  value: string
  detail: string | null | undefined
}

interface AdminLinkProps {
  title: string
  desc: string
  href: string
}

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <div className="min-h-screen bg-[#F8F8F7] text-[#1A1A1A] font-sans p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* --- DASHBOARD HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                System Active • Product Engine
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight">
              {user?.email ? `Welcome, ${user.email.split('@')[0]}` : 'Admin Gateway'}
            </h1>
          </div>

          <a
            href={payloadConfig.routes.admin}
            className="inline-flex items-center justify-center px-8 py-4 bg-black text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-[0.98] shadow-xl shadow-black/10"
          >
            Open Admin Panel →
          </a>
        </header>

        {/* --- STATS / STATUS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatusCard
            label="Environment"
            value={process.env.NODE_ENV || 'development'}
            detail="Current Build Mode"
          />
          <StatusCard
            label="Auth Status"
            value={user ? 'Authenticated' : 'Public Access'}
            detail={user?.email || 'Please log in for full access'}
          />
          <StatusCard label="Database" value="Connected" detail="Payload CMS Instance" />
        </div>

        {/* --- CONFIGURATION OVERVIEW --- */}
        <section className="bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">
            Project Shortcuts
          </h3>

          <div className="space-y-4">
            <AdminLink
              title="Content Collections"
              desc="Manage your furniture products, categories, and inventory."
              href={`${payloadConfig.routes.admin}/collections/products`}
            />
            <AdminLink
              title="Media Library"
              desc="Upload and optimize product lifestyle images."
              href={`${payloadConfig.routes.admin}/collections/media`}
            />
            <AdminLink
              title="Global Settings"
              desc="Edit sitewide metadata, SEO, and navigation headers."
              href={`${payloadConfig.routes.admin}/globals/settings`}
            />
          </div>
        </section>

        <footer className="mt-12 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
            Built for the Modern Indian Home • 2026
          </p>
        </footer>
      </div>
    </div>
  )
}

/* --- SUB-COMPONENTS --- */

const StatusCard = ({ label, value, detail }: StatusCardProps) => (
  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 block mb-2">
      {label}
    </span>
    <div className="text-xl font-serif text-gray-900 mb-1 capitalize">{value}</div>
    <div className="text-[10px] text-gray-400 font-medium">{detail}</div>
  </div>
)

const AdminLink = ({ title, desc, href }: AdminLinkProps) => (
  <a
    href={href}
    className="group flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-[#FBFBFA] transition-all"
  >
    <div>
      <h4 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-black">{title}</h4>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
    <span className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all mt-4 md:mt-0">
      →
    </span>
  </a>
)
