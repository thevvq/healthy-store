const editBtn = document.querySelector(".btn-edit");
const saveBtn = document.querySelector(".btn-save");
const cancelBtn = document.querySelector(".btn-cancel");
const inputs = document.querySelectorAll(".profile-input");
const fileInput = document.querySelector("input[name='avatar']");

editBtn.addEventListener("click", () => {
    inputs.forEach(i => i.removeAttribute("disabled"));
    fileInput.removeAttribute("disabled");

    editBtn.style.display = "none";
    saveBtn.style.display = "inline-block";
    cancelBtn.style.display = "inline-block";
});

cancelBtn.addEventListener("click", () => {
    window.location.reload();
});
