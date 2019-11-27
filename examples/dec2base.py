from string import digits, ascii_lowercase # letras en el orden alfabetico

def digito(valor):
    if valor < 10:
        return str(valor)
    else: # letras a = 10, b = 11, c = 12, etc.
        return ascii_lowercase[valor - 10]

def convertir(decimal, base): # convertir un valor decimal a otra base
    potencia = 0
    while base**potencia <= decimal:
        potencia += 1
    digitos = ''
    pendiente = decimal
    while potencia > 0:
        potencia -= 1
        cuanto = base**potencia
        digitos += digito(pendiente // cuanto) # las veces que cabe indica el digito
        pendiente %= cuanto # lo que sobra se cubre con las potencias menores
    # verificamos que coincida con lo que dice la libreria estandar        
    assert decimal == int(digitos, base)
    return digitos

def residuos(decimal, base): # con el metodo de residuos repetidos que muchos prefieren
    digitos = ''
    pendiente = decimal
    while pendiente > 0:
        digitos += digito(pendiente % base)
        pendiente //= base
    digitos = digitos[::-1] # vienen al reves, hay que voltearlos (NO OLVIDEN ESTA PARTE)
    assert decimal == int(digitos, base) # comprobar que venga bien hecho
    return digitos
        
ejemplos = [(64, 2), (12345, 4), (123456, 7), (12345678, 12), (987654321, 20)]

for caso in ejemplos:
    (d, b) = caso
    print(caso, "->", convertir(d, b), '=', residuos(d, b))
