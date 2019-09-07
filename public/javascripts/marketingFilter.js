const chooseFilter = document.querySelector('[data-choose="filter"]')
const chooseEmail = document.querySelector('[data-choose="email"]')
const filterSection = document.querySelector('.filter-section')
const emailSection = document.querySelector('.mail-section')

chooseFilter.addEventListener('click', () => {
  filterSection.style['display'] = 'block'
  emailSection.style['display'] = 'none'
})

chooseEmail.addEventListener('click', () => {
  filterSection.style['display'] = 'none'
  emailSection.style['display'] = 'block'
})

const endpoint = '/api/customers'
const customers = []

async function getData() {
  await fetch(endpoint)
    .then(blob => blob.json())
    .then(data => {
      customers.push(...data)
      createCustomer(customers)
      console.log(data)
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
    newRow.appendChild(
      document.createElement('td')
    ).innerHTML = `<input type="email" name="email" value="${customer.email}" readonly="readonly">`
    newRow.appendChild(
      document.createElement('td')
    ).innerHTML = `${customer.phoneNr}`

    filterList.appendChild(newRow)

    copy()
  })
}

filterButton.forEach(b => {
  b.addEventListener('change', () => {
    const filterSelect = []
    filterButton.forEach(filter => {
      filterSelect.push(filter.value)
    })

    const tagValue = filterSelect[0]
    const birthdayValue = filterSelect[1]
    const genderValue = filterSelect[2]

    tagFilterData = customers.filter(customer => {
      if (tagValue === 'all') {
        return customer
      } else {
        return customer.associatedTags.map(a => a.tag).includes(tagValue)
      }
    })

    birthdayFilterData = tagFilterData.filter(a => {
      if (birthdayValue === 'all') {
        return a
      }
      const date = new Date(a.birthday)
      if ((date.getMonth() + 1) === Number(birthdayValue)) {

        return a
      }
    })

    // priceFilterData = birthdayFilterData.filter(a => { })

    genderFilterData = birthdayFilterData.filter(a => {
      if (genderValue === 'all') {
        return a
      } else if (a.gender === genderValue) {
        return a
      }
    })
    createCustomer(genderFilterData)
  })
})

getData()

//Modal partical

const openButtons = document.querySelectorAll('[data-open="open"]')
const modalNext = document.querySelector('.modal-next')
const close = document.querySelectorAll('.close')

const mailTitle = document.querySelector('.mail-title input')
const contentSection = document.querySelector('.content-section textarea')
const modalData = document.querySelector('.modal-data')
const customerData = document.querySelector('.filter-list-section')
let copyData = ''

contentSection.addEventListener('input', e => {
  contentSection.textContent = e.target.value
})

function copy() {
  copyData = customerData.cloneNode(true)
}

function next() {
  const titleInput = mailTitle.value
  const contentInput = contentSection.textContent

  modalData.innerHTML = `
  <h1>傳送以下訊息：</h1>
            <h2>主旨：<input type="text" name="subject" value="${titleInput}" class="mail-input" readonly></h2>
            <span>訊息：<textarea name="message" class="mail-input" readonly>${contentInput}</textarea></span>
            <br/>
            <h1>目標客戶：</h1>
  `

  modalData.appendChild(copyData)
}

openButtons.forEach(open => {
  open.addEventListener('click', () => {
    if (open.id === 'next') {
      modalNext.style.display = 'block'
      next()
    }
  })
})

close.forEach(a =>
  a.addEventListener('click', () => {
    modalNext.style.display = 'none'
  })
)

//image show immediately
const imageShow = document.querySelector('.image-show')
const inputImage = document.querySelector("input[class='marketing-image']")

inputImage.addEventListener('change', e => {
  console.log(e.target.files)

  for (let i = 0; i < e.target.files.length; i++) {
    const file = e.target.files[i]

    const imgDiv = document.createElement('div')
    imgDiv.style.width = '150px'
    imgDiv.style.padding = '5px'

    const img = document.createElement('img')
    img.style.width = '100%'

    const reader = new FileReader()
    reader.onloadend = function() {
      img.src = reader.result
    }
    reader.readAsDataURL(file)

    imgDiv.append(img)
    imageShow.innerHTML = ''
    imageShow.append(imgDiv)

    //fetch 傳送至後端
    // let form = new FormData()
    // form.append("product[photos][]", e.target.files[i])

    // fetch('/marketing/template', {
    //   headers: {
    //     version: 1,
    //     "content-type": "application/json"
    //   },
    //   method: "POST",
    //   body: JSON.stringify({
    //     imageId: 1,
    //     icon: Array.from(new Uint8Array(reader))
    //   })
    // })
  }
})
