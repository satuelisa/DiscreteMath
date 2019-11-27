from itertools import combinations, chain

A = ['a', 'b', 'c', 'd']
for subconjunto in combinations(A, 3):
    print(subconjunto)
    
k = 7
A = range(7)
contador = 0
for subconjunto in chain.from_iterable(combinations(A, r) for r in range(k + 1)):
    print(subconjunto)
    contador += 1
 
assert contador == 2**k
