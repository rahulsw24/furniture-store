import { inngest } from './client'
import { generateInvoicePDF } from '@/utils/generateInvoice'

/* -------------------------------------------------------------------------- */
/* SHARED HELPERS                               */
/* -------------------------------------------------------------------------- */

const BRAND_HEADER = `
  <tr>
    <td align="center" style="padding: 40px 0 60px 0;">
      <div style="font-family: 'Helvetica', Arial, sans-serif; font-size: 24px; letter-spacing: 6px; color: #000000; text-transform: uppercase; font-weight: 900;">
        BOLT<span style="color: #999; font-weight: 300;">LESS</span>
      </div>
      <div style="font-size: 9px; letter-spacing: 4px; color: #999; text-transform: uppercase; margin-top: 8px; font-weight: 700;">
        Simplified Living
      </div>
    </td>
  </tr>
`

const BRAND_FOOTER = `
  <tr>
    <td style="padding-top: 60px;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #EEEEEE; padding-top: 40px;">
        <tr>
          <td valign="top" style="font-family: 'Helvetica', Arial, sans-serif; font-size: 10px; color: #BBBBBB; line-height: 1.8; letter-spacing: 2px; text-transform: uppercase;">
            © 2026 BOLTLESS FURNITURE<br/>
            <span style="color: #999999; font-weight: 700;">MADE IN INDIA</span>
          </td>
          
          <td align="right" valign="top">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td style="padding-bottom: 8px;">
                  <a href="https://instagram.com/boltless" style="text-decoration: none; color: #000000; font-family: 'Helvetica', Arial, sans-serif; font-size: 10px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">
                    INSTAGRAM
                  </a>
                </td>
              </tr>
              <tr>
                <td>
                  <a href="https://boltless.in/reach-out" style="text-decoration: none; color: #BBBBBB; font-family: 'Helvetica', Arial, sans-serif; font-size: 10px; font-weight: 400; letter-spacing: 2px; text-transform: uppercase;">
                    SUPPORT
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <tr>
          <td colspan="2" align="center" style="padding-top: 50px; font-family: 'Georgia', serif; font-size: 12px; color: #CCCCCC; font-style: italic; letter-spacing: 1px;">
            Arrives sanded, ready for your finish.
          </td>
        </tr>
      </table>
    </td>
  </tr>
`
function generateInquiryEmailHtml(doc: any, isInternal: boolean) {
  const title = isInternal ? 'New Inquiry Received' : 'We’ve Received Your Message'
  const subtext = isInternal
    ? `A new inquiry has been submitted via the BoltLess contact form.`
    : `Hello ${doc.name}, thank you for reaching out. Our team has received your message and will get back to you shortly.`

  return `
    <!DOCTYPE html>
    <html>
    <body style="margin: 0; padding: 0; background-color: #FFFFFF;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF">
        <tr>
          <td align="center" style="padding: 20px;">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%;">
              ${BRAND_HEADER}
              <tr>
                <td style="padding-bottom: 40px;">
                  <h1 style="font-family: 'Georgia', serif; font-size: 28px; color: #1A1A1A; margin: 0 0 16px 0; font-weight: 400; font-style: italic;">${title}</h1>
                  <p style="font-family: 'Helvetica', Arial, sans-serif; font-size: 15px; color: #666666; line-height: 1.6; margin: 0;">${subtext}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#F9F9F7" style="border-radius: 4px; border-left: 4px solid #000000;">
                    <tr>
                      <td style="padding: 30px;">
                        <div style="font-family: 'Helvetica', sans-serif; font-size: 10px; font-weight: 900; color: #999999; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px;">Message Details</div>
                        <div style="font-family: 'Helvetica', sans-serif; font-size: 14px; color: #1A1A1A; line-height: 1.6;">
                          <strong>From:</strong> ${doc.name} (${doc.email})<br/><br/>
                          "${doc.message}"
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              ${BRAND_FOOTER}
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}
// Helper to generate the premium Order Status/Confirmation HTML
function generateOrderEmailHtml(doc: any, message: string) {
  const itemsHtml = doc.items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 24px 0; border-bottom: 1px solid #EEEEEE;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="left" style="font-family: 'Helvetica', Arial, sans-serif; font-size: 13px; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 1px; line-height: 1.4;">
              ${item.product_name}
              
              ${
                item.variant_name || item.variantLabel
                  ? `<div style="font-size: 9px; color: #999999; margin-top: 2px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                      ${item.variant_name || item.variantLabel}
                    </div>`
                  : ''
              }

              <div style="font-size: 11px; color: #999999; margin-top: 6px; font-weight: 400; text-transform: none; letter-spacing: 0;">
                Quantity: ${item.quantity}
              </div>
            </td>
            <td align="right" valign="top" style="font-family: 'Helvetica', Arial, sans-serif; font-size: 13px; font-weight: 700; color: #000000;">
              ₹${item.subtotal.toLocaleString('en-IN')}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `,
    )
    .join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #FFFFFF; -webkit-text-size-adjust: none;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF">
        <tr>
          <td align="center" style="padding: 20px;">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%;">
              ${BRAND_HEADER}
              
              <tr>
                <td style="padding-bottom: 40px;">
                  <h1 style="font-family: 'Georgia', serif; font-size: 32px; color: #1A1A1A; margin: 0 0 16px 0; font-weight: 400; font-style: italic;">Order Update</h1>
                  <p style="font-family: 'Helvetica', Arial, sans-serif; font-size: 15px; color: #666666; line-height: 1.6; margin: 0;">${message}</p>
                </td>
              </tr>

              <tr>
                <td style="padding-bottom: 40px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#F9F9F7" style="border-radius: 4px;">
                    <tr>
                      <td style="padding: 30px;">
                        <span style="font-family: 'Helvetica', sans-serif; font-size: 10px; font-weight: 900; color: #999999; text-transform: uppercase; letter-spacing: 2px;">Reference Number</span><br/>
                        <span style="font-family: 'Helvetica', sans-serif; font-size: 20px; font-weight: 700; color: #000000;">#${doc.order_number}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    ${itemsHtml}
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding-top: 30px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td width="70%" align="left" style="padding: 10px 0; font-family: 'Helvetica', sans-serif; font-size: 12px; color: #999999; text-transform: uppercase; letter-spacing: 1.5px;">Subtotal</td>
                      <td width="30%" align="right" style="padding: 10px 0; font-family: 'Helvetica', sans-serif; font-size: 13px; color: #000000; font-weight: 700;">₹${doc.subtotal.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td width="70%" align="left" style="padding: 10px 0; font-family: 'Helvetica', sans-serif; font-size: 12px; color: #999999; text-transform: uppercase; letter-spacing: 1.5px;">Shipping</td>
                      <td width="30%" align="right" style="padding: 10px 0; font-family: 'Helvetica', sans-serif; font-size: 13px; color: #000000; font-weight: 700;">₹${(doc.shipping_cost || 0).toLocaleString('en-IN')}</td>
                    </tr>
                    
                    <tr>
                        <td colspan="2" style="padding-top: 20px;">
                            <div style="border-top: 2px solid #000000; font-size: 1px; line-height: 1px;">&nbsp;</div>
                        </td>
                    </tr>

                    <tr>
                      <td width="70%" align="left" style="padding: 20px 0; font-family: 'Helvetica', sans-serif; font-size: 18px; font-weight: 900; color: #000000; text-transform: uppercase; letter-spacing: 2px;">Total</td>
                      <td width="30%" align="right" style="padding: 20px 0; font-family: 'Helvetica', sans-serif; font-size: 18px; font-weight: 900; color: #000000;">₹${doc.total.toLocaleString('en-IN')}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              ${BRAND_FOOTER}
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

// Helper for Internal Admin Notifications
function generateAdminOrderEmailHtml(doc: any) {
  const itemsHtml = doc.items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #EEEEEE; font-family: 'Helvetica', Arial, sans-serif; font-size: 13px; color: #1A1A1A;">
        <span style="font-weight: 700;">${item.product_name}</span>
        
        ${
          item.variant_name || item.variantLabel
            ? `<div style="font-size: 9px; color: #999999; margin-top: 2px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                ${item.variant_name || item.variantLabel}
              </div>`
            : ''
        }
      </td>
      <td align="center" style="padding: 12px 0; border-bottom: 1px solid #EEEEEE; font-family: 'Helvetica', Arial, sans-serif; font-size: 13px; color: #666666;">
        ${item.quantity}
      </td>
      <td align="right" style="padding: 12px 0; border-bottom: 1px solid #EEEEEE; font-family: 'Helvetica', Arial, sans-serif; font-size: 13px; font-weight: 700; color: #1A1A1A;">
        ₹${item.subtotal.toLocaleString('en-IN')}
      </td>
    </tr>
  `,
    )
    .join('')

  return `
    <!DOCTYPE html>
    <html>
    <body style="margin: 0; padding: 0; background-color: #F4F4F4;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#F4F4F4">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
              
              <tr>
                <td bgcolor="#000000" style="padding: 12px 40px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="font-family: 'Helvetica', Arial, sans-serif; font-size: 10px; color: #FFFFFF; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">
                        🚨 NEW INBOUND ORDER
                      </td>
                      <td align="right" style="font-family: 'Helvetica', Arial, sans-serif; font-size: 10px; color: #AAAAAA; font-weight: 700;">
                        ${new Date().toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 40px 30px 40px;">
                  <h1 style="font-family: 'Helvetica', Arial, sans-serif; font-size: 24px; color: #1A1A1A; margin: 0 0 8px 0; font-weight: 900; letter-spacing: -0.5px;">
                    #${doc.order_number}
                  </h1>
                  <p style="font-family: 'Helvetica', Arial, sans-serif; font-size: 14px; color: #666666; margin: 0;">
                    Action required: Review inventory and confirm fulfillment schedule.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding: 0 40px 40px 40px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#F9F9F7" style="border-radius: 4px;">
                    <tr>
                      <td style="padding: 24px;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td width="50%" valign="top" style="padding-right: 20px; border-right: 1px solid #EEEEEE;">
                              <span style="font-family: 'Helvetica', sans-serif; font-size: 9px; font-weight: 900; color: #999999; text-transform: uppercase; letter-spacing: 1.5px;">Customer</span><br/>
                              <div style="font-family: 'Helvetica', sans-serif; font-size: 13px; font-weight: 700; color: #000000; margin-top: 6px;">
                                ${doc.shipping_address?.full_name}<br/>
                                <span style="font-weight: 400; font-size: 12px; color: #666666;">${doc.customer_email}</span>
                              </div>
                            </td>
                            <td width="50%" valign="top" style="padding-left: 20px;">
                              <span style="font-family: 'Helvetica', sans-serif; font-size: 9px; font-weight: 900; color: #999999; text-transform: uppercase; letter-spacing: 1.5px;">Payment</span><br/>
                              <div style="font-family: 'Helvetica', sans-serif; font-size: 13px; font-weight: 700; color: #000000; margin-top: 6px;">
                                ${(doc.payment_method || 'N/A').toUpperCase()}<br/>
                                <span style="font-weight: 400; font-size: 12px; color: #666666;">Status: ${(doc.payment_status || 'PENDING').toUpperCase()}</span>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding: 0 40px 40px 40px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                      <tr>
                        <th align="left" style="padding-bottom: 12px; font-family: 'Helvetica', sans-serif; font-size: 9px; font-weight: 900; color: #999999; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 2px solid #000000;">Item</th>
                        <th align="center" style="padding-bottom: 12px; font-family: 'Helvetica', sans-serif; font-size: 9px; font-weight: 900; color: #999999; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 2px solid #000000;">Qty</th>
                        <th align="right" style="padding-bottom: 12px; font-family: 'Helvetica', sans-serif; font-size: 9px; font-weight: 900; color: #999999; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 2px solid #000000;">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding: 0 40px 40px 40px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#000000" style="border-radius: 4px;">
                    <tr>
                      <td style="padding: 30px; text-align: center;">
                        <span style="font-family: 'Helvetica', sans-serif; font-size: 10px; font-weight: 700; color: #999999; text-transform: uppercase; letter-spacing: 3px;">Total Revenue</span><br/>
                        <div style="font-family: 'Helvetica', sans-serif; font-size: 32px; font-weight: 900; color: #FFFFFF; margin-top: 10px;">
                          ₹${doc.total.toLocaleString('en-IN')}
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 0 40px 60px 40px;">
                  <a href="${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin/collections/orders/${doc.id}" 
                     style="display: block; background-color: #FFFFFF; border: 2px solid #000000; color: #000000; text-align: center; padding: 18px; text-decoration: none; font-family: 'Helvetica', Arial, sans-serif; font-size: 12px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; border-radius: 4px;">
                     Process Fulfillment
                  </a>
                </td>
              </tr>

            </table>
            
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%;">
              <tr>
                <td align="center" style="padding-top: 30px; font-family: 'Helvetica', Arial, sans-serif; font-size: 10px; color: #999999; text-transform: uppercase; letter-spacing: 2px;">
                  Generated by BoltLess.
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

/* -------------------------------------------------------------------------- */
/* INNGEST FUNCTIONS                            */
/* -------------------------------------------------------------------------- */

// --- FUNCTION: WELCOME SIGNUP ---
export const sendWelcomeEmail = inngest.createFunction(
  { id: 'send-welcome-email' },
  { event: 'user.signup' },
  async ({ event, step }) => {
    const { email, name, role } = event.data

    await step.run('send-nodemailer', async () => {
      const { getPayload } = await import('payload')
      const configPromise = await import('@payload-config')
      const payload = await getPayload({ config: configPromise.default })

      const isCustomer = role === 'customer'
      const subject = isCustomer ? 'Welcome to the BoltLess Family' : 'Admin Access Confirmed'

      const customerHtml = `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 0; background-color: #FFFFFF;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF">
            <tr>
              <td align="center" style="padding: 20px;">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px;">
                  ${BRAND_HEADER}
                  <tr>
                    <td align="center">
                      <div style="width: 100%; height: 320px; background-color: #F3F3F1; border-radius: 4px; overflow: hidden; margin-bottom: 60px;">
                        <img src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80" alt="BoltLess" style="width: 100%; height: 100%; object-fit: cover;" />
                      </div>
                      <h1 style="font-family: 'Georgia', serif; font-size: 38px; color: #1A1A1A; margin: 0 0 24px 0; font-weight: 400; font-style: italic;">Welcome Home, ${name || 'Friend'}.</h1>
                      <p style="font-family: 'Helvetica', Arial, sans-serif; font-size: 16px; line-height: 1.8; color: #666; margin: 0 0 40px 0; max-width: 480px;">Your account is active. We believe furniture should be simple, sustainable, and personal. No tools, no stress—just thoughtful design.</p>
                      <a href="https://boltless.in/products" style="background: #000; color: #FFF; padding: 20px 40px; text-decoration: none; font-family: 'Helvetica', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; display: inline-block;">Start Exploring</a>
                    </td>
                  </tr>
                  ${BRAND_FOOTER}
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `

      const adminHtml = `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 0; background-color: #F9F9F9;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#F9F9F9">
            <tr>
              <td align="center" style="padding: 20px;">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; padding: 40px; border: 1px solid #EEE; border-radius: 8px;">
                  ${BRAND_HEADER}
                  <tr>
                    <td><h2 style="font-family: 'Helvetica', sans-serif; font-size: 18px; color: #000; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">Admin Credentials Confirmed</h2>
                    <p style="font-family: 'Helvetica', sans-serif; font-size: 14px; line-height: 1.6; color: #444;">Hello ${name || 'Admin'}, your administrative access is active. You now have permissions to manage the store backend.</p>
                    <a href="${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin" style="display: block; background: #000; color: #FFF; text-align: center; padding: 15px; text-decoration: none; font-family: 'Helvetica', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-top: 30px;">Access Dashboard</a></td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `

      return await payload.sendEmail({
        to: email,
        subject: subject,
        html: isCustomer ? customerHtml : adminHtml,
      })
    })
  },
)

// --- FUNCTION: HANDLE NEW ORDER ---
export const handleOrderCreated = inngest.createFunction(
  { id: 'handle-order-created' },
  { event: 'order.created' },
  async ({ event, step }) => {
    const { orderId } = event.data

    const { doc, settings } = await step.run('fetch-order-data', async () => {
      const { getPayload } = await import('payload')
      const configPromise = await import('@payload-config')
      const payload = await getPayload({ config: configPromise.default })

      const order = await payload.findByID({ collection: 'orders', id: orderId })
      const bizSettings = await (payload as any).findGlobal({ slug: 'business-settings' })
      return { doc: order, settings: bizSettings }
    })

    const invoiceBuffer = await step.run('generate-pdf', async () => {
      return await generateInvoicePDF(doc, settings)
    })

    await step.run('send-emails', async () => {
      const { getPayload } = await import('payload')
      const configPromise = await import('@payload-config')
      const payload = await getPayload({ config: configPromise.default })

      // FIX: Inngest serializes Buffers. We need to grab the .data array.
      const pdfContent = (invoiceBuffer as any).data
        ? Buffer.from((invoiceBuffer as any).data)
        : Buffer.from(invoiceBuffer as any)

      const attachments = [
        {
          filename: `Invoice-${doc.order_number}.pdf`,
          content: Buffer.from(pdfContent),
        },
      ]

      await payload.sendEmail({
        to: doc.customer_email,
        subject: `Order Confirmed - #${doc.order_number}`,
        attachments,
        html: generateOrderEmailHtml(
          doc,
          'Thank you for choosing BoltLess. Your order is confirmed and your invoice is attached below.',
        ),
      })

      await payload.sendEmail({
        to: 'team@boltless.in',
        subject: `🚨 NEW ORDER - #${doc.order_number}`,
        attachments,
        html: generateAdminOrderEmailHtml(doc),
      })
    })
  },
)

// --- FUNCTION: HANDLE STATUS UPDATES ---
export const handleOrderStatusUpdate = inngest.createFunction(
  { id: 'handle-order-status-update' },
  { event: 'order.status.updated' },
  async ({ event, step }) => {
    const { orderId, newStatus } = event.data

    await step.run('send-status-email', async () => {
      const { getPayload } = await import('payload')
      const configPromise = await import('@payload-config')
      const payload = await getPayload({ config: configPromise.default })

      const doc = await payload.findByID({ collection: 'orders', id: orderId })

      let statusMessage = ''
      let subject = `Update on Order #${doc.order_number}`

      switch (newStatus) {
        case 'confirmed':
          statusMessage = 'Your order has been confirmed and is officially in our system.'
          break
        case 'processing':
          statusMessage = "Our craftsmen are now working on your pieces. We're on it!"
          break
        case 'shipped':
          subject = `Your BoltLess order has shipped! 🚚`
          statusMessage = `Great news! Your order is on the way. ${doc.tracking?.tracking_number ? `Tracking: ${doc.tracking.tracking_number}` : ''}`
          break
        case 'out_for_delivery':
          statusMessage = 'Your furniture is out for delivery and should arrive later today.'
          break
        case 'delivered':
          subject = `Delivered: Order #${doc.order_number}`
          statusMessage =
            'Your order has been delivered. We hope you love your new simplified space!'
          break
        case 'cancelled':
          statusMessage = 'Your order has been cancelled. If this was a mistake, please contact us.'
          break
        default:
          statusMessage = `The status of your order has changed to: ${newStatus}.`
      }

      await payload.sendEmail({
        to: doc.customer_email,
        subject: subject,
        html: generateOrderEmailHtml(doc, statusMessage),
      })
    })
  },
)

export const handleInquiryCreated = inngest.createFunction(
  { id: 'handle-inquiry-created' },
  { event: 'inquiry.created' },
  async ({ event, step }) => {
    const { inquiryId } = event.data

    // 1. Fetch the inquiry details from Payload
    const doc = await step.run('fetch-inquiry', async () => {
      const { getPayload } = await import('payload')
      const configPromise = await import('@payload-config')
      const payload = await getPayload({ config: configPromise.default })

      return await payload.findByID({
        collection: 'inquiries',
        id: inquiryId,
      })
    })

    // 2. Send Emails
    await step.run('send-inquiry-emails', async () => {
      const { getPayload } = await import('payload')
      const configPromise = await import('@payload-config')
      const payload = await getPayload({ config: configPromise.default })

      // A. Auto-reply to the Customer
      await payload.sendEmail({
        to: doc.email,
        subject: `We've received your message, ${doc.name.split(' ')[0]}`,
        html: generateInquiryEmailHtml(doc, false),
      })

      // B. Alert to the Admin Team
      await payload.sendEmail({
        to: 'team@boltless.in',
        subject: `📩 New Inquiry: ${doc.name}`,
        html: generateInquiryEmailHtml(doc, true),
      })
    })

    return { success: true }
  },
)

// 2. ORDER SUCCESS HANDLER (Invoice sent here)
export const handleOrderPaid = inngest.createFunction(
  { id: 'handle-order-paid' },
  { event: 'order.paid' },
  async ({ event, step }) => {
    const { orderId } = event.data

    const { doc, settings } = await step.run('fetch-order-data', async () => {
      const { getPayload } = await import('payload')
      const configPromise = await import('@payload-config')
      const payload = await getPayload({ config: configPromise.default })
      const order = await payload.findByID({ collection: 'orders', id: orderId })
      const bizSettings = await (payload as any).findGlobal({ slug: 'business-settings' })
      return { doc: order, settings: bizSettings }
    })

    const invoiceBuffer = await step.run('generate-pdf', async () => {
      return await generateInvoicePDF(doc, settings)
    })

    await step.run('send-emails', async () => {
      const { getPayload } = await import('payload')
      const configPromise = await import('@payload-config')
      const payload = await getPayload({ config: configPromise.default })

      // Fix serialization issue for PDF content
      const pdfContent = (invoiceBuffer as any).data
        ? Buffer.from((invoiceBuffer as any).data)
        : Buffer.from(invoiceBuffer as any)

      await payload.sendEmail({
        to: doc.customer_email,
        subject: `Payment Successful - Order #${doc.order_number}`,
        attachments: [{ filename: `Invoice-${doc.order_number}.pdf`, content: pdfContent }],
        html: generateOrderEmailHtml(
          doc,
          'Your payment was successful and your order is confirmed.',
        ),
      })

      await payload.sendEmail({
        to: 'team@boltless.in',
        subject: `🚨 NEW ORDER - #${doc.order_number}`,
        attachments: [{ filename: `Invoice-${doc.order_number}.pdf`, content: pdfContent }],
        html: generateAdminOrderEmailHtml(doc),
      })
    })
  },
)
