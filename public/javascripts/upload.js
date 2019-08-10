const form = document.getElementById('upload-form')
const file = document.querySelector('#upload_file')

form.addEventListener('submit', event => {
  event.preventDefault()
  console.log(file.files)
  if (typeof FileReader !== 'undefined') {
    let reader = new FileReader()
    reader.readAsText(file.files[0])
    reader.onload = function(evt) {
      let data = evt.target.result
      processData(data)
    }
  } else {
    alert('IE9及以下瀏覽器不支援，請使用Chrome或Firefox瀏覽器')
  }
})

// $(document).ready(function() {
//   $.ajax({
//     type: 'GET',
//     url: data,
//     dataType: 'text',
//     success: function(data) {

//     }
//   })
// })

function processData(allText) {
  console.log('4')
  let record_num = 4
  let allTextLines = allText.split(/\r\n|\n/)
  let entries = allTextLines[0].split(',')
  let headings = entries.splice(0, record_num)
  debugger
  while (entries.length > 0) {
    console.log('1')
    let tar = []
    let lines = []
    for (let j = 0; j < record_num; j++) {
      tar.push(headings[j] + ':' + entries.shift())
      console.log('2')
    }
    console.log('3')
    lines.push(tar)
  }
  // alert(lines)
}
