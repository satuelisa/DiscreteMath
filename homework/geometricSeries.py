def sig_geom(anterior, constante):
    return anterior * constante

n = 12
geom_serie = [13]
d = 3
for pos in range(n - 1):
    geom_serie.append(sig_geom(geom_serie[-1], d))
print(geom_serie) 
assert sum(geom_serie) == geom_serie[0] * (1 - d**n) / (1 - d)
