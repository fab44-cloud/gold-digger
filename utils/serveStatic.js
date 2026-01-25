import path from 'node:path'

export function serveStatic(baseDir) {
    const filePath = path.join(baseDir, 'public', 'index.html')
}