// /***** drag function *****/

let sourceContainerId = ''

function dragSetUp() {
  let dragSources = document.querySelectorAll('[draggable="true"]')
  dragSources.forEach(dragSource => {
    dragSource.addEventListener('dragstart', dragStart)
    dragSource.addEventListener('dragend', dragEnd)
  })

  let dropTargets = document.querySelectorAll(
    '[data-role="drag-drop-container"]'
  )
  dropTargets.forEach(dropTarget => {
    dropTarget.addEventListener('drop', dropped)
    dropTarget.addEventListener('dragenter', cancelDefault)
    dropTarget.addEventListener('dragover', dragOver)
    dropTarget.addEventListener('dragleave', dragLeave)
  })
}

dragSetUp()

function dropped(e) {
  if (this.id !== sourceContainerId) {
    cancelDefault(e)
    let id = e.dataTransfer.getData('text/plain')
    e.target.dataset.role !== 'drag-drop-container' // Child elements are not allowing drop
      ? e.target.parentElement.appendChild(document.querySelector('#' + id))
      : e.target.appendChild(document.querySelector('#' + id))
    this.classList.remove('hover')
  }
}

function cancelDefault(e) {
  e.preventDefault()
  e.stopPropagation()
  return false
}

function dragStart(e) {
  this.classList.add('dragging')
  e.dataTransfer.setData('text/plain', e.target.id)
  sourceContainerId = this.id
}

function dragEnd(e) {
  cancelDefault(e)
  this.classList.remove('dragging')
}

function dragOver(e) {
  cancelDefault(e)
  this.classList.add('hover')
}

function dragLeave(e) {
  this.classList.remove('hover')
}

/***** set purchase record function *****/

const field = document.querySelector('.main-content')

function setRecord(product) {
  const data = JSON.parse(localStorage.getItem('purchaseList')) || []
  const record = data.filter(
    item => Number(item.ProductId) === Number(product.dataset.target)
  )
  const html = generatorForm(product)
  field.innerHTML += html
  const listField = document.querySelector('.list-field')
  if (record.length !== 0) {
    return (listField.innerHTML = `
        <div class="single-record">
          <div>
            <label>本次進貨數量</label>
            <input type="number" name="amount" id="amount" value="${record[0].quantity}" data-count=>
          </div>
          <div>
            <label>商品有效期限</label>
            <input type="date" name="expiration-date" id="expirationDate" value="${record[0].expirationDate}">
          </div>
        </div>
  `)
  } else {
    return (listField.innerHTML = generatorNewList())
  }
}

function generatorNewList() {
  return `
    <div class="single-record">
      <div>
        <label>本次進貨數量</label>
        <input type="number" name="amount">
      </div>
      <div>
        <label>商品有效期限</label>
        <input type="date" name="expiration-date">
      </div>
    </div>
  `
}

function generatorForm(product) {
  return `
    <div class="bg">
      <div class="data-setting" data-id="${product.dataset.target}">
        <div class="card-title">
          <h2>${product.id}</h2>
          <button type="button" class="card-close" aria-label="Close">
           &times;
          </button>
        </div>
        <div class="list-field">
        
        </div>
        <div class="button-group">
          <button type="button" class="add-new-one">再新增一筆</button>
          <button type="button" class="check-record">送出</button>
        </div>
      </div>
    </div>
   `
}

field.addEventListener('click', event => {
  let product
  if (event.target.className === 'check-record') {
    product = event.target.closest('.data-setting')
    addOneNewRecord(
      product.dataset.id,
      Number(amount.value),
      expirationDate.value
    )
    removeBox()
  }
  if (event.target.className === 'card-close') {
    removeBox()
  }

  if (event.target.className === 'add-new-one') {
    const insertField = document.querySelector('.list-field')
    insertField.innerHTML += generatorNewList()
  }
  if (event.target.parentNode.className === 'purchase-products') {
    setRecord(event.target)
  }
})

function removeBox() {
  const box = document.querySelector('.bg')
  box.remove()
  dragSetUp()
}

function addOneNewRecord(ProductId, quantity, expirationDate) {
  const list = JSON.parse(localStorage.getItem('purchaseList')) || []
  list.push({
    ProductId: ProductId,
    quantity: quantity,
    expirationDate: expirationDate
  })
  localStorage.setItem('purchaseList', JSON.stringify(list))
}

const submit = document.querySelector('.purchase-submit > button')

function submitPurchaseList() {
  let url = 'http://localhost:3000/api/purchase'
  const purchaseList = JSON.parse(localStorage.getItem('purchaseList'))

  axios
    .post(url, {
      purchaseList: purchaseList
    })
    .then(function(response) {
      localStorage.removeItem('purchaseList')
      location.replace('/getqrcode')
    })
    .catch(function(error) {
      console.log(error)
    })
}

const clearAllButton = document.getElementById('clear-all')

function clearAll() {
  localStorage.removeItem('purchaseList')
  location.reload()
}
