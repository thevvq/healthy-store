// ===============================
// CART SYSTEM FRONT-END (FULL)
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    // ============================================================
    // 1) THÊM SẢN PHẨM VÀO GIỎ HÀNG (SweetAlert chọn số lượng)
    // ============================================================

    const addButtons = document.querySelectorAll(".btn-add-cart");

    addButtons.forEach(btn => {
        btn.addEventListener("click", () => {

            const id = btn.dataset.id;
            const title = btn.dataset.title;
            const image = btn.dataset.image;
            const stock = parseInt(btn.dataset.stock);

            Swal.fire({
                title: "Chọn số lượng",
                html: `
                    <p><strong>${title}</strong></p>
                    <img src="${image}" style="width:130px;border-radius:10px;margin-bottom:10px;">
                    <input id="qtyInput" type="number" min="1" max="${stock}" value="1" class="swal2-input">
                    <p style="font-size:14px;color:#777;">Tồn kho: ${stock}</p>
                `,
                confirmButtonText: "Thêm vào giỏ",
                showCancelButton: true,
                cancelButtonText: "Hủy",
                preConfirm: () => {
                    const qty = parseInt(document.getElementById("qtyInput").value);
                    if (qty < 1 || qty > stock) {
                        Swal.showValidationMessage(`Số lượng phải từ 1 → ${stock}`);
                        return false;
                    }
                    return qty;
                }
            }).then(result => {
                if (result.isConfirmed) {
                    addToCart(id, result.value);
                }
            });
        });
    });


    // API thêm giỏ hàng
    async function addToCart(productId, quantity) {
        try {
            const res = await fetch("/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity })
            });

            const data = await res.json();

            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Đã thêm vào giỏ hàng!",
                    timer: 1200,
                    showConfirmButton: false
                }).then(() => location.reload());
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi!",
                    text: data.message
                });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Lỗi hệ thống",
                text: "Vui lòng thử lại!"
            });
        }
    }



    // ============================================================
    // 2) CẬP NHẬT SỐ LƯỢNG TRONG GIỎ
    // ============================================================

    const qtyInputs = document.querySelectorAll(".qty-box");

    qtyInputs.forEach(input => {
        input.addEventListener("change", async () => {

            const id = input.dataset.id;
            const qty = parseInt(input.value);

            try {
                await fetch("/cart/update", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId: id, quantity: qty })
                });

                location.reload();
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Không thể cập nhật giỏ hàng!"
                });
            }
        });
    });



    // ============================================================
    // 3) XÓA 1 SẢN PHẨM KHỎI GIỎ
    // ============================================================

    const deleteButtons = document.querySelectorAll(".btn-delete");

    deleteButtons.forEach(btn => {
        btn.addEventListener("click", () => {

            const id = btn.dataset.id;

            Swal.fire({
                icon: "warning",
                title: "Xóa sản phẩm?",
                text: "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ?",
                showCancelButton: true,
                confirmButtonText: "Xóa",
                cancelButtonText: "Hủy"
            }).then(async (result) => {
                if (!result.isConfirmed) return;

                try {
                    await fetch("/cart/delete", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ productId: id })
                    });

                    location.reload();

                } catch (err) {
                    Swal.fire({
                        icon: "error",
                        title: "Không thể xóa sản phẩm!"
                    });
                }
            });

        });
    });



    // ============================================================
    // 4) XÓA TOÀN BỘ GIỎ HÀNG
    // ============================================================

    const clearBtn = document.getElementById("btnClearAll");

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {

            Swal.fire({
                icon: "warning",
                title: "Xóa toàn bộ giỏ hàng?",
                text: "Bạn sẽ xóa tất cả sản phẩm, không thể phục hồi!",
                showCancelButton: true,
                confirmButtonText: "Xóa hết",
                cancelButtonText: "Hủy"
            }).then(async (result) => {
                if (!result.isConfirmed) return;

                try {
                    await fetch("/cart/clear", {
                        method: "POST"
                    });

                    location.reload();

                } catch (err) {
                    Swal.fire({
                        icon: "error",
                        title: "Không thể xóa giỏ hàng!"
                    });
                }
            });

        });
    }

});
