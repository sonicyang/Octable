document.getElementById("school").addEventListener("change", function() {selectionChange_School(this)}, false);
document.getElementById("department").addEventListener("change", selectionChange, false);
document.getElementById("grade").addEventListener("change", selectionChange, false);

document.getElementById("list_title_1").addEventListener("click", title1, false);
document.getElementById("list_title_2").addEventListener("click", title2, false);

var cells = document.getElementsByClassName("cell");
for (i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", function() {oneclick_Block(this, event)}, false);
    cells[i].addEventListener("dblclick", function() {click_Block(this)}, false);
    cells[i].addEventListener("mouseover", function() {hover_Block(this)}, false);
    cells[i].addEventListener("mouseout", function() {out_Block(this)}, false);
}
