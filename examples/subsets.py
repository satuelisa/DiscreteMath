# funciona con hasta 32 elementos 

def cuales(ordenado, entero):
    seleccion = []
    while entero > 0:
        if entero & 1: # se incluye
            seleccion.append(ordenado.pop())
        else:
            ordenado.pop() # no se incluye
        entero >>= 1
    return sorted(seleccion)

def bits(entero, largo):
    s = bin(entero)[2:]
    return '0' * (largo - len(s)) + s

conjuntos = [{"a", "b", "c", "d"}, {1, 2, 3}]

for conjunto in conjuntos:
    largo = len(conjunto)
    limite = 2**largo
    for i in range(limite):
        print(bits(i, largo), '->', " ".join([str(e) for e in cuales(sorted(list(conjunto)), i)]))
