const form = document.getElementById('delete_confirm_form')
if (information != null || information != '' || information != undefined) {
    document.getElementById('heading').textContent = `Are you sure you want to delete ${information.title}? You cannot reverse this process.`
    form.setAttribute('action', `/delete/${information.name}/success`)
}
else {

}