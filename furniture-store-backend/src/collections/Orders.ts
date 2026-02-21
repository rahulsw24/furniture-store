import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    create: () => true,
    read: ({ req }) => !!req.user, // users can read their orders
  },

  admin: {
    useAsTitle: 'order_number',
    defaultColumns: [
      'order_number',
      'user',
      'total',
      'payment_status',
      'order_status',
      'createdAt',
    ],
  },

  timestamps: true, // adds createdAt + updatedAt automatically

  fields: [
    /* ================= USER ================= */

    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false, // allow guest checkout later
    },

    {
      name: 'customer_email',
      type: 'email',
      required: true,
    },

    {
      name: 'customer_phone',
      type: 'text',
    },

    /* ================= ORDER ID ================= */

    {
      name: 'order_number',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar' },
    },

    /* ================= ITEMS ================= */

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

        // Snapshot fields (VERY IMPORTANT)
        {
          name: 'product_name',
          type: 'text',
          required: true,
        },

        {
          name: 'product_image',
          type: 'text',
        },

        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },

        {
          name: 'unit_price',
          type: 'number',
          required: true,
        },

        {
          name: 'subtotal',
          type: 'number',
          required: true,
        },
      ],
    },

    /* ================= PRICING ================= */

    {
      name: 'subtotal',
      type: 'number',
      required: true,
    },

    {
      name: 'shipping_cost',
      type: 'number',
      defaultValue: 0,
    },

    {
      name: 'tax',
      type: 'number',
      defaultValue: 0,
    },

    {
      name: 'discount',
      type: 'number',
      defaultValue: 0,
    },

    {
      name: 'total',
      type: 'number',
      required: true,
    },

    {
      name: 'currency',
      type: 'text',
      defaultValue: 'INR',
    },

    /* ================= PAYMENT ================= */

    {
      name: 'payment_method',
      type: 'select',
      options: ['razorpay', 'cod', 'card', 'upi'],
      defaultValue: 'razorpay',
    },

    {
      name: 'payment_status',
      type: 'select',
      options: ['pending', 'paid', 'failed', 'refunded'],
      defaultValue: 'pending',
    },

    // Razorpay metadata
    {
      name: 'payment_details',
      type: 'group',
      fields: [
        { name: 'razorpay_order_id', type: 'text' },
        { name: 'razorpay_payment_id', type: 'text' },
        { name: 'razorpay_signature', type: 'text' },
      ],
    },

    /* ================= ORDER STATUS ================= */

    {
      name: 'order_status',
      type: 'select',
      options: [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'out_for_delivery',
        'delivered',
        'cancelled',
        'returned',
      ],
      defaultValue: 'pending',
    },

    /* ================= SHIPPING ================= */

    {
      name: 'shipping_address',
      type: 'group',
      fields: [
        { name: 'full_name', type: 'text', required: true },
        { name: 'phone', type: 'text', required: true },
        { name: 'line1', type: 'text', required: true },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text', required: true },
        { name: 'state', type: 'text', required: true },
        { name: 'postal_code', type: 'text', required: true },
        { name: 'country', type: 'text', defaultValue: 'India' },
      ],
    },

    {
      name: 'tracking',
      type: 'group',
      fields: [
        { name: 'carrier', type: 'text' },
        { name: 'tracking_number', type: 'text' },
        { name: 'tracking_url', type: 'text' },
      ],
    },

    /* ================= NOTES ================= */

    {
      name: 'customer_note',
      type: 'textarea',
    },

    {
      name: 'admin_note',
      type: 'textarea',
      admin: { position: 'sidebar' },
    },
  ],
}
