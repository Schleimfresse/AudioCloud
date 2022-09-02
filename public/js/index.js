const main = document.getElementById("Media_Showcase_wrapper");
async function load() {
	const res = await fetch("/api");
	const data = await res.json();
	console.log('data:', data)
	data.forEach((e) => {
		const div = document.createElement("div");
		const img = document.createElement('img')
		img.src = `/thumbnails/${e.thumbnail}`;
        div.setAttribute('class', 'box');
        div.setAttribute('onclick', `window.location.href = "./Player/${e.name}"`);
        div.appendChild(img)
		div.appendChild(document.createElement("div"));
		div.children[1].classList.add('Media_Showcase_Title');
		div.children[1].innerText = e.title;
        main.append(div);
	});
}
load();