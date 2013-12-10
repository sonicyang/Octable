var data;

var SELECTED = "#D6B86D";
var CONFLICT = "#FF1C2D";
var HOVERED = "#ADC7C5"

function ajax_Fetch(HOST, DIR) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.status == 404) {
            response = "";
        } else if (xhr.readyState == 4) {
            response = xhr.responseText;
        }
    }

    var dateList = Date().toString().split(" ");
//    var filename = dateList[1] + "-" + dateList[2] + "-" + dateList[3];
//    var url = HOST + DIR + filename + ".json";
    var url = HOST + DIR + ".json";

    xhr.open("GET", url, false);
    xhr.send();

    if (xhr.responseText == "") {
        return "";
    }

    return JSON.parse(xhr.responseText);
}


function selectionChange_School(sel) {
    var host = window.location.toString();
    var school = sel.options[sel.selectedIndex].value;
    var datapath = "/static/data/" + school + "/" + school.toString();
    data = ajax_Fetch(host, datapath);
    document.getElementById("grade").value = 0;
    var department = document.getElementById("department");
    department.innerHTML = "";
    for (i = 0; i < data.length; i++) {
        var value = data[i]['department'];
        var flag = 1;
        for (j = 0; j < i; j++) {
            if (value == data[j]['department']) {
                flag = 0;
            }
        }
        //adjustment for trash values
        if (value == "開課單位" || value == " ") {
            flag = 0;
        }
        if (flag) {
            department.innerHTML += "<option value=\"" + value + "\">" + value + "</option>";
        }
    }

    for (i = 1; i <= 6; i++) {
        for (j = 1; j <= 10; j++) {
            var acctime = j.toString();
            acctime = "0" + acctime;
            acctime = i.toString() + acctime;
            if (j == 10) {
                acctime = i.toString() + "0N";
            }
            document.getElementById(acctime).style.backgroundColor = "";
            document.getElementById(acctime).innerHTML = "";
            document.getElementById(acctime).setAttribute("mom","");
        }
    }
    document.getElementById("obl_List").style.lineHeight = "normal";
    document.getElementById("opt_List").style.lineHeight = "normal";
    document.getElementById("ext_List").style.lineHeight = "normal";
    document.getElementById("ext_List").innerHTML = "<ul class=\"course\"></ul>";
    document.getElementById("extern").style.display = "none";

    selectionChange();
}


function selectionChange() {
    var out = "<ul class=\"course\">";
    var opt_out = "<ul class=\"course\">";
    for (i = 0; i < data.length; i++) {
        var dpm = data[i]['department'];
        var grade = parseInt(data[i]['grade'], 10);
        if(dpm == document.getElementById("department").value && (grade == document.getElementById("grade").value || document.getElementById("grade").value == 0) ) {
            if ( data[i]['obligatory'] == "必修"){
                var junction = "<li class=\"subject\" active=\"0\" onmouseover=\"hover_Course(this)\"" +
                    " onmouseout=\"out_Course(this)\"" +
                    " onmousedown=\"down_Course(this)\"" +
                    " onmouseup=\"up_Course(this)\" time=\"" +
                    data[i]['time'].trim() + "\" child=\" " + data[i]['code']  + " <span>" +
                    data[i]['title'].split(" ")[0] + "</span>\" inx=\"" + i + "\"> " +
                    "<span style=\"display: block;\"><a rel=\"bookmark\" title=\"課程代碼:" +
                    data[i]['code'] + "\">" + data[i]['title'].split(" ")[0] + "</a></span>" +
                    "<span style=\"display: block;padding-left: 20px;\">授課教授:" + data[i]['professor'] + "  學分數:" + data[i]['credits'] +
                    "</span></li>";

                var flag = 1;
                for (j = 0; j < document.getElementById("ext_List").children[0].children.length; j++) {
                    if (i == parseInt(document.getElementById("ext_List").children[0].children[j].getAttribute("inx"), 10)) {
                        flag = 0;
                    }
                }
                if (flag) {
                    out += junction;
                }
            } else {
                var junction = "<li class=\"subject\" active=\"0\" onmouseover=\"hover_Course(this)\"" +
                    " onmouseout=\"out_Course(this)\"" +
                    " onmousedown=\"down_Course(this)\"" +
                    " onmouseup=\"up_Course(this)\" time=\"" +
                    data[i]['time'].trim() + "\" child=\" " + data[i]['code']  + " <span>" +
                    data[i]['title'].split(" ")[0] + "</span>\" inx=\"" + i + "\"> " +
                    "<span style=\"display: block;\"><a rel=\"bookmark\" title=\"課程代碼:" +
                    data[i]['code'] + "\">" + data[i]['title'].split(" ")[0] + "</a></span>" +
                    "<span style=\"display: block;padding-left: 20px;\">授課教授:" + data[i]['professor'] + "  學分數:" + data[i]['credits'] +
                    "</span></li>";

                var flag = 1;
                for (j = 0; j < document.getElementById("ext_List").children[0].children.length; j++) {
                    if(i == parseInt(document.getElementById("ext_List").children[0].children[j].getAttribute("inx"))) {
                        flag = 0;
                    }
                }
                if (flag) {
                    opt_out += junction;
                }
            }
        }
    }
    out += "</ul>";
    document.getElementById("obl_List").innerHTML = out;
    document.getElementById("opt_List").innerHTML = opt_out;
}


function hover_Course(course) {
    var raw = course.getAttribute("time").trim();
    var time = raw.split(",");
    for (i in time) {
        var weekday = parseInt(time[i],10).toString().substring(0,1);
        for (j = 1; j < time[i].length; j++) {
            var acctime = time[i].substring(j, j+1);
            if (acctime.length == 1) {
                acctime = "0" + acctime;
            }
            if (acctime == "0A" || acctime == "0B" || acctime == "0C" || acctime == "0D") {
                document.getElementById("dynamic_table_1").style.display = "block";
                document.getElementById("dynamic_table_2").style.display = "block";
                document.getElementById("dynamic_table_3").style.display = "block";
                document.getElementById("dynamic_table_4").style.display = "block";
                document.getElementById("dynamic_table_5").style.display = "block";
                document.getElementById("dynamic_table_6").style.display = "block";
                document.getElementById("dynamic_table_7").style.display = "block";
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
    course.style.backgroundColor = "#CCC";
}

function out_Course(course) {
    course.style.backgroundColor = "";
    for (i = 1; i <= 6; i++) {
        for (j = 1; j <= 14; j++) {
            var acctime = j.toString();
            acctime = "0" + acctime;
            acctime = i.toString() + acctime;
            if (j == 10) {
                acctime = i.toString() + "0N";
            } else if(j == 11){
                acctime = i.toString() + "0A";
            } else if(j == 12){
                acctime = i.toString() + "0B";
            } else if(j == 13){
                acctime = i.toString() + "0C";
            } else if(j == 14){
                acctime = i.toString() + "0D";
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
    for (i = 1; i <= 6; i++) {
        for (j = 10; j <= 14; j++) {
            var acctime;
            if (j == 10) {
                acctime = i.toString() + "0N";
            } else if(j == 11){
                acctime = i.toString() + "0A";
            } else if(j == 12){
                acctime = i.toString() + "0B";
            } else if(j == 13){
                acctime = i.toString() + "0C";
            } else if(j == 14){
                acctime = i.toString() + "0D";
            }

            if (document.getElementById(acctime).innerHTML != "") {
                if (j >= 11 && j <= 14) {
                    flag = 0;
                }
            }
        }
    }
    if (flag) {
        document.getElementById("dynamic_table_1").style.display = "none";
        document.getElementById("dynamic_table_2").style.display = "none";
        document.getElementById("dynamic_table_3").style.display = "none";
        document.getElementById("dynamic_table_4").style.display = "none";
        document.getElementById("dynamic_table_5").style.display = "none";
        document.getElementById("dynamic_table_6").style.display = "none";
        document.getElementById("dynamic_table_7").style.display = "none";
    }
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
            var acctime = time[i].substring(j, j+1);
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
        for (k = 0; k < t_count; k++){
            var block = document.getElementById(acctimes[k].trim());
            if (block.getAttribute("mom") != ""){
                flag = 0;
            }
        }

        if (flag){
            var inx = parseInt(course.getAttribute("inx"),10);
            for (k = 0; k < t_count; k++){
                var block = document.getElementById(acctimes[k].trim());
                block.style.backgroundColor = SELECTED;
                block.innerHTML = data[inx]['code'] + " " + data[inx]['title'].split(" ")[0];
                block.setAttribute("mom", course.getAttribute("inx"));
            }

            var app = "<li class=\"subject\" active=\"1\" onmouseover=\"hover_Course(this)\"" +
                " onmouseout=\"out_Course(this)\"" +
                " onmousedown=\"down_Course(this)\"" +
                " onmouseup=\"up_Course(this)\" time=\"" +
                raw + "\" child=\"" + course.getAttribute("child") + "\" inx=\"" + course.getAttribute("inx") + "\">"+
                course.innerHTML + "</li>" ;
            document.getElementById("ext_List").children[0].innerHTML += app;
            course.style.display = "none";
        }
    } else {
        var flag = 1;
        for (k = 0; k < t_count; k++){
            var block = document.getElementById(acctimes[k].trim());
            if (block.getAttribute("mom") != course.getAttribute("inx")){
                flag = 0;
            }
        }

        if (flag){
            for (k = 0; k < t_count; k++){
                var block = document.getElementById(acctimes[k].trim());
                block.style.backgroundcolor = "#BEE";
                block.innerHTML = "";
                block.setAttribute("mom", "");
            }
            var list = document.getElementById("obl_List").children[0].children;
            for (i = 0;i < list.length; i++) {
                if (list[i].getAttribute("inx") == course.getAttribute("inx")) {
                    list[i].style.display = "list-item";
                }
            }
            list = document.getElementById("opt_List").children[0].children;
            for (i = 0;i < list.length; i++) {
                if (list[i].getAttribute("inx") == course.getAttribute("inx")) {
                    list[i].style.display = "list-item";
                }
            }
            dyn_ext();
            course.style.display = "none";

        }
    }
}


function up_Course(course) {
    course.style.backgroundColor = "#CCC";
}


function click_Block(block) {
    var target = block.getAttribute("mom");
    var list = document.getElementById("ext_List");
    var obl = document.getElementById("obl_List");
    var opt = document.getElementById("opt_List");
    for (i = 0; i < obl.children[0].children.length; i++) {
        if (obl.children[0].children[i].getAttribute("inx") == target) {
            var raw = obl.children[0].children[i].getAttribute("time").trim();
            var time = raw.split(",");
            for (k in time) {
                var weekday = parseInt(time[k], 10).toString().substring(0, 1);
                for (j = 1; j < time[k].length; j++) {
                    var acctime = time[k].substring(j, j+1);
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
        obl.children[0].children[i].style.display = "list-item";
        }
    }
    for (i = 0; i < opt.children[0].children.length; i++) {
        if (opt.children[0].children[i].getAttribute("inx") == target) {
            var raw = opt.children[0].children[i].getAttribute("time").trim();
            var time = raw.split(",");
            for(k in time){
                var weekday = parseInt(time[k], 10).toString().substring(0, 1);
                for (j = 1; j < time[k].length; j++) {
                    var acctime = time[k].substring(j, j+1);
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
        opt.children[0].children[i].style.display = "list-item";
        }
    }

    for (i = 0; i < list.children[0].children.length; i++) {
        if (list.children[0].children[i].getAttribute("inx") == target) {
            var raw = list.children[0].children[i].getAttribute("time").trim();
            var time = raw.split(",");
            for (k in time) {
                var weekday = parseInt(time[k], 10).toString().substring(0, 1);
                for (j = 1; j < time[k].length; j++) {
                    var acctime = time[k].substring(j, j+1);
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
        list.children[0].children[i].style.display = "none";
        }
    }
    document.getElementById("extern").style.display= "none";
    dyn_ext();
}


function hover_Block(block) {
    var target = block.getAttribute("mom");
    var list = document.getElementById("ext_List");
    for (i = 0; i < list.children[0].children.length; i++) {
        if (list.children[0].children[i].getAttribute("inx") == target) {
            var raw = list.children[0].children[i].getAttribute("time").trim();
            var time = raw.split(",");
            list.children[0].children[i].style.backgroundColor = "#CCC";
            for (k in time) {
                var weekday = parseInt(time[k], 10).toString().substring(0, 1);
                for (j = 1; j < time[k].length; j++) {
                    var acctime = time[k].substring(j, j+1);
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
    var list = document.getElementById("ext_List");
    for (i = 0; i < list.children[0].children.length; i++) {
        if (list.children[0].children[i].getAttribute("inx") == target) {
            var raw = list.children[0].children[i].getAttribute("time").trim();
            var time = raw.split(",");
            list.children[0].children[i].style.backgroundColor = "";
            for (k in time) {
                var weekday = parseInt(time[k], 10).toString().substring(0, 1);
                for (j = 1; j < time[k].length; j++) {
                    var acctime = time[k].substring(j, j+1);
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
    var my = event.pageY + 5 ;
    var di = block.getAttribute("mom");
    if (di != "" && di != last_c) {
        var ext = document.getElementById("extern");
        ext.style.display = "inline-block";
        ext.style.opacity = "0.75";
        ext.style.left = mx.toString() + "px";
        ext.style.top = my.toString() + "px";

        di = parseInt(di);
        ext.innerHTML = "<div>課程編號: " + data[di]['code']+ "</div>" +
                        "<div>課程名稱: " + data[di]['title']+ "</div>" +
                        "<div>授課教授: " + data[di]['professor']+ "</div>" +
                        "<div>　學分數: " + data[di]['credits']+ "</div>" +
                        "<div>必／選修: " + data[di]['obligatory']+ "</div>";
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
function title1(){
    var title1 = document.getElementById('list_title_1');
    var title2 = document.getElementById('list_title_2');
    var title3 = document.getElementById('list_title_3');
    document.getElementById('obligatory').style.display = 'inline-block';
    document.getElementById("elective").style.display="none";
    document.getElementById('selected').style.display = 'none';
    title1.style.zIndex="5";
    title2.style.zIndex="4";
    title3.style.zIndex="3";
    title1.style["boxShadow"] ="0px 0px 0px" ;
    title2.style["boxShadow"] ="inset 0px 0px 3px ";
    title3.style["boxShadow"] ="inset 0px 0px 3px ";
    title1.style["backgroundColor"] ="#DEDEDE";
    title2.style["backgroundColor"] ="#888888";
    title3.style["backgroundColor"] ="#888888";
    title1.style["borderRadius"] = "0px 0px 0px 0px";
    title2.style["borderRadius"] = "5px 0px 0px 0px";
    title3.style["borderRadius"] = "0px 0px 0px 0px";
}
function title2(){
    var title1 = document.getElementById('list_title_1');
    var title2 = document.getElementById('list_title_2');
    var title3 = document.getElementById('list_title_3');
    document.getElementById("obligatory").style.display="none";
    document.getElementById("elective").style.display="inline-block";
    document.getElementById('selected').style.display = 'none';
    title1.style.zIndex="4";
    title2.style.zIndex="5";
    title3.style.zIndex="3";
    title2.style["boxShadow"] ="0px 0px 0px" ;
    title1.style["boxShadow"] ="inset 0px 0px 3px ";
    title3.style["boxShadow"] ="inset 0px 0px 3px ";
    title1.style["backgroundColor"] ="#888888";
    title2.style["backgroundColor"] ="#DEDEDE";
    title3.style["backgroundColor"] ="#888888";
    title2.style["borderRadius"] = "0px 0px 0px 0px";
    title1.style["borderRadius"] = "0px 5px 0px 0px";
    title3.style["borderRadius"] = "5px 0px 0px 0px";
}

function title3(){
    var title1 = document.getElementById('list_title_1');
    var title2 = document.getElementById('list_title_2');
    var title3 = document.getElementById('list_title_3');
    document.getElementById("obligatory").style.display="none";
    document.getElementById("elective").style.display="none";
    document.getElementById('selected').style.display = 'inline-block';
    title1.style.zIndex="3";
    title2.style.zIndex="4";
    title3.style.zIndex="5";
    title3.style["boxShadow"] ="0px 0px 0px" ;
    title2.style["boxShadow"] ="inset 0px 0px 3px ";
    title1.style["boxShadow"] ="inset 0px 0px 3px ";
    title1.style["backgroundColor"] ="#888888";
    title2.style["backgroundColor"] ="#888888";
    title3.style["backgroundColor"] ="#DEDEDE";
    title3.style["borderRadius"] = "0px 0px 0px 0px";
    title2.style["borderRadius"] = "0px 5px 0px 0px";
    title1.style["borderRadius"] = "0px 0px 0px 0px";
}

/*
var toggle = 0;
function sidebar_toggle() {
    var sidebar = document.getElementById("hello_container");
    if (toggle) {
        toggle = 0;
        sidebar.style.right = "0px";
        sidebar.style.opacity = "0";
        sidebar.style.visibility = "hidden";
    } else {
        toggle = 1;
        sidebar.style.right = (1200 - window.innerWidth).toString()+"px";
        sidebar.style.transition = "0.5s";
        sidebar.style.opacity = "0.9";
        sidebar.style.visibility = "visible"
    }
}

window.onresize = function() {
    var wx = window.innerWidth;
    var sidebar = document.getElementById("hello_container").style;
    if (wx <= 1000 && !(toggle)) {
        sidebar.visibility = "hidden";
        sidebar.opacity = "0";
        sidebar.right = "-500px";
        document.getElementById("sidebar_toggle").style.display = "inline-block";
        toggle = 0;
    } else if (wx <= 1000 && toggle) {
        toggle = 1;
        sidebar.right = (1200 - window.innerWidth).toString()+"px";
        sidebar.transition = "0.5s";

        document.getElementById("sidebar_toggle").style.display = "inline-block";
    } else {
        sidebar.visibility = "visible";
        sidebar.opacity = "1";
        sidebar.right = "110px";
        document.getElementById("sidebar_toggle").style.display = "none";
        toggle = 0;
    }
};
*/
