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

const customerEndPoint = '/api/customers'
const customers = []

const templateEndPoint = '/api/template'
const templates = []


async function getData() {
  await fetch(customerEndPoint).then(blob => blob.json()).then(data => {
    customers.push(...data)
    createCustomer(customers)
  })

  await fetch(templateEndPoint).then(blob => blob.json()).then(data => {
    templates.push(...data)
    console.log(templates)
  })
}

const filterButton = document.querySelectorAll('[data-filter="filter"]')
const filterList = document.querySelector('.filter-list')

let tagFilterData = []
let birthdayFilterData = []
let priceFilterData = []
let genderFilterData = []

function createCustomer(data) {

  const receiveEmail = data.filter(customer => {
    if (customer.receiveEmail) {
      return true
    } else {
      return false
    }
  })


  filterList.innerHTML = `<table class="filter-list">
          <tr>
            <th>Name</th>
            <th>E-mail</th>
            <th>Phone</th>
          </tr>`
  receiveEmail.forEach(customer => {
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

  for (let i = 0; i < e.target.files.length; i++) {
    const file = e.target.files[i]

    const imgDiv = document.createElement('div')
    imgDiv.style.width = '100%'
    imgDiv.style.height = '100%'

    const img = document.createElement('img')
    img.style.height = '100%'

    const reader = new FileReader()
    reader.onloadend = function () {
      img.src = reader.result
    }
    reader.readAsDataURL(file)


    imgDiv.innerHTML = '<i class="fa fa-times-circle fa-2x delete-mark"></i>'
    imgDiv.appendChild(img)
    imageShow.innerHTML = ''
    imageShow.append(imgDiv)

    clear()
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

function clear() {
  const deleteButton = document.querySelector('.delete-mark')

  deleteButton.addEventListener('click', () => {
    inputImage.value = ''
    imageShow.innerHTML = `
  <i class="far fa-image"></i>
  `
  })
}

const templateSelect = document.querySelector('.template-select')


templateSelect.addEventListener('change', () => {

  const template = templates.filter(a => a.id === Number(templateSelect.value))
  const mailTitle = document.querySelector('.mail-title')
  const mailContent = document.querySelector('.content-section')


  mailTitle.innerHTML = `
  <input type="text" name="title" placeholder="郵件標題" class="mail-input" value="${template[0].title}">
  `
  mailContent.innerHTML = `
  <div class="mail-blank-section"></div>
  <textarea name="message" rows="10" placeholder="郵件內容" class="mail-input">${template[0].message}</textarea>
  `

  if (template[0].image === null) {
    imageShow.innerHTML = `
    <i class="far fa-image"></i>
    `
  } else {
    imageShow.innerHTML = `
    <div class="image-section">
      <i class="fa fa-times-circle fa-2x delete-mark"></i>
      <img src="${template[0].image}" class="template-image">
    </div>
    `
  }

})


clear()