function limit(element, max_chars)
{
    if(element.value.length > max_chars) {
        element.value = element.value.substr(0, max_chars);
    }
}
function minmax(value, min, max) 
{
    if(parseInt(value) < min || isNaN(parseInt(value))) 
        return 0; 
    else if(parseInt(value) > max) 
        return 100; 
    else return value;
}

const resend_btn = document.getElementById("resend");
resend_btn.addEventListener("click", () => {
    fetch("/verify", {
        headers: {
			"Content-Type": "application/json",
		},
        method: "post",
    })
})