const searchInput = document.getElementById('phone_nr')
const suggestions = document.querySelector('.suggestions')

const endpoint = '/api/customers'
const customers = []

fetch(endpoint)
  .then(blob => blob.json())
  .then(data => {
    customers.push(...data)
  })

function findMatches(wordToMatch, customers) {
  return customers.filter(c => c.phoneNr.match(wordToMatch))
}

function displayMatches() {
  const matchArray = findMatches(this.value, customers)
  suggestions.innerHTML = matchArray
    .map(c => {
      return `
      <li>
        <a href="/customers/${c.id}">${c.phoneNr}<span style="float: right;">${
        c.name
      }<span></a>
      </li>
      `
    })
    .join('')
}

searchInput.addEventListener('change', displayMatches)
searchInput.addEventListener('keyup', displayMatches)
