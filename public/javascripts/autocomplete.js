const suggestions = document.querySelector('.suggestions')
const productId = document.querySelector('.productId')

function findMatches(wordToMatch, products) {
  return products.filter(product => {
    return String(product.id).match(wordToMatch)
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
