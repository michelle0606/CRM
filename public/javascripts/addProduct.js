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

  if (Number(productId) === 0) {
    alert('請輸入產品編號！')
  } else if (Number(count) === 0) {
    alert('請輸入產品數量！')
  } else if (product.length === 0) {
    alert('產品編號錯誤！')
  } else {
    const newRow = document.createElement('tr')

    newRow.appendChild(
      document.createElement('td')
    ).innerHTML = `<input type='number' value='${product[0].id}' name="productId">`
    newRow.appendChild(document.createElement('td')).innerHTML = product[0].name
    newRow.appendChild(
      document.createElement('td')
    ).innerHTML = `<input type='number' value='${count}' name="count">`
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

// Below is autocomplete function

const suggestions = document.querySelector('.suggestions')
const container = document.querySelector('.container')

function findMatches(wordToMatch, products) {
  return products.filter(product => {
    return String(product.id).match(wordToMatch) // Type 'Number' can't use match method
  })
}

function displayMatches() {
  const matchArray = findMatches(String(this.value), products)
  suggestions.innerHTML = matchArray
    .map(product => {
      const regex = new RegExp(this.value, 'gi')
      const productId = String(product.id).replace(
        regex,
        `<span class="match">${this.value}</span>`
      )
      return `
      <li data-id="${product.id}" class="target-product">
        ${productId} <span class="product-name">${product.name}</span>
      </li>
      `
    })
    .join('')
}

productId.addEventListener('change', displayMatches)
productId.addEventListener('keyup', displayMatches)
suggestions.addEventListener('click', autocomplete)

function autocomplete() {
  const target = event.target.closest('.target-product')

  productId.value = Number(target.dataset.id)
}

container.addEventListener('click', event => {
  suggestions.style.display = event.target !== productId ? 'none' : 'block'
})
