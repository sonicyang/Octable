document.querySelector("#school").addEventListener("change", function() {selectSchool(this)}, false);
document.querySelector("#department").addEventListener("change", selectionChange, false);
document.querySelector("#grade").addEventListener("change", selectionChange, false);

document.querySelector("#list_title_1").addEventListener("click", showMine, false);
document.querySelector("#list_title_2").addEventListener("click", showDept, false);

document.querySelector("#searchCode").addEventListener("input", function() {searchCode(this)}, false);
