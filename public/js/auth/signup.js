const response_box = document.getElementById("response-box");
const signup_form = document.getElementById("signup_form");

signup_form.addEventListener("submit", (e) => {
	e.preventDefault();
	const body = JSON.stringify({
		password: document.getElementById("password").value,
		email: document.getElementById("email").value,
		username: document.getElementById("username").value,
	});
	fetch("/auth/signup", {
		headers: {
			"Content-Type": "application/json",
		},
		body: body,
		method: "post",
	})
		.then((res) => res.json())
		.then((data) => showResponse(data));
});

const showResponse = (data) => {
	response_box.children[0].textContent = data.heading;
	response_box.children[1].textContent = data.desc;
	if (data.status === "success") {
		setTimeout(() => {
			window.location.href = "/";
		}, 1000);
	}
};
