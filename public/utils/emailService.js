import nodemailer from 'nodemailer'

export async function sendReceiptEmail(transactionData) {
    const testAccount = await nodemailer.createTestAccount()

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    })

    const info = await transporter.sendMail({
        from: '"Support" <support@example.com>',
        to: "investor@example.com",
        subject: `Your Receipt ${transactionData.id}`,
        text: `Thank you! You purchased ${transactionData.ounces} Oz for ${transactionData.amount}.`,
        html: `
            <div style="font-family: sans-serif; border: 1px solid #D4AF37; padding: 20px; border-radius: 10px;">
                <h2 style="color: #D4AF37;">Investment Receipt</h2>
                <p><strong>Transaction ID:</strong> ${transactionData.id}</p>
                <p><strong>Date:</strong> ${transactionData.date}</p>
                <hr>
                <p><strong>Quantity:</strong>${transactionData.ounces} Oz</p>
                <p><strong>Total Paid:</strong> <span style="font-size: 1.2em; font-weight: bold;">${transactionData.amount}</span></p>
                <p><em>This is a mock email for testing purposes</em></p>
            </div>
        `,
    })

    console.log("_____________________")
    console.log("Mock email sent")
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info))
    console.log("_____________________")

    return info
}