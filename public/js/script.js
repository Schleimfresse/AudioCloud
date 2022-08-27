const main = document.querySelector("main");
async function load() {
	const res = await fetch("/api");
	const data = await res.json();
	data.forEach((e) => {
		const div = document.createElement("div");
        div.setAttribute('class', 'box');
        div.setAttribute('onclick', `window.location.href = "./Media/${e.name}"`);
        div.textContent = 'Media: '
		div.appendChild(document.createElement("span"));
        div.children[0].textContent = e.name;
        main.append(div);
	});
}
load();
