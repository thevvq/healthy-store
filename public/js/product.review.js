document.addEventListener('DOMContentLoaded', function () {
  const starLabels = document.querySelectorAll('.rating-stars .star');

  if (!starLabels.length) return;

  starLabels.forEach(label => {
    label.addEventListener('click', function () {
      const value = parseInt(this.dataset.value, 10);

      // chọn radio tương ứng
      const radio = this.querySelector(`input[name="rating"][value="${value}"]`)
        || document.querySelector(`input[name="rating"][value="${value}"]`);

      if (radio) {
        radio.checked = true;
      }

      // tô sáng các sao <= value
      starLabels.forEach(star => {
        const starValue = parseInt(star.dataset.value, 10);
        if (starValue <= value) {
          star.classList.add('active');
        } else {
          star.classList.remove('active');
        }
      });
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
    const buyNowBtn = document.querySelector('.btn-buy-now');
    
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function() {
            // ✅ KIỂM TRA ĐĂNG NHẬP TRƯỚC
            if (!isLoggedIn) {
                Swal.fire({
                    icon: "warning",
                    title: "Chưa đăng nhập",
                    text: "Vui lòng đăng nhập để mua hàng",
                    confirmButtonText: "Đăng nhập",
                    showCancelButton: true,
                    cancelButtonText: "Hủy"
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "/login";
                    }
                });
                return;
            }
            
            // Nếu đã đăng nhập, chuyển tới giỏ hàng
            window.location.href = "/cart";
        });
    }
});
