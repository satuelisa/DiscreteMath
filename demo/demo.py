from sys import argv # read command-line parameters
n = None
try:
    n = int(argv[1]) # how many cities does our TSP have
except:
    n = 5 # a small default
assert n > 2 # we need at least three for this to make sense
print(f'Working with a TSP of {n} cities')

from math import sqrt, log, ceil, exp, fabs # mathematical routines
unit = 8
width = int(n * sqrt(n))
wunit = (width / n) * unit
radius = 1 / n
magn = int(ceil(log(n, 2)))
significant = 0.01
gns = max(50, 300 - 20 * int(log(n, 2))) if n <= 30 else 20 # node size for graphs
tns = max(150, 400 - 20 * int(log(n, 2))) if n < 5 else 20 # node size for trees

from time import time
def timestamp(start):
    ms = 1000 * (time() - start)
    print(f'That took {ms:.2f} ms of runtime')

# step 1) represent the complete graph with euclidean-distance weights

def eucl(p1, p2):
    (vx, vy) = p1
    (wx, wy) = p2
    dx = vx - wx # horizontal difference
    dy = vy - wy # vertical difference
    return sqrt(dx**2 + dy**2) # remember Pythagoras?

# we COULD of course do the creation of the graph using a library
# routine from networkx, but we LEARN more if we do it step by step
from networkx import Graph, draw, relabel_nodes # graph representation (object-oriented)
G = Graph() # storage for the graph
gpos = dict() # storage for the vertex positions
v = 0

from random import random, shuffle, randint # pseudo-random number generation
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

import matplotlib.pyplot as plt # for the drawings
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

def cost(G, r):
    acc = 0 # accumulate the cost here
    p = 1 # by traversing the route
    while p < len(r):
        source = r[p - 1]
        target = r[p]
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
# let's remember some of these for later
memories = dict()
for replica in range(replicas): # try several times
    shuffle(route) # a new permutation
    cycle = route + [ route[0] ] # close the cycle
    c = cost(G, cycle)
    if c < rbest:
        rbest = c
        bestwalk = cycle.copy()
        memories[f'BRW'] = bestwalk
    if replica < 5:
        memories[f'RW{replica}'] = cycle.copy()
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
from collections import defaultdict # easy storage
import operator # for getting extrema from dictionaries

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
# (3 / 2) * mstcost is the Christophides upper bound

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
bf = []
visited = set()

def dfs(v):
    global bf, neighbors, visited
    bf.append(v)
    visited.add(v)
    cand = neighbors[v] - visited # unvisited
    for w in cand:
        dfs(w)
        bf.append(v)
start = time()
dfs(0)
if n <= 10:
    print('Back and forth', bf)
bfcost = cost(G, bf)
print(f'The back-and-forth MST costs {bfcost:.2f}')
timestamp(start)

# we need to straighten out the repeated visits
start = time()
prev = 0 # start at zero again
st = [] # store the straightened-out route
for cand in bf:
    if cand not in st: # skip ahead if already visited
        st.append(cand)
st.append(st[0])
if n <= 10:
    print('Straightened out', st)
for i in range(n):
    assert i in st
scost = cost(G, st)
print(f'The straightened-out MST cycle costs {scost:.2f}')
timestamp(start)
memories['MST'] = st

S = G.copy() # make a copy of the graph
S.remove_edges_from(G.edges() - used(st))
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

def roll(r):
    k = len(r)
    assert r[0] == r[-1]
    offset = randint(1, k - 2)
    assert offset < len(r)
    rolled = r[offset:-1] + r[:offset] 
    return rolled + [ rolled[0] ] # close it back

def restore(r):
    if r[0] == 0:
        assert r[-1] == 0
        return r # nothing to do here
    assert r[0] == r[-1]
    zero = r.index(0)
    unrolled = r[zero:-1] + r[:zero] + [0]
    return unrolled

# local search
def twoopt(r):
    n = len(r)
    f = randint(1, n - 2) # first cut
    s = randint(f + 1, n - 1) # second cut
    start = r[:f]
    middle = r[f:s] # to invert
    finish = r[s:]
    assert len(start) > 0 and len(middle) > 0 and len(finish) > 0
    return start + middle[::-1] + finish
        
# simulated annealing
def simAnn(G, current, stuck, maximum, quiet = False, \
           T = 1000, cooling = 0.999, eps = 0.01, target = None, cap = 0):
    stalled = 0
    stable = 0
    cheapest = current.copy()
    lcost = ccost = cost(G, current)
    i = 0
    while stalled < maximum and T > eps:
        assert current[0] == current[-1] == 0
        assert len(current) == n + 1
        modified = restore(twoopt(roll(current)))
        mcost = cost(G, modified)
        d = ccost - mcost
        if mcost < lcost: # a new low (a good thing here)
            if target is not None and len(target) < cap: # store this
                target.add(tuple(current)) # lists cannot go into set
            if not quiet:
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
            ccost = mcost
            current = modified
            if d > 0: # it was better
                T *= cooling # get stricter
                stalled = 0 
                continue
        stalled += 1
    return cheapest

start = time()
# start with a copy of the straightened-out route
assert st[0] == st[-1] == 0
cheapest = simAnn(G, st.copy(), magn, 200 * magn)
memories['SA'] = cheapest
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

# what if we DID NOT know the edge costs?
# can deep learning infer them by observing good and bad routes?
# WARNING: not every laptop will do this in a blink of an eye

# let's make a dataset of tons of routes
# also, routes themselves would be very BAD inputs (random orderings)
# we should match the inputs to the vertices
# and store at which _position_ that vertex is visited
# assuming 0 is first (we fix this to resolve the rotation problem)
def index(r):
    pos = dict()
    i = 0
    for v in r[:-1]:
        pos[v] = i
        i += 1
    zero = pos[0] # make this first
    output = [0]
    for v in range(1, n):
        p = pos[v]
        if p > zero: # it came AFTER zero
            output.append(p - zero)
        elif p < zero: # it came BEFORE zero 
            output.append(zero + p)
    return output

from math import factorial
goal = min(500, 3 * factorial(n - 1) / 4) # be prudent
# higher -> better (but make less if using this online)
start = time()
routes = set() # avoid duplicates (still getting the mirror images)
half = goal // 2
# make roughly half "good ones" 
print('Generating probable "good" routes')
stuck = 0
prev = 0
while len(routes) < half and stuck < 10: # make some with local search
    assert st[0] == st[-1] == 0
    simAnn(G, st.copy(), magn, 200 * magn, quiet = True, target = routes, cap = half)
    present = len(routes) # how many do we have
    print(f'At {present} out of {half}')
    if present == prev:
        stuck += 1 # do not try forever
    prev = present
print('Good ones done')    
goal = max(present, goal) # if we already have more, match that

# the other half "bad ones" (random walks)
# will need to start at zero, too
# otherwise we get leakage
print('Generating probable "bad" routes')
while len(routes) < goal:
    shuffle(route) # we can use one we already had and mix it
    routes.add(tuple(restore(route + [ route[0] ])))
print('Data generation ready')
timestamp(start)
routes = list(routes)

import numpy as np 
shuffle(routes) # randomize the order 
costs = [ cost(G, r) for r in routes ] # route costs
thr = np.median(costs) # a threshold for "cheap" / "expensive"

# let's take a look
head, h = n, 0
for (r, c) in zip(routes, costs):
    print(f'{r} -> {c:.3f} -> {c < thr}')
    h += 1
    if h == head:
        break # not all

labels = [ c < thr for c in costs ] # better / worse
ri = [ index(r) for r in routes ] # better inputs (one less of them, too)
div = round(0.7 * len(routes)) # split into train and test

# prepare the training data
training = ri[:div] # 70%
X = np.array(training) # need a matrix as input
y = np.array(labels[:div]).T # labels as a column vector
ls, cs = np.unique(y, return_counts = True)
for (l, c) in zip(ls, cs):
    print(f'Training with {c} routes with label {l}')
assert len(cs) == 2 # we _need_ both kinds
assert min(cs) > max(cs) / 2 # no gross imbalance

# prepare the test data
testing = ri[div:] # 30%
testX = np.array(testing)
testy = np.array(labels[div:]).T
ls, cs = np.unique(testy, return_counts = True)
for (l, c) in zip(ls, cs):
    print(f'Testing with {c} routes with label {l}')
assert len(cs) == 2 # we again _need_ both kinds
assert min(cs) > max(cs) / 2 # no gross imbalance

# now we do some deep learning (this will perform poorly for small n)

def examine(m, X, y, testX, testy, epochs = 20): # the things we need to do with a model
    start = time()
    m.compile(loss = 'binary_crossentropy', # a two-class problem
              optimizer = 'adam', # a gradient descent algorithm
              metrics = [ 'accuracy' ]) # performance measure
    m.fit(X, y, epochs = epochs, batch_size = 10) # how many rounds, update interval
    # usually we do many more, but this is just a quick demo
    timestamp(start)

    results = m.evaluate(testX, testy)
    # check look at the performance
    for (metric, value) in zip(m.metrics_names, results):
        print(f'Performance metric {metric} was {value:.3f} in the test')
        
    # remember, we never told the model we were solving the TSP
    # let us see for ourselves how well this works
    order = [ key for key in memories.keys() ]
    X = np.array([ index(memories[r]) for r in order ])
    output = m.predict(X)

    # remember: this will look different every time you run it
    happy, sad = 0, 0
    for (result, key) in zip(output, order):
        route = memories[key]
        expected = cost(G, route) < thr
        observed = result[0] > 0.5 # sigmoidal threshold
        match = observed == expected
        outcome = ':)' if match else ':('
        happy += match
        sad += not match
        print(f'{outcome} for {key}\twanted {expected}\t got {observed}\t(raw: {result})')
    hp = 'es' if happy > 1 else ''
    sp = 'es' if sad > 1 else ''
    sad = 'no' if sad == 0 else str(sad)
    happy = 'no' if happy == 0 else str(happy)
    print(f'That is {happy} match{hp} and {sad} mismatch{sp}.')
    return results

# if you do this on your computer, also install TensorFlow
from keras.models import Sequential # increment the layers one at a time
from keras.layers import Dense # everything is connected to everything

# a first model

m = Sequential()
m.add(Dense(n, input_dim = n, activation = 'relu')) # rectified linear unit activation function
m.add(Dense(1, activation = 'sigmoid')) # output the 0/1
# not very "deep", is it?
first = examine(m, X, y, testX, testy)

# relies on the graphviz backend to be present on your system
from keras_visualizer import visualizer 
visualizer(m, filename = 'first', format = 'png', view = False)

# the weights go by pairs per layer: kernel matrix, bias vector
W = m.get_weights()
# what DL thinks of the vertex-to-vertex relations
# between the input and the hidden layer now 
I = W[0]

# build the distance matrix from the edges
D = np.zeros((n, n))
for (v, w), d in edgecosts.items():
    D[v, w] = d

# normalize both to [0, 1]
def normalize(M):
    low = M.min()
    span = M.max() - low
    if low > 0:
        M -= M.min()
    if span > 0:
        M /= span
    return M

# we KNOW the vertex order in this one
D = normalize(D)

# in this one, we only know the input order, not the one at the hidden
# layer side but since if this WERE a representation of the edges, the
# diagonal (self) elements would be the smallest ones, we can put this
# in the "most promising order"

def mindiag(matrix): # reorder the columns to put minimal elements on
    n, m = matrix.shape
    assert n == m # square only
    ordered = dict()
    used = set()
    high = np.max(matrix) * 2
    while len(ordered) < n:
        low = high
        pick = None
        for x in range(n): # rows
            if not x in ordered:
                for y in range(n): # columns
                    if not y in used:
                        v = matrix[x][y]
                        if v < low:
                            low = v
                            pick = (x, y)
        (x, y) = pick
        ordered[x] = matrix[:, y]
        used.add(y)
    return np.column_stack([ ordered[v] for v in range(n) ])

# visual inspection
import seaborn as sns

ax = sns.heatmap(D, linewidth = 0, square = True)
plt.savefig('original.png')
plt.close()

ax = sns.heatmap(I, linewidth = 0, square = True)
plt.savefig('inferred.png')
plt.close()

Io = mindiag(normalize(I))

ax = sns.heatmap(Io, linewidth = 0, square = True)
plt.savefig('reordered.png')
plt.close()

# are these related?
# remember that we are still just guessing an ordering
i = Io.flatten() # 1D
d = D.flatten() # 1D
corr = np.corrcoef(i, d)[0][-1] 
print(f'The correlation is {corr}') # nope

# remember, the model NEVER sees the edges
# but it "knows" them now...
# how? and can we get them out of there?

deep = Sequential() # kinda like Arturo's bolzmann machines
deep.add(Dense(n, input_dim = n, activation = 'relu')) # input and first hidden:
for i in range(n - 1): # another n - 1 hidden layers
    deep.add(Dense(n, activation = 'relu')) 
deep.add(Dense(1, activation = 'sigmoid')) # output the 0/1

second = examine(m, X, y, testX, testy)

# is it better?
print(f'The first one had {first[0]:.3f} loss and {first[1]:.3f} accuracy')
print(f'This one had {second[0]:.3f} loss and {second[1]:.3f} accuracy')

from keras_visualizer import visualizer
visualizer(deep, filename = 'deep', format = 'png', view = False)

# since we do not know how in maps the vertices
# on the layers internally, we can but visualize the structure
W = deep.get_weights()
Gd = Graph()
dpos = dict()
for layer in range(n):
    k = 2 * layer
    ew = normalize(W[k])
    # for this architecture, we get just zeroes,
    # but in general we may want to see these
    vw = normalize(W[k - 1]) if k > 0 else np.zeros(n)
    for v in range(n):
        vl = f'{layer}.{v}'
        Gd.add_node(vl, weight = vw[v])
        dpos[vl] = (layer, v) # position by layer
        if layer > 0: # link it to the previous layer, all positions
            for u in range(n): 
                Gd.add_edge(vl, f'{layer-1}.{u}', weight = ew[v][u]) # we use the kernel matrix

# set up how we want the visualization to look
plt.rcParams['figure.figsize'] = (2 * n, n) # we need this _wide_
opt = { 'with_labels': False, 'node_size': 50, 'width': 1 }
fig, ax = plt.subplots()
from networkx import get_edge_attributes, get_node_attributes
wm = get_edge_attributes(Gd, 'weight').values()
wn = list(get_node_attributes(Gd, 'weight').values())
draw(Gd, pos = dpos, 
     cmap = plt.get_cmap('Blues'), # color the nodes with their weights
     edge_cmap = plt.get_cmap('Oranges'), # the same palette works
     node_color = wn, # node colors from weights
     edge_color = wm, # edge colors from weights
     **opt) 
ax.set_facecolor('black') 
fig.set_facecolor('black')
ax.axis('off') 
plt.savefig(f'layers.png') # somewhere in there, our edges are hiding
plt.close()

# HOMEWORK

C = Graph() # we make a circle of n vertices
cpos = dict()
from math import pi, sin, cos
da = 2 * pi / n
sep = 200 # how far apart along the circle the vertices go
radius = sep / da
noise = 0.05 # how noisy it should be (as a fraction of [-radius, radius])

def wiggle(magnitude, radius):
    return radius + magnitude * radius * (2 * random() - 1)

for v in range(n):
    angle = v * da
    x = wiggle(noise, radius) * cos(angle)
    y = wiggle(noise, radius) * sin(angle)
    p = (x, y)
    C.add_node(v)
    cpos[v] = (x, y)

ec = dict()
for v in range(n):
    (vx, vy) = cpos[v]
    for u in range(n):
        (ux, uy) = cpos[u]
        d = sqrt((vx - ux)**2 + (vy - uy)**2)
        C.add_edge(v, u)
        ec[(v, u)] = d
        
opt = { 'node_color': 'white', 'font_color': 'black' }
opt['with_labels'] = n <= 30
opt['node_size'] = sep // 2
opt['width'] = max(4 - magn, 1)
plt.rcParams['figure.figsize'] = (unit, unit) 
if n <= 100:
    fig, ax = plt.subplots() 
    draw(C, pos = cpos, 
         edge_cmap = plt.get_cmap('Oranges'), 
         edge_color = [ ec[(v, w)] for v, w in C.edges() ], 
         **opt) 
    ax.set_facecolor('black') 
    fig.set_facecolor('black')
    ax.axis('off') 
    plt.savefig(f'circle{n}.png')
    plt.close()

# the optimum here is be obvious as long as the noise is low; explore
# with different kinds of DL models to see you explain how the fitted
# model represents the graph

# you can either write your own code or reuse bits and pieces from the
# code above to test things out
