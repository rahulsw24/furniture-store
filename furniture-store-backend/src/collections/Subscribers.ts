import { CollectionConfig } from 'payload'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  access: {
    create: () => true, // Anyone can subscribe
    read: ({ req: { user } }) => !!user, // Only logged-in admins can see the list
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'createdAt'],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true, // Prevents duplicate signups
    },
  ],
}
