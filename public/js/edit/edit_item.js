document.getElementById("title").textContent = information.title;
const form = document.getElementById("edit_form");
form.setAttribute('action', `/edit/${information.name}/success`)
form.children[0].value = information.title;
form.children[1].value = information.desc;
form.children[2].value = information.artist;