var db;
var transaction;
window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

function createDB() {
    const dbName = "Courses";

    var request = window.indexedDB.open(dbName, 1);

    request.onupgradeneeded = function(evt) {
        db = evt.target.result;

        var objectStore = db.createObjectStore("courses", {keyPath: "id", autoIncrement: true});

        var keys = ["obligatory", "code", "title", "credits", "time", "grade", "professor", "language", "note", "department"];

        for (i = 0; i < keys.length; i++) {
            objectStore.createIndex(keys[i], keys[i], {unique: false});
        }
        for (i = 0; i < data.length; i++) {
            objectStore.add(data[i]);
        }
    };

    request.onsuccess = function(evt) {
        db = evt.target.result;
        var transaction = db.transaction(["courses"]);

        transaction.oncomplete = function(evt) {
        }
    };

    request.onerror = function(evt) {
        console.log("Database error: " + evt.target.errorCode);
    };
}
