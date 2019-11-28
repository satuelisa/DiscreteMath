E = {('a', 'b'), ('a', 'c'), ('b', 'd'), ('c', 'a'), ('d', 'e'), ('e', 'b')}
acc = dict() # adj es un mapeo de conjuntos de adyacencia
for (u, v) in E:
    if u not in acc:
        acc[u] = set()
    acc[u].add(v) # dirigido; vale en un sólo sentido
 
i = 0
I = dict()
A = dict()
 
def fuerteconexo(v, comp, P, acc): # algoritmo de Tarjan
    global i, I, A
    A[v] = i
    I[v] = i
    i += 1
    if v not in comp:
        comp[v] = set()
    if v not in acc: # no salen aristas
        return # no hay nada en el componente
    P.insert(0, v) # al inicio de la pila
    for u in acc[v]:
        if not u in comp:
            fuerteconexo(u, comp, P, acc)
            A[v] = min(A[v], A[u])
        elif u in P:
            A[v] = min(A[v], I[u])
    if A[v] == I[v]:
        while True:
            u = P.pop(0) # quitar el primero
            comp[v].add(u)
            if u == v:
                break
 
def componentes(acc):
    comp = dict() # componentes
    for v in acc: # para cada origen
        if v not in comp: # si no tiene componente aún
            fuerteconexo(v, comp, list(), acc) # calcularlo
            print(comp[v]) # imprimirlo
 
print(componentes(acc))
