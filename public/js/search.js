const main = document.querySelector("main");
function load() {
    console.log(media)
	media.forEach((e) => {
		const div = document.createElement("div");
        div.setAttribute('class', 'box');
        div.setAttribute('onclick', `window.location.href = "./Player/${e.name}"`);
        div.innerText = e.title;
        main.append(div);
	});
}
load();
