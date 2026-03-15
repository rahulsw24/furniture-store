import { GlobalConfig } from 'payload'

export const PromoBar: GlobalConfig = {
  slug: 'promo-bar',
  label: 'Promo Bar Settings',
  access: {
    read: () => true, // Publicly readable
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      label: 'Promo Text',
      required: true,
      admin: {
        placeholder: 'e.g., USE CODE BOLT20 FOR 20% OFF',
      },
    },
    {
      name: 'valid_until',
      type: 'date',
      label: 'Valid Until',
      admin: {
        description:
          'Promo text will show until this date. After this, it switches to the fallback text.',
      },
    },
    {
      name: 'fallback_text',
      type: 'text',
      label: 'Fallback Text',
      defaultValue: 'BOLTLESS: THE FUTURE OF TOOL-FREE ASSEMBLY',
      required: true,
    },
  ],
}
