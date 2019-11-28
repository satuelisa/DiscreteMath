def bfs(inicio, adj):
    visitados = []
    cola = [inicio]
    while len(cola) > 0:
        actual = cola.pop(0) # primero
        if actual in visitados:
            continue
        else:
            visitados.append(actual)
            for vecino in adj[actual]:
                cola.append(vecino)
    return visitados
 
E = {('a', 'b'), ('a', 'c'), ('b', 'd'), ('c', 'e'), ('d', 'f')}
adj = dict() # adj es un mapeo de conjuntos de adyacencia
for arista in E:
    for vertice in arista:
        if vertice not in adj:
            adj[vertice] = set()
    (u, v) = arista
    adj[v].add(u)
    adj[u].add(v) # no dirigido; vale en ambos sentidos
 
print(bfs('b', adj))
