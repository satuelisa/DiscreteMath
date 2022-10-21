var active = "#bbb891";
var inactive = "#b3b3b3";
function clearNav() {
    var i;
    var j;
    for (i = 1; i <= 5; i++) {
	document.getElementById('ct' + i).className = document.getElementById('ct' + i).className.replace(" active", "");
	document.getElementById('cp' + i).className = document.getElementById('cp' + i).className.replace(" active", "");
	document.getElementById('ct' + i).style.backgroundColor = inactive;
	document.getElementById('cp' + i).style.backgroundColor = inactive;	
	for (j = 1; j <= 5; j++) {
	    var label = "T" + j + i;
	    document.getElementById(label).style.display = "none";
	}
    }
}
function cargaTarea(evt, tarea) {
    clearNav();
    sessionStorage.setItem('tareaActiva', tarea);
    document.getElementById('ct' + tarea).className += " active";
    document.getElementById('ct' + tarea).style.backgroundColor = active;
    var recuerda = sessionStorage.getItem('recuerda');
    if (recuerda) {
	document.getElementById('cp' + recuerda).click();
	sessionStorage.removeItem('recuerda');
    } else {
	document.getElementById('cp1').click();
    }
}

function cargaPregunta(evt, pregunta) {
    clearNav();
    var tarea = sessionStorage.getItem('tareaActiva');
    sessionStorage.setItem('preguntaActiva', pregunta);
    document.getElementById('cp' + pregunta).className += " active";
    document.getElementById('cp' + pregunta).style.backgroundColor = active;
    document.getElementById('ct' + tarea).style.backgroundColor = active;    
    document.getElementById("T" + tarea + pregunta).style.display = "flex";    
}

var student = "";
var hash = "";
var anon = false;
var tips = {};
loadData("data/check.xml", false, 3, null, null);       

function getCookieByName(name) {
    var cookiestring=RegExp(""+name+"[^;]+").exec(document.cookie);
    return unescape(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
}

function timestamp() {
    var curr = new Date(); 
    var h = curr.getHours();
    var m = curr.getMinutes();
    if (m < 10) {
	m = "0" + m;
    }
    return "" + h + ":"  + m;
}

function nocache() {
    var dt = new Date();
    var strOutput = "";
    strOutput = dt.getHours() + "_" + dt.getMinutes() + "_" + dt.getSeconds() + "_" + dt.getMilliseconds();
    return strOutput;
}

function loadData(filename, force, kind, next) {
    var mimeType = "text/xml";    
    var x;
    if (window.XMLHttpRequest) {
	x = new XMLHttpRequest();
    } else {
	x = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (force) {
	url = filename + "?time=" + nocache();
    } else {
	url = filename;
    }
    x.open("GET", url, true);
    x.setRequestHeader("Content-Type", mimeType);    
    x.onload = function() {
	if (x.readyState == 4) {
	    var total = 0.0;
	    var perExercise = {};
	    var status = {};
	    for (var ex = 1; ex <= 5; ex++) {
		perExercise[ex] = 0.0;
		status[ex] = false;
	    }
	    resp = x.responseXML;
	    var data = resp.getElementsByTagName("field");
	    for (var i = 0; i < data.length; i++) {   
		if (kind == 3) { // tips for incorrect exercises
		    var tip = data[i];
		    var raw = tip.textContent;
		    var cut = raw.indexOf("#");
		    var label = raw.substring(0, cut);
		    var content = raw.substring(cut + 2);
		    tips[label] = content;
		} else {
		    var label = data[i].firstChild.textContent;
		    var value = data[i].lastChild.textContent;
		    value = value.trim()		  
		    if (kind == 1) { // problem data (generated)
			if (value.indexOf(" ") > 0) {
			    value = "<code>" + value.replace(/ /g, ", ") + "</code>";
			}
			label = "d" + label
		    } else if (kind == 4) { // points awarded from exercises
			var exercise = label.substring(1, label.indexOf("."));    
			label = label.replace("r", "c");
			status[exercise] = true;
			var effect = parseFloat(value);
			if (effect > 0) {
			    perExercise[exercise] += effect;
			    value = "<span style='color:#bbb891'>&#10004;</span>";
			} else {
			    value = "<span style='color:#dc965a'>&#10008;</span>";
			    if (tips[label] !== undefined) {
				value +=  "<p>&nbsp;<span style='color:b3b3b3'>" + tips[label] + "</span></p>";
			    }
			}
		    }
		    var target = document.getElementById(label);
		    if (kind != 2) { // divs
			target.innerHTML = value;
		    } else { // input fields
			target.value = value;
		    }
		}
	    }
	    if (kind == 4) {
		var answered = 0;
		for (var ex = 1; ex <= 5; ex++) {
		    if (status[ex]) {
			answered++;
			var label = "pt" + ex;
			var score = 2 * perExercise[ex];      
			total += score;
			document.getElementById(label).innerHTML = 
			    "<br>(" + score.toFixed(0) + " / 10)";      
		    }
		}
		perc = 100.0 * total / 50.0;
		document.getElementById("pts").innerHTML = "<p>Total: " + total
		    + " points for " + answered + 
		    " assignments  (" + + perc.toFixed(0) + " %)";
	    }
	}
	if (next != null) {
	    window.location.href = next;
	}
    }
    x.send(null);   
}

function getcontent(element){
    var cont;
    if (typeof window.ActiveXObject != 'undefined' && element.hasChildNodes) {
	cont = element.childNodes[0].nodeValue;
    } else if (element.hasChildNodes) {
	cont = element.childNodes[1].nodeValue;
    }
    return cont;
}

function gradeExercise(tarea, pregunta) {
    var tarea = sessionStorage.getItem('tareaActiva');
    var pregunta = sessionStorage.getItem('preguntaActiva');
    sessionStorage.setItem('recuerda', pregunta);
    var identificador = "r" + tarea + "." + pregunta;
    var responses = "";
    v = document.getElementById(identificador).value;
    if (v.length > 0) {
	responses += "&" + identificador + "=" + encodeURIComponent(v);
    }
    carga("https://elisa.dyndns-web.com/cgi-bin/verif.py?hash=" + hash + responses, "mobile.html");
}

function fillValues(next) {
    if (hash != "") {
	loadData("data/" + hash + ".generated.xml", false, 1, null);
	loadData("data/" + hash + ".rejected.xml", true, 2, null);
	loadData("data/" + hash + ".accepted.xml", true, 2, null);
	loadData("data/" + hash + ".awarded.xml", true, 4, next);
        submitbutton = "<button type='button' style='height:50px;width:100px;;background-color:#bbb891;' onclick='gradeExercise()'>Grade</button>";
	document.getElementById("calif").innerHTML = submitbutton;
	var pregunta = sessionStorage.getItem('preguntaActiva');
	if (pregunta) {
	    document.getElementById('cp' + pregunta).click();
	} else {
	    document.getElementById('ct1').click();
	}
    }
}

function carga(url, next) {
    var mimeType = "text/plain";    
    var req;
    if (window.XMLHttpRequest) {
	req = new XMLHttpRequest();
    } else {
	req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    req.open("GET", url, true);
    req.setRequestHeader("Content-Type", mimeType);    
    req.onload = function() {
	if (req.readyState == 4) {
	    fillValues(next); 
	}
    }
  req.send(null);   
}

function getHash() {
    var url = "https://elisa.dyndns-web.com/cgi-bin/md.py?student=" + student
    var mimeType = "text/plain";    
    var x;
    if (window.XMLHttpRequest) {
	x = new XMLHttpRequest();
    } else {
	x = new ActiveXObject("Microsoft.XMLHTTP");
    }
    x.open("GET", url, true);
    x.setRequestHeader("Content-Type", mimeType);    
    x.onload = function() {
	if (x.readyState == 4) {
	    var rt = x.responseText;	
	    var resp = rt.split(" ");
	    hash = resp[0].trim();
	    var status = resp[1].trim();
	    if (status == "new") {
		alert("NEW ACCOUNT. If this is NOT your first login, you have mistyped your email and you should log out and use the original one instead.");
	    }
            document.cookie = "hash=" + hash;
            fillValues(null, null);
	}
    }
    x.send(null);   
}

function greetUser() {
    var loggedIn = "<span style='color:#dc965a'>Username ";
    var logout = "<a href='movil.html' onclick='performLogout();''><strong>Log out</strong></a>"; 
    var content = logout + "&nbsp;" + loggedIn + student + ".</span>"
    document.getElementById("login").innerHTML = content;
}

function anonGreet() {
    document.getElementById("login").innerHTML = 
	"<span style='color:#dc965a'>You must <a onclick='performLogin();'><strong>log in</strong></a>" +
	" to grade homework.</span>";
}

function performLogin() {
    student = prompt("Username:");
    if (student != null) {
	student = student.toLowerCase().trim();
    }
    if (student != null && student != "" && student.indexOf("@") != -1 && student.indexOf(".") != -1 && student.indexOf(" ") == -1) {
	document.cookie = "student=" + student;
	document.cookie = "anon=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
	anon = false;
	greetUser(); 
	getHash();
    } else {
	anonGreet();
    }
}

function performLogout() {
    clearNav();
    sessionStorage.removeItem('preguntaActiva');
    sessionStorage.removeItem('tareaActiva');
    anon = true;
    student = "";
    hash = "";
    document.cookie = "student=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "hash=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "anon=true";
    anonGreet(); 
}
if (document.cookie.indexOf("anon") >= 0) {
    anon = true;
    anonGreet(); 
} 
if (!anon) {
    if (document.cookie.indexOf("student") >= 0) {
	student = getCookieByName("student");
	greetUser();
	if (document.cookie.indexOf("hash") >= 0 ) {
	    hash = getCookieByName("hash");
	} 
	hash = hash.trim();
	if (hash == null || hash == "") {
	    getHash();
	} else {
	    fillValues(null, null);
	}
    } else {
	performLogin();
    }
}

