
def pascal(cuantos):
    print('1') # para cero elementos
    n = 1 
    valores = [1] 
    for renglon in range(cuantos - 1):
        valores = [1] + [valores[p] + valores[p + 1] for p in range(len(valores) - 1)] + [1]
        print("\t".join([str(v) for v in valores]))
        assert sum(valores) == 2**n # los renglones suman a potencias de dos
        n += 1 # solamente para verificar, mantenemos cuentas de cual renglon es

pascal(25)
