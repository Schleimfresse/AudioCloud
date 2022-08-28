const main = document.querySelector("main");
async function load() {
    console.log(media)
	media.forEach((e) => {
		const div = document.createElement("div");
        div.setAttribute('class', 'box');
        div.setAttribute('onclick', `window.location.href = "./Player/${e.name}"`);
        div.textContent = 'Media: '
		div.appendChild(document.createElement("span"));
        div.children[0].innerText = e.title;
        main.append(div);
	});
}
load();
