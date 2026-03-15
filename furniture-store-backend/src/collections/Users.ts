import type { CollectionConfig } from 'payload'
import { inngest } from '../inngest/client' // Adjust path as needed

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // We remove 'cookieName' to fix the TS error.
    // Payload uses the 'cookiePrefix' from your main config automatically.
    tokenExpiration: 2592000,
    verify: false,

    // This is the property Payload uses for cookie-specific settings if needed,
    // but leaving it as an empty object (or omitting) uses the defaults from your main config.
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  access: {
    // Anyone can create an account (Sign up)
    create: () => true,

    // Admins see everyone; Users see only themselves
    read: ({ req: { user }, id }) => {
      if (user?.role === 'admin') return true
      // Use a boolean check instead of a query object
      if (user && user.id === id) return true
      return false
    },

    update: ({ req: { user }, id }) => {
      if (user?.role === 'admin') return true
      // Boolean check: Compare logged-in user ID to the ID in the URL
      // We use == or String() to ensure "8" matches 8
      if (user && id && String(user.id) === String(id)) return true
      return false
    },

    // Only Admins can delete users
    delete: ({ req: { user } }) => user?.role === 'admin',
  },

  admin: {
    useAsTitle: 'email',
  },
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create') {
          // Send event to Inngest for background processing
          // This allows role-specific emails (Admin vs Customer) to be handled in the background
          await inngest
            .send({
              name: 'user.signup',
              data: {
                email: doc.email,
                name: doc.name,
                role: doc.role,
              },
            })
            .catch((err) => console.error('Inngest trigger failed:', err))
        }
      },
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          // Find orders where the email matches AND there is no user linked
          const guestOrders = await req.payload.find({
            collection: 'orders',
            where: {
              and: [{ customer_email: { equals: doc.email } }, { user: { equals: null } }],
            },
            req, // 👈 PASS THE REQ (This shares the transaction)
          })

          if (guestOrders.totalDocs > 0) {
            await Promise.all(
              guestOrders.docs.map((order) =>
                req.payload.update({
                  collection: 'orders',
                  id: order.id,
                  data: { user: doc.id },
                  req, // 👈 CRITICAL: This prevents the Foreign Key error
                }),
              ),
            )
          }
        }
      },
    ],
  },

  fields: [
    // 👤 BASIC PROFILE
    {
      name: 'name',
      type: 'text',
      required: false,
    },

    {
      name: 'phone',
      type: 'text',
      required: false,
    },

    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },

    // 👑 ROLE SYSTEM
    {
      name: 'role',
      type: 'select',
      defaultValue: 'customer',
      options: [
        { label: 'Customer', value: 'customer' },
        { label: 'Admin', value: 'admin' },
      ],
      required: true,
      saveToJWT: true,
    },

    // 📍 ADDRESSES
    {
      name: 'addresses',
      type: 'array',
      label: 'Saved Addresses',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Home / Office',
        },

        {
          name: 'full_name',
          type: 'text',
          required: true,
        },

        {
          name: 'phone',
          type: 'text',
          required: true,
        },

        { name: 'line1', type: 'text', required: true },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text', required: true },
        { name: 'state', type: 'text', required: true },
        { name: 'postal_code', type: 'text', required: true },
        { name: 'country', type: 'text', defaultValue: 'India' },

        {
          name: 'is_default',
          type: 'checkbox',
          label: 'Default Address',
        },
      ],
    },

    // 🛒 LAST LOGIN (useful for analytics)
    {
      name: 'last_login',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
}
