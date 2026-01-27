const priceDisplay = document.getElementById('price-display')

async function updatePrice() {
    try {
        const response = await fetch('/api/price')

        if (!response.ok) throw new Error('Server response failed')
    
        // Parse the JSON data from the server
        const data = await response.json()
        const price = data.price
    
        if (priceDisplay) {
            priceDisplay.textContent = price
            return true
        }

    } catch(err) {
        console.log(err)
    }
}

async function initApp() {
    const isLive = await updatePrice() 
    
    if (isLive) {
        setInterval(updatePrice, 5000)
    } else {
        setTimeout(initApp, 2000)
    }
}

initApp()