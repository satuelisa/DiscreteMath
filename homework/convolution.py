# calculamos con entradas f = [1, 2, 3] y g = [0, 1, 5]
#
# 5 1 0
#     1 2 3 
# ---------- * por elemento
#     0      + = 0 de (0, 0)
#
# 5 1 0
#   1 2 3
# ---------- * por elemento
#   1 0      + = 1 de (0, 1) y (1, 0)
#
# 5 1 0
# 1 2 3
# ---------- * por elemento
# 5 2 0      + = 7 de (0, 1, 2) y (2, 1, 0)
#
#   5 1 0
# 1 2 3
# ---------- * por elemento
#  10 3     + = 13 de (1, 2) y (2, 1)
#
#     5 1 0
# 1 2 3
# ---------- * por elemento de (2, 2)
#    15     + = 15
#
# el resultado debe ser [0, 1, 7, 13, 15]
 
def convo(f, g):
    assert len(f) == len(g) # ocupan tener el mismo largo           
    n = len(f)
    desde = 0 # inicio del pedazo a multiplicar                     
    hasta = 0 # final del pedazo a multiplicar                      
    c = [] # resultado va en esta lista                             
    for k in range(2 * n - 1): # para cada elemento                 
        s = 0 # inicializar la suma                                 
        pos = list(range(desde, hasta + 1)) # pedazo                
        l = len(pos) # largo del pedazo                             
        for i in range(l): # para cada posición                     
            j = l - (i + 1) # índice desde el final para g          
            s += f[pos[i]] * g[pos[j]]
        c.append(s) # agregar al resultado                          
        if k < n - 1: # incrementar pezado en su final              
            hasta += 1
        else:
            desde += 1 # disminuir el pedazo al inicio              
    return c
 
f = [1, 2, 3] # datos de prueba                                     
g = [0, 1, 5]
fog = convo(f, g) # cálculo                                         
print(fog, fog == convo(g, f))
