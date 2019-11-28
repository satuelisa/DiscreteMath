def recursivo(palabra):
    if len(palabra) < 1:
        return True
    elif palabra[0] == palabra[-1]:
        return recursivo(palabra[1:-1])
    else:
        return False
 
def iterativo(palabra):
    i = 0
    j = len(palabra) - 1
    while i < j:
        if palabra[i] != palabra[j]:
            return False
        i += 1
        j -= 1
    return True
