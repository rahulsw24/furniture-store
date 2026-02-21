import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',

  auth: true,
  access: {
    // Anyone can create an account (Sign up)
    create: () => true,
    // Only the user themselves or an admin can read/update their profile
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return { id: { equals: user?.id } }
    },
  },

  admin: {
    useAsTitle: 'email',
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
