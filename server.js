import http from 'node:http'
import path from 'node:path'

const PORT = 3000

const __dirname = import.meta.dirname

const server = http.createServer((req, res) => {

    const pathToResource = path.join(__dirname, 'public', 'index.html')

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end('<html><h1>The server is working!!</h1></html>')
})

server.listen(PORT, () => console.log(`Connected on port ${PORT}`))