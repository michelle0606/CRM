const endpoint = '/api/products'
const products = []
const container = document.querySelector('.container')
const addButton = document.querySelector('.fa-plus-circle')
const productList = document.querySelector('.trade-product-list')
const productIdInputField = document.querySelector('.productId')
const countInputField = document.querySelector('.count')
const newRecord = []

fetch(endpoint)
  .then(blob => blob.json())
  .then(data => {
    products.push(...data)
  })

function addProduct(productId, count) {
  const product = products.filter(a => a.id === Number(productId))

  if (Number(productId) === 0) {
    alert('請輸入產品編號！')
    return
  } else if (Number(count) === 0) {
    alert('請輸入產品數量！')
    return
  } else if (product.length === 0) {
    alert('產品編號錯誤！')
    return
  } else {
    const newProduct = {
      id: Number(product[0].id),
      name: product[0].name,
      count: Number(count),
      salePrice: product[0].salePrice
    }
    newRecord.push(newProduct)
    renderRecord(newRecord)
    return newRecord
  }
}

function creatTableHeader() {
  let str = `
    <tr>
      <th scope="col">產品編號</th>
      <th scope="col">產品名稱</th>
      <th scope="col">數量</th>
      <th scope="col">價格</th>
      <th scope="col"></th>
    </tr>
  `
  return str
}

function renderRecord(record) {
  productList.innerHTML = creatTableHeader()

  record.forEach(product => {
    productList.innerHTML += `
      <tr>
        <td><input type='number' value='${product.id}' name="productId"></td>
        <td>${product.name}</td>
        <td class="trade-product-count"><input type='number' value='${
          product.count
        }' name="count" id="count" data-id="${
      product.id
    }"><i class="fas fa-sort"></i></td>
        <td><span class="price">${product.salePrice * product.count}</span></td>
        <td class="cancel" data-id="${
          product.id
        }"><i class="fas fa-minus-square"></i></td>
      </tr>
    `
  })
}

function cleanInput(productId, countInputField) {
  productId.value = ''
  count.value = ''
}

function calculateTotalPrice(record) {
  const totalPrice = document.querySelector('.total-price')
  let price = 0
  record.forEach(product => {
    price += product.salePrice * product.count
  })
  totalPrice.value = price
}

function cancelProduct(productId) {
  const removeData = newRecord.find(item => item.id === Number(productId))
  let index = newRecord.indexOf(removeData)
  newRecord.splice(index, 1)
  renderRecord(newRecord)
  calculateTotalPrice(newRecord)
}

function changeProductCount(productId, changeValue) {
  newRecord.filter(product => {
    if (product.id === productId) {
      product.count = Number(changeValue)
    }
  })
  renderRecord(newRecord)
  calculateTotalPrice(newRecord)
}

addButton.addEventListener('click', () => {
  calculateTotalPrice(
    addProduct(productIdInputField.value, countInputField.value)
  )
  cleanInput(productIdInputField, countInputField)
})

container.addEventListener('change', event => {
  if (event.target.id === 'count') {
    const productId = Number(event.target.dataset.id)
    changeProductCount(productId, event.target.value)
  }
})

container.addEventListener('click', event => {
  if (event.target.closest('.cancel')) {
    const canceltarget = event.target.closest('.cancel').dataset.id
    setTimeout(function() {
      cancelProduct(canceltarget)
    }, 400)
  }
})
