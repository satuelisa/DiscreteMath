const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require('fs');

client.on("ready", () => {
    console.log('Math time');
});

'use strict';

const debugMode = true;

const data = {'boole': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/logica/arboles.html',
	      'video': 'https://www.youtube.com/playlist?list=PLSxaeMB7D949M8LiimQF_XQEGWptVJk5o',
	      'youtube': 'https://www.youtube.com/playlist?list=PLSxaeMB7D949M8LiimQF_XQEGWptVJk5o',
	      't1': 'https://youtu.be/364guooLVX0',
	      't3': 'https://youtu.be/VzUhE8NVf_s', 
	      't4': 'https://youtu.be/Qvou3MXscl4',
	      't2p1': 'https://youtu.be/Wsp_N6U8Ds8',
	      't2p2': 'https://youtu.be/Wsp_N6U8Ds8',
	      't2p3': 'https://youtu.be/LSTc4I5BgJY',
	      't2p4': 'https://youtu.be/BgagDXHco5c',
	      't2p5': 'https://youtu.be/BgagDXHco5c', 
	      't5p1': 'https://youtu.be/Dh7YI4u_1AU',
	      't5p2': 'https://youtu.be/Dh7YI4u_1AU',
	      't5p3': 'https://youtu.be/lJ0OiPKdcXg',
	      't5p4': 'https://youtu.be/lJ0OiPKdcXg', 
	      't5p5': 'https://youtu.be/ZTehJDpaqdU',
	      't2': 'La tarea 2 tiene videos por pregunta; pregúntame por t2p1, por ejemplo.',
	      't5': 'La tarea 5 tiene videos por pregunta; pregúntame por t5p1, por ejemplo.',
	      'medio curso': 'https://youtu.be/l9ta-9uycT0',
	      'mc': 'https://youtu.be/l9ta-9uycT0',
	      'ordinario': 'El examen ordinario tiene videos por tema; pregúntame por og (grafos), oa (árboles binarios) o op (problemas)',
	      'mero bin': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/bases/binario.png',
	      'rbol bin': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/arboles/arboles.html',
	      'repo': 'https://github.com/satuelisa/DiscreteMath',
	      'binario': 'Conozco los conceptos de *número binario* y *arbol binario*. Pregúntame sobre esos.', 
	      'octal': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/bases/octal.png',
	      'decimal': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/bases/decimal.png',
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
	      'pascal': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/combinat/pascal.png',
	      'permut': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/combinat/permutaciones.png',
	      'coef': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/combinat/coef_binomial.png',
	      'potencia': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/combinat/conpot.png',
	      'subconjunto': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/combinat/subconjuntos.png',
	      'binaria': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/arreglos/bbinaria.gif',
	      'turing': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/logica/tm.gif',
	      'distancia': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/algoritmos/editdist.gif',
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
	      'ayuda': 'https://elisa.dyndns-web.com/teaching/ayudas_elisa.html',
	      'movil': 'https://elisa.dyndns-web.com/teaching/mat/discretas/movil.html',
	      'tarea': 'https://elisa.dyndns-web.com/teaching/mat/discretas/md.html',
	      'puntos': 'https://elisa.dyndns-web.com/cgi-bin/res.py',
	      'resultado': 'https://elisa.dyndns-web.com/cgi-bin/res.py',
	      'viejos': 'https://elisa.dyndns-web.com/teaching/mat/discretas/examenes/',
	      'tarjetas': 'https://tinycards.duolingo.com/users/satuelisa',
	      'tiny': 'https://tinycards.duolingo.com/users/satuelisa',
	      'cards': 'https://tinycards.duolingo.com/users/satuelisa',
	      'pia': 'Pregúntame sobre el proyecto, te puedo pasar la página con las instrucciones.',
	      'examen': 'https://elisa.dyndns-web.com/teaching/mat/discretas/guion/examen.html',
	      'temas': 'https://elisa.dyndns-web.com/teaching/mat/discretas/temario.html',
	      'calif': 'https://elisa.dyndns-web.com/teaching/mat/discretas/criterios.html',
	      'proy': 'https://elisa.dyndns-web.com/teaching/mat/discretas/proyecto.html',
	      'og': 'https://youtu.be/txpkuyFZRN8',
	      'oa': 'https://youtu.be/WZPtmiUpLmg',
	      'op': 'https://youtu.be/BXMbnwa7a1c'
	     };

const claves = Object.keys(data);

async function asistencia(usuario) {
    console.log(usuario);
    var actuales = fs.readFileSync('matr.dat').toString().trim().split('\n').filter(Boolean);
    for (var i = 0; i < actuales.length; i++) {
	var campos = actuales[i].split(' ');
	if (campos[0] == usuario) { // match
	    var matr = campos[1];
	    fs.appendFileSync('asistencia.txt', matr + ' ' + new Date() + '\n', (err) => {
		if (err) throw err;
	    });
	    return;
	}
    }
}

function process(message) {
    var channel = message.channel;
    var text = message.content.toLowerCase();
    if (!channel.name.includes('discretas')) { // ignore other channels
	return;
    }
    if (text.startsWith('!calc')) {
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
	    if (n < 0) {
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
	    channel.send('Lamentablemente no sé calcular eso, pero con Python deberías lograrlo.\nRevisa los ejemplos en el material de estudio y pide ayuda a los demás si no te sale.');
	}
	return;
    }
    for (const clave of claves) {
	if (text.includes(clave)) {
	    var resp = data[clave];
	    if (resp.includes('.png') || resp.includes('.gif')) {
		const e = new Discord.RichEmbed()
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
    var text = message.content.toLowerCase();
    var digitos = /^\d+$/.test(text);
    var tag = message.author.tag;
    var usuario =  tag.split('#')[0];
    if (digitos && text.length == 7) {
	var actuales = fs.readFileSync('matr.dat').toString().trim().split('\n').filter(Boolean);
	for (var i = 0; i < actuales.length; i++) {
	    var campos = actuales[i].split(' ');
	    if (campos[0] == tag) { // ya hay
		if (text == campos[1]) { // es lo mismo de antes
		    try {
			await message.author.send('Ya me la habías dicho antes, pero gracias nuevamente.\n');
		    } catch(e) {
			console.log(e);
		    };
		    return;
		} else { // es diferente
		    actuales[i] = tag + ' ' + text;
		    try {
			await message.author.send('Me habías dicho antes que tu matrícula era ' + campos[1] + '. Voy a sustituirla con ' + text + '.\n');
		    } catch(e) {
			console.log(e);
		    };
		    fs.writeFileSync('matr.dat', actuales.join('\n')  + '\n', (err) => { 
			if (err) throw err;
		    });		
		    return;
		}
	    }
	} // no estaba incluida
	fs.appendFileSync(filename(day), tag + ' ' + text + '\n', (err) => {
	    if (err) throw err;
	});
	try {
	    await message.author.send('Gracias, ' + usuario + ", por decirme que tu matrícula es " + text + ". Ahora te puedo tomar asistencia.");
	} catch(e) {
	    console.log(e);
	};
    } else {
	try {
	    await message.author.send('Hola, ' + usuario + '. Esperaba que me dijeras tu matrícula completa. Es lo único que hago por mensaje privado por el momento.');
	} catch(e) {
	    console.log(e);
	};
	
    }
    return;
}

client.on("message", (message) => {
    if (message.channel instanceof Discord.DMChannel) {
	chat(message);
    } else {
	var channel = message.channel;
	var text = message.content;
	if (!channel.name.includes('discretas')) { // ignore other channels
	    return;
	}
	if (text.startsWith('!')) {
	    process(message);
	}
        asistencia(message.author.tag);
    }
});

var ID = fs.readFileSync('token.txt').toString().trim();
client.login(ID);
