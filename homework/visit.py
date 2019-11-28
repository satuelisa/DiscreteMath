def dfs_imprime(actual, adj, visitados, orden=None):
    if actual in visitados:
        return
    visitados.add(actual)
    if orden == "pre":
        print(actual)
    for vecino in adj[actual]:
        dfs_imprime(vecino, adj, visitados, orden)
    if orden == "post":
        print(actual)
 
dfs_imprime('a', adj, set(), "pre")
dfs_imprime('a', adj, set(), "post")
dfs_imprime('a', adj, set())
