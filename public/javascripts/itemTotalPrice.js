const itemPrices = document.querySelectorAll('[data-price="price"]')

itemPrices.forEach(price => {
  let totalPrice = 0
  totalPrice = Number(price.innerHTML) * Number(price.nextElementSibling.innerHTML)
  price.nextElementSibling.nextElementSibling.innerHTML = totalPrice
})