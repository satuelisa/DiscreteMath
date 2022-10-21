var url = new URL(window.location.href);
var n;
var data = '';
var op = {};
var expires = new Date();
var inciso = ['a) ', 'b) ', 'c) ', 'd) ', 'e) '];
loadData(url.searchParams.get("hash"), url.searchParams.get("kind"), url.searchParams.get("mod"), url.searchParams.get("lan"));
var serverClock = new Date(Date.parse(url.searchParams.get("time")));
var localClock = new Date();
var timeDiff = serverClock - localClock; // positive if local clock is behind
console.log(timeDiff)

function prep(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

function timer() {
    var now = new Date(new Date().getTime() + timeDiff);
    if (now > expires) {
	document.getElementById("quedan").innerHTML = "<span style='color:red'>Tiempo agotado.</span>";
	return;
    }
    var h = now.getHours();
    var m = now.getMinutes();
    document.getElementById("reloj").innerHTML = "Son las " + h + ":" + prep(m) + " hrs.";
    if (expires != null) {
	var q = Math.round((expires - now) / 1000 / 60);
	var h = 0;
	while (q >= 60) {
	    h++;
	    q -= 60;
	}
	var plural = '';
	var horas = '';
	if (h > 0) {
	    horas = h + ' hora';
	    if (h > 1) {
		horas += 's';
		plural = 'n';
	    }
	}
	var minutos = '';
	if (q > 0) {
	    minutos = q + ' minuto';
	    if (q > 1) {
		minutos += 's';
		plural = 'n';
	    }
	}
	var conectivo = '';
	if (h > 0 && q > 0) {
	    conectivo = ' y ';
	}
	document.getElementById("quedan").innerHTML = 'Queda' + plural + ' ' + horas + conectivo + minutos + '.';
    }
    var t = setTimeout(timer, 6000);
}

function nocache() {
    var dt = new Date();
    var strOutput = "";
    strOutput = dt.getHours() + "_" + dt.getMinutes() + "_" + dt.getSeconds() + "_" + dt.getMilliseconds();
    return strOutput;
}

function loadData(hash, kind, mod, lan) {
    var trial = (mod === 't');
    var suffix = '';
    if (lan == 'eng') {
	document.getElementById("idioma").innerHTML = '<strong>Las preguntas est&aacute;n en ingl&eacute;s';
	if (!trial) {
	    document.getElementById("idioma").innerHTML += 'ya que la inscripci&oacute;n a la unidad se ha hecho en ese idioma.';	    
	} else {
	    document.getElementById("idioma").innerHTML += '.</strong>';
	}
    }
    if (trial) {
	document.getElementById('mod').value = 't';
	suffix = 'trial/';
    } else {
	document.getElementById('pin').required = true;
	document.getElementById('pin').disabled = false;
	document.getElementById('mod').value = 'r';
    }
    if (kind == 'ord') {
	document.getElementById("examType").innerHTML = 'Ordinario';
	document.getElementById("unidad").innerHTML = 'Todas las preguntas corresponden a la unidad tem&aacute;tica <em>3.&nbsp;Grafos y &aacute;rboles</em>.';
    } else if (kind == 'mc') {
	document.getElementById("examType").innerHTML = 'Medio curso';
	document.getElementById("unidad").innerHTML = 'Las preguntas 1&ndash;12 corresponden a la unidad tem&aacute;tica <em>1.&nbsp;L&oacute;gica</em>' +
	    ' y las preguntas 13&ndash;20 a la unidad <em>2. Combinatoria</em>.'
    } else if (kind == 'xord') {
	document.getElementById("examType").innerHTML = 'Extraordinario';
	document.getElementById("unidad").innerHTML = 'Las preguntas 1&ndash;12 corresponden a la unidad tem&aacute;tica <em>1.&nbsp;L&oacute;gica</em>, ' +
	    '13&ndash;20 a la unidad <em>2.&nbsp;Combinatoria</em> y 21&ndash;40 a la unidad <em>3.&nbsp;Grafos y &aacute;rboles</em>.';
    } else {
	return;
    }
    document.getElementById("hash").value = hash;
    document.getElementById("kind").value = kind;
    if (trial) {
	var alert = document.getElementById('alert');			    	
	label = document.createElement('span');
	label.style.backgroundColor = "yellow";
	label.style.color = "red";
	label.style.fontSize = "120%";
	label.innerHTML = "Examen de pr&aacute;ctica";
	alert.appendChild(label);
	alert.appendChild(document.createElement('br'));
    }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 404) {
	    document.getElementById('questions').innerHTML = "<span style='color:red;font-size:200%'>Hay que entrar en <a href='https://elisa.dyndns-web.com/teaching/mat/discretas/login.html'>la p&aacute;gina de login</a> para generar el examen.</span>";
	} else if (this.readyState == 4 && this.status == 200) {
	    data = JSON.parse(this.responseText);
	    expires = new Date(Date.parse(data.expires));
	    document.getElementById("final").innerHTML = "El examen cierra a las " + expires.getHours() + ":" + prep(expires.getMinutes()) + " hrs.";
	    timer()
	    n = data.questions.length;
	    document.getElementById("total").innerHTML = n;
	    for (var q = 0; q < n; q++) {
		var section = document.createElement("div"); 
		var descr = document.createTextNode((q + 1) + ". " + data.questions[q].description);
		section.appendChild(descr);		
		for (var a = 0; a < 5; a++) {
		    var option = document.createElement("div"); 
		    var radio = document.createElement('input');
		    radio.setAttribute('type', 'radio');
		    var qid = 'q' + (q + 1);
		    var id = qid + 'a' + (a + 1);
		    radio.setAttribute('name', qid);
		    radio.setAttribute('id', id);
		    radio.addEventListener('change', function() {
			var c = 0;
			var r = '';
			for (var i = 0; i < n; i++) {
			    r += '-';
			    for (var j = 0; j < 5; j++) {
				var l = 'q' + (i + 1) + 'a' + (j + 1);				
				if (document.getElementById(l).checked) {
				    c++;
				    r = r.slice(0, -1) + (j + 1);
				}
			    }
			}
			document.getElementById("resp").value = r;			
			document.getElementById("count").innerHTML = c;
			if (c == n) {
			    document.getElementById('button').disabled = false;
			} else {
			    document.getElementById('button').disabled = true;
			}
		    });
		    op[id] = radio;
		    option.appendChild(document.createTextNode(inciso[a]));
		    option.appendChild(radio);
		    option.appendChild(document.createTextNode(data.questions[q].options[a]));
		    section.appendChild(option)
		}
		document.getElementById('questions').appendChild(section);
		document.getElementById('questions').appendChild(document.createElement('hr'));
	    }
	    var end = document.createElement("div");
	    end.innerHTML = '<p align="center"><em>Fin del examen.</em></p>';
	    document.getElementById('questions').append(end)
	}
    };
    var filename = "https://elisa.dyndns-web.com/teaching/mat/discretas/data/exam/" + suffix + hash + '_' + kind + '.json' + "?time=" + nocache();
    xmlhttp.open("GET", filename, true);
    xmlhttp.send();
}

