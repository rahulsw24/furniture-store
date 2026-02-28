import type { CollectionConfig } from 'payload'

export const Coupons: CollectionConfig = {
  slug: 'coupons',

  admin: {
    useAsTitle: 'code',
  },
  access: {
    // Allows the frontend/checkout to check if a coupon exists and is valid
    read: () => true,

    // Strictly restricted to Admins now that your role is fixed
    // This check is safer: it checks if a user exists AND if they are an admin
    create: ({ req: { user } }) => {
      if (!user) return false
      console.log('User Role', user.role)
      if (user.role === 'admin') return true
      return false
    },

    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },

  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
    },

    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Percentage', value: 'percentage' },
        { label: 'Fixed Amount', value: 'fixed' },
      ],
      required: true,
    },

    {
      name: 'value',
      type: 'number',
      required: true,
    },

    {
      name: 'min_order',
      type: 'number',
      label: 'Minimum order value',
    },

    {
      name: 'usage_limit',
      type: 'number',
    },

    {
      name: 'used_count',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },

    {
      name: 'expires_at',
      type: 'date',
    },

    {
      name: 'is_active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
