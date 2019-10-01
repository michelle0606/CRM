const container = document.querySelector('.container')
const downloadButton = document.querySelector('.download')
let itemsNotFormatted = []
let itemsFormatted = []
let endpoint
let fileTitle
let headers

function formatData(endpoint, fileName) {
  fetch(endpoint)
    .then(blob => blob.json())
    .then(data => {
      // format the data
      if (fileName === 'inventory') {
        itemsNotFormatted.push(...data)
        itemsNotFormatted.forEach(item => {
          itemsFormatted.push({
            ProductId: item.id,
            name: item.name,
            salePrice: item.salePrice,
            quantity: item.inventory
          })
        })
      }

      if (fileName === 'customerInfo') {
        itemsNotFormatted = [data]
        itemsNotFormatted.forEach(item => {
          itemsFormatted.push({
            name: item.name,
            email: item.email,
            phoneNr: item.phoneNr,
            address: item.address,
            gender: item.gender,
            age: item.age,
            birthday: item.birthday
          })
        })
      }
      exportCSVFile(headers, itemsFormatted, fileTitle)
    })
  return
}

function convertToCSV(objArray) {
  let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray
  let str = ''

  for (let i = 0; i < array.length; i++) {
    let line = ''
    for (let index in array[i]) {
      if (line != '') line += ','

      line += array[i][index]
    }

    str += line + '\r\n'
  }

  return str
}

function exportCSVFile(headers, items, fileTitle) {
  if (headers) {
    items.unshift(headers)
  }

  let jsonObject = JSON.stringify(items)

  let csv = this.convertToCSV(jsonObject)

  let exportedFilenmae = fileTitle + '.csv' || 'export.csv'

  let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, exportedFilenmae)
  } else {
    let link = document.createElement('a')
    if (link.download !== undefined) {
      let url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', exportedFilenmae)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}

container.addEventListener('click', event => {
  const target = event.target.closest('.download')
  if (target.id === 'download-invertory') {
    endpoint = '/api/products'
    fileTitle = 'Inventory'
    headers = {
      ProductId: 'ProductId',
      name: 'name',
      salePrice: 'salePrice',
      quantity: 'quantity'
    }
    formatData(endpoint, 'inventory')
  }

  if (target.id === 'download-customer') {
    endpoint = `/api/customer/${target.dataset.id}`
    fileTitle = 'Customer Information'
    headers = {
      name: 'Name',
      email: 'Email',
      phoneNr: 'Phone Number',
      address: 'Address',
      gender: 'Gender',
      age: 'Age',
      birthday: 'Birthday'
    }
    formatData(endpoint, 'customerInfo')
  }
})
