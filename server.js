import http from 'node:http'
import { serveStatic } from './utils/serveStatic.js'
import { generateNewPrice } from './utils/priceSimulator.js'
import { sendResponse } from './utils/sendResponse.js'
import { handlePost } from './handlers/routeHandlers.js'
import { EventEmitter } from 'node:events'
import fs from 'node:fs/promises'
import path, { dirname } from 'node:path'

const PORT = 3000

const __dirname = import.meta.dirname

const priceEmitter = new EventEmitter()

setInterval(() => {
    const newPrice = generateNewPrice()

    priceEmitter.emit('priceUpdate', newPrice)
}, 5000)

const server = http.createServer( async (req, res) => {
    if (req.url === '/api/updates' && req.method ==='GET') {
        res.statusCode = 200

        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')

        const onPriceUpdate = (price) => {
            res.write(`data: ${JSON.stringify({ price })}\n\n`)
        }

        priceEmitter.on('priceUpdate', onPriceUpdate)

        req.on('close', () => {
            priceEmitter.off('priceUpdate', onPriceUpdate)
            res.end()
        })

        return
    }
    else if (req.url === '/api') {
        const price = generateNewPrice()
        sendResponse(res, 200, 'application/json', JSON.stringify({price: price}))
        return
    }
    else if (req.url === '/purchase' && req.method === 'POST') {
        handlePost(req, res, __dirname)
    }
    else if (req.url.startsWith('/api/download-receipt') && req.method === 'GET') {
        const urlParams = new URL(req.url, `http://${req.headers.host}`)
        const transactionId = urlParams.searchParams.get('id')

        try {
            const filePath = path.join(__dirname, 'purchases.txt')
            const fileContent = await fs.readFile(filePath, 'utf-8')
            const lines = fileContent.split('\n')
            const transactionLine = lines.find(line => line.includes(transactionId))

            if (!transactionLine) {
                sendResponse(res, 404, 'text/plain', 'Transaction record not found')
                return
            }

            const parts = transactionLine.split(',')
            const transactionData = {
                id: parts[0].replace('ID: ', '').trim(),
                date: `${parts[1].trim()} at ${parts[2].trim()}`,
                amount: parts[3].includes(':') ? parts[3].split(':')[1].trim() : 'N/A',
                price: parts[4].includes(':') ? parts[4].split(':')[1].trim() : 'N/A',
                ounces: parts[5].includes(':') ? parts[5].split(':')[1].trim() : 'N/A'
            }

            const receiptText = `
            ID: ${transactionData.id}
            Date: ${transactionData.date}
            Gold: ${transactionData.ounces}
            Price: ${transactionData.price} / Oz
            Total: ${transactionData.amount}
            `.trim()

            res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Content-Disposition': `attachment; filename=receipt-${transactionId}.text`
            })
            res.end(receiptText)
            return
        } catch(err) {
            console.error('File system error', err)
            sendResponse(res, 500, 'text/plain', 'Error accessing transaction logs')
            return
        }
    }
    else if (!req.url.startsWith('/api')) {
        return await serveStatic(req, res, __dirname)
    }
})

server.listen(PORT, () => console.log(`Connected on port ${PORT}`))