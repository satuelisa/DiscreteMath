const Discord = require("discord.js");
const fs = require('fs');
const latex = require('node-latex');
const pp = require('pdf2pic');
const gm = require('gm');

'use strict';

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
client.on("ready", () => {
    console.log('Ready!');
});

const options = {
    density: 300,
    saveFilename: "latex",
    savePath: ".",
    format: "png",
    width: 3840,
    height: 2160
};

function stamp() {
    const date = new Date();
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day =`${date.getDate()}`.padStart(2, '0');
    const hour =`${date.getHours()}`.padStart(2, '0');
    const minute =`${date.getMinutes()}`.padStart(2, '0');
    const second =`${date.getSeconds()}`.padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}${second}`
}

async function publish(target, filename) {
    console.log('PNG up to date at', filename);    
    target.send({
	embed: new Discord.MessageEmbed()
	    .setTitle('LaTeX')
	    .setColor(0x999999)
	    .setDescription('Esta es tu renderización.'),
	files: [{
	    attachment: filename,
	    name: filename
	}]
    });
    setTimeout(function () {
	console.log('Erasing', filename);
	try {
	    fs.unlinkSync(filename);
	} catch (err) {
	    console.log(filename, 'did not exist anymore');		    
	    return;
	}
	console.log(filename, 'erased');	
    }, 3000);
}

async function crop(target) {
    console.log('Cropping');
    let t = stamp();
    const filename = 'latex' + t + '.png';
    console.log('Using timestamp', t, 'to crop')
    gm('latex.1.png')
	.quality(300) // .transparent('white')
	.trim()
    	.borderColor('white')
    	.border(5, 5)
	.write(filename,
	       (err) => {
		   if (err) {
		       console.log(err);
		       return;
		   } else {
		       publish(target, filename);
		   }
	       });
}

async function png(target) {
    console.log('PDF created');
    const storeAsImage = pp.fromPath('latex.pdf', options);
    const ok = await storeAsImage(1);
    console.log('PNG created from PDF')
    crop(target);
}

const header = `\\documentclass[12pt]{article}
\\usepackage[landscape,top=5mm,bottom=5mm,left=5mm,right=5mm]{geometry}
\\pagestyle{empty}
\\begin{document}`; 

const footer = '\\end{document}';

async function render(target, tex) {
    const source = header + tex + footer;
    fs.writeFile('latex.tex', source, function (err) {
	if (err) return console.log(err);
    });    
    const input = fs.createReadStream('latex.tex');
    const output = fs.createWriteStream('latex.pdf');
    const pdf = latex(input);
    const done = await pdf.pipe(output);
    pdf.on('error', (err) => {
	if (err) {
	    target.send('Eso no pinta ser LaTeX adecuado.')	    
	    return;
	}
    });
    pdf.on('finish', () => png(target));
}		

function process(message) {
    var channel = message.channel;
    var text = message.content.toLowerCase();
    if (text.startsWith('!latex')) {
	let start = text.indexOf("`");
	let end = text.lastIndexOf("`");
	if (start == -1 || start == end) {
	    channel.send('Hay que ponerlo entre comillas de código.')
	    return;
	}
	const tex = text.substring(start + 1, end); 
	console.log('Rendering <', tex, '>');
	render(channel, tex);
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
	    channel.send('Lamentablemente no sé calcular eso.');
	}
    }
    return;
}

async function poll(channel, title) {
    channel.send('*Encuesta instantánea*' + title + '\n\nOcupo saber __qué tan bien entiendes__ de qué estamos hablando en el stream de la clase en este momento.\n\nPor favor **reacciona** a este mensaje\ncon :white_check_mark: si vas bien\ncon :question: si tienes dudas (y luego escribe tu pregunta)\ncon :confused: si necesitas un poco de tiempo para procesar esto\ncon :sleeping: si no estabas en realidad prestando atención\n...');
}

client.on("messageCreate", (message) => {
    if (message.channel instanceof Discord.DMChannel) {
	return
    } else {
	var channel = message.channel;
	var text = message.content;
	var user = message.author;
	if (text.startsWith('!poll')) {
	    let title = "";
	    if (text.length > 5) {
		title = ': **' + text.substring(5) + '**';
	    }
	    poll(message.channel, title);
	} else {
	    if (text.includes('Encuesta instantánea')) {
		message.react('✅');
		message.react('❓');		
		message.react('😕');
		message.react('😴');
	    } else {
		process(message);
	    }
	}
    }
});

var ID = fs.readFileSync('token.txt').toString().trim();
client.login(ID);
