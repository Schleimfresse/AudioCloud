const main = document.querySelector("main");
if (media == "") {
	const temp = document.getElementById("noresults");
	main.appendChild(temp.content.cloneNode(true));
} else {
	media.forEach((e) => {
		const div = document.createElement("div");
		div.setAttribute("class", "box-search");
		div.setAttribute("onclick", `window.location.href = "./edit/${e.id}"`);
		div.innerText = e.title;
		main.append(div);
	});
}
