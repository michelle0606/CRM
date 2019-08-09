const advance = document.querySelector('.advance')
const optionList = document.querySelector('.option')
const body = document.querySelector('body')

function showOption() {
  body.addEventListener('click', e => {
    if (e.target.closest('.advance') !== this) {
      optionList.style.display = 'none'
    } else {
      optionList.style.display = 'block'
    }
  })
}

advance.addEventListener('click', showOption)
