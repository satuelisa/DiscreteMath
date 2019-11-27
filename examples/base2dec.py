from string import digits, ascii_lowercase 

def valor(digito):
    if digito in digits: # de cero a nueve
        return int(digito) # regresamos el valor numerico
    else: # letras a = 10, b = 11, c = 12, etc.
        return 10 + ascii_lowercase.index(digito.lower())

def decimal(digitos, base): # convertir a decimal
    suma = 0 # se va a acumular la suma que es el valor en base diez
    p = len(digitos) # segun cuantos digitos tiene
    while p > 0:
        v = valor(digitos[-p]) # comenzando con la potencia mayor
        p -= 1 # avanzando hacia la potencia menor
        suma += v * base**p # sumar los multiples de las potencias
    # verificamos que coincida con lo que dice la libreria estandar        
    assert suma == int(digitos, base)
    return suma

ejemplos = [("1011", 2), ("2012", 3), ("4321", 5), ("6403", 8), \
            ("4632", 10), ("1b70", 12), ("a32c", 16)]

for caso in ejemplos:
    (d, b) = caso
    print(caso, "->", decimal(d, b))
