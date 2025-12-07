document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("#checkoutForm");
    const btn = document.querySelector("#btnPlaceOrder");
    const selectedItemsInput = document.querySelector("#selectedItemsInput");

    if (!form) return;

    // Debug kiểm tra dữ liệu
    console.log("Selected Items tại trang checkout:", selectedItemsInput?.value);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // ============================
        // KIỂM TRA selectedItems
        // ============================
        if (!selectedItemsInput || !selectedItemsInput.value) {
            Swal.fire("Lỗi!", "Không có sản phẩm nào được chọn!", "error");
            return;
        }

        let parsedSelected = [];

        try {
            parsedSelected = JSON.parse(selectedItemsInput.value);
        } catch (err) {
            Swal.fire("Lỗi!", "Danh sách sản phẩm không hợp lệ!", "error");
            return;
        }

        if (parsedSelected.length === 0) {
            Swal.fire("Lỗi!", "Không có sản phẩm nào để đặt hàng!", "error");
            return;
        }

        // Disable nút để tránh spam
        btn.disabled = true;
        btn.innerText = "Đang xử lý...";

        // Lấy dữ liệu từ form
        const formData = new FormData(form);
        let data = Object.fromEntries(formData);

        // ⭐ THÊM selectedItems VÀO DATA GỬI LÊN BACKEND ⭐
        data.selectedItems = selectedItemsInput.value;

        try {
            const res = await fetch("/checkout/place-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const json = await res.json();

            if (json.success) {
                Swal.fire({
                    icon: "success",
                    title: "Đặt hàng thành công!",
                    text: "Mã đơn hàng: " + json.orderId,
                    confirmButtonText: "Xem đơn hàng"
                }).then(() => {
                    window.location.href = "/orders/" + json.orderId;
                });

            } else {
                Swal.fire("Lỗi!", json.message, "error");
            }

        } catch (error) {
            Swal.fire("Lỗi kết nối!", "Không thể gửi đơn hàng.", "error");

        } finally {
            btn.disabled = false;
            btn.innerText = "Đặt hàng";
        }

    });

});
