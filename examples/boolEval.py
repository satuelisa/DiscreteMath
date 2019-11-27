from sys import argv
from random import choice

precedencia = "EIXOA" # ordenamiento a los que no son estandarizados de menos importante a mas importante
significado = {"N": "not", "A": "and", "X": "xor", "O": "or", "I": "impl", "E": "equi"}
reemplazos = dict([[simbolo, cadena] for cadena, simbolo in significado.items()])
reemplazos["("] = " ( "
reemplazos[")"] = " ) "
ejemplos = ["(0 and not 1) or not (1 equi 0 impl 0) xor 1"]

expresion = None
if len(argv) < 2:
    expresion = choice(ejemplos)
else:
    expresion = argv[1] # algo como ((0 and 1) xor 0) viene escrito en la linea de instrucciones como parametro
    if len(argv) > 2:
        reemplazo = argv[2]
        if not all([operador in reemplazo for operador in precedencia]):
            print("Precedencia sugerida incompleta, no es posible proceder.")
            quit()
        else:
            precedencia = reemplazo
precedencia = "()" + precedencia + "N" # not es siempre el menos importante
    

# basado en                                 https://www.tutorialspoint.com/data_structures_algorithms/expression_parsing_using_statck.htm
def postfix(expr):
    resultado = []
    pila = []
    for pedazo in expr:
        if pedazo not in precedencia: # no es operador
            resultado.append(pedazo)
        else:
            if pedazo == "(": # abre subexpresion
                pila.append(pedazo)
            else:
                if pedazo == ")": # cierra subexpresion
                    while True:
                        siguiente = pila.pop(-1)
                        if siguiente == "(":
                            break
                        else:
                            resultado.append(siguiente)
                        if len(pila) == 0:
                            print("Hay una parentesis que no se cierra, no es posible evaluar.")
                            return None
                else:
                    if len(pila) == 0 or precedencia.index(pedazo) > precedencia.index(pila[-1]):
                        pila.append(pedazo)
                    else:
                        while len(pila) > 0 and precedencia.index(pedazo) <= precedencia.index(pila[-1]): 
                            resultado.append(pila.pop(-1))
                        pila.append(pedazo)
    return resultado + pila[::-1]

def valor(a, b, op):
    if op in "AOXIE": # operador booleano binario
        assert(a in "01" and b in "01") # acepta solamente bits
        if op == "A": # and
            if a == "1" and b == "1": # ambos unos para que sea verdadero
                return "1"
            else:
                return "0"
        elif op == "X": # xor
            if a != b: # con que sean diferentes
                return "1"
            else:
                return "0"
        elif op == "E": # equivalencia
            if a == b: # con que sean iguales
                return "1"
            else:
                return "0"
        elif op == "O": # or
            if a == "1" or b == "1": # con que hay por lo menos un uno
                return "1"
            else:
                return "0"
        else: # nada mas queda la implicacion como opcion
            assert op == "I"
            if a == "0" or b == "1": # o no a o b
                return "1"
            else:
                return "0"
    elif op in "+-*/%": # aritmetica regular (de enteros en este caso)
        va = None
        vb = None
        try:
            va = int(a)
            vb = int(b)
        except:
            print("Se permite solamente enteros; no se puede evaluar de otra forma.")
            quit()
        if op == "+":
            return str(va + vb)
        elif op == "-":
            return str(va - vb)
        elif op == "*":
            return str(va * vb)
        if op in "/%":
            if vb == 0:
                print("No se puede realizar divisiones entre cero.")
                quit()
        if op == "/":
            return str(va // vb)
        if op == "%":
            return str(va % vb)

def evaluar(expr): # toma como entrada la expresion en forma postfix
    pfe = postfix(expr)
    pila = []
    while len(pfe) > 0:
        if pfe[0] not in precedencia: # no es un operador
            pila.append(pfe.pop(0))
        else: # es un operador
            operador = pfe.pop(0)
            if operador == "N": # unario
                v = pila.pop(-1)
                assert v in "01" # solamente para bits
                if v == "1": # voltear el valor
                    print("not 1 = 0")
                    pila.append("0")
                else:
                    print("not 0 = 1")
                    pila.append("1")                
            else: # los demas son binarios
                ladoDer = pila.pop(-1)
                ladoIzq = pila.pop(-1)
                pila.append(valor(ladoIzq, ladoDer, operador))
                print(ladoIzq, significado.get(operador, operador), ladoDer, "=", pila[-1])
    return pila[0]

if 'debug' in argv: # la misma idea tambien funciona con aritmetica
    precedencia = "()+-*/"
    expresion = "10 - 4 * ( 21 + 38 / 7 )"
    print(expresion, "=", evaluar(expresion.split()))
else: # operacion normal booleana
    expr = expresion
    for cambio in reemplazos:
        expr = expr.replace(cambio, reemplazos[cambio])
    print(expresion, "=", evaluar(expr.split()))
