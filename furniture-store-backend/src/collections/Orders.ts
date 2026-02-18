import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'id',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },

    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
      ],
    },

    {
      name: 'total_amount',
      type: 'number',
      required: true,
    },

    {
      name: 'payment_status',
      type: 'select',
      options: ['pending', 'paid', 'failed'],
      defaultValue: 'pending',
    },

    {
      name: 'order_status',
      type: 'select',
      options: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      defaultValue: 'pending',
    },

    {
      name: 'shipping_address',
      type: 'group',
      fields: [
        { name: 'line1', type: 'text' },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'state', type: 'text' },
        { name: 'postal_code', type: 'text' },
        { name: 'country', type: 'text' },
      ],
    },

    {
      name: 'created_at',
      type: 'date',
      defaultValue: () => new Date(),
    },
  ],
}
