def floyd_warshall(G): 
    d = {}
    for v in G.V:
        d[(v, v)] = 0 # distancia reflexiva es cero
        for u in G.vecinos[v]: # para vecinos, la distancia es el peso
           d[(v, u)] = G.E[(v, u)]
    for intermedio in G.V:
        for desde in G.V:
            for hasta in G.V:
                di = None
                if (desde, intermedio) in d:
                    di = d[(desde, intermedio)]
                ih = None
                if (intermedio, hasta) in d:
                    ih = d[(intermedio, hasta)]
                if di is not None and ih is not None:
                    c = di + ih # largo del camino via "i"
                    if (desde, hasta) not in d or c < d[(desde, hasta)]:
                        d[(desde, hasta)] = c # mejora al camino actual
    return d
