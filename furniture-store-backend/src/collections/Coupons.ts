import type { CollectionConfig } from 'payload'

export const Coupons: CollectionConfig = {
  slug: 'coupons',

  admin: {
    useAsTitle: 'code',
  },
  access: {
    // Allows anyone to see the list of active coupons on the Checkout page
    read: () => true,

    // Keep these restricted to Admins only
    create: ({ req: { user } }) => user?.role === 'admin',
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
