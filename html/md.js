var student = "";
var hash = "";
var anon = false;
var tips = {};
loadData("data/checa.xml", false, 3, null, null);       

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

function loadData(filename, force, kind, notif, next) {
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
  // document.getElementById("debug").innerHTML += "<p>Loading XML from " + url + "</p>"
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
//      document.getElementById("debug").innerHTML += "<p>Loaded " + resp + "</p>"
//      document.getElementById("debug").innerHTML += "<p>" + (resp == null) + "</p>"
      var data = resp.getElementsByTagName("field");
      for (var i = 0; i < data.length; i++) {   
        if (kind == 3) { // tips for incorrect exercises
	  var tip = data[i];
	  var raw = tip.textContent;
	  var cut = raw.indexOf("#");
	  var label = raw.substring(0, cut);
	  var content = raw.substring(cut + 2);
	  tips[label] = content;
	  // document.getElementById("debug").innerHTML += "<p>Tip for " + label + " is " + content + ".</p>"
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
  	    // document.getElementById("debug").innerHTML += "<p>Effect " + effect + " for " + label  + "; tip " + tips[label] + "</p>"
            if (effect > 0) {
              perExercise[exercise] += effect;
              value = "<p><span style='color:green'>Has recibido dos puntos por la respuesta correcta.</span></p>"
          } else {
          value = "<p><span style='color:red'><strong>Respuesta incorrecta.</strong>" + 
	  " Revisa bien los pasos de tu soluci&oacute;n e intenta nuevamente.</span>";
	      if (tips[label] !== undefined) {
	        value +=  "<br>" + tips[label];
              }
	      value += "</p>";
            }
          }
  	  // document.getElementById("debug").innerHTML += "<p>Content for " + label + " (" + kind + "): " + value + "</p>"

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
             var label = "p" + ex;
			       var score = 2 * perExercise[ex];      
             total += score;
             document.getElementById(label).innerHTML = 
			       " <small>(" + score.toFixed(0) + " pts)</small>";      
          }
       }
       perc = 100.0 * total / 50.0;

       document.getElementById("pts").innerHTML = "<p>Tienes en total " + total
			       + " puntos de las " + answered + 
			       " tareas que has hecho hasta la fecha." + 
			       " Ese total corresponde al " + perc.toFixed(0) 
			       + " porciento del total disponible. " + 
                      	       "Se muestran los puntos acumulados por tarea.";
      }
    }
    if (notif != null) {
      document.getElementById(notif).innerHTML = "<p><small>Calificado " + timestamp() + ".</small></p>"
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
function gradeExercise(number) {
  // document.getElementById("debug").innerHTML += "<p>Calificando ejercicio" + number + "</p>"
  document.getElementById("l" + number).innerHTML = "&nbsp;<img alt='Loading...' src='../../loader.gif' alt='Grading...'>";
  var responses = "";
  for (i = 1; i <= 5; i++) {
    v = document.getElementById("r" + number + "." + i).value;
    if (v.length > 0) {
      responses += "&r" + number + "." + i + "=" + encodeURIComponent(v);
    }
  }
  carga("https://elisa.dyndns-web.com/cgi-bin/verif.py?hash=" + hash + responses, "md.html#ce" + number, "l" + number);
}
function fillValues(notif, next) {
  //document.getElementById("debug").innerHTML += "<p><span style='color:orange'>Reloading XMLs...</span></p>"
  if (hash != "") {
      //document.getElementById("debug").innerHTML += "<p><span style='color:red'>Using hash " + hash + ".</span></p>"
      for (var ex = 1; ex <= 5; ex++) {
         submitlabel = "s" + ex; 
         submitbutton = "<button type='button' onclick='gradeExercise(" + ex + ")'>Calificar Tarea " + ex + "</button>";
         document.getElementById(submitlabel).innerHTML = submitbutton;
      }
      loadData("data/" + hash + ".generated.xml", false, 1, null, null);
      loadData("data/" + hash + ".rejected.xml", true, 2, null, null);
      loadData("data/" + hash + ".accepted.xml", true, 2, null, null);
      loadData("data/" + hash + ".awarded.xml", true, 4, notif, next);
  }
}
function carga(url, next, notif) {
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
        //document.getElementById("debug").innerHTML += req.responseText;
	fillValues(notif, next); 
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
	// console.log("HASH", hash)
	var status = resp[1].trim();
	if (status == "new") {
	    alert("Has entrado al sistema con una cuenta NUEVA. Si ya has entrado antes, pues, pusiste mal el correo y necesitas salir del sistema y volver a entrar con el correo correcto para contabilizar tus puntos.");
	}
        document.cookie = "hash=" + hash;
        fillValues(null, null);
     }
   }
  x.send(null);   
}
function greetUser() {
  var loggedIn = "Entraste al sistema con el correo ";
  var logout = "<br><a href='md.html' onclick='performLogout();''>Sal del sistema.</a>"; 
  var content = loggedIn + student + "." + logout;
  document.getElementById("login").innerHTML = content;
}
function anonGreet() {
   document.getElementById("login").innerHTML = 
     "<span style='color:red'>Tendr&aacute;s que <a onclick='performLogin();'><strong>identificarte</strong></a>" +
     " para hacer tareas.</span>";
}
function performLogin() {
    student = prompt("Entra con tu correo para realizar tareas. Cancela para ver el contenido sin enviar tareas.");
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
	document.getElementById("login").innerHTML = "<span style='color:red'>Correo inv&aacute;lido." + 
            " <a onclick='performLogin();'><strong>Intenta nuevamente.</strong></a></span>";
    }
}
function performLogout() {
  anon = true;
  student = "";
  hash = "";
  document.cookie = "student=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  document.cookie = "hash=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  document.cookie = "anon=true";
  // document.getElementById("debug").innerHTML += "<p>Anon. mode activated</p>";
  anonGreet(); 
}
if (document.cookie.indexOf("anon") >= 0) {
  anon = true;
  // document.getElementById("debug").innerHTML += "<p>Anon. mode detected</p>";
  anonGreet(); 
} 
if (!anon) {
  // document.getElementById("debug").innerHTML += "<p>Anon. mode not detected</p>";
  if (document.cookie.indexOf("student") >= 0) {
    student = getCookieByName("student");
    // document.getElementById("debug").innerHTML += "<p>Student cookie says " + student + ".</p>";
    greetUser();
    if (document.cookie.indexOf("hash") >= 0 ) {
       hash = getCookieByName("hash");
       // document.getElementById("debug").innerHTML += "<p>Hash cookie says " + hash + ".</p>";
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

