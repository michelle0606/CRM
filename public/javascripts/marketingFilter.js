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

const shopEndPoint = '/api/shopInfo'
let shopInfo

async function getData() {
  await fetch(customerEndPoint)
    .then(blob => blob.json())
    .then(data => {
      customers.push(...data)
      createCustomer(customers)
    })

  await fetch(templateEndPoint)
    .then(blob => blob.json())
    .then(data => {
      templates.push(...data)
    })

  await fetch(shopEndPoint)
    .then(blob => blob.json())
    .then(data => {
      shopInfo = [data]
    })
}
getData()

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
      if (date.getMonth() + 1 === Number(birthdayValue)) {
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

//Modal partical

const openButtons = document.querySelector('[data-open="open"]')
const modalNext = document.querySelector('.modal-next')
const close = document.querySelector('.close')
const mailTitle = document.querySelector('.mail-title input')
const contentSection = document.querySelector('.content-section textarea')
const modalData = document.querySelector('.modal-data')
const customerData = document.querySelector('.filter-list-section')

contentSection.addEventListener('input', e => {
  contentSection.textContent = e.target.value
})

async function next() {
  const titleInput = mailTitle.value
  const contentInput = contentSection.textContent
  // const copyData = customerData.cloneNode(true)
  // const h2fCustomerList = document.createElement('h2')
  // const imgPreview = img.cloneNode(true) //copy upload img and could use commonly
  // imgPreview.style.width = '100%'
  // const imgDiv = document.createElement('div')
  // imgDiv.style.width = '100%'
  // h2fCustomerList.innerHTML = '<h2>目標客戶:</h2>'
  // imgDiv.append(h2fCustomerList)
  modalData.innerHTML = `
    <h1>預覽郵件</h1>
    <div style="border: 1px solid #ddd; margin: 20px 0px; border-radius: 5px;">
      <div style="width: 500px; margin: auto;">
        <br />
        <div>
          <img src="${shopInfo[0].logo}" alt="" width="200px">
        </div>
        <br />
        <div>
          <h2>${titleInput}</h2>
        </div>
        <div style="width: inherit;">
          <img src="https://picsum.photos/930/400" style="width: inherit;" class="img-fluid" alt="Responsive image" />
        </div>
        <br />
        <div>
          ${contentInput}
        </div>
        <br />
        <div>${shopInfo[0].name}</div>
        <div>店家地址 ${shopInfo[0].address}</div>
        <div>聯絡電話 ${shopInfo[0].phoneNr}</div>
        <div>服務信箱 ${shopInfo[0].email}</div>
        <br />
        <div style="font-size: 13px; color:red">這是由 WAROEMN 系統發送的訊息，並非官方電子信箱，請勿直接回覆，謝謝。</div>
        <br />
      </div>
    </div>
  `

  // modalData.append(imgDiv)
  // modalData.appendChild(copyData)
}

openButtons.addEventListener('click', () => {
  modalNext.style.display = 'block'
  next()
})

close.addEventListener('click', () => {
  modalNext.style.display = 'none'
})

//image show immediately
const imageShow = document.querySelector('.image-show')
const inputImage = document.querySelector("input[class='marketing-image']")
const img = document.createElement('img') // put on the global to let modal partial can use this
img.style.height = '100%'

inputImage.addEventListener('change', e => {
  for (let i = 0; i < e.target.files.length; i++) {
    const file = e.target.files[i]

    const imgDiv = document.createElement('div')
    imgDiv.style.width = '100%'
    imgDiv.style.height = '100%'

    const reader = new FileReader()
    reader.onloadend = function() {
      img.src = reader.result
    }
    reader.readAsDataURL(file)

    imgDiv.innerHTML = '<i class="fa fa-times-circle fa-2x delete-mark"></i>'
    imgDiv.appendChild(img)
    imageShow.innerHTML = ''
    imageShow.append(imgDiv)

    clear() // create delete button and function
  }
})

function clear() {
  const deleteButton = document.querySelector('.delete-mark')
  deleteButton.addEventListener('click', () => {
    inputImage.value = ''
    imageShow.innerHTML = `
  <i class="far fa-image"></i>
  `
    img.src = ''
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
  clear()
})

clear() // When you render marketing page, if your template has img that will create a delete button/function on the img
