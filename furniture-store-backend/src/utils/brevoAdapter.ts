import axios from 'axios'
import { EmailAdapter, SendEmailOptions } from 'payload'

const brevoAdapter = (): any => {
  return () => ({
    defaultFromAddress: process.env.BREVO_SENDER_EMAIL as string,
    defaultFromName: process.env.BREVO_SENDER_NAME as string,

    sendEmail: async (message: SendEmailOptions): Promise<unknown> => {
      // 1. Map recipients
      const toArray = Array.isArray(message.to)
        ? message.to.map((item: any) => ({
            email: typeof item === 'string' ? item : item.address,
          }))
        : [{ email: typeof message.to === 'string' ? message.to : (message.to as any)?.address }]

      // 2. Map Attachments (Renamed to 'brevoFiles' to avoid shorthand bugs)
      const brevoFiles = message.attachments?.map((att: any) => {
        let base64Content = ''

        if (Buffer.isBuffer(att.content)) {
          base64Content = att.content.toString('base64')
        } else if (typeof att.content === 'object' && att.content.data) {
          base64Content = Buffer.from(att.content.data).toString('base64')
        } else {
          base64Content = Buffer.from(att.content).toString('base64')
        }

        return {
          content: base64Content,
          name: att.filename, // Brevo requires 'name'
        }
      })

      // 3. Construct Payload
      const payload: any = {
        sender: {
          name: process.env.BREVO_SENDER_NAME,
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: toArray,
        subject: message.subject,
        htmlContent: message.html,
      }

      // Only add these if they actually exist
      if (message.text) payload.textContent = message.text

      // ✅ FORCE THE KEY TO BE SINGULAR 'attachment'
      if (brevoFiles && brevoFiles.length > 0) {
        payload.attachment = brevoFiles
      }

      // --- LOG THIS AND CHECK FOR THE KEY 'attachment' (NO S) ---
      console.log('SENDING TO BREVO:', JSON.stringify(payload, null, 2))

      try {
        const res = await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
          headers: {
            'api-key': process.env.BREVO_API_KEY as string,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
        return res.data
      } catch (error: any) {
        console.error('❌ Brevo Error:', error.response?.data || error.message)
        throw error
      }
    },
  })
}

export default brevoAdapter
