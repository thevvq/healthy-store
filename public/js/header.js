// Toggle dropdown user bằng click
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("userMenuToggle");
    const dropdown = document.getElementById("userDropdown");

    if (!toggle || !dropdown) return;

    // Bấm vào avatar / tên => bật tắt dropdown
    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("show");
    });

    // Click ra ngoài => đóng dropdown
    document.addEventListener("click", () => {
        dropdown.classList.remove("show");
    });

    // Click bên trong dropdown không đóng ngay
    dropdown.addEventListener("click", (e) => {
        e.stopPropagation();
    });
});
