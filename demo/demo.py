import operator # for getting extrema from dictionaries
from time import time
from sys import argv # read command-line parameters
import matplotlib.pyplot as plt # for the drawings
from collections import defaultdict # easy storage
from math import sqrt, log, ceil, exp, fabs # mathematical routines
from random import random, shuffle, randint # pseudo-random number generation
from networkx import Graph, draw, relabel_nodes # graph representation (object-oriented)

n = None
try:
    n = int(argv[1]) # how many cities does our TSP have
except:
    n = 5 # a small default
assert n > 2 # we need at least three for this to make sense
print(f'Working with a TSP of {n} cities')

unit = 8
width = int(n * sqrt(n))
wunit = (width / n) * unit
radius = 1 / n
magn = int(ceil(log(n, 2)))
significant = 0.01
gns = max(50, 300 - 20 * int(log(n, 2))) if n <= 30 else 20 # node size for graphs
tns = max(150, 400 - 20 * int(log(n, 2))) if n < 5 else 20 # node size for trees

def timestamp(start):
    ms = 1000 * (time() - start)
    print(f'That took {ms:.0f} ms of runtime')

# step 1) represent the complete graph with euclidean-distance weights

def eucl(p1, p2):
    (vx, vy) = p1
    (wx, wy) = p2
    dx = vx - wx # horizontal difference
    dy = vy - wy # vertical difference
    return sqrt(dx**2 + dy**2) # remember Pythagoras?

# we COULD of course do the creation of the graph using a library
# routine from networkx, but we LEARN more if we do it step by step
G = Graph() # storage for the graph
gpos = dict() # storage for the vertex positions
v = 0
while v < n: # add a total of n vertices called 0, 1, 2, ..., n - 1
    # position each vertex pseudo-randomly in a unit square
    x = random() # horizontal position
    y = random() # vertical position
    p = (x, y)
    close = False
    for w in G.nodes(): # check that it is not too close
        distance = eucl(p, gpos[w])
        if distance < radius:
            close = True
            break
    if not close:
        G.add_node(v)
        gpos[v] = (x, y)
        v += 1
        
low = sqrt(2) # the highest possible Euclidean distance in a unit square
high = 0 # the lowest possible distance
edgecosts = dict()
for v in gpos: # for each vertex
    for w in gpos: # for each other vertex
        if v == w:
            continue # skip self
        d = eucl(gpos[v], gpos[w])
        G.add_edge(v, w, cost = d)
        edgecosts[(v, w)] = d
        edgecosts[(w, v)] = d
        low = min(low, d) # figure out the minimum edge cost
        high = max(high, d) # as well as the maximum
# view the min-max edgecosts at two-decimal precision
print(f'The minimum single-edge cost is {low:.2f} and the maximum is {high:.2}')

# first we set up how we want the visualization to look
opt = { 'node_color': 'white', 'font_color': 'black' }
opt['with_labels'] = n <= 30
opt['node_size'] = gns
opt['width'] = max(4 - magn, 1)
worst = sum(edgecosts.values()) / 2 # no solution could ever cost more than ALL the edges

plt.rcParams['figure.figsize'] = (unit, unit) # big figure
if n <= 100:
    fig, ax = plt.subplots() # create an image to draw onto
    draw(G, pos = gpos, # place each vertex in the unit square using its coordinates
         edge_cmap = plt.get_cmap('Oranges'), # use tones of orange to color the edges
         edge_color = [ edgecosts[(v, w)] for v, w in G.edges() ], # the tone of each depends on its cost
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
        
    def adjust(self): # set values for height
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

    def permute(self, values, source, root, best):
        if self.parent is not None: # not the root
            self.path = self.parent.path + '.' + str(self.value)
            # the cost of the edge from the parent to this one in the graph
            self.cost = source[(self.value, self.parent.value)]
            self.total = self.cost + self.parent.total
        else:
            self.path = str(self.value)
        pending = sorted(list(values - self.present())) # skip those already present
        if len(pending) == 0: # nothing left (a leaf)
            closing = source[(self.value, root.value)]
            self.total += closing # close the loop
            return min(self.total, best)
        d = self.depth + 1 # the children will be one level deeper
        self.children = [ Node(value, parent = self, depth = d) for value in pending ]
        below = values - { self.value }
        for child in self.children: # continue recursively
            best = min(best, child.permute(below, source, root, best))
        return best

    def position(self, ltarget, ptarget, xr, y, dy):
        self.label = f'{self.path} = {self.total:.2f}' # make a label with total cost
        ltarget[self.path] = self.label 
        (xlow, xhigh) = xr
        self.x = (xlow + xhigh) / 2 # horizontally in the middle
        self.y = y # vertical position
        ptarget[self.label] = (self.x, self.y) # associate positions to the labels
        if self.children is not None:
            xspan = xhigh - xlow
            xa = xspan / len(self.children) # horizontal allocation per child
            for child in self.children:
                child.position(ltarget, ptarget, (xlow, xlow + xa), y - dy, dy)
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
opt['font_color'] = 'cyan'
opt['node_size'] = tns
gbest = None
labels = dict()
tpos = dict()
if n < 11: # too slow for larger graphs
    # note that it does not matter where we start since it is a cycle
    start = time()
    groot = Node(0) # we can start at zero w.l.o.g.
    gbest = groot.permute({ v for v in range(n) }, edgecosts, groot, worst)
    print(f'The cheapest (exhaustive) route costs {gbest:.2f}')
    timestamp(start)
    groot.adjust()
    T = Graph() # we make a graph of it so we can draw it the same way
    groot.join(T) # create vertices to represent the nodes
    plt.rcParams['figure.figsize'] = (wunit, unit) # big figure
    groot.position(labels, tpos, (0, w), 1, 1 / (n + 1)) # label and position the nodes with
    L = relabel_nodes(T, labels)
    groot.connect(L) # add edges to represent the branches and match the edgecosts
    if n < 7: # makes no sense for large n to draw the trees
        fig, ax = plt.subplots()
        draw(L, pos = tpos, # using the tree positions
             edge_cmap = plt.get_cmap('Oranges'),
             edge_color = [ data['cost'] for v, w, data in L.edges(data = True) ], **opt) 
        ax.set_facecolor('black')
        fig.set_facecolor('black')
        plt.subplots_adjust(left=0.01, right=0.99)
        plt.savefig(f'tree{n}.png', bbox_inches='tight')
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
            self.path = self.parent.path + '.' + str(self.value)
            self.cost = source[(self.value, self.parent.value)]
            self.total = self.cost + self.parent.total
            if self.total > best: # already more expensive, makes no sense to continue
                self.path += str(self.value) # leave early
                return best # this becomes an incomplete route if not a leaf yet
        else:
            self.path = str(self.value)
        pending = sorted(list(values - self.present())) # skip those already present
        if len(pending) == 0: # nothing left (a leaf)
            closing = source[(self.value, root.value)]
            self.total += closing
            self.complete = True
            return min(self.total, best)
        d = self.depth + 1 
        self.children = [ Smart(value, parent = self, depth = d) for value in pending ]
        below = values - { self.value }
        for child in self.children: 
            best = min(best, child.permute(below, source, root, best))
        return best

opt['font_color'] = 'cyan'
opt['font_size'] = 12
if n < 13:
    start = time()
    sroot = Smart(0)
    sbest = sroot.permute({ v for v in range(n) }, edgecosts, sroot, worst)
    print(f'The cheapest (pruned) route costs {sbest:.2f}')
    timestamp(start)
    if gbest is not None:
        assert fabs(gbest - sbest) < significant
    sroot.adjust()
    P = Graph() 
    sroot.join(P)
    h = sroot.height
    sroot.position(labels, tpos, (0, w), 1, 1 / (n + 1)) # label and position the nodes with
    Q = relabel_nodes(P, labels)
    sroot.connect(Q) # add edges to represent the branches and match the edgecosts
    del opt['node_color']
    if n < 7: 
        complete = dict()
        sroot.role(complete)
        nodecolor = [ complete[v] for v in Q.nodes() ] # intermediate, full solution or pruned 
        fig, ax = plt.subplots()
        draw(Q, pos = tpos, 
             node_color = nodecolor,
             cmap = plt.get_cmap('Set1'),
             edge_cmap = plt.get_cmap('Oranges'),
             edge_color = [ data['cost'] for v, w, data in Q.edges(data = True) ], **opt) 
        ax.set_facecolor('black')
        fig.set_facecolor('black')
        ax.axis('off')
        plt.subplots_adjust(left=0.01, right=0.99)
        plt.savefig(f'prune{n}.png', bbox_inches='tight')
        plt.close()        

plt.rcParams['figure.figsize'] = (unit, unit) # restore some of these
opt['node_size'] = gns
opt['node_color'] = 'white' 
opt['with_labels'] = n <= 30
opt['font_color'] = 'black'
        
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

start = time()
route = [ v for v in range(n) ]
replicas = 10 * magn
rbest = worst
bestwalk = None
for replica in range(replicas): # try several times
    shuffle(route) # a new permutation
    cycle = route + [ route[0] ] # close the cycle
    c = cost(G, cycle)
    if c < rbest:
        rbest = c
        bestwalk = cycle.copy()
print(f'The cheapest random walk costs {rbest:.2f} (over {replicas} attempts)')
timestamp(start)

def used(r):
    u = set()
    for p in range(len(r)  - 1):
        a = r[p]
        b = r[p + 1]
        u.add((a, b))
        u.add((b, a))
    return u

W = G.copy() # make a copy
removed = G.edges() - used(bestwalk)
W.remove_edges_from(removed)
if n <= 100:
    fig, ax = plt.subplots()
    draw(W, pos = gpos, 
         edge_cmap = plt.get_cmap('Oranges'), 
         edge_color = [ edgecosts[(v, w)] for v, w in W.edges() ], 
         **opt) 
    ax.set_facecolor('black')
    fig.set_facecolor('black')
    ax.axis('off')
    plt.savefig(f'rw{n}.png')
    plt.close()


# so this is pretty fast but quite bad; we need a better approach
# let us compute a minimum spanning tree 
start = time()
mst = set()
components = dict() # connected-component storage
mstcost = 0 # cost accumulator
neighbors = defaultdict(set)
candidates = edgecosts.copy()
while len(candidates) > 0: # Kruskal's algorithm for MST
    cheapest = min(candidates.items(), key = operator.itemgetter(1))[0]
    (v, w) = cheapest
    value = edgecosts[cheapest]
    del candidates[cheapest] # remove the processed edges
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
timestamp(start)

M = G.copy() # make a copy
removed = G.edges() - mst
M.remove_edges_from(removed)
if n <= 100:
    fig, ax = plt.subplots()
    draw(M, pos = gpos, 
         edge_cmap = plt.get_cmap('Oranges'), 
         edge_color = [ edgecosts[(v, w)] for v, w in M.edges() ], 
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
start = time()
dfs(0)
if n <= 10:
    print('Back and forth', route)
bfcost = cost(G, route)
print(f'The back-and-forth MST costs {bfcost:.2f}')
timestamp(start)

# we need to straighten out the repeated visits
start = time()
prev = 0 # start at zero again
straight = [ 0 ]
for pos in range(1, len(route)):
    cand = route[pos]
    if cand not in straight: # skip ahead (already visited)
        straight.append(cand)
        prev = cand
straight.append(0) # close the loop
if n <= 10:
    print('Straighted out', straight)
assert len(straight) == n + 1
scost = cost(G, straight)
print(f'The straightened-out MST cycle costs {scost:.2f}')
timestamp(start)

S = G.copy() # make a copy of the graph
S.remove_edges_from(G.edges() - used(straight))
if n <= 100:
    fig, ax = plt.subplots()
    draw(S, pos = gpos, 
         edge_cmap = plt.get_cmap('Oranges'), 
         edge_color = [ edgecosts[(v, w)] for v, w in S.edges() ], 
         **opt) 
    ax.set_facecolor('black')
    fig.set_facecolor('black')
    ax.axis('off')
    plt.savefig(f'approx{n}.png')
    plt.close()

# now, some of those edges are plain dumb choices, right?

def roll(route):
    n = len(route)
    assert route[0] == route[-1]
    route.pop() # remove the last
    offset = randint(1, n - 2)
    assert offset < len(route)
    rolled = route[offset:] + route[:offset] 
    return rolled + [ rolled[0] ] # close it back
    
# local search
def twoopt(route):
    n = len(route)
    f = randint(1, n - 2) # first cut
    s = randint(f + 1, n - 1) # second cut
    start = route[:f]
    middle = route[f:s] # to invert
    finish = route[s:]
    assert len(start) > 0 and len(middle) > 0 and len(finish) > 0
    return start + middle[::-1] + finish
        
# simulated annealing
start = time()
T = 1000
eps = 0.01
cooling = 0.999
stalled = 0
maximum = 200 * magn
stuck = magn
stable = 0
current = straight
cheapest = straight.copy()
lcost = ccost = scost
i = 0
while stalled < maximum and T > eps:
    modified = twoopt(current)
    assert len(modified) == n + 1
    mcost = cost(G, modified)
    d = ccost - mcost
    if mcost < lcost: # a new low (a good thing here)
        print(f'New low at {mcost:.2f} on iteration {i} at temp {T:.2f}')
        cheapest = modified.copy()
        lcost = mcost
        if d > eps:
            stable += 1
            if stable > stuck:
                stalled = maximum
                continue
        else:
            stable = 0 # notable improvement
    threshold = exp(d / T) # probability
    i += 1
    if random() < threshold: # accept
        current = roll(modified) # change the start position (for varying 2-opt)c
        assert current[0] == current[-1]
        ccost = mcost
        if d > 0: # it was better
            T *= cooling # get stricter
            stalled = 0 
            continue
    stalled += 1
timestamp(start)
    
if n <= 100:
    F = G.copy() # make a copy of the graph
    F.remove_edges_from(G.edges() - used(cheapest))
    fig, ax = plt.subplots()
    draw(F, pos = gpos, 
         edge_cmap = plt.get_cmap('Oranges'), 
         edge_color = [ edgecosts[(v, w)] for v, w in F.edges()  ],
         **opt) 
    ax.set_facecolor('black')
    fig.set_facecolor('black')
    ax.axis('off')
    plt.savefig(f'local{n}.png')
    plt.close()


