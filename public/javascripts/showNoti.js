$(function() {
	const flag = parseInt(document.getElementById("show-noti").value)
	const Toast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 5000
  })

  if (flag === 1) {
	  Toast.fire({
	    type: 'warning',
	    title: '有商品的庫存低於最低庫存了！'
	  })
	}
});