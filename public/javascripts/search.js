const searchInput = document.getElementById('keyword')
const clear = document.getElementById('clear')
const table = document.querySelector('.table')

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
  table.innerHTML = `<tr>
        <th scope="col">姓名</th>
        <th scope="col">Email</th>
        <th scope="col">電話號碼</th>
      </tr>`
  table.innerHTML += matchArray
    .map(c => {
      return `<tr>
                <td><a href="/customers/${c.id}">${c.name}</a></td>
                <td>${c.email}</td>
                <td>${c.phoneNr}</td>
              </tr>
    `
    })
    .join('')
}

searchInput.addEventListener('change', displayMatches)
searchInput.addEventListener('keyup', displayMatches)
clear.addEventListener('click', () => {
  searchInput.value = ''
})
