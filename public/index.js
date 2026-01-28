const priceDisplay = document.getElementById('price-display')
const dialog = document.querySelector('.outputs')

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

 document.querySelector('main').addEventListener('click', (event) => {
    const investBtn = event.target.closest('#invest-btn')
    const okBtn = event.target.closest('#ok-btn')

    if (investBtn) {
        event.preventDefault()
        dialog.showModal()
    } else if (okBtn) {
        dialog.close()
    }
 })