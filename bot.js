const Discord = require("discord.js");

const client = new Discord.Client();

const fs = require('fs');
let cards = undefined;
let max = undefined;
let sID = '458343272520351768';
let members = undefined;

'use strict';

const rolD = 'discretas';
const rolP = 'progra';
const rolA = 'adaptativos';
let servidor = undefined;
let rMD = undefined;


client.on("ready", () => {
    let data = fs.readFileSync('cards.json');
    cards = JSON.parse(data);
    max = cards.length;
    console.log(max + ' cards available');    
    servidor = client.guilds.cache.get(sID);
    rMD = servidor.roles.cache.find(r => r.name === rolD);
    rSA = servidor.roles.cache.find(r => r.name === rolA);
    rPE = servidor.roles.cache.find(r => r.name === rolP);
    console.log('Ready!');
});

const debugMode = true;

const data = {'boole': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/logica/arboles.html',
	      'video': 'https://www.youtube.com/playlist?list=PLSxaeMB7D949M8LiimQF_XQEGWptVJk5o',
	      'youtube': 'https://www.youtube.com/playlist?list=PLSxaeMB7D949M8LiimQF_XQEGWptVJk5o',
	      'twi': 'https://twitch.tv/satuelisa',
	      'stream': 'https://twitch.tv/satuelisa',
	      'canal': 'pregúntame por el canal de **!twitch** o de **!youtube**',
	      'git': 'https://github.com/satuelisa/DiscreteMath',
	      'clase': 'https://twitch.tv/satuelisa',
	      'curso': 'https://elisa.dyndns-web.com/teaching/mat/discretas/',
	      'agenda': 'https://elisa.dyndns-web.com/teaching/mat/discretas/',
	      'web': 'https://elisa.dyndns-web.com/teaching/',	      
	      'pagina': 'https://elisa.dyndns-web.com/teaching/',
	      'página': 'https://elisa.dyndns-web.com/teaching//',
	      'discretas': 'https://elisa.dyndns-web.com/teaching/mat/discretas/',
	      'progra': 'https://elisa.dyndns-web.com/teaching/prog/ansic/estructurada.html',
	      't1': 'https://youtu.be/N3f9Oingj8I',
	      't3': 'https://youtu.be/VzUhE8NVf_s', 
	      't4': 'https://youtu.be/Qvou3MXscl4',
	      't2p1': 'https://youtu.be/omzBbOf8U34',
	      't2p2': 'https://youtu.be/omzBbOf8U34',
	      't2p3': 'https://youtu.be/Hwlezy-BFfc',
	      't2p4': 'https://youtu.be/BgagDXHco5c',
	      't2p5': 'https://youtu.be/BgagDXHco5c', 
	      't5p1': 'https://youtu.be/n7OyiyWGi0M',
	      't5p2': 'https://youtu.be/n7OyiyWGi0M',
	      't5p3': 'https://youtu.be/lJ0OiPKdcXg',
	      't5p4': 'https://youtu.be/lJ0OiPKdcXg', 
	      't5p5': 'https://youtu.be/ZTehJDpaqdU',
	      'fact': 'Sé calcular el *factorial*; pídeme por ejemplo **!calc fact(5)** y te digo que vale 120.',
	      'conv': 'Sé convertir *enteros a decimal*; dame los dígitos y la base, tipo **!calc dec(a2f, 19)** para ver cuánto vale a29 de base 19 en base 10', 
	      'ayuda': 'Para registrar una ayuda, escribe **!mvp**, *menciona* el usuario (con \@) quien te ayudó y en qué cosa',
	      't2': 'La tarea 2 tiene videos por pregunta; pregúntame por t2p1, por ejemplo.',
	      't5': 'La tarea 5 tiene videos por pregunta; pregúntame por t5p1, por ejemplo.',
	      'medio curso': 'https://youtu.be/NWah4dKNL0M',
	      'mediocurso': 'https://youtu.be/NWah4dKNL0M',
	      'mc': 'https://youtu.be/NWah4dKNL0M',
	      'ordinario': 'El examen ordinario tiene videos por tema; pregúntame por og (grafos), oa (árboles binarios) o op (problemas)',
	      'mero bin': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/bases/binario.png',
	      'rbol bin': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/arboles/arboles.html',
	      'repo': 'https://github.com/satuelisa/DiscreteMath',
	      'binario': 'Conozco los conceptos de *número binario* y *árbol binario*. Pregúntame sobre esos.', 
	      'octal': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/bases/octal.png',
	      'decimal': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/bases/decimal.png',
	      'python': 'https://www.python.org/downloads/',
	      'online': 'https://repl.it/@enaard/Python-3',
	      'enlinea': 'https://repl.it/@enaard/Python-3',
	      'enlínea': 'https://repl.it/@enaard/Python-3',
	      'en línea': 'https://repl.it/@enaard/Python-3',
	      'en linea': 'https://repl.it/@enaard/Python-3',
	      'hexadecimal': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/bases/hexadecimal.png',
	      '&': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/logica/bitwise_and.png',
	      'and': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/logica/bitwise_and.png',
	      '|': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/logica/bitwise_or.png',
	      'or': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/logica/bitwise_or.png',
	      '^': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/logica/bitwise_xor.png',
	      'xor': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/logica/bitwise_xor.png',
	      'floyd': 'https://github.com/satuelisa/DiscreteMath/blob/master/homework/fw.py',
	      'fw': 'https://github.com/satuelisa/DiscreteMath/blob/master/homework/fw.py', 
	      'warshall': 'https://github.com/satuelisa/DiscreteMath/blob/master/homework/fw.py',
	      'logi': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/logica/arboles.html',
	      'log': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/funciones/log.png',
	      'exp': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/funciones/expo.png',
	      'raíz': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/funciones/raiz.png',
	      'raiz': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/funciones/raiz.png',	      
	      'gcd': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/funciones/gcd.png',
	      'fibo': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/fibo/fibo.gif',
	      'pal': 'https://github.com/satuelisa/DiscreteMath/blob/master/homework/palindrome.py',
	      'primo': 'https://github.com/satuelisa/DiscreteMath/blob/master/homework/prime.py',
	      'primera': 'https://elisa.dyndns-web.com/teaching/mat/discretas/guion/primera.html',
	      'regular': 'https://elisa.dyndns-web.com/teaching/mat/discretas/guion/regular.html',
	      'regreso': 'https://elisa.dyndns-web.com/teaching/mat/discretas/guion/regreso.html',
	      'ultima': 'https://elisa.dyndns-web.com/teaching/mat/discretas/guion/ultima.html',
	      'última': 'https://elisa.dyndns-web.com/teaching/mat/discretas/guion/ultima.html', 
	      'pascal': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/combinat/pascal.png',
	      'permut': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/combinat/permutaciones.png',
	      'coef': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/combinat/coef_binomial.png',
	      'potencia': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/combinat/conpot.png',
	      'subconjunto': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/combinat/subconjuntos.png',
	      'binaria': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/arreglos/bbinaria.gif',
	      'turing': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/logica/tm.gif',
	      'distancia de edición': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/algoritmos/editdist.gif',
	      'edici': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/algoritmos/editdist.gif',	      
	      'complejidad': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/complejidad/complex.png',
	      'algoritmos': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/complejidad/complex.png',
	      'problemas': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/complejidad/complex.png',
	      'asintótica': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/complejidad/asintotica.gif',
	      'asintotica': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/complejidad/asintotica.gif',
	      'compara': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/complejidad/comparasion.gif',
	      'altura': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/arboles/altmin.gif',
	      'densidad': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/densidad.gif',
	      'grado': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/grado.gif',
	      'camino': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/camino.gif',
	      'diametro': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/diametro.gif',
	      'diámetro': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/diametro.gif',
	      'distancia': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/distancia.png',
	      'subgrafo': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/subgrafo.gif',
	      'grafo': 'https://github.com/satuelisa/DiscreteMath/blob/master/homework/grafo.py', 
	      'inducido': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/subgrafo.gif',
	      'camarilla': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/clique.gif',
	      'clique': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/clique.gif',
	      'indepen': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/idset.gif',
	      'idset': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/idset.gif',
	      'complemento': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/compl.gif',
	      'dfs': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/dfs.gif',
	      'bfs': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/bfs.gif',
	      'cubierta por v': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/vertexcover.gif',
	      'cubierta por a': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/edgecover.gif',
	      'cubierta': 'Conozco cubiertas por vértices y cubiertas por aristas. Pregúntame sobre esos.',
	      'mst': 'Para árboles de expensión mínima, conozco los algoritmos de Prim y Kruskal. Pregúntame sobre esos.',
	      'prim': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/prim.gif',
	      'kruskal': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/kruskal.gif',
	      'salon': 'https://elisa.dyndns-web.com/teaching/mat/discretas/',
	      'ejemplo': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/',
	      'material': 'https://elisa.dyndns-web.com/teaching/mat/discretas/material.html',
	      'libro': 'https://books.google.com.mx/books?id=lHqqjoR0b1YC&printsec=frontcover&hl=es&redir_esc=y#v=onepage&q&f=false',
	      'movil': 'https://elisa.dyndns-web.com/teaching/mat/discretas/movil.html',
	      'tarea': 'https://elisa.dyndns-web.com/teaching/mat/discretas/md.html',
	      'puntos': 'https://elisa.dyndns-web.com/cgi-bin/res.py',
	      'resultado': 'https://elisa.dyndns-web.com/cgi-bin/res.py',
	      'registro': 'https://elisa.dyndns-web.com/cgi-bin/res.py',
	      'viejos': 'https://elisa.dyndns-web.com/teaching/mat/discretas/examenes/',
	      'tarjetas': 'https://tinycards.duolingo.com/users/satuelisa',
	      'tiny': 'https://tinycards.duolingo.com/users/satuelisa',
	      'cards': 'https://tinycards.duolingo.com/users/satuelisa',
	      'pia': 'Pregúntame sobre el proyecto, te puedo pasar la página con las instrucciones.',
	      'examen': 'https://elisa.dyndns-web.com/teaching/mat/discretas/guion/examen.html',
	      'temas': 'https://elisa.dyndns-web.com/teaching/mat/discretas/temario.html',
	      'calif': 'https://elisa.dyndns-web.com/teaching/mat/discretas/criterios.html',
	      'crit': 'https://elisa.dyndns-web.com/teaching/mat/discretas/criterios.html',
	      'proy': 'https://elisa.dyndns-web.com/teaching/mat/discretas/proyecto.html',
	      'og': 'https://youtu.be/txpkuyFZRN8',
	      'oa': 'https://youtu.be/WZPtmiUpLmg',
	      'op': 'https://youtu.be/BXMbnwa7a1c',
	      'encuesta': 'https://elisa.dyndns-web.com/cuestionario.html',
	      'cuestionario': 'https://elisa.dyndns-web.com/cuestionario.html'
	     };

const claves = Object.keys(data);

function sendCard(target, specs) {
    var fields;
    while (1) {
	fields = cards[Math.floor(Math.random() * Math.floor(max))];
	if (specs.length == 0 || specs.includes(fields['unit'])) {
	    break;
	}
    }
    let front = fields['front'];
    let back = fields['back'];
    if (front.includes('.jpg')) {
	target.send({
	    embed:  new Discord.MessageEmbed()
		.setTitle('¿Qué es eso?')
		.setColor(0x999999)
		.setDescription('Respuesta (dale click para revelar): || ' + back + '||'),
	    files: [{
		attachment: 'cards/' + front,
		name: 'cards/' + front
	    }]
	});;
    } else {
	target.send('¿Qué es ' + front + '?\nRespuesta (dale click para revelar): || ' + back + ' ||');
    }
}

function matricula(usuario) {
    //console.log('buscando', usuario);
    var actuales = fs.readFileSync('matr.dat').toString().trim().split('\n').filter(Boolean);
    for (var i = 0; i < actuales.length; i++) {
	var campos = actuales[i].split(' ');
	let k =  campos.length;
	let r = (campos.slice(0, k - 1)).join(' ');
	//console.log('comparando con', r);
	if (r == usuario) { // match
	    let m = campos[k - 1];
	    //console.log(r, 'encontrado como', m);	    
	    return m;
	}
    }
    return undefined;
}

function timestamp() {
    return '' + new Date();
}

async function asistencia(usuario, materia) {
    console.log(usuario);
    const matr = matricula(usuario);
    if (typeof matr === "undefined") {
	return;
    } else {
	fs.appendFileSync('asistencia.txt', matr + ' ' + materia + ' ' + timestamp() + '\n', (err) => {
	    if (err) throw err;
	});
    }
}

async function mvp(message, topic) {
    console.log('Buscando matricula para', message.author.tag);
    const recipiente = matricula(message.author.tag);
    if (typeof recipiente === "undefined") {
	message.channel.send('No me has dicho tu matrícula aún, ' +
			     message.author.tag +
			     '; mándame eso por DM para poder registrar ayudas.');
    	return;
    } else {
	const ayudante = message.mentions.users.first();
	const registro = matricula(ayudante.tag);
	if (typeof registro === "undefined") {
	    message.channel.send(ayudante.tag +
				 ' no me ha dicho su matrícula, no le puedo otorgar comisión.');
    	    return;
	} else {
	    if (registro == recipiente) {
		message.channel.send('La auto-ayuda no cuenta para comisiones.');
		return;
	    }
	    let output = registro + ' ' + recipiente + ' ' + topic + ' ' + timestamp() + ' ' + message.content.toLowerCase() + '\n';	    
	    fs.appendFileSync('ayudas_elisa.txt', output, (err) => {
		if (err) throw err;
	    });
	    message.channel.send('Gracias por contarme; he registrado la ayuda.');
	    return;
	}
    }
    message.channel.send('Dime por favor quién te ayudó y en qué cosa.');
    return;
}

function process(message) {
    var channel = message.channel;
    var text = message.content.toLowerCase();
    if (!channel.name.includes('discretas') && !channel.name.includes('progra')) { // ignore other channels
	return;
    }
    if (text.startsWith('!mvp')) {
	mvp(message, channel.name);
	return;
    } else if (text.startsWith('!reto')) {
	sendCard(channel, (text.substring(5)).trim());
	return;
    } else if (text.startsWith('!calc')) {
	if (text.includes("log")) {
	    var start = text.indexOf("(");
	    var end = text.indexOf(")");
	    var mid = text.indexOf(",");
	    var a = parseInt(text.substring(start + 1, mid));
	    var b = parseInt(text.substring(mid + 1, end));	    
	    var response = 'Logaritmo base ' + b + ' de ' + a + ' vale ';
	    channel.send(response + Math.log(a) / Math.log(b) + '.');

	} else if (text.includes("gcd")) {
	    var start = text.indexOf("(");
	    var end = text.indexOf(")");
	    var mid = text.indexOf(",");
	    var a = parseInt(text.substring(start + 1, mid));
	    var b = parseInt(text.substring(mid + 1, end));	    
	    var temp;
	    if (a < b) {
		temp = a;
		a = b;
		b = temp;
	    }
	    var response = 'El mayor divisor común entre ' + a + ' y ' + b + ' es ';
	    while (b > 0) {		
		temp = a % b;
		a = b;
		b = temp;
	    }
	    channel.send(response + a + '.');
	} else if (text.includes("fact")) {
	    var start = text.indexOf("(");
            var end = text.indexOf(")");
            var n = parseInt(text.substring(start + 1, end));
	    if (isNaN(n)) {
		channel.send('Se necesita un número entero.');
	    } else if (n < 0) {
		channel.send('Negativos no tienen factoriales.');
	    } else if (n < 2) {
		channel.send('Factorial de ' + n + ' vale uno.');
	    } else {
		var f = 1;
		for (var i = 2; i <= n; i++) {
		    if (f > Number.MAX_SAFE_INTEGER / i) {
			channel.send('Mejor usa Python. Yo con JavaScript no puedo con números tan grandes.');
			return;
		    }
		    f = f * i;
		}
		channel.send('Factorial de ' + n + ' vale ' + f + '.');
	    }
	} else if (text.includes("bino")) {	
	    var start = text.indexOf("(");
	    var end = text.indexOf(")");
	    var mid = text.indexOf(",");
	    var n = parseInt(text.substring(start + 1, mid));
	    var k = parseInt(text.substring(mid + 1, end));
	    if (isNaN(n) || isNaN(k)) {
		channel.send('Ocupas definir dos enteros positivos.');
		return;
	    }
	    var arriba = 1;
	    for (var f = Math.max(k, n - k) + 1; f <= n; f++) {
		arriba *= f;
	    }
	    var abajo = 1;
	    for (var f = 2; f <= Math.min(k, n - k); f++) {
		abajo *= f;
	    }
	    channel.send('El coeficiente binomial ' + n + ' sobre ' + k + ' vale ' +  arriba / abajo + '.');
	} else if (text.includes("dec")) {
            var start = text.indexOf("(");
            var end = text.indexOf(")");
            var mid = text.indexOf(",");
            var n = text.substring(start + 1, mid);
            var b = parseInt(text.substring(mid + 1, end));
	    for (var i = 0; i < n.length; i++) {
		let j = parseInt(n.charAt(i), b);
		if (isNaN(j) || j >= b) {
		    channel.send('La cadena ' + n + ' no es un número valido en base ' + b + '.');
		    return;
		}
	    }
	    var conv = parseInt(n, b);
	    if (!isNaN(conv)) {
		channel.send('El valor decimal de ' + n + ' en base ' + b + ' es ' + conv + '.');
	    } else {
		channel.send('La cadena ' + n + ' no es un número valido en base ' + b + '.');
	    }
	} else if (text.includes("fib")) {
	    var start = text.indexOf("(");
            var end = text.indexOf(")");
            var n = parseInt(text.substring(start + 1, end));
	    if (n < 0) {
		channel.send('La secuencia de Fibonacci inicia con índice cero.');
	    } else if (n < 2) {
		channel.send('F(' + n + ') = ' + n + '.');
	    } else {
		var ap = 0;
		var p = 1;
		var temp;
		for (var i = 2; i <= n; i++) {
		    temp = ap + p;
		    ap = p;
		    p = temp;
		    if (temp > Number.MAX_SAFE_INTEGER - temp) {
			channel.send('Mejor usa Python. Yo con JavaScript no puedo con números tan grandes.');
			return;
		    }
		}
		channel.send('F(' + n + ') = ' + p + '.');		
	    }
	} else if (text.includes("mod") || text.includes("mód") || text.includes('res')) {
	    var start = text.indexOf("(");
	    var end = text.indexOf(")");
	    var mid = text.indexOf(",");
	    var a = parseInt(text.substring(start + 1, mid));
	    var b = parseInt(text.substring(mid + 1, end));	    
	    channel.send('El residuo al dividir ' + a + ' entre ' + b + ' vale ' + a % b + '.');
	} else {
~	    channel.send('Lamentablemente no sé calcular eso, pero con Python deberías lograrlo.' +
			 ' Revisa los ejemplos en el material de estudio y pide ayuda a los demás si no te sale.');
	}
	return;
    }
    for (const clave of claves) {
	if (text.includes(clave)) {
	    var resp = data[clave];
	    if (resp.includes('.png') || resp.includes('.gif')) {
		const e = new Discord.MessageEmbed()
		      .setColor('#0099ff')
		      .setTitle('Te sugiero este ejemplo')
		      .setImage(resp);
		channel.send(e);
	    } else if (resp.includes('youtu')) {
		channel.send('Checa este video: ' + resp);		
	    } else if (resp.includes('http')) {
		channel.send('Checa esta página web: ' + resp);
	    } else {
		channel.send(resp);
	    }
	    return;
	}
    }
    channel.send('Lamentablemente no sé nada de eso :frowning2:');
    return;
}

async function chat(message) {
    var tag = message.author.tag;
    if (tag.includes('MathBot')) { // it me, Mario
	return;
    }
    var usuario =  tag.split('#')[0];
    message.author.send('¡Hola, ' + usuario + '!');
    var text = message.content.toLowerCase();
    if (text.includes("!reto")) {
	sendCard(message.author);
	return;
    }
    var digitos = /^\d+$/.test(text);
    if (digitos && text.length == 7) {
	let member = client.users.cache.find(user => user.username == usuario);
	console.log(member);
	var actuales = fs.readFileSync('matr.dat').toString().trim().split('\n').filter(Boolean);
	for (var i = 0; i < actuales.length; i++) {
	    var campos = actuales[i].split(' ');
	    if (campos[0] == tag) { // ya hay
		if (text == campos[1]) { // es lo mismo de antes
		    message.author.send('Ya me la habías dicho antes, ' +
					'pero gracias nuevamente.\n').catch(error => { console.log(tag + ' no me escucha') });
		    return;
		} else { // es diferente
		    actuales[i] = tag + ' ' + text;
		    message.author.send('Me habías dicho que tu matrícula era ' + campos[1] +
					'. La sustituyo con ' + text + '.\n').catch(error => { console.log(tag + ' no me escucha') });
		    fs.writeFileSync('matr.dat', actuales.join('\n')  + '\n', (err) => { 
			if (err) throw err;
		    });		
		    return;
		}
	    }
	} // no estaba incluida
	fs.appendFileSync('matr.dat', tag + ' ' + text + '\n', (err) => {
	    if (err) throw err;
	});
	message.author.send('Gracias, ' + usuario +
			    ", por decirme que tu matrícula es " + text +
			    ". Ahora te puedo tomar asistencia cuando hables en el canal de las unidades en el servidor Science.").catch(error => { console.log(error) });
    } else {
	message.author.send('Hola, ' + usuario + '. Esperaba que me dijeras tu matrícula completa.' +
			    ' Eso y **!reto** son todo lo que hago por mensaje privado por el momento.').catch(error => { console.log(tag + ' no me escucha')});
    }
    return;
}

async function poll(channel, title) {
    channel.send('*Encuesta instantánea*' + title + '\n\nOcupo saber __qué tan bien entiendes__ de qué estamos hablando en el stream de la clase en este momento.\n\nPor favor **reacciona** a este mensaje\ncon :white_check_mark: si vas bien\ncon :question: si tienes dudas (y luego escribe tu pregunta)\ncon :confused: si necesitas un poco de tiempo para procesar esto\ncon :sleeping: si no estabas en realidad prestando atención\n...');
}


client.on("message", (message) => {
    if (message.channel instanceof Discord.DMChannel) {
	chat(message);
    } else {
	var channel = message.channel;
	var text = message.content;
	var user = message.author;
	if (!channel.name.includes('discretas') &&
	    !channel.name.includes('adaptativos') &&
	    !channel.name.includes('progra') &&
	    !channel.name.includes('proba') &&
	    !channel.name.includes('tesis') &&
	    !channel.name.includes('simula')) { // ignore other channels
	    return;
	}
	if (channel.name.includes('discretas')) {	
            asistencia(message.author.tag, channel.name);
	}
	if (text.startsWith('!rol')) {
	    let newRole = undefined;
	    if (channel.name.includes('discretas')) {
		newRole = rMD;
	    } else if (channel.name.includes('adaptativos')) {
		newRole = rSA;
	    } else if (channel.name.includes('progra')) {
		newRole = rPE;
	    }
	    console.log(newRole);
	    if (newRole.id) {
		message.guild.member(user).roles.add(newRole);
		message.channel.send('Has sido asignado el rol **' + newRole.name + '**, ' + message.author.toString() + '.');
	    } else {
		message.channel.send('La asignación de roles solamente funciona en los canales de las UA de licenciatura');
	    }
	} else if (text.startsWith('!')) {
	    if (text.startsWith('!poll')) {
		let title = "";
		if (text.length > 5) {
		    title = ': **' + text.substring(5) + '**';
		}
		poll(message.channel, title);
	    } else if (channel.name.includes('discretas')) {
		process(message);
	    }
	} else {
	    if (text.includes('Encuesta instantánea')) {
		message.react('✅');
		message.react('❓');		
		message.react('😕');
		message.react('😴');
	    }
	}
    }
});

var ID = fs.readFileSync('token.txt').toString().trim();
client.login(ID);
