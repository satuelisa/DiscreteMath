def permutaciones(pendiente, fijo = []):
    n = len(pendiente)
    if n > 0: # aun faltan elementos por acomodar
        for pos in range(n): # cada elemento toma turnos siendo el primero
            permutaciones(pendiente[0:pos] + pendiente[(pos + 1):n], fijo + [pendiente[pos]])
    else: # si ya no faltan elementos por acomodar
        print(" ".join([str(elemento) for elemento in fijo])) # imprimir la permutacion

conjuntos = [{1, 2, 3}, {'a', 'b', 'c', 'd'}]

for A in conjuntos:
    permutaciones(sorted(list(A)))
    print('*******')
    
        
