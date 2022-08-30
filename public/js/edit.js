function search() {
const search = document.getElementById("search");
let children = Array.from(document.getElementById('Media_Showcase_wrapper').children);
if (search.value !== '' || null) {
children.forEach(e => {
    console.log(e);
    if (!(e.innerText.toLowerCase().includes(search.value.toLowerCase()))) {
        e.remove();
    }
});
}
else if (search.value === '' || null) {
    document.getElementById('Media_Showcase_wrapper').innerHTML = '';
    load()
}
};