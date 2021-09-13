import json

def place(content):
    if 'jpg' not in content:
        print('{\\Huge ' + content.replace('*', '$') + '}')
    else:
        print(f'\\includegraphics[width=70mm]{{cards/{content}}}')

def first(content):
    print('\\begin{tabular}{cc}')    
    place(content)
    print('&')

def second(content):
    place(content)
    print('\\end{tabular}')    

print('''\\documentclass[landscape]{article}
\\usepackage{graphicx}
\\usepackage[spanish]{babel}   
\\usepackage[utf8]{inputenc}
\\title{Conceptos de Matemáticas Discretas}
\\author{Elisa Schaeffer}
\\institute {FIME UANL}
\\email{elisa.schaeffer@uanl.edu.mx}
\\begin{document}
\\maketitle
\\begin{center}''')
    
with open('cards.json') as source:
     data = json.load(source)
     for card in data:
         first(card['front'])
         second(card['back'])
         
print('''\\end{center}
\end{document}''')
