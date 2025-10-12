// Button status
const btnsStatus = document.querySelectorAll('[btn-status]')

if (btnsStatus.length > 0){
    btnsStatus.forEach(btn => {
        btn.addEventListener('click', () =>{
            let url = new URL(window.location.href)
            const status = btn.getAttribute('btn-status')

            if (status){
                url.searchParams.set('status', status)
            }else{
                url.searchParams.delete('status')
            }

            window.location.href = url.href
        })
    })
}
// End button status

// Form search
const formsSearch = document.querySelectorAll('#form-search')

if (formsSearch.length > 0) {
    formsSearch.forEach(item => {
        item.addEventListener('submit', (e) => {
        e.preventDefault()

        const url = new URL(window.location.href)
        const keyword = e.target.elements.keyword.value.trim()

        if (keyword) {
            url.searchParams.set('keyword', keyword)
        } else {
            url.searchParams.delete('keyword')
        }

        window.location.href = url.href
    })
    })
}


// End form search

// Pagination
const btnsPagination = document.querySelectorAll('[btn-pagination]')

if (btnsPagination.length > 0) {

    btnsPagination.forEach(btn => {
        btn.addEventListener('click', () => {

            let url = new URL(window.location.href)

            const page = btn.getAttribute('btn-pagination')

            url.searchParams.set('page', page)
            window.location.href = url.href
        })
    })
}

// End Pagination

