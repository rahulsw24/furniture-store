import type { GlobalConfig } from 'payload'

export const BusinessSettings: GlobalConfig = {
  slug: 'business-settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'gstNumber',
      type: 'text',
      label: 'GST Number',
    },
    {
      name: 'gstPercentage',
      type: 'number',
      defaultValue: 18,
      label: 'GST Percentage (%)',
    },
    {
      name: 'companyAddress',
      type: 'textarea',
      label: 'Company Address (For Invoice)',
    },
  ],
}
