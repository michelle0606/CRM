const chooseFilter = document.querySelector('[data-choose="filter"]')
const chooseEmail = document.querySelector('[data-choose="email"]')
const filterSection = document.querySelector('.filter-section')
const emailSection = document.querySelector('.mail-section')

chooseFilter.addEventListener('click', () => {
  filterSection.style['display'] = "block"
  emailSection.style['display'] = "none"
})

chooseEmail.addEventListener('click', () => {
  filterSection.style['display'] = "none"
  emailSection.style['display'] = "block"
})

const endpoint = '/api/customers'
const customers = []

async function getData() {
  await fetch(endpoint)
    .then(blob => blob.json())
    .then(data => {
      customers.push(...data)
      createCustomer(customers)
    })
}

const filterButton = document.querySelectorAll('[data-filter="filter"]')
const filterList = document.querySelector('.filter-list')

let tagFilterData = []
let birthdayFilterData = []
let priceFilterData = []
let genderFilterData = []

function createCustomer(data) {
  filterList.innerHTML = `<table class="filter-list">
          <tr>
            <th>Name</th>
            <th>E-mail</th>
            <th>Phone</th>
          </tr>`
  data.forEach(customer => {
    const newRow = document.createElement('tr')
    newRow.appendChild(
      document.createElement('td')
    ).innerHTML = `${customer.name}`
    newRow.appendChild(document.createElement('td')).innerHTML = `<input type="email" name="email" value="${customer.email}" readonly="readonly">`
    newRow.appendChild(
      document.createElement('td')
    ).innerHTML = `${customer.phoneNr}`

    filterList.appendChild(newRow)
  })
}


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



    birthdayFilterData = customers.filter(a => {
      if (birthday === 'all') {
        return a
      }
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
    createCustomer(genderFilterData)

  })
})


getData()

// function addRecipient() {
//   const list = []

//   list.push(...genderFilterData)

//   localStorage.setItem('recipientList', JSON.stringify(list))
// }



const formData = new FormData();
const fileField = document.querySelector('input[type="file"]');

fileField.addEventListener('change', (e) => {
  for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {

    var file = e.originalEvent.srcElement.files[i];

    var img = document.createElement("img");
    var reader = new FileReader();
    reader.onloadend = function () {
      img.src = reader.result;
    }
    reader.readAsDataURL(file);
    fileField.after(img)
  }
})


// function test() {
//   console.log('hello')

//   formData.append('username', 'abc123');
//   formData.append('info', fileField.files[0]);

//   console.log(formData)

  // fetch('/marketing/image', {
  //   method: 'PUT',
  //   body: formData
  // })
  //   .then(response => response.json())
  //   .catch(error => console.error('Error:', error))
  //   .then(response => console.log('Success:', JSON.stringify(response)));
// }


