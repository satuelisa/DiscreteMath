def fSecuencia(cuantos):
    listado = [0, 1] # fragmento inicial                                                                                  
    while len(listado) < cuantos: # extendemos al largo deseado                                                           
        listado.append(listado[-1] + listado[-2]) # sumando los dos elementos al final                                    
    return listado # regresamos resultado                                                                                 

def fibo(n):
    if n < 2:
        return n
    a, b = 0, 1
    while n > 2:
        a, b, n = b, a + b, n - 1
    return b

n = 18
secuencia = fSecuencia(n) # consultamos la secuencia de veinte elementos                                                  
assert secuencia[-1] == fibo(n)
