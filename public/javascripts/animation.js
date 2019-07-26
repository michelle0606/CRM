const icon = document.querySelector('.fa-outdent')
const sidebar = document.querySelector('.sidebar')
const content = document.querySelector('.main-content')

icon.addEventListener('click', () => {
  if (icon.classList.contains('icon-rotate-out')) {
    icon.classList.replace('icon-rotate-out', 'icon-rotate-in')
    sidebar.classList.replace('fade-out', 'fade-in')
    content.classList.replace('content-out', 'content-in')
  } else {
    icon.classList.replace('icon-rotate-in', 'icon-rotate-out')
    sidebar.classList.replace('fade-in', 'fade-out')
    content.classList.replace('content-in', 'content-out')
  }
})
