// Button status
const btnStatus = document.querySelectorAll('[btn-status]')

if (btnStatus.length > 0){
    btnStatus.forEach(btn => {
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
