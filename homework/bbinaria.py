def bbinaria(ordenados, buscado):
    n = len(ordenados)
    if n == 0: # no hay nada
        return False
    pos = n // 2 # div. entera
    pivote = ordenados[pos]
    if pivote == buscado:
        return True # encontrado
    elif buscado < pivote: # viene antes del pivote
        return bbinaria(ordenados[: pos], buscado)
    else: # pivote < buscado # viene desp. del pivote
        return bbinaria(ordenados[pos + 1 :], buscado)

print(bbinaria([x for x in range(4, 30, 5)], 15))
