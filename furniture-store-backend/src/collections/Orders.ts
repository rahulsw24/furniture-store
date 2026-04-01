import { inngest } from '@/inngest/client'
import { generateInvoicePDF } from '@/utils/generateInvoice'
import type { CollectionConfig } from 'payload'

// Helper to handle the Admin Email HTML
function generateAdminOrderEmailHtml(doc: any) {
  const itemsList = doc.items
    .map(
      (item: any) =>
        `<li>${item.product_name} (x${item.quantity}) - ₹${item.subtotal.toLocaleString('en-IN')}</li>`,
    )
    .join('')

  return `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #000; border-radius: 12px; color: #000;">
      <h2 style="text-transform: uppercase; letter-spacing: 2px;">New Order Alert</h2>
      <p>Order <strong>#${doc.order_number}</strong> was just placed.</p>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase;">Customer Details</h3>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${doc.shipping_address?.full_name}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${doc.customer_email}</p>
        <p style="margin: 5px 0;"><strong>Phone:</strong> ${doc.customer_phone || doc.shipping_address?.phone}</p>
        <p style="margin: 5px 0;"><strong>Payment:</strong> ${doc.payment_method.toUpperCase()}</p>
      </div>

      <h3 style="font-size: 14px; text-transform: uppercase;">Items Ordered</h3>
      <ul style="padding-left: 20px;">
        ${itemsList}
      </ul>

      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 18px;"><strong>Total Revenue: ₹${doc.total.toLocaleString('en-IN')}</strong></p>
      
      <a href="https://your-admin-panel-url.com/admin/collections/orders/${doc.id}" 
         style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 50px; font-size: 12px; font-weight: bold;">
         VIEW IN ADMIN PANEL
      </a>
    </div>
  `
}

// Helper to handle the Customer Email HTML
function generateOrderEmailHtml(doc: any, message: string) {
  const itemsHtml = doc.items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0;">
        <span style="font-size: 14px; font-weight: 700; color: #000;">${item.product_name}</span><br/>
        <span style="font-size: 12px; color: #999;">Qty: ${item.quantity}</span>
      </td>
      <td align="right" style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; font-weight: 700;">
        ₹${item.subtotal.toLocaleString('en-IN')}
      </td>
    </tr>
  `,
    )
    .join('')

  return `
    <!DOCTYPE html>
    <html>
    <body style="margin: 0; padding: 0; background-color: #fff; font-family: 'Helvetica', Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="600" style="max-width: 600px; width: 100%; border: 1px solid #f0f0f0; padding: 40px; border-radius: 20px;">
              <tr>
                <td align="center" style="padding-bottom: 30px;">
                  <div style="font-size: 24px; letter-spacing: 5px; font-weight: bold; color: #000;">BOLTLESS</div>
                </td>
              </tr>
              <tr>
                <td>
                  <h1 style="font-size: 22px; margin-bottom: 10px; color: #000;">Order Update</h1>
                  <p style="font-size: 15px; color: #555; line-height: 1.6;">${message}</p>
                  
                  <div style="margin-top: 40px; padding: 20px; background-color: #F9F9F9; border-radius: 12px;">
                    <span style="font-size: 11px; font-weight: bold; color: #999; text-transform: uppercase; letter-spacing: 1px;">Order Number</span><br/>
                    <span style="font-size: 16px; font-weight: bold; color: #000;">#${doc.order_number}</span>
                  </div>

                  <table width="100%" style="margin-top: 30px; border-collapse: collapse;">
                    ${itemsHtml}
                    <tr>
                      <td style="padding: 20px 0 5px 0; font-size: 14px; color: #999;">Subtotal</td>
                      <td align="right" style="padding: 20px 0 5px 0; font-size: 14px; color: #000;">₹${doc.subtotal.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0; font-size: 14px; color: #999;">Shipping</td>
                      <td align="right" style="padding: 5px 0; font-size: 14px; color: #000;">₹${doc.shipping_cost.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td style="padding: 15px 0; font-size: 18px; font-weight: bold; color: #000; border-top: 2px solid #000;">Total</td>
                      <td align="right" style="padding: 15px 0; font-size: 18px; font-weight: bold; color: #000; border-top: 2px solid #000;">₹${doc.total.toLocaleString('en-IN')}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-top: 40px;">
                  <p style="font-size: 12px; color: #aaa;">© 2026 BoltLess Furniture Store. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    create: () => true,
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (user?.id) return { user: { equals: user.id } }
      return false
    },
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  admin: {
    useAsTitle: 'order_number',
    defaultColumns: [
      'order_number',
      'user',
      'total',
      'payment_status',
      'order_status',
      'createdAt',
    ],
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create' && !data.order_number) {
          const year = new Date().getFullYear()
          const count = await req.payload.count({
            collection: 'orders',
          })
          data.order_number = `BLT-${year}-${(count.totalDocs + 1).toString().padStart(4, '0')}`
        }
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation }) => {
        // CASE 1: NEW ORDER
        if (operation === 'create') {
          await inngest
            .send({
              name: 'order.created',
              data: { orderId: doc.id },
            })
            .catch((err) => console.error('Inngest order.created failed:', err))
        }

        // CASE 2: STATUS UPDATE
        const statusChanged = doc.order_status !== previousDoc?.order_status
        if (operation === 'update' && statusChanged) {
          await inngest
            .send({
              name: 'order.status.updated',
              data: {
                orderId: doc.id,
                oldStatus: previousDoc?.order_status,
                newStatus: doc.order_status,
              },
            })
            .catch((err) => console.error('Inngest order.status failed:', err))
        }
      },
    ],
  },
  timestamps: true,
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
    {
      name: 'coupon',
      type: 'relationship',
      relationTo: 'coupons',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'customer_email',
      type: 'email',
      required: true,
    },
    {
      name: 'customer_phone',
      type: 'text',
    },
    {
      name: 'order_number',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        // Inside Orders collection fields array:

        {
          name: 'product_name',
          type: 'text',
          required: true,
        },
        {
          name: 'product_image',
          type: 'text',
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'unit_price',
          type: 'number',
          required: true,
        },
        {
          name: 'subtotal',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
    },
    {
      name: 'shipping_cost',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'tax',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'discount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'total',
      type: 'number',
      required: true,
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'INR',
    },
    {
      name: 'payment_method',
      type: 'select',
      options: ['razorpay', 'cod', 'card', 'upi'],
      defaultValue: 'razorpay',
    },
    {
      name: 'payment_status',
      type: 'select',
      options: ['pending', 'paid', 'failed', 'refunded'],
      defaultValue: 'pending',
    },
    {
      name: 'payment_details',
      type: 'group',
      fields: [
        { name: 'razorpay_order_id', type: 'text' },
        { name: 'razorpay_payment_id', type: 'text' },
        { name: 'razorpay_signature', type: 'text' },
        { name: 'failure_reason', type: 'text' }, // 👈 Add this
        { name: 'error_code', type: 'text' },
      ],
    },
    {
      name: 'order_status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Out For Delivery', value: 'out_for_delivery' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Returned', value: 'returned' },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'shipping_address',
      type: 'group',
      fields: [
        { name: 'full_name', type: 'text', required: true },
        { name: 'phone', type: 'text', required: true },
        { name: 'line1', type: 'text', required: true },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text', required: true },
        { name: 'state', type: 'text', required: true },
        { name: 'postal_code', type: 'text', required: true },
        { name: 'country', type: 'text', defaultValue: 'India' },
      ],
    },
    {
      name: 'tracking',
      type: 'group',
      fields: [
        { name: 'carrier', type: 'text' },
        { name: 'tracking_number', type: 'text' },
        { name: 'tracking_url', type: 'text' },
      ],
    },
    {
      name: 'customer_note',
      type: 'textarea',
    },
    {
      name: 'admin_note',
      type: 'textarea',
      admin: { position: 'sidebar' },
    },
    {
      name: 'paid_at',
      type: 'date',
    },
    {
      name: 'delivered_at',
      type: 'date',
    },
  ],
}
