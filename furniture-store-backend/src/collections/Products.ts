import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true

      return {
        is_active: {
          equals: true,
        },
      }
    },
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'product_type', 'stock'],
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
      name: 'product_type',
      type: 'select',
      defaultValue: 'simple',
      options: [
        { label: 'Simple (Single Item)', value: 'simple' },
        { label: 'Variable (Multiple Options)', value: 'variable' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Use --- to separate story sections.',
      },
    },
    {
      name: 'highlights',
      type: 'textarea',
      admin: {
        description: 'Paste "About this item" bullets here.',
      },
    },

    // --- 1. VARIANTS CONFIGURATION ---
    {
      name: 'variants',
      type: 'array',
      label: 'Product Variants',
      admin: {
        condition: (data) => data.product_type === 'variable',
      },
      fields: [
        {
          name: 'variant_name',
          type: 'text',
          required: true,
          admin: { placeholder: 'e.g., 3-Tier / 12" Depth / 48" Length' },
        },
        {
          name: 'selected_options',
          type: 'array',
          label: 'Option Values',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'type',
                  type: 'relationship', // 🔥 FIXED: Using relationship to Variation Types collection
                  relationTo: 'variation-types',
                  required: true,
                  admin: {
                    width: '50%',
                    description: 'Select a variation type (e.g. Length)',
                  },
                },
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'e.g., 48 inches',
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'price', type: 'number', required: true, admin: { width: '50%' } },
            { name: 'stock', type: 'number', required: true, admin: { width: '50%' } },
          ],
        },
        {
          name: 'variant_image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional: Specific image for this variation',
          },
        },
      ],
    },

    // --- 2. GLOBAL SPECS ---
    {
      type: 'row',
      fields: [
        { name: 'dimensions', type: 'textarea', admin: { placeholder: 'Overall Width: 48"...' } },
        { name: 'materials', type: 'textarea', admin: { placeholder: 'Premium Birch Plywood...' } },
      ],
    },

    // --- 3. PRICING ---
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          required: true,
        },
        {
          name: 'compare_price',
          type: 'number',
        },
      ],
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

    // --- 4. STOCK MANAGEMENT ---
    {
      name: 'stock',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        condition: (data) => data.product_type === 'simple',
      },
    },
    { name: 'low_stock_threshold', type: 'number', defaultValue: 5 },
    { name: 'is_active', type: 'checkbox', defaultValue: true },
  ],
}
