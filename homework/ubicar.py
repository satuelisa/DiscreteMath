from arbol import Arbol
a = Arbol()
a.agrega(50)
a.agrega(18)
a.agrega(74)
a.agrega(7)
a.agrega(22)

def ubicar(nodo, buscado):
    if nodo.contenido == buscado:
        return True
    if buscado < nodo.contenido and nodo.izquierdo is not None:
        return ubicar(nodo.izquierdo, buscado)
    if buscado > nodo.contenido and nodo.derecho is not None:
        return ubicar(nodo.derecho, buscado)
    return False
 
print(ubicar(a.raiz, 15))
print(ubicar(a.raiz, 22))
