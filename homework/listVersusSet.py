secuencia = [1, 4, 4, 7, 8] # listas permiten repeticiones y tienen un orden fijo
conjunto = {1, 4, 4, 7, 8} # conjuntos no guardan repeticiones y carecen orden
sum(secuencia) != sum(conjunto)
 
def producto(entrada):
    resultado = 1
    for elemento in entrada:
        resultado *= elemento
    return resultado
 
producto(secuencia)
producto(conjunto)
