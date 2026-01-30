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

    console.log(`[Server] Price updated and emitted £${newPrice}`)
}, 5000)

const server = http.createServer( async (req, res) => {
    if (req.url === '/api') {
        const price = generateNewPrice()
        sendResponse(res, 200, 'application/json', JSON.stringify({price: price}))
        return
    }
    else if (req.url === '/purchase' && req.method === 'POST') {
        handlePost(req, res, __dirname)
    }
    else if (!req.url.startsWith('/api')) {
        return await serveStatic(req, res, __dirname)
    }
})

server.listen(PORT, () => console.log(`Connected on port ${PORT}`))