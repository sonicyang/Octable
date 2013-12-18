document.querySelector("#school").addEventListener("change", function() {selectSchool(this)}, false);
document.querySelector("#department").addEventListener("change", selectionChange, false);
document.querySelector("#grade").addEventListener("change", selectionChange, false);

document.querySelector("#list_title_1").addEventListener("click", showMine, false);
document.querySelector("#list_title_2").addEventListener("click", showDept, false);

document.querySelector("#searchCode").addEventListener("input", function() {searchCode(this)}, false);

function createDB() {
    const dbName = "Courses";

    var request = db.open(dbName, 1);

    request.onupgradeneeded = function(evt) {
        var db = evt.target.result;

        var objectStore = db.createObjectStore("courses", {keyPath: "id", autoIncrement: true});

        var keys = ["obligatory", "code", "title", "credits", "time", "grade", "professor", "language", "note", "department"];

        for (i = 0; i < keys.length; i++) {
            objectStore.createIndex(keys[i], keys[i], {unique: false});
        }
        for (i = 0; i < data.length; i++) {
            objectStore.add(data[i]);
        }
    };

    request.onsuccess = function(evt) {};

    request.onerror = function(evt) {
        console.log("Database error: " + evt.target.errorCode);
    };
}

if (localStorage.getItem('selectedSchool')) {
    document.querySelector('#school').value = localStorage.getItem('selectedSchool');

    selectSchool(localStorage.getItem('selectedSchool'));
}
