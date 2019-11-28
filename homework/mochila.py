peso_permitido = 25
objetos = ((5, 10), (8, 12), (4, 24), (12, 30), (5, 7), (2, 8), (1, 3))
peso_total = sum([objeto[0] for objeto in objetos])
valor_total = sum([objeto[1] for objeto in objetos])
if peso_total < peso_permitido: # cabe todo
    print('óptimo:', valor_total, 'con peso total de', peso_total)
else:
    cantidad = len(objetos)
    V = dict()
    for w in range(peso_permitido + 1):
        V[(w, 0)] = 0
    for i in range(cantidad):
        (peso, valor) = objetos[i]
        for w in range(peso_permitido + 1):
            cand = V.get((w - peso, i), -float('inf')) + valor
            V[(w, i + 1)] = max(V[(w, i)], cand)
    mejor_valor = max(V.values())
    peso_de_mejor = max(V.keys(), key = (lambda k: V[k]))[0]
    print('óptimo:', mejor_valor, 'con peso total de', peso_de_mejor)
