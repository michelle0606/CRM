const endpoint = '/api/customers'
const customers = []

fetch(endpoint)
  .then(blob => blob.json())
  .then(data => {
    customers.push(...data)
  })

const filterButton = document.querySelectorAll('[data-filter="filter"]')
const filterList = document.querySelector('.filter-list')

filterButton.forEach(b => {

  b.addEventListener('change', () => {
    const filterSelect = []
    filterButton.forEach(filter => {
      filterSelect.push(filter.value)
    })
    const tag = filterSelect[0]
    const birthday = filterSelect[1]
    const price = filterSelect[2]
    const gender = filterSelect[3]

    let tagFilterData = []
    let birthdayFilterData = []
    let priceFilterData = []
    let genderFilterData = []

    birthdayFilterData = customers.filter(a => {
      const date = new Date(a.birthday)
      if ((date.getMonth() + 1) === Number(birthday)) {
        return a
      }
    })

    // priceFilterData = birthdayFilterData.filter(a => { })

    genderFilterData = birthdayFilterData.filter(a => {
      if (gender === 'all') {
        return a
      } else if (a.gender === gender) {
        return a
      }
    }
    )

    filterList.innerHTML = `<table class="filter-list">
          <tr>
            <th>Name</th>
            <th>E-mail</th>
            <th>Phone</th>
          </tr>`

    genderFilterData.forEach(customer => {
      const newRow = document.createElement('tr')

      newRow.appendChild(
        document.createElement('td')
      ).innerHTML = `${customer.name}`
      newRow.appendChild(document.createElement('td')).innerHTML = `${customer.email}`
      newRow.appendChild(
        document.createElement('td')
      ).innerHTML = `${customer.phoneNr}`

      filterList.appendChild(newRow)
    })

  })
})



