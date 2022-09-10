const main = document.getElementById("Media_Showcase_wrapper");
async function load() {
	const res = await fetch("/api");
	const data = await res.json();
	data.forEach((e) => {
		const div = document.createElement("div");
		const span = document.createElement('span');
		const img = document.createElement('img')
		img.src = `/thumbnails/${e.thumbnail}`;
		span.setAttribute('class', 'img-wrapper')
        div.setAttribute('class', 'box');
        div.setAttribute('onclick', `window.location.href = "./Player/${e.name}"`);
        div.appendChild(span);
		span.appendChild(img);
		div.appendChild(document.createElement("div"));
		div.children[1].classList.add('Media_Showcase_Title');
		div.children[1].innerText = e.title;
        main.append(div);
	});
}
load();