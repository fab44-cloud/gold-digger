import http from 'node:http'
import path from 'node:path'
import { serveStatic } from './utils/serveStatic.js'

const PORT = 3000

const __dirname = import.meta.dirname

const server = http.createServer((req, res) => {
    serveStatic(req, res, __dirname)
})

server.listen(PORT, () => console.log(`Connected on port ${PORT}`))