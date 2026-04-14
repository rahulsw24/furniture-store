import type { CollectionConfig } from 'payload'
import { inngest } from '@/inngest/client'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  access: {
    // Anyone can submit a contact form
    create: () => true,
    // Only admins can see or manage them
    read: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'createdAt'],
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          await inngest
            .send({
              name: 'inquiry.created',
              data: { inquiryId: doc.id },
            })
            .catch((err) => console.error('Inngest Inquiry ID failed:', err))
        }
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'message', type: 'textarea', required: true },
  ],
}
