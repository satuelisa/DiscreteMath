import json

def place(content):
    if 'jpg' not in content:
        content = content.replace('#', '\\#')
        content = content.replace('&', '\\&')
        print('{\\Huge ' + content.replace('*', '$') + '}')
    else:
        print(f'\\includegraphics[width=110mm]{{cards/{content}}}')

def first(content):
    print('\\begin{tabular}{|m{120mm}|m{120mm}|}')    
    print('\\hline')
    place(content)
    print('&')

def second(content):
    place(content)
    print('''\\\\   
\\hline    
\\end{tabular}''')    

print('''\\documentclass[landscape]{article}
\\usepackage{graphicx}
\\usepackage{array}
\\usepackage[spanish]{babel}   
\\usepackage[top=10mm,bottom=10mm,left=10mm,right=10mm]{geometry}   
\\usepackage[utf8]{inputenc}
\\pagestyle{empty}
\\renewcommand{\\arraystretch}{24}
\\begin{document}''')
    
with open('cards.json') as source:
     data = json.load(source)
     for card in data:
         first(card['front'])
         second(card['back'])
         print('\\newpage')
         
print('\end{document}')

# MUST USE xelatex because there are unicode characters
