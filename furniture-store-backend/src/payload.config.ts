import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { Orders } from './collections/Orders'
import { Coupons } from './collections/Coupons'
import { createOrder } from './api/create-order'
import { validateCoupon } from './api/validate-coupon'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { Inquiries } from './collections/Inquiries'
import { BusinessSettings } from '../src/collections/Settings'
import { Subscribers } from './collections/Subscribers'
import { syncSupabaseUser } from './api/sync-supabase'
import { PromoBar } from './collections/PromoBar'
import { razorpayWebhook } from './api/razorpay-webhook'
import brevoAdapter from './utils/brevoAdapter'
import { VariationTypes } from './collections/VariationTypes'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

console.log('DEBUG: Current Secret:', process.env.PAYLOAD_SECRET ? 'LOADED' : 'MISSING')
export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',

  admin: {
    user: Users.slug,
    autoLogin: false,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  email: brevoAdapter(),
  collections: [
    Users,
    Media,
    Categories,
    Products,
    Orders,
    Coupons,
    Inquiries,
    Subscribers,
    VariationTypes,
  ],
  globals: [BusinessSettings, PromoBar],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET!,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      max: 5,
    },
  }),
  cors: [
    'http://localhost:3000',
    process.env.PAYLOAD_PUBLIC_SERVER_URL || '',
    'http://127.0.0.1:5173',
    'http://localhost:5173',
    'https://www.boltless.in',
    'https://admin.boltless.in',
    'https://furniture-store-git-payload-dev-rahulsw24s-projects.vercel.app',
    'https://furniture-store-pi-drab.vercel.app',
    'https://furniture-store-backend.onrender.com',
  ].filter(Boolean),
  csrf: [
    'http://localhost:3000',
    process.env.PAYLOAD_PUBLIC_SERVER_URL || '',
    'http://localhost:5173',
    'https://www.boltless.in',
    'https://admin.boltless.in',
    'https://furniture-store-git-payload-dev-rahulsw24s-projects.vercel.app',
    'https://furniture-store-pi-drab.vercel.app',
    'https://furniture-store-backend.onrender.com',
  ].filter(Boolean),
  sharp,
  endpoints: [
    { path: '/create-order', method: 'post', handler: createOrder },
    { path: '/validate-coupon', method: 'post', handler: validateCoupon },
    // ADD THIS LINE
    { path: '/sync-supabase', method: 'post', handler: syncSupabaseUser },
    // ADD THIS LINE
    { path: '/razorpay-webhook', method: 'post', handler: razorpayWebhook },
  ],
  plugins: [],

  cookiePrefix: 'boltless',
})
