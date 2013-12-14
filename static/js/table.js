document.querySelector("#school").addEventListener("change", function() {selectSchool(this)}, false);
document.querySelector("#department").addEventListener("change", selectionChange, false);
document.querySelector("#grade").addEventListener("change", selectionChange, false);

document.querySelector("#list_title_1").addEventListener("click", title1, false);
document.querySelector("#list_title_2").addEventListener("click", title2, false);

document.querySelector("#searchCode").addEventListener("input", function() {searchCode(this)}, false);
