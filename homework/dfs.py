def dfs_i(actual, adj):
    cola = [actual]
    visitados = set()
    while len(cola) > 0: # iterativo                                                                                      
	actual = cola.pop(0)
	visitados.add(actual)
	for vecino in adj[actual]:
            if vecino not in visitados:
		cola.append(vecino)
    return visitados

def dfs_r(actual, adj, visitados): # recursivo                                                                            
    if actual in visitados:
	return
    visitados.add(actual)
    for vecino in adj[actual]:
	dfs_r(vecino, adj, visitados)

E = {('a', 'b'), ('a', 'c'), ('b', 'd'), ('c', 'e'), ('d', 'f'), ('e', 'f')}
adj = dict() # un mapeo de conjuntos de adyacencia                                                                        
for arista in E:
    for vertice in arista:
	if vertice not in adj:
            adj[vertice] = set()
    (u, v) = arista
    adj[v].add(u)
    adj[u].add(v) # no dirigido; vale en ambos sentidos                                                                   

ci = dfs_i('a', adj) # iterativo                                                                                          
cr = set()
dfs_r('a', adj, cr)
assert ci == cr
print(cr)
