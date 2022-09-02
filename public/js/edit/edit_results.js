const main = document.querySelector("main");
if (media == "") {
	const temp = document.getElementById("noresults");
	main.appendChild(temp.content.cloneNode(true));
} else {
	media.forEach((e) => {
		const div = document.createElement("div");
		div.setAttribute("class", "box-edit");
		div.setAttribute("onclick", `window.location.href = "./edit/${e.name}"`);
		div.innerText = e.title;
		main.append(div);
	});
}
