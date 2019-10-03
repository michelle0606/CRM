const openButton = document.querySelectorAll('[data-info="open"]')

openButton.forEach(open => {
  open.addEventListener('click', () => {
    const detailData = open.parentElement.parentElement.parentElement.parentElement.nextElementSibling

    detailData.classList.toggle('open-it')
  })
})
