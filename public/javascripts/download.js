const Download = document.querySelector('.download-products')

Download.addEventListener('click', createCsvFile)

function createCsvFile() {
  var fileName = 'inventory.csv'
  var data = getRandomData()
  var blob = new Blob([data], {
    type: 'application/octet-stream'
  })
  var href = URL.createObjectURL(blob)
  var link = document.createElement('a')
  document.body.appendChild(link)
  link.href = href
  link.download = fileName
  link.click()
}

//隨機產生資料
function getRandomData() {
  var header = '第一欄,第二欄,第三欄,第四欄,第五欄\n'
  var data = ''
  for (var i = 0; i < 50; i++) {
    for (var j = 0; j < 5; j++) {
      if (j > 0) {
        data = data + ','
      }
      data = data + 'Item' + i + '_' + j
    }
    data = data + '\n'
  }
  return header + data
}
