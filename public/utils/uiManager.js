export function updateConnectionStatus(isConnected) {
    const connectionStatus = document.getElementById('connection-status')
    const investBtn = document.getElementById('invest-btn')
    
    if (isConnected) {
        connectionStatus.textContent = 'Live Price 🟢'
        investBtn.disabled = false
        investBtn.style.opacity = '1'
    } else {
        connectionStatus.textContent = 'Disconnected 🔴'
        investBtn.disabled = true
        investBtn.style.opacity = '0.5'
    }
}