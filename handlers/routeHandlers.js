import { parseJSONBody } from '../utils/parseJSONBody.js'
import { sendResponse } from '../utils/sendResponse.js'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { sanitizeInput } from '../utils/santitizeInput.js'

export async function handlePost(req, res, __dirname) {
    try {
        const data = await parseJSONBody(req)
        const cleanData = sanitizeInput(data)
        const transactionId = randomUUID()
    
        const logEntry = `ID: ${transactionId}, ${new Date().toLocaleString()}, amount paid: £${cleanData.amount}, price per Oz: £${cleanData.price}, gold sold: ${cleanData.ounces} Oz\n`
    
        await fs.appendFile(path.join(__dirname, 'purchases.txt'), logEntry)

        sendResponse(res, 200, 'application/json', JSON.stringify({
            success: true,
            transactionId: transactionId
        }))
    } catch(err) {
        sendResponse(res, 500, 'application/json', JSON.stringify({error: 'Log failed'}))
    }
}