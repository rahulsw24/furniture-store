import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export const generateInvoicePDF = async (doc: any, settings: any) => {
  const pdf = new jsPDF()
  const gstRate = settings.gstPercentage || 18
  const divisor = 1 + gstRate / 100

  // --- HEADER: BoltLess Logo ---
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(28)
  pdf.setTextColor(0, 0, 0)
  pdf.text('BOLT', 20, 25)
  pdf.setFont('helvetica', 'light')
  pdf.setTextColor(150, 150, 150)
  pdf.text('LESS', 47, 25)
  pdf.circle(75, 23, 1.5, 'F')

  // --- BUSINESS DETAILS ---
  pdf.setFontSize(10)
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  const businessAddress = settings.companyAddress || 'Your Registered Office Address'
  pdf.text(businessAddress, 20, 35)
  pdf.text(`GSTIN: ${settings.gstNumber || 'N/A'}`, 20, 45)

  // --- INVOICE INFO ---
  pdf.text(`Order Number: #${doc.order_number}`, 140, 25)
  pdf.text(`Date: ${new Date(doc.createdAt).toLocaleDateString('en-IN')}`, 140, 30)
  pdf.text(`Status: ${doc.payment_status.toUpperCase()}`, 140, 35)

  // --- BILL TO ---
  pdf.setFont('helvetica', 'bold')
  pdf.text('BILL TO:', 20, 65)
  pdf.setFont('helvetica', 'normal')
  pdf.text(doc.shipping_address.full_name, 20, 70)
  pdf.text(`${doc.shipping_address.line1}, ${doc.shipping_address.line2 || ''}`, 20, 75)
  pdf.text(
    `${doc.shipping_address.city}, ${doc.shipping_address.state} - ${doc.shipping_address.postal_code}`,
    20,
    80,
  )
  pdf.text(`Phone: ${doc.customer_phone}`, 20, 85)

  // --- ITEMS TABLE ---
  const tableRows = doc.items.map((item: any) => {
    const itemBasePrice = item.subtotal / divisor
    return [
      item.product_name,
      item.quantity,
      `INR ${(item.unit_price / divisor).toFixed(2)}`,
      `INR ${itemBasePrice.toFixed(2)}`,
    ]
  })

  autoTable(pdf, {
    startY: 95,
    head: [['Product', 'Qty', 'Base Price', 'Subtotal']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [20, 20, 20], textColor: 255 },
  })

  // --- TOTALS CALCULATION ---
  const lastTable = (pdf as any).lastAutoTable
  const finalY = lastTable ? lastTable.finalY + 15 : 150

  const baseTotal = doc.total / divisor
  const totalGst = doc.total - baseTotal

  // Adjusted X-coordinates to prevent overlapping
  const labelX = 120
  const valueX = 190 // The "Right Wall" for numbers

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)

  pdf.text(`Subtotal (Base):`, labelX, finalY)
  pdf.text(`INR ${baseTotal.toFixed(2)}`, valueX, finalY, { align: 'right' })

  pdf.text(`GST (${gstRate}%):`, labelX, finalY + 8)
  pdf.text(`INR ${totalGst.toFixed(2)}`, valueX, finalY + 8, { align: 'right' })

  pdf.text(`Shipping:`, labelX, finalY + 16)
  pdf.text(`FREE`, valueX, finalY + 16, { align: 'right' })

  // Grand Total - Styled Bold and Larger
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(14)
  pdf.text(`Grand Total:`, labelX, finalY + 28)
  pdf.text(`INR ${doc.total.toLocaleString('en-IN')}`, valueX, finalY + 28, { align: 'right' })

  // Return as Buffer
  return Buffer.from(pdf.output('arraybuffer'))
}
