const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
    console.log('Math time');
});

'use strict';

const debugMode = true;

const data = {'boole': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/logica/arboles.html',
              'ero binario': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/bases/binario.png',
              'octal': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/bases/octal.png',
              'decimal': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/bases/decimal.png',
              'hexadecimal': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/bases/hexadecimal.png',
              '&': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/logica/bitwise_and.png',
              '|': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/logica/bitwise_or.png',
              '^': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/logica/bitwise_xor.png',
              'logaritmo': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/funciones/log.png',
              'gcd': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/funciones/gcd.png',
              'fibo': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/fibo/fibo.gif',
              'pascal': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/combinat/pascal.png',
              'permut': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/combinat/permutaciones.png',
              'coef': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/combinat/coef_binomial.png',
              'potencia': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/combinat/conpot.png',
              'subconjunto': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/combinat/subconjuntos.png',
              'binaria': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/arreglos/bbinaria.gif',
              'turing': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/logica/tm.gif',
              'distancia': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/algoritmos/editdist.gif',
              'complejidad': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/algoritmos/complex.png',
              'bol binario': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/arboles/arboles.html',
              'altura': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/arboles/altmin.gif',
              'camarilla': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/clique.gif',
              'indepen': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/idset.gif',
              'complemento': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/compl.gif',
              'dfs': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/dfs.gif',
              'bfs': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/bfs.gif',
              'cubierta por v': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/vertexcover.gif',
              'cubierta por a': 'https://elisa.dyndns-web.com/teaching/mat/discretas/ejemplos/grafos/edgecover.gif',
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
              'viejos': 'https://elisa.dyndns-web.com/teaching/mat/discretas/examenes/',
              'tarjetas': 'https://tinycards.duolingo.com/users/satuelisa',
              'examen': 'https://elisa.dyndns-web.com/teaching/mat/discretas/guion/examen.html',
              'temas': 'https://elisa.dyndns-web.com/teaching/mat/discretas/temario.html',
              'calif': 'https://elisa.dyndns-web.com/teaching/mat/discretas/criterios.html'
             };

const claves = Object.keys(data);

function process(message) {
    var text = message.content.toLowerCase();
    var channel = message.channel;
    if (!channel.name.includes('discretas')) { // ignore other channels
        return;
    }
    for (const clave of claves) {
        if (text.includes(clave)) {
            var url = data[clave];
            if (url.includes('.png') || url.includes('.gif')) {
                const e = new Discord.RichEmbed()
                      .setColor('#0099ff')
                      .setTitle('Te sugiero este ejemplo')
                      .setImage(url);
                channel.send(e);
            } else {
                channel.send('Checa esta p<C3><A1>gina web: ' + url);
            }
            return;
        }
    }
    channel.send('Lamentablemente no s<C3><A9> nada de eso :frowning2:');
    return;
}
client.on("message", (message) => {
    if (message.content.startsWith('!')) {
        process(message);
    } 
});

const fs = require('fs');
var ID = fs.readFileSync('token.txt').toString().trim();
client.login(ID);
