grafo = {(1, 3): 4, (2, 3): 2, (2, 4): 1, (3, 4): 2, (4, 6): 1, (5, 6): 2}
from copy import deepcopy
pendientes = deepcopy(grafo)
arista = min(pendientes.keys(), key = (lambda k: pendientes[k]))
del pendientes[arista] # se consideran una sola vez
arbol = {arista}
peso = grafo[arista]
incluidos = set()
incluidos.update(arista)
 
while len(pendientes) > 0:
    candidatos = dict()
    redundantes = set()
    for arista in pendientes:
        comunes = len(incluidos.intersection(arista))
        if comunes == 0:
             continue # no es candidato
        elif comunes == 1:
             candidatos[arista] = grafo[arista] # es candidato
        else: # causa un ciclo
             redundantes.add(arista)
    for inutil in redundantes:
        del pendientes[inutil]
    if len(candidatos) == 0:
        break # ya no falta nada
    seleccionado = min(candidatos.keys(), key = (lambda k: candidatos[k]))
    del pendientes[seleccionado] # se consideran una sola vez                 
    arbol.add(seleccionado)
    peso += grafo[seleccionado]
    incluidos.update(seleccionado) 
 
print('MST con peso', peso, ':', arbol)
