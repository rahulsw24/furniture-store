import axios from 'axios'
import { EmailAdapter, SendEmailOptions } from 'payload'

// We return a function that Payload will call internally during initialization
const brevoAdapter = (): any => {
  return () => ({
    defaultFromAddress: process.env.BREVO_SENDER_EMAIL as string,
    defaultFromName: process.env.BREVO_SENDER_NAME as string,

    sendEmail: async (message: SendEmailOptions): Promise<unknown> => {
      // 1. Map 'to' to Brevo's array format
      const toArray = Array.isArray(message.to)
        ? message.to.map((item: any) => ({
            email: typeof item === 'string' ? item : item.address,
          }))
        : [{ email: typeof message.to === 'string' ? message.to : (message.to as any)?.address }]

      // 2. Handle Attachments
      const attachments = message.attachments?.map((att: any) => ({
        content: Buffer.isBuffer(att.content)
          ? att.content.toString('base64')
          : Buffer.from(att.content).toString('base64'),
        name: att.filename,
      }))

      const payload = {
        sender: {
          name: process.env.BREVO_SENDER_NAME,
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: toArray,
        subject: message.subject,
        htmlContent: message.html,
        textContent: message.text,
        ...(attachments && attachments.length > 0 && { attachments }),
      }

      try {
        const res = await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
          headers: {
            'api-key': process.env.BREVO_API_KEY as string,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
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