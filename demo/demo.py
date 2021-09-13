import operator # for getting extrema from dictionaries
from sys import argv # read command-line parameters
import matplotlib.pyplot as plt # for the drawings
from math import sqrt, log, ceil # mathematical routines
from collections import defaultdict # easy storage
from random import random, shuffle # pseudo-random number generation
from networkx import Graph, draw, relabel_nodes # graph representation (object-oriented)

n = None
try:
    n = int(argv[1]) # how many cities does our TSP have
except:
    n = 4 # a small default
assert n > 2 # we need at least three for this to make sense
print(f'Working with a TSP of {n} cities')

# step 1) represent the complete graph with euclidean-distance weights

# we COULD of course do the creation of the graph using a library
# routine from networkx, but we LEARN more if we do it step by step

G = Graph() # storage for the graph
gpos = dict() # storage for the vertex positions
for v in range(n): # add a total of n vertices called 0, 1, 2, ..., n - 1
    # position each vertex pseudo-randomly in a unit square
    x = random() # horizontal position
    y = random() # vertical position
    G.add_node(v)
    gpos[v] = (x, y)
low = sqrt(2) # the highest possible Euclidean distance in a unit square
high = 0 # the lowest possible distance
for v in gpos: # for each vertex
    (vx, vy) = gpos[v] # access position
    for w in gpos: # for each other vertex
        if v == w:
            continue # skip self
        (wx, wy) = gpos[w]
        dx = vx - wx # horizontal difference
        dy = vy - wy # vertical difference
        distance = sqrt(dx**2 + dy**2) # remember Pythagoras?
        G.add_edge(v, w, cost = distance)
        low = min(low, distance) # figure out the minimum edge cost
        high = max(high, distance) # as well as the maximum
# view the min-max costs at two-decimal precision
print(f'The minimum single-edge cost is {low:.2f} and the maximum is {high:.2}')

# first we set up how we want the visualization to look
opt = { 'node_color': 'white', # white vertex color
        'font_color': 'black' # vertex label font color
}
opt['with_labels'] = n <= 30
opt['node_size'] = max(100, 500 - 3 * int(log(n, 2)))
opt['width'] = max(4 - int(ceil(log(n, 10))), 1)
costs = [ data['cost'] for v, w, data in G.edges(data = True) ]
worst = sum(costs) # no solution could ever cost more than ALL the edges
unit = 15
plt.rcParams['figure.figsize'] = (unit, unit) # big figure
if n <= 100:
    fig, ax = plt.subplots() # create an image to draw onto
    draw(G, pos = gpos, # place each vertex in the unit square using its coordinates
         edge_cmap = plt.get_cmap('Oranges'), # use tones of orange to color the edges
         edge_color = costs, # the tone of each depends on its cost
         **opt) # use the options above
    ax.set_facecolor('black') # make it a black background
    fig.set_facecolor('black')
    ax.axis('off') # no axis needed
    plt.savefig(f'graph{n}.png')
    plt.close()

class Node: # now, consider all the possible visitation orders as a tree 

    def __init__(self, label, parent = None, depth = 0): # create an empty node
        self.value = label # store the value
        self.parent = parent # root has none
        self.children = None # leaves have none
        self.depth = depth # the root is at zero
        self.height = None
        self.x = None
        self.y = None
        self.path = ''
        self.cost = 0
        self.total = 0
        self.label = None
        
    def adjust(self): # set values for path, cost, height
        self.path = self.parent.path + '.' if self.parent is not None else ''
        self.path += str(self.value)
        tallest = [ child.adjust() for child in self.children ] if self.children is not None else [ 0 ]
        self.height = 1 + max(tallest) # leaves have height one 
        return self.height
        
    def __str__(self): # print the node (recursively the tree)
        prefix = ' ' * self.depth
        below = '\n'.join(str(child) for child in self.children) if self.children is not None else ''
        return f'{prefix}{self.path}\n{below}'.rstrip() 

    def __repr__(self):
        return str(self) # when asked to represent, use the above format
    
    def present(self): # what values are already present at or above this one
        above = self.parent.present() if self.parent is not None else set()
        return { self.value } | above

    def permute(self, values, source, root):
        if self.parent is not None:
            data = source.get_edge_data(self.value, self.parent.value)
            self.cost = data['cost']
            self.total = self.cost + self.parent.cost
        pending = sorted(list(values - self.present())) # skip those already present
        if len(pending) == 0: # nothing left (a leaf)
            self.total += source.get_edge_data(self.value, root.value)['cost'] # close the loop
            return 
        d = self.depth + 1 # the children will be one level deeper
        self.children = [ Node(value, parent = self, depth = d) for value in pending ]
        below = values - { self.value }
        for child in self.children: # continue recursively
            child.permute(below, source, root)

    def position(self, ltarget, ptarget, xr, yr = (0, 1), curr = None, total = None): # position in a unit square as well 
        self.label = f'{self.path} = {self.total:.2f}' # make a label with total cost
        ltarget[self.path] = self.label 
        (xlow, xhigh) = xr
        self.x = (xlow + xhigh) / 2 # horizontally in the middle
        (ylow, yhigh) = yr
        self.y = yhigh # vertically on the top
        ptarget[self.label] = (self.x, self.y) # associate positions to the labels
        if self.children is not None:
            xspan = xhigh - xlow
            xa = xspan / len(self.children) # horizontal allocation per child
            yspan = yhigh - ylow
            yp = curr / total if curr is not None and total is not None else (self.height - 1) / self.height
            ya = yp * yspan
            ytop = ylow + ya
            for child in self.children:
                child.position(ltarget, ptarget, (xlow, xlow + xa), (ylow, ytop),
                               curr - 1 if curr is not None else None, total)
                xlow += xa

    def join(self, graph): # add nodes as vertices to draw with networkx
        graph.add_node(self.path)
        if self.children is not None:
            for child in self.children:
                child.join(graph)

    def connect(self, graph): # add connections as edges to draw with networkx
        if self.parent is not None:
            v = self.label
            w = self.parent.label
            graph.add_edge(v, w, cost = self.cost)
        if self.children is not None:
            for child in self.children:
                child.connect(graph)

    def cheapest(self, best):
        if self.children is None: # at a leaf
            return min(self.total, best)
        else: # not at a leaf yet
            return min([ child.cheapest(best) for child in self.children ])

opt['with_labels'] = n < 5
if n < 10: # too slow for larger graphs
    # note that it does not matter where we start since it is a cycle
    root = Node(0) # we can start at zero w.l.o.g.
    root.permute({ v for v in range(n) }, G, root)
    root.adjust()
    T = Graph() # we make a graph of it so we can draw it the same way
    root.join(T) # create vertices to represent the nodes
    labels = dict()
    tpos = dict()
    w = int(n * sqrt(n)) # figure width
    wunit = (w / n) * unit
    plt.rcParams['figure.figsize'] = (wunit, unit) # big figure
    root.position(labels, tpos, (0, w)) # label and position the nodes with
    L = relabel_nodes(T, labels)
    root.connect(L) # add edges to represent the branches and match the costs
    gbest = root.cheapest(worst)
    print(f'The cheapest (exhaustive) route costs {gbest:.2f}')
    if n < 7: # makes no sense for large n to draw the trees
        lcosts = [ data['cost'] for v, w, data in L.edges(data = True) ]
        fig, ax = plt.subplots()
        draw(L, pos = tpos, # using the tree positions
             edge_cmap = plt.get_cmap('Oranges'),
             edge_color = lcosts, **opt) 
        ax.set_facecolor('black')
        fig.set_facecolor('black')
        plt.savefig(f'tree{n}.png')
        plt.close()        

# let's be smart and prune branches that cost more than the best one seen thus far

class Smart(Node):

    def __init__(self, label, parent = None, depth = 0):
        super().__init__(label, parent, depth)
        self.complete = False

    def role(self, target):
        # complete leaves are 1, incomplete leaves are 0, internals are -1
        target[self.label] = 1 * self.complete if self.children is None else -1 
        if self.children is not None:
            for child in self.children: 
                child.role(target)
        
    def permute(self, values, source, root, best): # redefine how to proceed
        if self.parent is not None:
            data = source.get_edge_data(self.value, self.parent.value)
            self.cost = data['cost']
            self.total = self.cost + self.parent.cost
            if self.total > best: # already more expensive, makes no sense to continue
                return best # this becomes an incomplete route if not a leaf yet
        pending = sorted(list(values - self.present())) # skip those already present
        if len(pending) == 0: # nothing left (a leaf)
            self.complete = True
            self.total += source.get_edge_data(self.value, root.value)['cost'] # close the loop            
            return min(best, self.total) # possibly best, update if so            
        else:
            d = self.depth + 1 # the children will be one level deeper
            self.children = [ Smart(value, parent = self, depth = d) for value in pending ]
            below = values - { self.value }
            return min(best, min([ child.permute(below, source, root, best) for child in self.children ]))

opt['font_color'] = 'cyan'
opt['font_size'] = 12
if n < 10: 
    sroot = Smart(0)
    pbest = sroot.permute({ v for v in range(n) }, G, root, worst)
    print(f'The cheapest (pruned) route costs {pbest:.2f}')
    assert gbest == pbest
    sroot.adjust()
    P = Graph() 
    sroot.join(P)
    h = sroot.height
    sroot.position(labels, tpos, (0, w), curr = h - 1, total = h) # label and position the nodes with
    Q = relabel_nodes(P, labels)
    sroot.connect(Q) # add edges to represent the branches and match the costs
    del opt['node_color']
    if n < 7: 
        qcosts = [ data['cost'] for v, w, data in Q.edges(data = True) ]
        complete = dict()
        sroot.role(complete)
        nodecolor = [ complete[v] for v in Q.nodes() ] # intermediate, full solution or pruned 
        fig, ax = plt.subplots()
        draw(Q, pos = tpos, 
             node_color = nodecolor,
             cmap = plt.get_cmap('Set1'),
             edge_cmap = plt.get_cmap('Oranges'),
             edge_color = qcosts, **opt) 
        ax.set_facecolor('black')
        fig.set_facecolor('black')
        ax.axis('off')
        plt.savefig(f'prune{n}.png')
        plt.close()        
        
# what if we have a large n?
# first idea: self-avoiding random walk

def cost(G, route):
    acc = 0 # accumulate the cost here
    p = 1 # by traversing the route
    while p < len(route):
        source = route[p - 1]
        target = route[p]
        d = G.get_edge_data(source, target)
        assert 'cost' in d
        acc += d['cost']
        p += 1
    return acc
    
route = [ v for v in range(n) ]
replicas = 10 * int(ceil(log(n, 2)))
rbest = worst
for replica in range(replicas): # try several times
    shuffle(route) # a new permutation
    cycle = route + [ route[0] ] # close the cycle
    rbest = min(rbest, cost(G, cycle))
print(f'The cheapest random walk costs {rbest:.2f} (over {replicas} attempts)')

# so this is pretty fast but quite bad; we need a better approach
# let us compute a minimum spanning tree 
mst = set()
costs = dict() # store candidate edges
for v, w, data in G.edges(data = True):
    costs[(v, w)] = data['cost'] 
components = dict() # connected-component storage
mstcost = 0 # cost accumulator
neighbors = defaultdict(set)
while len(costs) > 0: # Kruskal's algorithm for MST
    cheapest = min(costs.items(), key = operator.itemgetter(1))[0]
    (v, w) = cheapest
    value = costs[cheapest]
    del costs[cheapest] # remove the processed edges
    connected = components.get(v, {v})
    if w not in connected:
        mst.add(cheapest) # use this edge
        neighbors[v].add(w)
        neighbors[w].add(v)
        mstcost += value 
        combination = connected.union(components.get(w, {w}))
        if len(combination) == n: # everyone is now connected
            break
        for u in combination:
            components[u] = combination
print(f'The minimum spanning tree costs {mstcost:.2f}')
plt.rcParams['figure.figsize'] = (unit, unit) # restore some of these
opt['node_color'] = 'white' 
opt['with_labels'] = n <= 30
opt['font_color'] = 'black'
M = G.copy() # make a copy
removed = G.edges() - mst
M.remove_edges_from(removed)
if n <= 100:
    mcosts = [ data['cost'] for v, w, data in M.edges(data = True) ]
    fig, ax = plt.subplots()
    draw(M, pos = gpos, 
         edge_cmap = plt.get_cmap('Oranges'), 
         edge_color = mcosts, 
         **opt) 
    ax.set_facecolor('black')
    fig.set_facecolor('black')
    ax.axis('off')
    plt.savefig(f'mst{n}.png')
    plt.close()

# let us make a cycle from the MST by walking it back and forth
route = []
visited = set()

def dfs(v):
    global route, neighbors, visited
    route.append(v)
    visited.add(v)
    cand = neighbors[v] - visited # unvisited
    for w in cand:
        dfs(w)
        route.append(v)
dfs(0)
if n <= 30:
    print('Back and forth', route)
bfcost = cost(G, route)
print(f'The back-and-forth MST costs {bfcost:.2f}')
# we need to straighten out the repeated visits
prev = 0 # start at zero again
straight = [ 0 ]
used = set()
for pos in range(1, len(route)):
    cand = route[pos]
    if cand not in straight: # skip ahead (already visited)
        straight.append(cand)
        used.add((prev, cand))
        used.add((cand, prev))
        prev = cand
last = straight[-1]
used.add((0, last))
used.add((last, 0))
straight.append(0) # close the loop
if n <= 30:
    print('Straighted out', straight)
assert len(straight) == n + 1
scost = cost(G, straight)
print(f'The straightened-out MST cycle costs {scost:.2f}')
print(f'The cheapest random walk was {rbest:.2f}')

S = G.copy() # make a copy of the graph
S.remove_edges_from(G.edges() - used)
if n <= 100:
    scosts = [ data['cost'] for v, w, data in S.edges(data = True) ]
    fig, ax = plt.subplots()
    draw(S, pos = gpos, 
         edge_cmap = plt.get_cmap('Oranges'), 
         edge_color = scosts, 
         **opt) 
    ax.set_facecolor('black')
    fig.set_facecolor('black')
    ax.axis('off')
    plt.savefig(f'approx{n}.png')
    plt.close()

# PENDING: local search with 2opt for stupid jumps (as a GIF)
