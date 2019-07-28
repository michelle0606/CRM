
const addButton = document.querySelector('.fa-plus-circle')
const productList = document.querySelector('.trade-product-list')

const endpoint = '/api/products'
const products = []

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

    newRow.appendChild(document.createElement('td')).innerHTML = product[0].id
    newRow.appendChild(document.createElement('td')).innerHTML = product[0].name
    newRow.appendChild(document.createElement('td')).innerHTML = count
    newRow.appendChild(document.createElement('td')).innerHTML = product[0].salePrice
    newRow.appendChild(document.createElement('td')).innerHTML = `<i class="fas fa-minus-square"></i>`

    productList.appendChild(newRow)
  }

}

addButton.addEventListener('click', () => {
  const productId = addButton.previousElementSibling.previousElementSibling.value
  const count = addButton.previousElementSibling.value
  addProduct(productId, count)
})