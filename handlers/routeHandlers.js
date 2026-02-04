import { parseJSONBody } from '../public/utils/parseJSONBody.js'
import { sendResponse } from '../public/utils/sendResponse.js'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { sanitizeInput } from '../public/utils/santitizeInput.js'
import { sendReceiptEmail } from '../public/utils/emailService.js'

export async function handlePost(req, res, __dirname) {
    try {
        const data = await parseJSONBody(req)
        const cleanData = sanitizeInput(data)
        const transactionId = randomUUID()
    
        const logEntry = `ID: ${transactionId}, ${new Date().toLocaleString()}, amount paid: £${cleanData.amount}, price per Oz: £${cleanData.price}, gold sold: ${cleanData.ounces} Oz\n`
    
        await fs.appendFile(path.join(__dirname, 'purchases.txt'), logEntry)

        const transactionData = {
            id: transactionId,
            date: new Date().toLocaleString(),
            amount: `£${cleanData.amount}`,
            ounces: `${cleanData.ounces}`
        }

        sendReceiptEmail(transactionData).catch(err => {
            console.error('Background Email Error', err)
        })

        sendResponse(res, 200, 'application/json', JSON.stringify({
            success: true,
            transactionId: transactionId
        }))
    } catch(err) {
        console.error('Error handling purchase', err)
        sendResponse(res, 500, 'application/json', 'Internal Server Error')
    }
}