const email_input = document.getElementById("user-information-email").children[1];
const username_input = document.getElementById("user-information-username").children[1];
const savechanges_box = document.getElementById("savechanges-box");
const form = document.getElementById("user-information-content");
const response_box = savechanges_box.children[1];
if (user.tfa === false) {
	email_input.innerHTML +=
		"<div id='tfa'>Your email has not been two-factor authenticated yet. Click <a href='/verify'>here</a> to authenticate it.</div>";
}

email_input.children[0].addEventListener("input", () => {
	if (email_input.children[0].value != user.email) {
		savechanges_box.style.opacity = 1;
	} else {
		savechanges_box.style.opacity = 0;
	}
});

username_input.addEventListener("input", () => {
	if (username_input.value != user.username) {
		savechanges_box.style.opacity = 1;
	} else {
		savechanges_box.style.opacity = 0;
	}
});

form.addEventListener("submit", (e) => {
	e.preventDefault();
	const body = JSON.stringify({
		_id: user.id,
		username: username_input.value,
		email: email_input.children[0].value,
	});
	fetch("/profile", {
		headers: {
			"Content-Type": "application/json",
		},
		body: body,
		method: "post",
	}).then(res => res.json()).then(data => showResponse(data));
});

const showResponse = (data) => {
   response_box.textContent = data.message;
   if (data.status === "success") {
	setTimeout(() => {
		window.location.reload();
	}, 1000)
}
}