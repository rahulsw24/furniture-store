import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    // Anyone can create an account (Sign up)
    create: () => true,

    // Admins see everyone; Users see only themselves
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (user) return { id: { equals: user.id } }
      return false
    },

    // Admins can update anyone; Users can only update their own profile
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (user) return { id: { equals: user.id } }
      return false
    },

    // Only Admins can delete users
    delete: ({ req: { user } }) => user?.role === 'admin',
  },

  admin: {
    useAsTitle: 'email',
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          const isAdmin = doc.role === 'admin'

          try {
            // We 'await' this now to ensure it triggers before the request ends on Render
            await req.payload.sendEmail({
              to: doc.email,
              subject: isAdmin
                ? 'Admin Access Granted | BoltLess Dashboard'
                : 'Welcome to BoltLess!',
              html: isAdmin
                ? `
                <div style="font-family: sans-serif; padding: 40px; color: #1a1a1a; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px;">
                  <h1 style="font-size: 24px; border-bottom: 1px solid #eee; padding-bottom: 20px; font-weight: 700;">Dashboard Access Granted</h1>
                  <p>Hello ${doc.name || 'Admin'},</p>
                  <p>Your administrator account for the <strong>BoltLess Furniture Store</strong> is now active.</p>
                  <p>You can manage products, view orders, and handle site settings via the link below:</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://admin.boltless.in/admin" style="display: inline-block; padding: 16px 32px; background: #000; color: #fff; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">
                      Access Admin Panel
                    </a>
                  </div>
                  <p style="font-size: 12px; color: #999; line-height: 1.5;">
                    If you did not expect this access, please contact the system owner immediately.<br/>
                    © 2026 BOLTLESS FURNITURE
                  </p>
                </div>
                `
                : `
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;700&display=swap');
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Inter', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%;">
          
          <tr>
            <td align="center" style="padding-bottom: 60px;">
              <div style="font-family: 'Playfair Display', serif; font-size: 28px; letter-spacing: 4px; color: #000000; text-transform: uppercase; font-weight: 700;">
                BOLTLESS
              </div>
              <div style="font-size: 10px; letter-spacing: 3px; color: #999999; text-transform: uppercase; margin-top: 5px; font-weight: 700;">
                Simplified Living
              </div>
            </td>
          </tr>

          <tr>
            <td align="center">
              <div style="width: 100%; height: 300px; background-color: #F3F3F1; border-radius: 24px; overflow: hidden;">
                <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80" alt="Furniture" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 60px 0;">
              <h1 style="font-family: 'Playfair Display', serif; font-size: 40px; color: #1a1a1a; margin: 0 0 24px 0; font-weight: 700;">
                Welcome Home, ${doc.name || 'Friend'}.
              </h1>
              <p style="font-size: 16px; line-height: 1.8; color: #666666; margin: 0 0 40px 0; max-width: 480px;">
                Your account at BoltLess is now active. We believe furniture should be simple, sustainable, and personal. We're honored to be a part of your space.
              </p>
              
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" bgcolor="#000000" style="border-radius: 50px;">
                    <a href="https://boltless.in/products" target="_blank" style="font-size: 12px; font-weight: 700; color: #ffffff; text-decoration: none; padding: 20px 48px; display: inline-block; letter-spacing: 2px; text-transform: uppercase;">
                      Start Exploring
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="border-top: 1px solid #f0f0f0;"></td>
          </tr>

          <tr>
            <td align="center" style="padding-top: 60px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-size: 12px; color: #999999; line-height: 1.5;">
                    © 2026 BOLTLESS FURNITURE<br/>
                    Arrives sanded, ready for your finish.
                  </td>
                  <td align="right">
                     <a href="#" style="text-decoration: none; color: #000; font-size: 12px; font-weight: 700; margin-left: 20px;">INSTAGRAM</a>
                     <a href="#" style="text-decoration: none; color: #000; font-size: 12px; font-weight: 700; margin-left: 20px;">SUPPORT</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
            })
          } catch (error) {
            console.error('CRITICAL: Welcome Email Failed to send:', error)
          }
        }
      },
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          // Find orders where the email matches AND there is no user linked
          const guestOrders = await req.payload.find({
            collection: 'orders',
            where: {
              and: [{ customer_email: { equals: doc.email } }, { user: { equals: null } }],
            },
            req,
          })

          if (guestOrders.totalDocs > 0) {
            await Promise.all(
              guestOrders.docs.map((order) =>
                req.payload.update({
                  collection: 'orders',
                  id: order.id,
                  data: { user: doc.id },
                  req,
                }),
              ),
            )
          }
        }
      },
    ],
  },

  fields: [
    // 👤 BASIC PROFILE
    {
      name: 'name',
      type: 'text',
      required: false,
    },

    {
      name: 'phone',
      type: 'text',
      required: false,
    },

    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },

    // 👑 ROLE SYSTEM
    {
      name: 'role',
      type: 'select',
      defaultValue: 'customer',
      options: [
        { label: 'Customer', value: 'customer' },
        { label: 'Admin', value: 'admin' },
      ],
      required: true,
      saveToJWT: true,
    },

    // 📍 ADDRESSES
    {
      name: 'addresses',
      type: 'array',
      label: 'Saved Addresses',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Home / Office',
        },

        {
          name: 'full_name',
          type: 'text',
          required: true,
        },

        {
          name: 'phone',
          type: 'text',
          required: true,
        },

        { name: 'line1', type: 'text', required: true },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text', required: true },
        { name: 'state', type: 'text', required: true },
        { name: 'postal_code', type: 'text', required: true },
        { name: 'country', type: 'text', defaultValue: 'India' },

        {
          name: 'is_default',
          type: 'checkbox',
          label: 'Default Address',
        },
      ],
    },

    // 🛒 LAST LOGIN (useful for analytics)
    {
      name: 'last_login',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
}
