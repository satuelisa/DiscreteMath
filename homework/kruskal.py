grafo = {(1, 3): 4, (2, 3): 2, (2, 4): 1, (3, 4): 2, (4, 6): 1, (5, 6): 2}
 
from copy import deepcopy
cand = deepcopy(grafo)
arbol = set()
peso = 0
comp = dict()
 
while len(cand) > 0:
    arista = min(cand.keys(), key = (lambda k: cand[k]))
    del cand[arista] # se consideran una sola vez
    (u, v) = arista
    c = comp.get(v, {v})
    if u not in c:
        arbol.add(arista)
        peso += grafo[arista]
        nuevo = c.union(comp.get(u, {u}))
        for w in nuevo:
            comp[w] = nuevo    
 
print('MST con peso', peso, ':', arbol)
