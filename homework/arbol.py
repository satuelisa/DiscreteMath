class Nodo:
 
    def __init__(self):
        self.contenido = None
        self.izquierdo = None
        self.derecho = None
 
    def __str__(self):
        if self.contenido is None:
            return ''
        else: # lo de %s es esencialmente lo mismo que lo de {:s} en .format()
            return '%s [%s | %s]' % (self.contenido, self.izquierdo, self.derecho)
 
    def agrega(self, elemento):
        if self.contenido is None:
            self.contenido = elemento
        else:
            if elemento < self.contenido:
                if self.izquierdo is None:
                    self.izquierdo = Nodo()
                self.izquierdo.agrega(elemento)
            if elemento > self.contenido:
                if self.derecho is None:
                    self.derecho = Nodo()
                self.derecho.agrega(elemento)
 
class Arbol:
 
    def __init__(self):
        self.raiz = None
 
    def __str__(self):
        return str(self.raiz)
 
    def __repr__(self):
        return str(self.raiz)
 
    def agrega(self, elemento):
        if self.raiz is None:
            self.raiz = Nodo()
        self.raiz.agrega(elemento)
