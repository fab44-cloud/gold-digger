let currentGoldPrice = 5000
const volatility = 2.5

export function generateNewPrice() {
    const change = (Math.random() - 0.5) * 2 * volatility
    currentGoldPrice += change
    return currentGoldPrice.toFixed(2)
}