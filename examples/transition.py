# read the command-line parameters

from sys import argv

fc = None
s = 2
try:
    fc = int(argv[1])
except:
    fc = 30 # 30 frames is the default
    s = 1
    
# read in the images
files = argv[s:]
from PIL import Image

images = [ Image.open(f) for f in files ]
iw = []
ih = []
for i in images:
    w, h = i.size
    iw.append(w)
    ih.append(h)
    if i.mode != 'RGB':
        i = i.convert('RGB')

# figure out whether the widths or the heights are more different
wl = min(iw)
hl = min(ih)
wr = max(iw) / wl
hr = max(ih) / hl
cw = wr > hr

# scale the larger to match one dimension of the smallest
scaled = []
t = wl if cw else hl
iw = []
ih = []
for i in images:
    w, h = i.size
    r = t / w if cw else t / h
    s = (t, round(h * r)) if cw else (round(w * h), t)
    iw.append(s[0])
    ih.append(s[1])
    scaled.append(i.resize(s))
    
# crop the larger to match the smaller exactly in the remaining dimension
from math import floor, ceil
wl = min(iw)
hl = min(ih)
cropped = []
for i in scaled:
    w, h = i.size
    we = (w - wl) / 2
    he = (h - hl) / 2
    cropped.append(i.crop((floor(we), floor(he), w - ceil(we), h - ceil(he))))

# using the parameter specifying the desired number of frames,
# determine how many pixels to transition per step (rate)
rate = (wl * hl) // fc
from math import log
tl = floor(log(fc, 10)) + 1 # how many digits we need for the frame counters

def alter(current, channel, value):
    v = list(current) # cannot assign to a tuple so we need a list
    v[channel] = value
    return (v[0], v[1], v[2]) # RGB tuple needed

def moore(col, row, w, h, mix = True):
    neighbors = [ (col - 1, row - 1), (col - 1, row), (col - 1, row + 1), \
                  (col, row - 1), (col, row + 1),
                  (col + 1, row - 1), (col + 1, row), (col + 1, row + 1) ]
    valid = []
    for (c, r) in neighbors:
        if r >= 0 and r < h and c >= 0 and c < w:
            valid.append((c, r))
    return valid

from random import randint, shuffle
current = cropped.pop(0)
counter = 0
while len(cropped) > 0:
    follower = cropped.pop(0)

    # create a bookkeeping image that is all black
    tracker = Image.new('RGB', (wl, hl))
    status = tracker.load()
    source = current.load() # this the image that is getting modified
    target = follower.load() # this the image to which to morph
    
    # pick three pixel positions at random as starting points
    seeds = [ (c , (randint(0, wl - 1), randint(0, hl - 1))) for c in range(3) ]
    # execute three traversals on the image: one per color channel
    pending = [ (c, { s }) for (c, s) in seeds ]
    while True: # until all pixels have been transferred
        # the number of pixels to traverse per iteration depends on the rate
        # computer above
        for (c, q) in pending:
            s = 0
            while s < rate:
                if len(q) == 0:
                    break
                i = randint(0, len(q))
                p = q.pop() 
                (col, row) = p
                if status[col, row][c] == 0: # still unused
                    s += 1 # this counts as progress
                    tracker.putpixel(p, alter(status[col, row], c, 255))
                    # upon traversal, switch the corresponding channel of the source pixel
                    # to that of the target pixel in the current frame
                    current.putpixel(p, alter(source[col, row], c, target[col, row][c]))
                    neighbors = moore(col, row, wl, hl)
                    for np in neighbors:
                        if np not in q: # neighbor not pending yet
                            (nc, nr) = np
                            if status[nc, nr][c] == 0: # neighbor still unused
                                q.add(np) # add it as pending
                        
        # store snapshots of the current state after each iteration
        c = f'{counter}'.zfill(tl)
        current.save(f'frame{c}.png')
        if max([ len(q) for (c, q) in pending ]) == 0: # all are empty
            break # done
        counter += 1
    current = follower

# combine the snapshots into an animated GIF with ImageMagick
