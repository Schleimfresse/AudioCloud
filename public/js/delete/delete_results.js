const main = document.querySelector("main");
if (media == "") {
	const temp = document.getElementById("noresults");
	main.appendChild(temp.content.cloneNode(true));
} else {
	media.forEach((e) => {
		const div = document.createElement("div");
		div.setAttribute("class", "box-search");
		div.setAttribute("onclick", `window.location.href = "./delete/m?v=${e.id}"`);
		if (e.mime.mime.includes("video")) {
			type = "Video";
		} else if (e.mime.mime.includes("audio")) {
			type = "Audio";
		} else {
			type = "Media";
		}
		div.innerText = `${type}: ${e.title}`;
		main.append(div);
	});
}
