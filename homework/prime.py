def primo_v1(n):
    for i in range(2, n):
        if n % i == 0:
            return False
    return True

def primo_v2(n):
    if n < 4:
        return True # 1, 2 y 3 son primos todos
    elif n % 2 == 0:
        return False
    for i in range(3, n, 2): # en pasos de dos
        if n % i == 0:
            return False
    return True

from math import sqrt, ceil # raiz cuadrada

def primo_v3(n):
    if n < 4:
        return True # 1, 2 y 3 son primos todos
    elif n % 2 == 0:
        return False
    tope = int(ceil(sqrt(n))) + 1 # el siguiente entero a la raiz de n
    for i in range(3, tope, 2): # en pasos de dos
        if n % i == 0:
            return False
    return True

from random import randint

for test in range(30):
    n = randint(1, 100000)
    p1 = primo_v1(n)
    p2 = primo_v2(n)
    assert p1 == p2
    p3 = primo_v3(n)
    assert p1 == p3
    es = 'es' if p3 else 'no es'
    print(f'{n} {es} primo')
