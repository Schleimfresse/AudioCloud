const skel_cardTemplate = document.getElementById("skeleton-card-template");
const cardTemplate = document.getElementById("card-template");
const main = document.getElementById("Media_Showcase_wrapper");

for (let i = 0; i < 30; i++) {
	main.append(skel_cardTemplate.content.cloneNode(true));
}
window.onload = function () {
	async function load() {
		const res = await fetch("/api");
		const data = await res.json();
		main.textContent = "";
		data.forEach((e) => {
			const div = cardTemplate.content.cloneNode(true);
			div.children[0].setAttribute('onclick', `window.location.href = "./Player/${e.name}"`)
			div.querySelector("[thumbnail]").src = `/thumbnails/${e.thumbnail}`;
			div.querySelector("[title]").textContent = e.title;
			main.append(div);
		});
	}
	load();
};