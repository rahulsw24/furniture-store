import cloudinary from '@/lib/cloudinary'
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'media',
    // Optional: add image sizes if you want Payload to handle thumbnails
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        const file = req.file

        // 1. Check if a file is actually being uploaded
        if (!file || !file.data) return data

        // 2. Wrap the Cloudinary stream in a Promise
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'furniture-store',
              resource_type: 'image',
            },
            (error, result) => {
              if (error || !result) {
                return reject(error || new Error('Cloudinary upload failed'))
              }

              // 3. Return the data to Payload to be saved in the database
              resolve({
                ...data,
                url: result.secure_url,
                public_id: result.public_id,
              })
            },
          )

          // 4. Send the file buffer (file.data) to Cloudinary
          uploadStream.end(file.data)
        })
      },
    ],
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      admin: {
        readOnly: true, // Prevent users from accidentally changing the URL
      },
    },
    {
      name: 'public_id',
      type: 'text',
      admin: {
        readOnly: true,
        hidden: true, // Keep this hidden unless you need it for debugging
      },
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
