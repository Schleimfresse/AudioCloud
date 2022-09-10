const main = document.querySelector("main");
function load() {
	if (!(media == "")) {
		media.forEach((e) => {
			const div = document.createElement("div");
			div.setAttribute("class", "box-search");
			div.setAttribute("onclick", `window.location.href = "./Player/${e.name}"`);
			div.innerText = e.title;
			main.append(div);
		});
	} else {
		const temp = document.getElementById("noresults");
		document.querySelector("main").appendChild(temp.content.cloneNode(true));
	}
}
load();
