document.addEventListener("DOMContentLoaded", () => {
    const btnEdit = document.querySelector(".btn-edit");
    const btnSave = document.querySelector(".btn-save");
    const btnCancel = document.querySelector(".btn-cancel");

    const inputs = document.querySelectorAll(".profile-input");
    const genderInputs = document.querySelectorAll("input[name='gender']");
    const avatarInput = document.querySelector("#avatarInput");
    const avatarPreview = document.querySelector("#avatarPreview");

    // ============ BẬT CHẾ ĐỘ CHỈNH SỬA ============
    btnEdit.addEventListener("click", () => {
        inputs.forEach(i => i.disabled = false);
        genderInputs.forEach(i => i.disabled = false);
        avatarInput.disabled = false;

        btnEdit.style.display = "none";
        btnSave.style.display = "inline-block";
        btnCancel.style.display = "inline-block";
    });

    // ============ NÚT HỦY ============
    btnCancel.addEventListener("click", () => {
        window.location.reload();
    });

    // ============ PREVIEW ẢNH ============
    avatarInput.addEventListener("change", function() {
        const file = this.files[0];
        if (file) {
            avatarPreview.src = URL.createObjectURL(file);
        }
    });

    // ============ LƯU THÔNG TIN (AJAX) ============
    btnSave.addEventListener("click", async () => {
        const form = document.querySelector("#profileForm");
        const formData = new FormData(form);

        try {
            const res = await fetch("/profile", {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (data.success) {
                // Cập nhật tên trên header
                const headerName = document.querySelector("#headerUserName");
                if (headerName) headerName.textContent = data.user.fullName;

                // Cập nhật avatar header nếu có
                if (data.user.avatar) {
                    let headerAvatar = document.querySelector(".avatar-small");
                    if (headerAvatar) headerAvatar.src = data.user.avatar;
                }

                alert("Cập nhật thành công!");

                // Cập nhật lại preview
                if (data.user.avatar) {
                    avatarPreview.src = data.user.avatar;
                }

                // Khóa input lại
                inputs.forEach(i => i.disabled = true);
                genderInputs.forEach(i => i.disabled = true);
                avatarInput.disabled = true;

                btnEdit.style.display = "inline-block";
                btnSave.style.display = "none";
                btnCancel.style.display = "none";
            } else {
                alert("Có lỗi xảy ra!");
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi khi lưu thông tin!");
        }
    });
});
