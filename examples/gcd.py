def gcd_resta(a, b):
    mayor = max(a, b)
    menor = min(a, b)
    if menor == 0:
        return mayor
    return gcd_resta(mayor - menor, menor)

def gcd_residuo(a, b): 
    if b == 0:
        return a
    return gcd_residuo(b, a % b)    

def gcd(a, b): # ahora sin recursion
    while b > 0:
        a, b = b, a % b
    return a
    
a = 210
b = 693
c = gcd_residuo(a, b)
assert c == gcd_resta(a, b)
assert c == gcd(a, b)
print("gcd({:d}, {:d}) = {:d}".format(a, b, c))
