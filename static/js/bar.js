if (localStorage.getItem('selectedSchool')) {
    document.querySelector('#school').value = localStorage.getItem('selectedSchool');
    selectSchool(localStorage.getItem('selectedSchool'));
}

/* Navbar */
document.querySelector("#school").addEventListener("change", function() {selectSchool(this)}, false);

var toggleMine = 0;
function showMine() {
    var mine = document.querySelector('#my_courses');
    if (!toggleMine) {
        mine.style.display = "inline-block";
        for (i = 0; i < mine.children.length; i++) {
            mine.children[i].style.display = "block";
        }
    } else {
        mine.style.display = "none";
        for (i = 0; i < mine.children.length; i++) {
            mine.children[i].style.display = "none";
        }
    }
    toggleMine = !toggleMine;
}

document.querySelector("#searchCode").addEventListener("input", function() {searchCode(this)}, false);
document.querySelector("#toggleMine").addEventListener("click", function() {showMine()}, false);

/* Sidebar */
function showSidebar() {
    var sidebar = document.querySelector('#sidebar');
    sidebar.style.right = '0px';
}

function hideSidebar() {
    var sidebar = document.querySelector('#sidebar');
    sidebar.removeAttribute("style");
}

document.querySelector('#show-sidebar').addEventListener("click", function() {showSidebar();});
document.querySelector('#hide-sidebar').addEventListener("click", function() {hideSidebar();});
document.querySelector("#department").addEventListener("change", selectionChange, false);
document.querySelector("#grade").addEventListener("change", selectionChange, false);
