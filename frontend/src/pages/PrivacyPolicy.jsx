import React from "react"
import LegalLayout from "../components/LegalLayout"

const PrivacyPolicy = () => (
    <LegalLayout title="Privacy Policy" lastUpdated="February 2026">
        <h3>1. Data Collection</h3>
        <p>We collect information you provide directly to us when you create an account, place an order, or contact our support team. This includes name, email, phone number, and delivery address.</p>

        <h3>2. Usage of Data</h3>
        <p>Your data is used solely to process orders, improve our furniture designs, and communicate updates about your shipment.</p>

        <h3>3. Payment Security</h3>
        <p>We do not store your credit/debit card information. All payments are processed through Razorpay, a PCI-DSS compliant payment gateway.</p>
    </LegalLayout>
)

export default PrivacyPolicy