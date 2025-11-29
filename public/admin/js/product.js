// Change Status
const buttonsChangeStatus = document.querySelectorAll('[data-btn-change-status]');
if (buttonsChangeStatus.length > 0) {
    const formChangeStatus = document.getElementById('form-change-status');
    const path = formChangeStatus.getAttribute('data-path');

    buttonsChangeStatus.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault()
            const id = button.getAttribute('data-id');
            const currentStatus = button.getAttribute('data-status');
            const newStatus = currentStatus == 'active' ? 'inactive' : 'active';

            formChangeStatus.action = `${path}/${newStatus}/${id}?_method=PATCH`;
            formChangeStatus.submit();
        });
    });
}

//End Change Status

// Delete Product
const buttonsDelete = document.querySelectorAll('[data-btn-delete]');
if (buttonsDelete.length > 0) {
    const formDeleteProduct = document.querySelector('#form-delete-product');
    const path = formDeleteProduct.getAttribute('data-path');
    
    buttonsDelete.forEach(button => {
        button.addEventListener('click', (e) => {
            const isConfirmed = confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?');
            if (isConfirmed) {
                const id = button.getAttribute('data-id');

                const action = `${path}/${id}?_method=DELETE`;
                formDeleteProduct.action = action;
                formDeleteProduct.submit();
            }  
        });
    });    
}
// End Delete Product