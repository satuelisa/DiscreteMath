from sys import argv # read command-line parameters
from math import sqrt # square root
from random import random # pseudo-random number generation
from celluloid import Camera # creating animations
import matplotlib.pyplot as plt # for the drawings
from networkx import Graph, draw # graph representation (object-oriented)
plt.rcParams['figure.figsize'] = (15, 15) # big figures

n = int(argv[1]) # how many cities does our TSP have
assert n > 2 # we need at least three for this to make sense

# step 1) represent the complete graph with euclidean-distance weights

# we COULD of course do the creation of the graph using a library
# routine from networkx, but we LEARN more if we do it step by step

G = Graph() # storage for the graph
pos = dict() # storage for the vertex positions
for v in range(n): # add a total of n vertices called 0, 1, 2, ..., n - 1
    # position each vertex pseudo-randomly in a unit square
    x = random() # horizontal position
    y = random() # vertical position
    G.add_node(v)
    pos[v] = (x, y)
low = sqrt(2) # the highest possible Euclidean distance in a unit square
high = 0 # the lowest possible distance
for v in pos: # for each vertex
    (vx, vy) = pos[v] # access position
    for w in pos: # for each other vertex
        if v == w:
            continue # skip self
        (wx, wy) = pos[w]
        dx = vx - wx # horizontal difference
        dy = vy - wy # vertical difference
        distance = sqrt(dx**2 + dy**2) # remember Pythagoras?
        G.add_edge(v, w, cost = distance)
        low = min(low, distance) # figure out the minimum edge cost
        high = max(high, distance) # as well as the maximum
# view the min-max costs at two-decimal precision
print(f'The minimum single-edge cost is {low:.2f} and the maximum is {high:.2}')

if 'graph' in argv: # when requested, let's take a look (there are tons of edges)
    # first we set up how we want the visualization to look
    opt = { 'node_size': 500, # large circles for the vertices
            'node_color': 'white', # white vertex color
            'width': 3, # constant edge width
            'with_labels': True, # show the vertex labels (names)
            'font_color': 'black' # vertex label font color
    }
    costs = [ data['cost'] for v, w, data in G.edges(data = True) ]
    fig, ax = plt.subplots() # create an image to draw onto
    draw(G, pos = pos, # place each vertex in the unit square using its coordinates
         edge_cmap = plt.get_cmap('Oranges'), # use tones of orange to color the edges
         edge_color = costs, # the tone of each depends on its cost
         **opt) # use the options above
    ax.set_facecolor('black') # make it a black background
    fig.set_facecolor('black')
    plt.show() # let's see it
    
# now, consider all the possible visitation orders as a tree 
class Node:

    def __init__(self, label, parent = None, depth = 0): # create an empty node
        self.value = label # store the value
        self.parent = parent # root has none
        self.children = None # leaves have none
        self.depth = depth # the root is at zero
        self.height = None
        self.x = None
        self.y = None
        self.path = ''

    def adjust(self): # set values for path and height
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

    def permute(self, values):
        pending = sorted(list(values - self.present())) # skip those already present
        if len(pending) == 0: # nothing left (a leaf)
            return 
        d = self.depth + 1 # the children will be one level deeper
        self.children = [ Node(value, parent = self, depth = d) for value in pending ]
        below = values - { self.value }
        for child in self.children: # continue recursively
            child.permute(below)

    def position(self, target, xr, yr = (0, 1)): # position in a unit square as well 
        (xlow, xhigh) = xr
        self.x = (xlow + xhigh) / 2 # horizontally in the middle
        (ylow, yhigh) = yr
        self.y = yhigh # vertically on the top
        target[self.path] = (self.x, self.y)
        if self.children is not None:
            xspan = xhigh - xlow
            xa = xspan / len(self.children) # horizontal allocation per child
            yspan = yhigh - ylow
            yp = (self.height - 1) / self.height # vertical proportion for branches below
            ya = yp * yspan
            ytop = ylow + ya
            for child in self.children:
                child.position(target, (xlow, xlow + xa), (ylow, ytop))
                xlow += xa

    def join(self, graph): # add nodes as vertices to draw with networkx
        graph.add_node(self.path)
        if self.children is not None:
            for child in self.children:
                child.join(graph)

    def connect(self, graph, source): # add connections as edges to draw with networkx
        if self.parent is not None:
            v = self.path
            w = self.parent.path
            data = source.get_edge_data(self.value, self.parent.value)
            graph.add_edge(v, w, cost = data['cost'])
        if self.children is not None:
            for child in self.children:
                child.connect(graph, source)            
                
# note that it does not matter where we start since it is a cycle
# so we can start at vertex zero
def permutations(n):
    root = Node(0)
    root.permute({ v for v in range(n) })
    return root

root = permutations(n)
print(f'The tree has {root.adjust()} levels of nodes')
tpos = dict() 
tree = root.position(tpos, (0, n))

if 'tree' in argv: # when requested, let's take a look at the tree, too
    # we make a graph of it so we can draw it the same way
    T = Graph()
    root.join(T) # create vertices to represent the nodes
    root.connect(T, G) # add edges to represent the branches and match the costs
    # we set up how we want the visualization to look
    opt = { 'width': 3, 'node_color': 'black', 'with_labels': True, 'font_color': 'white' }
    costs = [ data['cost'] for v, w, data in T.edges(data = True) ]
    fig, ax = plt.subplots()
    draw(T, pos = tpos, # using the tree positions
         edge_cmap = plt.get_cmap('Oranges'),
         edge_color = costs, **opt) 
    ax.set_facecolor('black')
    fig.set_facecolor('black')
    plt.show()



#ax.axis('on')
#cam.snap() 
#gif = cam.animate(interval = 500), # milliseconds between frames
#gif.save('tmp.gif', writer = 'imagemagick')
#cam = Camera(fig) # for storing the frames
#            cmap = plt.get_cmap('Greens'),
#            node_color = logrank,
#            node_size = rank,
#

