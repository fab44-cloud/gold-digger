const priceDisplay = document.getElementById('price-display')

async function updatePrice() {
    try {
        const data = await fetch('/api')
        if (!data.ok) return false
        // Parse the JSON data from the server
        const response = await data.json()
        const price = response.price
    
        if (priceDisplay) {
            priceDisplay.textContent = price
        }
        return true

    } catch(err) {
        console.log(err)
        return false
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