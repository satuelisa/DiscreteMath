M = {'a': 5, 'b': 13, 'c': 27}

print('claves (dominio)', ' '.join([str(x) for x in M.keys()]))
print('valores (rango)', ' '.join([str(x) for x in M.values()]))
print('relación', ' '.join([str(x) for x in M.items()]))
print('M(c) - M(a) = ', M['c'] - M['a'])
