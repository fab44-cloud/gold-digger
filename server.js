import http from 'node:http'
import { serveStatic } from './utils/serveStatic.js'
import { generateNewPrice } from './utils/priceSimulator.js'
import { sendResponse } from './utils/sendResponse.js'
import { handlePost } from './handlers/routeHandlers.js'
import { EventEmitter } from 'node:events'

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

        if (!transactionId) {
            sendResponse(res, 400, 'text/plain', 'Transaction ID required')
            return
        }

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=receipt-${transactionId}.pdf`
        })

        res.end('PDF Generation Placeholder')
        return
    }
    else if (!req.url.startsWith('/api')) {
        return await serveStatic(req, res, __dirname)
    }
})

server.listen(PORT, () => console.log(`Connected on port ${PORT}`))