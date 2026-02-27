import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    read: () => true, // Public can view
    // Only admins can modify
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Use --- to separate story sections. First line is the title.',
      },
    },
    // --- NEW TECHNICAL DETAILS GROUP ---
    {
      type: 'row', // Put these side-by-side in the CMS UI
      fields: [
        {
          name: 'dimensions',
          type: 'textarea',
          admin: {
            placeholder: 'Width: 48"\nDepth: 24"\nHeight: 18"',
            description: 'One dimension per line.',
          },
        },
        {
          name: 'materials',
          type: 'textarea',
          admin: {
            placeholder: 'Premium Birch Plywood\nNatural Wax Finish',
            description: 'One material per line.',
          },
        },
      ],
    },

    {
      name: 'price',
      type: 'number',
      required: true,
    },

    {
      name: 'compare_price',
      type: 'number',
    },

    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
    },

    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },

    {
      name: 'stock',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'low_stock_threshold',
      type: 'number',
      defaultValue: 5,
    },

    {
      name: 'is_active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
