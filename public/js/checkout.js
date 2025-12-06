document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#checkoutForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        const res = await fetch("/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const json = await res.json();

        if (json.success) {
            Swal.fire({
                icon: "success",
                title: "Đặt hàng thành công!",
                text: "Mã đơn hàng: " + json.orderId
            }).then(() => {
                window.location.href = "/orders";
            });
        } else {
            Swal.fire("Lỗi!", json.message, "error");
        }
    });
});
