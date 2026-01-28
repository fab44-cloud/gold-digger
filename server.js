import http from 'node:http'
import path from 'node:path'
import { serveStatic } from './utils/serveStatic.js'
import { generateNewPrice } from './utils/priceSimulator.js'
import { sendResponse } from './utils/sendResponse.js'

const PORT = 3000

const __dirname = import.meta.dirname

const server = http.createServer((req, res) => {
    if (req.url === "/api") {
        const price = generateNewPrice()
        sendResponse(res, 200, 'application/json', JSON.stringify({price: price}))
        return
    }
    serveStatic(req, res, __dirname)
})

server.listen(PORT, () => console.log(`Connected on port ${PORT}`))