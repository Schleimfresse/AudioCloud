const main = document.getElementById("Media_Showcase_wrapper-edit");

const modal = document.getElementById("filter-Modal");
const showModal = document.getElementById("showModal");
const closeModal = document.getElementById("closeModal");

showModal.addEventListener("click", () => {
	modal.show();
});

closeModal.addEventListener("click", () => {
	modal.close();
});