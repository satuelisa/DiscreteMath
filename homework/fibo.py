def fSecuencia(k): # genera los k primeros elementos
    listado = [0, 1] # fragmento inicial
    while len(listado) < k: # extendemos al largo deseado
        listado.append(listado[-1] + listado[-2]) # suma de los dos al final
    return listado # regresamos resultado

def fibo(n): # genera F_n
    if n < 2:
        return n
    a, b = 0, 1
    while n > 1:
        a, b, n = b, a + b, n - 1
    return b

secuencia = fSecuencia(20) # consultamos veinte elementos
assert secuencia[-1] == fibo(19) # al final viene F_19 ya que F_0 es primero
print(secuencia)
n = int(input("Dame un n: "))
print('F_n vale', fibo(n))
