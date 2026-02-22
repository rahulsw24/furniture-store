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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categories, Products, Orders, Coupons],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  cors: [
    'http://localhost:5173', // Vite default
    'http://127.0.0.1:5173',
    'https://furniture-store-git-payload-dev-rahulsw24s-projects.vercel.app',
    'https://furniture-store-pi-drab.vercel.app',
  ],
  csrf: [
    'http://localhost:5173',
    'https://furniture-store-git-payload-dev-rahulsw24s-projects.vercel.app',
    'https://furniture-store-pi-drab.vercel.app',
  ],
  sharp,
  endpoints: [
    { path: '/create-order', method: 'post', handler: createOrder },
    { path: '/validate-coupon', method: 'post', handler: validateCoupon },
  ],
  plugins: [],
})
