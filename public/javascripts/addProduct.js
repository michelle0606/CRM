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
.then((res) => res.json())
.then((data) => products.push(...data))
.catch((error) => console.log(error));

function addProduct(itemInfo, count) {
  // itemInfo needs to be in the format of 'id exp_date stock_date'
  // e.g. '22 2020-01-31 2019-12-11'
  const itemInfoArr = itemInfo.split(' ')
  const itemId = Number(itemInfoArr[0])
  const itemExpDate = itemInfoArr[1]
  const itemStockDate = itemInfoArr[2]
  const product = products.find(a => a.id === itemId)
  const existProduct = newRecord.find(item => item.id === itemId)

  if (itemId === 0) {
    alert('請輸入產品編號！')
    return null
  } else if (count === 0) {
    alert('請輸入產品數量！')
    return null
  } else if (product === undefined) {
    alert('產品編號錯誤！')
    return null
  } else if (existProduct !== undefined) {
    existProduct.count += count
    existProduct.expDates += (' ' + itemExpDate)
    existProduct.stockDates += (' ' + itemStockDate)
    renderRecord(newRecord)
    return newRecord
  } else {
    const newProduct = {
      id: product.id,
      name: product.name,
      count: count,
      salePrice: product.salePrice,
      expDates: itemExpDate,
      stockDates: itemStockDate
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
        <td class="trade-product-count"><input type='number' value='${product.count}' name="count" id="count" 
        data-id="${product.id}"><i class="fas fa-sort"></i></td>
        <td><span class="price">${product.salePrice * product.count}</span></td>
        <td class="cancel" data-id="${product.id}"><i class="fas fa-minus-square"></i></td>
        <td><input type="text" value='${product.expDates}' name="expDates"></td>
        <td><input type="text" value='${product.stockDates}' name="stockDates"></td>
      </tr>
    `
  })
}

function calculateTotalPrice(record) {
  const totalPrice = document.querySelector('.total-price')
  let price = 0

  if (!record) return

  record.forEach(product => {
    price += product.salePrice * product.count
  })
  totalPrice.value = price
}

function cancelProduct(productId) {
  const removeData = newRecord.find(item => item.id === Number(productId))
  const index = newRecord.indexOf(removeData)
  newRecord.splice(index, 1)
  renderRecord(newRecord)
  calculateTotalPrice(newRecord)
}

function changeProductCount(productId, changeValue) {
  const product = newRecord.find(el => el.id === productId)
  product.count = Number(changeValue)
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
  // calculateTotalPrice(addProduct((productIdInputField.value), Number(countInputField.value)))
  calculateTotalPrice(addProduct('22 2020-01-31 2019-12-11', Number(countInputField.value)))
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
