// /***** drag function *****/

let sourceContainerId = ''

let dragSources = document.querySelectorAll('[draggable="true"]')
dragSources.forEach(dragSource => {
  dragSource.addEventListener('dragstart', dragStart)
  dragSource.addEventListener('dragend', dragEnd)
})

let dropTargets = document.querySelectorAll('[data-role="drag-drop-container"]')
dropTargets.forEach(dropTarget => {
  dropTarget.addEventListener('drop', dropped)
  dropTarget.addEventListener('dragenter', cancelDefault)
  dropTarget.addEventListener('dragover', dragOver)
  dropTarget.addEventListener('dragleave', dragLeave)
})

function dropped(e) {
  if (this.id !== sourceContainerId) {
    cancelDefault(e)
    let id = e.dataTransfer.getData('text/plain')
    e.target.appendChild(document.querySelector('#' + id))
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
const purchaseList = []

function setRecord(product) {
  const html = `
    <div class="bg">
      <div class="data-setting" data-id="${product.dataset.target}">
          <h2>${product.id}</h2>
        <div>
          <label for="amount">本次進貨數量</label>
          <input type="number" name="amount" id="amount">
        </div>
        <div>
          <label for="expiration-date">商品有效期限</label>
          <input type="date" name="expiration-date" id="expirationDate">
        </div>
        <div>
          <button type="button" class="check-record">送出</button>
        </div>
      </div>
    </div>
  `
  return (field.innerHTML += html)
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
    const box = document.querySelector('.bg')
    box.remove()
  }
  if (event.target.parentNode.className === 'purchase-products') {
    setRecord(event.target)
  }
})

function addOneNewRecord(ProductId, quantity, expirationDate) {
  purchaseList.push({
    ProductId: ProductId,
    quantity: quantity,
    expirationDate: expirationDate
  })
  console.log(purchaseList)
  console.log('aaaaa')
}

// function abandom(product) {
//   const box = document.querySelector('.bg')
//   box.remove()
// }
// var dragulaCards = dragula([
//   document.querySelector('#products'),
//   document.querySelector('#purchase-list')
// ])

// dragulaCards.on('drop', function(el, target, source, sibling) {
//   console.log(source) // from
//   console.log(target) // to
//   console.log(sibling) // next card
// })

// var dragulaKanban = dragula([document.querySelector('#kanban')], {
//   moves: function(el, container, handle) {
//     return handle.classList.contains('panel-title')
//   }
// })
