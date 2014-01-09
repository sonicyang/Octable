var data;

var db;
var transaction;
window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

var SELECTED = "#D6B86D";
var CONFLICT = "#FF1C2D";
var HOVERED = "#ADC7C5";

function fetchAJAX(HOST, DIR) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.status == 404) {
            response = "";
        } else if (xhr.readyState == 4) {
            response = xhr.responseText;
        }
    };

    var dateList = Date().toString().split(" ");
    var url = HOST + DIR + ".json";

    xhr.open("GET", url, false);
    xhr.send();

    if (xhr.responseText == "") {
        return "";
    }

    return JSON.parse(xhr.responseText);
}

function selectSchool(selection) {
    var HOST = window.location.toString();
    if (selection.options) {
        var option = selection.options[selection.selectedIndex].value;
    }
    var SCHOOL =  option || selection;
    var DATAPATH = "/static/data/" + SCHOOL + "/" + SCHOOL;
    data = fetchAJAX(HOST, DATAPATH);

    window.indexedDB.deleteDatabase("Courses");

    createDB();
    localStorage.setItem('selectedSchool', option || selection);

    // Reset grade
    document.querySelector("#grade").value = 0;

    // Put departments into select > option
    var department = document.querySelector("#department");
    department.innerHTML = "";

    for (i = 0; i < data.length; i++) {
        var flag = 1;
        var value = data[i]['department'];
        for (j = 0; j < i; j++) {
            if (value == data[j]['department']) {
                flag = 0;
            }
        }
        //Skip trash values in NCHU
        if (value == "開課單位" || value == " ") {
            flag = 0;
        }
        if (flag) {
            department.innerHTML += "<option value='" + value + "'>" + value + "</option>";
        }
    }

    // Clear form data when switching between schools
    var cells = document.querySelectorAll(".cell");
    for (i = 0; i < cells.length; i++) {
        if (cells[i].id[0] == "0" || cells[i].id[2] == "0") {
            continue;
        }
        cells[i].style.backgroundColor = "";
        cells[i].innerHTML = "";
        cells[i].setAttribute("mom", "");
        // Add event listener to each cell
        cells[i].addEventListener("click", function() {clickCell(this, event)}, false);
        cells[i].addEventListener("dblclick", function() {dblClickCell(this)}, false);
        cells[i].addEventListener("mouseover", function() {hoverCell(this)}, false);
        cells[i].addEventListener("mouseout", function() {leaveCell(this)}, false);

    }
    document.querySelector("#extern").style.display = "none";

    selectionChange();
}

function selectionChange() {
    var oblItems = "";
    var eleItems = "";

    for (i = 0; i < data.length; i++) {
        var grade = parseInt(data[i]['grade'], 10);
        if (grade != document.querySelector("#grade").value && document.querySelector("#grade").value != 0) {
            continue;
        }

        var flag = 1;
        var dpm = data[i]['department'];
        if (dpm == document.querySelector("#department").value) {
            if (data[i]['obligatory'] == "必修") {
                var junction = "<li class='subject' active='0' time='" +
                    data[i]['time'].trim() + "' child=' " + data[i]['code'] + " <span>" +
                    data[i]['title'].split(" ")[0] + "</span>' inx='" + i + "'> " +
                    "<span><a rel='bookmark' title='課程代碼:" +
                    data[i]['code'] + "'>" + data[i]['title'].split(" ")[0] + "</a></span>" +
                    "<span>授課教授:" + data[i]['professor'] + "  學分數:" + data[i]['credits'] +
                    "</span></li>";

                for (j = 0; j < document.querySelector("#selected").children.length; j++) {
                    if (i == parseInt(document.querySelector("#selected").children[j].getAttribute("inx"), 10)) {
                        flag = 0;
                    }
                }
                if (flag) {
                    oblItems += junction;
                }
            } else {
                var junction = "<li class='subject' active='0' time='" +
                    data[i]['time'].trim() + "' child=' " + data[i]['code'] + " <span>" +
                    data[i]['title'].split(" ")[0] + "</span>' inx='" + i + "'> " +
                    "<span><a rel='bookmark' title='課程代碼:" +
                    data[i]['code'] + "'>" + data[i]['title'].split(" ")[0] + "</a></span>" +
                    "<span>授課教授:" + data[i]['professor'] + "  學分數:" + data[i]['credits'] +
                    "</span></li>";

                for (j = 0; j < document.querySelector("#selected").children.length; j++) {
                    if (i == parseInt(document.querySelector("#selected").children[j].getAttribute("inx"))) {
                        flag = 0;
                    }
                }
                if (flag) {
                    eleItems += junction;
                }
            }
        }
    }
    document.querySelector("#obligatory").children[0].innerHTML = oblItems;
    document.querySelector("#elective").children[0].innerHTML = eleItems;

    // Add event listener to each subject in list
    var subjects = document.querySelectorAll(".subject");
    for (j = 0; j < subjects.length; j++) {
        subjects[j].addEventListener('mouseover', function() {hoverList(this)}, false);
        subjects[j].addEventListener('mouseout', function() {leaveList(this)}, false);
        subjects[j].addEventListener('mousedown', function() {clickList(this)}, false);
    }
}

function searchCode(input) {
    var count = 0;
    var len = input.value.toString().length;
    var searchResult = document.querySelector("#searchResult");
    var searchList = document.querySelector("#searchList");
    searchList.innerHTML = "";
    for (i = 0; i < data.length; i++) {
        if (count == 25) {
            break;
        }
        if (input.value.toString() == "") {
            searchResult.style.display = "none";
            searchList.style.display = "none";
            break;
        }
        if (data[i]["code"].substring(0, len) != input.value.toString()) {
            continue;
        } else {
            searchResult.style.display = "inline-block";
            searchList.style.display = "block";
            searchList.innerHTML += "<li class='subject' active='0' time='" +
                    data[i]['time'].trim() + "' child=' " + data[i]['code'] + " <span>" +
                    data[i]['title'].split(" ")[0] + "</span>' inx='" + i + "'> " +
                    "<span><a rel='bookmark' title='課程代碼:" +
                    data[i]['code'] + "'>" + data[i]['title'].split(" ")[0] + "</a></span>" +
                    "<span>授課教授:" + data[i]['professor'] + "  學分數:" + data[i]['credits'] +
                    "</span></li>";
        }
        count += 1;
    }
        // Add event listener to each subject in list
    var subjects = document.querySelectorAll(".subject");
    for (j = 0; j < subjects.length; j++) {
        subjects[j].addEventListener('mouseover', function() {hoverList(this)}, false);
        subjects[j].addEventListener('mouseout', function() {leaveList(this)}, false);
        subjects[j].addEventListener('mousedown', function() {clickList(this)}, false);
    }
}

function clickList(listItem) {
    listItem.style.backgroundColor = "#AAA";
    var raw = listItem.getAttribute("time").trim();
    var time = raw.split(",");

    var t_count = 0;
    var acctimes = new Array();

    for (i = 0; i < time.length; i++) {
        var weekday = parseInt(time[i], 10).toString().substring(0, 1);
        for (j = 1; j < time[i].length; j++) {
            var acctime = weekday + "0" + time[i][j];
            acctimes[t_count] = acctime;
            t_count++;
        }
    }

    var act = listItem.getAttribute("active");
    if (act == 0) {
        var flag = 1;
        for (i = 0; i < t_count; i++) {
            var cells = document.getElementById(acctimes[i].trim());
            if (cells.getAttribute("mom") != "") {
                flag = 0;
            }
        }

        if (flag) {
            var inx = parseInt(listItem.getAttribute("inx"), 10);
            for (i = 0; i < t_count; i++) {
                var cells = document.getElementById(acctimes[i].trim());
                cells.style.backgroundColor = SELECTED;
                cells.innerHTML = data[inx]['code'] + " " + data[inx]['title'].split(" ")[0];
                cells.setAttribute("mom",listItem.getAttribute("inx"));
            }
            var app = "<li class='subject' active='1' time='" +
                raw + "' child='" +listItem.getAttribute("child") + "' inx='" + listItem.getAttribute("inx") + "'>" +
                listItem.innerHTML + "</li>";

            document.querySelector("#selected").children[0].innerHTML += app;

            var subjects = document.querySelector("#selected").children[0].children;
            for (i = 0; i < subjects.length; i++) {
                subjects[i].addEventListener('mouseout', function() {leaveList(this)}, false);
                subjects[i].addEventListener('mousedown', function() {clickList(this)}, false);
            }
            listItem.style.display = "none";
        }
    } else {
        var flag = 1;
        for (i = 0; i < t_count; i++) {
            var cells = document.getElementById(acctimes[i].trim());
            if (cells.getAttribute("mom") != listItem.getAttribute("inx")) {
                flag = 0;
            }
        }

        if (flag) {
            for (i = 0; i < t_count; i++) {
                var cells = document.getElementById(acctimes[i].trim());
                cells.style.backgroundcolor = "#BEE";
                cells.innerHTML = "";
                cells.setAttribute("mom", "");
            }

            var obligatory = ["#obligatory", "#elective"];
            for (i = 0; i < obligatory.length; i++) {
                var list = document.querySelector(obligatory[i]).children[0].children;
                for (j = 0; j < list.length; j++) {
                    if (list[j].getAttribute("inx") == listItem.getAttribute("inx")) {
                        list[j].style.display = "list-item";
                    }
                }
            }
            dynamicTable();
            listItem.style.display = "none";

        }
    }
}

function hoverList(listItem) {
    var times = listItem.getAttribute("time").trim().split(",");
    for (i = 0; i < times.length; i++) {
        for (j = 1; j < times[i].length; j++) {
            var acctime = times[i][j];
            if (acctime.length == 1) {
                acctime = "0" + acctime;
            }
            if (acctime == "0A" || acctime == "0B" || acctime == "0C" || acctime == "0D") {
                var dynamic_tables = document.querySelectorAll(".dynamic_table");
                for (k = 0; k < dynamic_tables.length; k++) {
                    dynamic_tables[k].style.display = "block";
                }
            }
            acctime = times[i][0] + acctime;

            if (acctime.length >= 3) {
                if (document.getElementById(acctime).innerHTML == "") {
                    document.getElementById(acctime).style.backgroundColor = HOVERED;
                } else {
                    if (document.getElementById(acctime).getAttribute("mom") == listItem.getAttribute("inx")) {
                        document.getElementById(acctime).style.backgroundColor = HOVERED;
                    } else {
                        document.getElementById(acctime).style.backgroundColor = CONFLICT;
                    }
                }
            }
        }
    }
}

function leaveList(listItem) {
    listItem.style.backgroundColor = "";
    var times = {10: "N", 11: "A", 12: "B", 13: "C", 14: "D"};
    for (i = 1; i <= 6; i++) {
        for (j = 1; j <= 14; j++) {
            if (j < 10) {
                var acctime = i + "0" + j
            } else {
                var acctime = i + "0" + times[j];
            }

            if (document.getElementById(acctime).innerHTML == "") {
                document.getElementById(acctime).style.backgroundColor = "#DEDEDE";
            } else {
                document.getElementById(acctime).style.backgroundColor = SELECTED;
            }
        }
    }
    dynamicTable();
}

function clickCell(cell, evt) {
    last_c = typeof last_c != 'undefined' ? last_c: "";
    var mx = evt.pageX + 5;
    var my = evt.pageY + 5;
    var di = cell.getAttribute("mom");
    if (di != "" && di != last_c) {
        var ext = document.querySelector("#extern");
        ext.style.display = "inline-block";
        ext.style.opacity = "0.75";
        ext.style.left = mx.toString() + "px";
        ext.style.top = my.toString() + "px";

        di = parseInt(di);
        ext.innerHTML = "<div>課程編號: " + data[di]['code'] + "</div>" +
            "<div>課程名稱: " + data[di]['title'] + "</div>" +
            "<div>授課教授: " + data[di]['professor'] + "</div>" +
            "<div>　學分數: " + data[di]['credits'] + "</div>" +
            "<div>必／選修: " + data[di]['obligatory'] + "</div>";
        last_c = di;

    } else if (di == last_c) {
        var ext = document.querySelector("#extern");
        ext.style.display = "none";
        last_c = "";
    } else {
        var ext = document.querySelector("#extern");
        ext.style.display = "none";
        last_c = "";
    }
}

function dblClickCell(cell) {
    var target = cell.getAttribute("mom");
    var list = document.querySelector("#selected").children[0];
    var obl = document.querySelector("#obligatory").children[0];
    var opt = document.querySelector("#elective").children[0];
    for (i = 0; i < obl.children.length; i++) {
        if (obl.children[i].getAttribute("inx") == target) {
            var raw = obl.children[i].getAttribute("time").trim();
            var time = raw.split(",");
            for (k in time) {
                var weekday = parseInt(time[k], 10).toString().substring(0, 1);
                for (j = 1; j < time[k].length; j++) {
                    var acctime = time[k].substring(j, j + 1);
                    if (acctime.length == 1) {
                        acctime = "0" + acctime;
                    }
                    acctime = weekday + acctime;
                    var cells = document.getElementById(acctime);
                    cells.style.backgroundColor = "#DEDEDE";
                    cells.innerHTML = "";
                    cells.setAttribute("mom", "");
                }
            }
            obl.children[i].style.display = "list-item";
        }
    }
    for (i = 0; i < opt.children.length; i++) {
        if (opt.children[i].getAttribute("inx") == target) {
            var raw = opt.children[i].getAttribute("time").trim();
            var time = raw.split(",");
            for (k in time) {
                var weekday = parseInt(time[k], 10).toString().substring(0, 1);
                for (j = 1; j < time[k].length; j++) {
                    var acctime = time[k].substring(j, j + 1);
                    if (acctime.length == 1) {
                        acctime = "0" + acctime;
                    }
                    acctime = weekday + acctime;
                    var cells = document.getElementById(acctime);
                    cells.style.backgroundColor = "#DEDEDE";
                    cells.innerHTML = "";
                    cells.setAttribute("mom", "");
                }
            }
            opt.children[i].style.display = "list-item";
        }
    }

    for (i = 0; i < list.children.length; i++) {
        if (list.children[i].getAttribute("inx") == target) {
            var raw = list.children[i].getAttribute("time").trim();
            var time = raw.split(",");
            for (k in time) {
                var weekday = parseInt(time[k], 10).toString().substring(0, 1);
                for (j = 1; j < time[k].length; j++) {
                    var acctime = time[k].substring(j, j + 1);
                    if (acctime.length == 1) {
                        acctime = "0" + acctime;
                    }
                    acctime = weekday + acctime;
                    var cells = document.getElementById(acctime);
                    cells.style.backgroundColor = "#DEDEDE";
                    cells.innerHTML = "";
                    cells.setAttribute("mom", "");
                }
            }
            list.children[i].style.display = "none";
        }
    }
    document.querySelector("#extern").style.display = "none";
    dynamicTable();
}

function hoverCell(cell) {
    var target = cell.getAttribute("mom");

    var list = document.querySelector("#selected").children[0];
    if (!list) {
        return;
    }

    for (i = 0; i < list.children.length; i++) {
        if (list.children[i].getAttribute("inx") == target) {
            var time = list.children[i].getAttribute("time").trim().split(",");
            list.children[i].style.backgroundColor = "#CCC";
            for (j = 0; j < time.length; j++) {
                var weekday = time[j][0];
                for (k = 1; k < time[j].length; k++) {
                    var acctime = weekday + "0" + time[j][k];
                    var cells = document.getElementById(acctime);
                    cells.style.backgroundColor = HOVERED;
                }
            }
        }
    }
}

function leaveCell(cell) {
    var target = cell.getAttribute("mom");

    var list = document.querySelector("#selected").children[0];
    if (!list) {
        return;
    }

    for (i = 0; i < list.children.length; i++) {
        if (list.children[i].getAttribute("inx") == target) {
            var time = list.children[i].getAttribute("time").trim().split(",");
            list.children[i].style.backgroundColor = "";
            for (j = 0; j < time.length; j++) {
                var weekday = time[j][0];
                for (k = 1; k < time[j].length; k++) {
                    var acctime = weekday + "0" + time[j][k];
                    var cells = document.getElementById(acctime);
                    if (cells.innerHTML == "") {
                        cells.style.backgroundColor = "#DEDEDE";
                    } else {
                        cells.style.backgroundColor = SELECTED;
                    }
                }
            }
        }
    }
}

function dynamicTable() {
    var flag = 1;
    var times = {10: "N", 11: "A", 12: "B", 13: "C", 14: "D"};
    for (i = 1; i <= 6; i++) {
        for (j = 10; j <= 14; j++) {
            var acctime = i.toString() + "0" + times[j];
            if (document.getElementById(acctime).innerHTML != "") {
                flag = 0;
            }
        }
    }
    if (flag) {
        var dynamic_tables = document.querySelectorAll(".dynamic_table");
        for (i = 0; i < dynamic_tables.length; i++) {
            dynamic_tables[i].style.display = "none";
        }
    }
}

function showMine() {
    var mine = document.querySelector('#my_courses');
    mine.style.display = 'block';

    for (i = 0; i < mine.children.length; i++) {
        mine.children[i].style.display = "block";
    }

    var dept = document.querySelector('#dept_courses')
    dept.style.display = 'none';

    for (i = 0; i < dept.children.length; i++) {
        dept.children[i].style.display = "none";
    }

    var title1 = document.querySelector('#list_title_1');
    var title2 = document.querySelector('#list_title_2');
    title1.style.zIndex = "5";
    title2.style.zIndex = "4";
    title1.style["boxShadow"] = "0px 0px 0px";
    title2.style["boxShadow"] = "inset 0px 0px 3px ";
    title1.style["backgroundColor"] = "#EAEAEA";
    title2.style["backgroundColor"] = "#888888";
}

function showDept() {
    var mine = document.querySelector('#my_courses');
    mine.style.display = 'none';

    for (i = 0; i < mine.children.length; i++) {
        mine.children[i].style.display = "none";
    }

    var dept = document.querySelector('#dept_courses')
    dept.style.display = 'block';

    for (i = 0; i < dept.children.length; i++) {
        dept.children[i].style.display = "block";
    }

    var title1 = document.querySelector('#list_title_1');
    var title2 = document.querySelector('#list_title_2');
    title1.style.zIndex = "4";
    title2.style.zIndex = "5";
    title1.style["boxShadow"] = "inset 0px 0px 3px ";
    title2.style["boxShadow"] = "0px 0px 0px";
    title1.style["backgroundColor"] = "#888888";
    title2.style["backgroundColor"] = "#EAEAEA";
}
