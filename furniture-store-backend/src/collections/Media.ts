import cloudinary from '@/lib/cloudinary'
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  upload: {
    staticDir: 'media',
    disableLocalStorage: true,
    // We point the thumbnail directly to our custom field
    adminThumbnail: ({ doc }) => doc.cloudinary_url as string,
    mimeTypes: ['image/*'],
  },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        const file = req.file
        if (!file || !file.data) return data

        const uploaded = await new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'furniture-store',
              resource_type: 'image',
            },
            (error, result) => {
              if (error || !result) reject(error)
              else resolve(result)
            },
          )
          stream.end(file.data)
        })

        return {
          ...data,
          // We save it here to keep it safe from Payload's internal overwriting
          cloudinary_url: uploaded.secure_url,
          url: uploaded.secure_url,
          filename: `${uploaded.public_id}.${uploaded.format}`,
          public_id: uploaded.public_id,
          mimeType: uploaded.resource_type + '/' + uploaded.format,
          filesize: uploaded.bytes,
          width: uploaded.width,
          height: uploaded.height,
        }
      },
    ],
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
    {
      name: 'cloudinary_url',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    // We add a 'virtual' field that mirrors cloudinary_url
    // This is what we will use in the frontend
    {
      name: 'url',
      type: 'text',
      hooks: {
        afterRead: [({ data }) => data?.cloudinary_url || data?.url],
      },
      admin: {
        hidden: true,
      },
    },
  ],
}
