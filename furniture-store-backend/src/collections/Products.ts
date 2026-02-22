import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    read: () => true, // 🔥 allow public read
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
