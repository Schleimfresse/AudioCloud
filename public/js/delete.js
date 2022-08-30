const main = document.querySelector("main");
const secureDOM = document.getElementById('secure');
async function load() {
	const res = await fetch("/api");
	const data = await res.json();
	data.forEach((e) => {
		const div = document.createElement("div");
        div.setAttribute('class', 'box');
        div.setAttribute('onclick', 'secure(this.innerText);');
        div.textContent = e.name;
        main.append(div);
	});
}
load();
function secure(name) {
secureDOM.style.display = 'flex';
secureDOM.children[0].children[0].textContent = name}

async function deleteobj(id) {
    secureDOM.style.display = 'none';
    await fetch(`/Media/${encodeURIComponent(id)}`, {
        method: "DELETE"
    });
}