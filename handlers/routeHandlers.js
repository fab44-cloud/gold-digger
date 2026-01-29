import { parseJSONBody } from "../utils/parseJSONBody.js"
import { sendResponse } from "../utils/sendResponse.js"

export async function handlePost(req, res) {
    const data = await parseJSONBody(req)

    console.log('Received data', data)

    sendResponse(res, 200, 'application/json', JSON.stringify({
        success: true,
        message: 'Purchase saved to the ledger'
    }))
}