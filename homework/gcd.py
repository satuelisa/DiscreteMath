def gcd(a, b):
    if b == 0:
        return a
    return gcd(b, a % b)

print(gcd(123456, 123))

def relativamente_primos(x, y):
    return gcd(x, y) == 1

a = 87665
b = 16731
print(relativamente_primos(a, b))
