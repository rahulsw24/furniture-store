import { serve } from 'inngest/next'
import { inngest } from '../../../inngest/client'
import {
  handleInquiryCreated,
  handleOrderCreated,
  handleOrderPaid,
  handleOrderStatusUpdate,
  sendWelcomeEmail,
} from '../../../inngest/functions'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    sendWelcomeEmail,
    handleOrderCreated,
    handleOrderStatusUpdate,
    handleInquiryCreated,
    handleOrderPaid,
  ],
})
