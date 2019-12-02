const endpoint = '/api/products'
const products = []
const container = document.querySelector('.container')
const addButton = document.querySelector('.fa-plus-circle')
const productList = document.querySelector('.trade-product-list')
const productIdInputField = document.querySelector('.productId')
const countInputField = document.querySelector('.count')
const newRecord = []

productIdInputField.focus()

fetch(endpoint)
  .then(blob => blob.json())
  .then(data => {
    products.push(...data)
  })

function addProduct(productId, count) {
  const product = products.filter(a => a.id === productId)
  const existProduct = newRecord.find(item => item.id === productId)

  if (productId === 0) {
    alert('請輸入產品編號！')
    return
  } else if (count === 0) {
    alert('請輸入產品數量！')
    return
  } else if (product.length === 0) {
    alert('產品編號錯誤！')
    return
  } else if (existProduct !== undefined) {
    existProduct.count += count
    renderRecord(newRecord)
    return newRecord
  } else {
    const newProduct = {
      id: product[0].id,
      name: product[0].name,
      count: count,
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


productIdInputField.addEventListener('keydown', (e) => {
  if (e.which === 13) {// key Enter
    e.preventDefault()
    const res = productIdInputField.value.split(' ')
    if (res[0] === 'PAY') {
      document.querySelector('.Button2').click()
    } else if (res[0] === 'CUSTOMER') {
      window.location.pathname = '/customers/' + res[1] + '/record'
    } else {
      addButton.click();
    }
  }
})

addButton.addEventListener('click', () => {
  calculateTotalPrice(
    addProduct(Number(productIdInputField.value), Number(countInputField.value))
  )
  productIdInputField.value = ''
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
