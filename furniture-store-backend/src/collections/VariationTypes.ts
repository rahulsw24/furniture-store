import type { CollectionConfig } from 'payload'

export const VariationTypes: CollectionConfig = {
  slug: 'variation-types',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  // This allows you to define "Length", "Shelf Depth", etc. once.
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}
