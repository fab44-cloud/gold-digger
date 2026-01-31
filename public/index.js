const priceDisplay = document.getElementById('price-display')
const dialog = document.querySelector('.outputs')

// async function updatePrice() {
//     try {
//         const data = await fetch('/api')
//         if (!data.ok) return false
//         // Parse the JSON data from the server
//         const response = await data.json()
//         const price = response.price
    
//         if (priceDisplay) {
//             priceDisplay.textContent = price
//         }
//         return true

//     } catch(err) {
//         console.log(err)
//         return false
//     }
// }

// async function initApp() {
//      const isLive = await updatePrice() 
    
//     if (isLive) {
//         setInterval(updatePrice, 5000)
//     } else {
//         setTimeout(initApp, 2000)
//     }
//  }

//  initApp()

const eventSource = new EventSource('/api/updates')

eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)

    if (priceDisplay) {
        priceDisplay.textContent = data.price
    }
}

 document.querySelector('main').addEventListener('click', (event) => {
    const investBtn = event.target.closest('#invest-btn')
    const okBtn = event.target.closest('#ok-btn')

    if (investBtn) {
        event.preventDefault()

        const amountInput = document.getElementById('investment-amount')
        const price = parseFloat(priceDisplay.textContent)
        const amount = parseFloat(amountInput.value)
        const investmentSummary = document.getElementById('investment-summary')

        if (amount > 0) {
            const ouncesCalculation = (amount / price).toFixed(4)
            investmentSummary.innerText = `You just bought ${ouncesCalculation} ounces (ozt) for £${amount.toLocaleString()}. \n You will receive
            documentation shortly.`

        fetch('/purchase', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                amount: amount,
                ounces: ouncesCalculation,
                price: price
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                investmentSummary.innerHTML += `<br><small>Transaction ID: ${data.transactionID}</small>`
            }
            dialog.showModal()
        })
        .catch(err => console.error('Connection error', err))
        } else {
            return
        }
    } else if (okBtn) {
        dialog.close()
        const amountInput = document.getElementById('investment-amount')
        amountInput.value = ''
        amountInput.focus()
    }
 })