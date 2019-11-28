def siguiente(anterior, constante):
    return anterior + constante
 
n = 10
serie = [7]
d = 6
for pos in range(n - 1):
    serie.append(siguiente(serie[-1], d))
print(serie) 
sum(serie) == n * (serie[0] + serie[-1]) / 2
