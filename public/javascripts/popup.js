const openbuttons = document.querySelectorAll('[data-open="open"]')
const modals = document.querySelectorAll('.modal')
const close = document.querySelectorAll('.close')

openbuttons.forEach(open => {
  open.addEventListener('click', () => {

    modals.forEach(a => {
      if (Number(a.id) === Number(open.value)) {
        a.style.display = "block"
      }
    })
  })
})

close.forEach(a => a.addEventListener('click', () => {
  modals.forEach(b => {
    b.style.display = "none"
  })
}))

