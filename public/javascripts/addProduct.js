const endpoint = '/api/products'
const products = []

const addButton = document.querySelector('.fa-plus-circle')
const productList = document.querySelector('.trade-product-list')
const productId = document.querySelector('.productId')
const count = document.querySelector('.count')

fetch(endpoint)
  .then(blob => blob.json())
  .then(data => {
    products.push(...data)
  })

function addProduct(productId, count) {
  const product = products.filter(a => a.id === Number(productId))

  if (Number(productId) === 0 || Number(count) === 0) {
    console.log('err')
  } else if (product.length === 0) {
    console.log('No match id')
  } else {
    const newRow = document.createElement('tr')

    newRow.appendChild(
      document.createElement('td')
    ).innerHTML = `<input type='number' value='${
      product[0].id
    }' name="productId" readonly="readonly">`
    newRow.appendChild(document.createElement('td')).innerHTML = product[0].name
    newRow.appendChild(
      document.createElement('td')
    ).innerHTML = `<input type='number' value='${count}' name="count" readonly="readonly">`
    newRow.appendChild(
      document.createElement('td')
    ).innerHTML = `<span class="price">${product[0].salePrice * count}</span>`
    newRow.appendChild(
      document.createElement('td')
    ).innerHTML = `<i class="fas fa-minus-square"></i>`

    productList.appendChild(newRow)
  }
}

function cleanInput(productId, count) {
  productId.value = ''
  count.value = ''
}

function total() {
  const totalPrice = document.querySelector('.total-price')
  const allPrice = document.querySelectorAll('.price')
  let price = 0
  allPrice.forEach(a => {
    price += Number(a.innerHTML)
  })
  totalPrice.value = price
}

addButton.addEventListener('click', () => {
  addProduct(productId.value, count.value)
  total()
  cleanInput(productId, count)
})
