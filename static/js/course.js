var data;

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
    var SCHOOL = selection.options[selection.selectedIndex].value;
    var DATAPATH = "/static/data/" + SCHOOL + "/" + SCHOOL;
    data = fetchAJAX(HOST, DATAPATH);

    // Reset grade
    document.getElementById("grade").value = 0;

    // Put departments into select > option
    var department = document.getElementById("department");
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
    var cells = document.getElementsByClassName("cell");
    for (i = 0; i < cells.length; i++) {
        cells[i].style.backgroundColor = "";
        cells[i].innerHTML = "";
        cells[i].setAttribute("mom", "");
        // Add event listener to each cell
        cells[i].addEventListener("click", function() {oneclick_Block(this, event)}, false);
        cells[i].addEventListener("dblclick", function() {click_Block(this)}, false);
        cells[i].addEventListener("mouseover", function() {hover_Block(this)}, false);
        cells[i].addEventListener("mouseout", function() {out_Block(this)}, false);

    }
    document.getElementById("extern").style.display = "none";

    selectionChange();
}

function selectionChange() {
    var oblItems = "";
    var eleItems = "";

    for (i = 0; i < data.length; i++) {
        var grade = parseInt(data[i]['grade'], 10);
        if (grade != document.getElementById("grade").value && document.getElementById("grade").value != 0) {
            continue;
        }

        var flag = 1;
        var dpm = data[i]['department'];
        if (dpm == document.getElementById("department").value) {
            if (data[i]['obligatory'] == "必修") {
                var junction = "<li class='subject' active='0' time='" +
                    data[i]['time'].trim() + "' child=' " + data[i]['code'] + " <span>" +
                    data[i]['title'].split(" ")[0] + "</span>' inx='" + i + "'> " +
                    "<span><a rel='bookmark' title='課程代碼:" +
                    data[i]['code'] + "'>" + data[i]['title'].split(" ")[0] + "</a></span>" +
                    "<span>授課教授:" + data[i]['professor'] + "  學分數:" + data[i]['credits'] +
                    "</span></li>";

                for (j = 0; j < document.getElementById("selected").children.length; j++) {
                    if (i == parseInt(document.getElementById("selected").children[j].getAttribute("inx"), 10)) {
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

                for (j = 0; j < document.getElementById("selected").children.length; j++) {
                    if (i == parseInt(document.getElementById("selected").children[j].getAttribute("inx"))) {
                        flag = 0;
                    }
                }
                if (flag) {
                    eleItems += junction;
                }
            }
        }
    }
    document.getElementById("obligatory").children[0].innerHTML = oblItems;
    document.getElementById("elective").children[0].innerHTML = eleItems;

    // Add event listener to each subject in list
    var subjects = document.getElementsByClassName("subject");
    for (j = 0; j < subjects.length; j++) {
        subjects[j].addEventListener('mouseover', function() {hover_Course(this)}, false);
        subjects[j].addEventListener('mouseout', function() {out_Course(this)}, false);
        subjects[j].addEventListener('mouseup', function() {up_Course(this)}, false);
        subjects[j].addEventListener('mousedown', function() {down_Course(this)}, false);
    }
}

function hover_Course(course) {
    var raw = course.getAttribute("time").trim();
    var time = raw.split(",");
    for (i in time) {
        var weekday = parseInt(time[i], 10).toString().substring(0, 1);
        for (j = 1; j < time[i].length; j++) {
            var acctime = time[i].substring(j, j + 1);
            if (acctime.length == 1) {
                acctime = "0" + acctime;
            }
            if (acctime == "0A" || acctime == "0B" || acctime == "0C" || acctime == "0D") {
                var dynamic_tables = document.getElementsByClassName("dynamic_table");
                for (j = 0; j < dynamic_tables.length; j++) {
                    dynamic_tables[j].style.display = "block";
                }
            }
            acctime = weekday + acctime;
            if (acctime.length >= 3) {
                if (document.getElementById(acctime).innerHTML == "") {
                    document.getElementById(acctime).style.backgroundColor = HOVERED;
                } else {
                    if (document.getElementById(acctime).getAttribute("mom") == course.getAttribute("inx")) {
                        document.getElementById(acctime).style.backgroundColor = HOVERED;
                    } else {
                        document.getElementById(acctime).style.backgroundColor = CONFLICT;
                    }
                }
            }
        }
    }
}

function out_Course(course) {
    course.style.backgroundColor = "";
    var times = {10: "N", 11: "A", 12: "B", 13: "C", 14: "D"};
    for (i = 1; i <= 6; i++) {
        for (j = 1; j <= 14; j++) {
            if (j < 10) {
                var acctime = i.toString() + "0" + j.toString();
            } else {
                var acctime = i.toString() + "0" + times[j];
            }

            if (document.getElementById(acctime).innerHTML == "") {
                document.getElementById(acctime).style.backgroundColor = "#DEDEDE";
            } else {
                document.getElementById(acctime).style.backgroundColor = SELECTED;
            }
        }
    }
    dyn_ext();
}

function dyn_ext() {
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
        var dynamic_tables = document.getElementsByClassName("dynamic_table");
        for (i = 0; i < dynamic_tables.length; i++) {
            dynamic_tables[i].style.display = "none";
        }
    }
}

function up_Course(course) {
    course.style.backgroundColor = "#CCC";
}

function down_Course(course) {
    course.style.backgroundColor = "#AAA";
    var raw = course.getAttribute("time").trim();
    var time = raw.split(",");

    var t_count = 0;
    var acctimes = new Array();
    for (i in time) {
        var weekday = parseInt(time[i], 10).toString().substring(0, 1);
        for (j = 1; j < time[i].length; j++) {
            var acctime = time[i].substring(j, j + 1);
            if (acctime.length == 1) {
                acctime = "0" + acctime;
            }
            acctime = weekday + acctime;
            acctimes[t_count] = acctime;
            t_count++;
        }
    }

    var act = course.getAttribute("active");
    if (act == 0) {
        var flag = 1;
        for (k = 0; k < t_count; k++) {
            var block = document.getElementById(acctimes[k].trim());
            if (block.getAttribute("mom") != "") {
                flag = 0;
            }
        }

        if (flag) {
            var inx = parseInt(course.getAttribute("inx"), 10);
            for (k = 0; k < t_count; k++) {
                var block = document.getElementById(acctimes[k].trim());
                block.style.backgroundColor = SELECTED;
                block.innerHTML = data[inx]['code'] + " " + data[inx]['title'].split(" ")[0];
                block.setAttribute("mom", course.getAttribute("inx"));
            }

            var app = "<li class='subject' active='1' time='" +
                raw + "' child='" + course.getAttribute("child") + "' inx='" + course.getAttribute("inx") + "'>" +
                course.innerHTML + "</li>";

            document.getElementById("selected").children[0].innerHTML += app;

            var subjects = document.getElementById("selected").children[0].children;
            for (i = 0; i < subjects.length; i++) {
                subjects[i].addEventListener('mouseout', function() {out_Course(this)}, false);
                subjects[i].addEventListener('mousedown', function() {down_Course(this)}, false);
            }
            course.style.display = "none";
        }
    } else {
        var flag = 1;
        for (k = 0; k < t_count; k++) {
            var block = document.getElementById(acctimes[k].trim());
            if (block.getAttribute("mom") != course.getAttribute("inx")) {
                flag = 0;
            }
        }

        if (flag) {
            for (k = 0; k < t_count; k++) {
                var block = document.getElementById(acctimes[k].trim());
                block.style.backgroundcolor = "#BEE";
                block.innerHTML = "";
                block.setAttribute("mom", "");
            }
            var list = document.getElementById("obligatory").children[0].children;
            for (i = 0; i < list.length; i++) {
                if (list[i].getAttribute("inx") == course.getAttribute("inx")) {
                    list[i].style.display = "list-item";
                }
            }
            var list = document.getElementById("elective").children[0].children;
            for (i = 0; i < list.length; i++) {
                if (list[i].getAttribute("inx") == course.getAttribute("inx")) {
                    list[i].style.display = "list-item";
                }
            }
            dyn_ext();
            course.style.display = "none";

        }
    }
}

function click_Block(block) {
    var target = block.getAttribute("mom");
    var list = document.getElementById("selected").children[0];
    var obl = document.getElementById("obligatory").children[0];
    var opt = document.getElementById("elective").children[0];
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
                    var block = document.getElementById(acctime);
                    block.style.backgroundColor = "#DEDEDE";
                    block.innerHTML = "";
                    block.setAttribute("mom", "");
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
                    var block = document.getElementById(acctime);
                    block.style.backgroundColor = "#DEDEDE";
                    block.innerHTML = "";
                    block.setAttribute("mom", "");
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
                    var block = document.getElementById(acctime);
                    block.style.backgroundColor = "#DEDEDE";
                    block.innerHTML = "";
                    block.setAttribute("mom", "");
                }
            }
            list.children[i].style.display = "none";
        }
    }
    document.getElementById("extern").style.display = "none";
    dyn_ext();
}

function hover_Block(block) {
    var target = block.getAttribute("mom");
    var list = document.getElementById("selected").children[0];
    if (!list) {
        return;
    }
    for (i = 0; i < list.children.length; i++) {
        if (list.children[i].getAttribute("inx") == target) {
            var raw = list.children[i].getAttribute("time").trim();
            var time = raw.split(",");
            list.children[i].style.backgroundColor = "#CCC";
            for (k in time) {
                var weekday = parseInt(time[k], 10).toString().substring(0, 1);
                for (j = 1; j < time[k].length; j++) {
                    var acctime = time[k].substring(j, j + 1);
                    if (acctime.length == 1) {
                        acctime = "0" + acctime;
                    }
                    acctime = weekday + acctime;
                    var block = document.getElementById(acctime);
                    block.style.backgroundColor = HOVERED;
                }
            }
        }
    }
}

function out_Block(block) {
    var target = block.getAttribute("mom");
    var list = document.getElementById("selected").children[0];
    if (!list) {
        return;
    }
    for (i = 0; i < list.children.length; i++) {
        if (list.children[i].getAttribute("inx") == target) {
            var raw = list.children[i].getAttribute("time").trim();
            var time = raw.split(",");
            list.children[i].style.backgroundColor = "";
            for (k in time) {
                var weekday = parseInt(time[k], 10).toString().substring(0, 1);
                for (j = 1; j < time[k].length; j++) {
                    var acctime = time[k].substring(j, j + 1);
                    if (acctime.length == 1) {
                        acctime = "0" + acctime;
                    }
                    acctime = weekday + acctime;
                    var block = document.getElementById(acctime);
                    if (document.getElementById(acctime).innerHTML == "") {
                        document.getElementById(acctime).style.backgroundColor = "#DEDEDE";
                    } else {
                        document.getElementById(acctime).style.backgroundColor = SELECTED;
                    }
                }
            }
        }
    }
}

var last_c = "";
function oneclick_Block(block, event) {
    var mx = event.pageX + 5;
    var my = event.pageY + 5;
    var di = block.getAttribute("mom");
    if (di != "" && di != last_c) {
        var ext = document.getElementById("extern");
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
        var ext = document.getElementById("extern");
        ext.style.display = "none";
        last_c = "";
    } else {
        var ext = document.getElementById("extern");
        ext.style.display = "none";
        last_c = "";
    }
}

//toyo
function title1() {
    document.getElementById('my_courses').style.display = 'block';
    document.getElementById('dept_courses').style.display = 'none';

    document.getElementById('selector_container').style.display = 'none';
    document.getElementById('search_by_code').style.display = 'inline-block';

    document.getElementById('obligatory').style.display = 'none';
    document.getElementById("elective").style.display = "none";
    document.getElementById('selected').style.display = 'inline-block';


    var legends = document.getElementsByClassName("dept_c");
    for (i = 0; i < legends.length; i++) {
        legends[i].style.display = "none";
    }

    var legends = document.getElementsByClassName("my_c");
    for (i = 0; i < legends.length; i++) {
        legends[i].style.display = "block";
    }

    var title1 = document.getElementById('list_title_1');
    var title2 = document.getElementById('list_title_2');
    title1.style.zIndex = "5";
    title2.style.zIndex = "4";
    title1.style["boxShadow"] = "0px 0px 0px";
    title2.style["boxShadow"] = "inset 0px 0px 3px ";
    title1.style["backgroundColor"] = "#EBEBEB";
    title2.style["backgroundColor"] = "#888888";
    title1.style["borderRadius"] = "0px 0px 0px 0px";
    title2.style["borderRadius"] = "5px 0px 0px 0px";
}

function title2() {
    document.getElementById('dept_courses').style.display = 'block';
    document.getElementById('my_courses').style.display = 'none';

    document.getElementById('selector_container').style.display = 'block';
    document.getElementById('search_by_code').style.display = 'none';

    document.getElementById("obligatory").style.display = "inline-block";
    document.getElementById("elective").style.display = "inline-block";
    document.getElementById('selected').style.display = 'none';

    var legends = document.getElementsByClassName("my_c");
    for (i = 0; i < legends.length; i++) {
        legends[i].style.display = "none";
    }

    var legends = document.getElementsByClassName("dept_c");
    for (i = 0; i < legends.length; i++) {
        legends[i].style.display = "block";
    }

    var title1 = document.getElementById('list_title_1');
    var title2 = document.getElementById('list_title_2');
    title1.style.zIndex = "4";
    title2.style.zIndex = "5";
    title2.style["boxShadow"] = "0px 0px 0px";
    title1.style["boxShadow"] = "inset 0px 0px 3px ";
    title1.style["backgroundColor"] = "#888888";
    title2.style["backgroundColor"] = "#DEDEDE";
    title2.style["borderRadius"] = "0px 0px 0px 0px";
    title1.style["borderRadius"] = "0px 5px 0px 0px";
}
