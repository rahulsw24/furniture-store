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
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        // Only send email when a NEW subscriber is created
        if (operation === 'create') {
          try {
            await req.payload.sendEmail({
              to: doc.email,
              subject: 'Welcome to the BoltLess List',
              html: `
                <!DOCTYPE html>
                <html>
                <body style="margin: 0; padding: 0; background-color: #FFFFFF;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF">
                    <tr>
                      <td align="center" style="padding: 40px 20px;">
                        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%;">
                          
                          <tr>
                            <td align="center" style="padding-bottom: 60px; font-family: 'Helvetica', Arial, sans-serif; font-size: 14px; font-weight: 900; letter-spacing: 4px; color: #000000; text-transform: uppercase;">
                              BOLTLESS
                            </td>
                          </tr>

                          <tr>
                            <td style="padding-bottom: 30px; text-align: center;">
                              <h1 style="font-family: 'Georgia', serif; font-size: 36px; color: #1A1A1A; margin: 0; font-weight: 400; font-style: italic;">
                                You're on the list.
                              </h1>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding-bottom: 40px; text-align: center;">
                              <p style="font-family: 'Helvetica', Arial, sans-serif; font-size: 15px; color: #666666; line-height: 1.8; margin: 0;">
                                Thank you for joining us. You’ll now be the first to know about new design drops, 
                                limited production runs, and the stories behind our tool-free assembly furniture.
                              </p>
                            </td>
                          </tr>

                          <tr>
                            <td align="center" style="padding-bottom: 60px;">
                              <a href="${process.env.PAYLOAD_PUBLIC_SERVER_URL}" 
                                 style="display: inline-block; background-color: #000000; color: #FFFFFF; text-align: center; padding: 18px 40px; text-decoration: none; font-family: 'Helvetica', Arial, sans-serif; font-size: 11px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; border-radius: 4px;">
                                 Explore the Collection
                              </a>
                            </td>
                          </tr>

                          <tr>
                            <td align="center" style="border-top: 1px solid #EEEEEE; padding-top: 40px;">
                              <p style="font-family: 'Helvetica', Arial, sans-serif; font-size: 10px; color: #999999; text-transform: uppercase; letter-spacing: 2px; margin: 0;">
                                Designed to move. Built to last.
                              </p>
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
          } catch (err) {
            console.error('Subscriber Welcome Email Failed:', err)
          }
        }
      },
    ],
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
