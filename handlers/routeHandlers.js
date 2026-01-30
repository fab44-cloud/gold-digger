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
        const transactionID = randomUUID()
    
        const logEntry = `ID: ${transactionID}, ${new Date().toLocaleString()}, amount paid: £${cleanData.amount}, price per Oz: £${cleanData.price}, gold sold: ${cleanData.ounces} Oz\n`
    
        await fs.appendFile(path.join(__dirname, 'purchases.txt'), logEntry)

        sendResponse(res, 200, 'application/json', JSON.stringify({
            success: true,
            transactionID: transactionID
        }))
    } catch(err) {
        sendResponse(res, 500, 'application/json', JSON.stringify({error: 'Log failed'}))
    }
}