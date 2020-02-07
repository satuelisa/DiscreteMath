def gray(b): # with only two integer variables needed as storage
    x = 0
    for i in range(1 << b):
        for j in range(b):
            if (i + (1 << j)) % (1 << (j + 1)) == 0:
                x ^= 1 << j
        yield x

def unrank(i, b): 
    x = 0
    for j in range(b):
        if ((i + (1 << j)) // (1 << (j + 1))) % 2 == 1:
            x ^= 1 << j
    return x

def rank(x, b):
    i = 0
    z = False 
    for k in range(0, b):
        j = b - k - 1
        if x & (1 << j) > 0: # bit on
            if not z: # not using zeroes
                i |= (1 << j)
                z = True
            else: # bit on but goes unused
                z = False
        elif z: # bit off and using zeroes
            i |= (1 << j)            
    return i

def bruteforce(b): # using lists of strings 
    code = [''] # make the initial code
    while len(code[0]) < b: # copy, mirror, and prefix
        code = ['0' + c for c in code] + ['1' + c for c in code[::-1]]
    return code

from sys import argv
b = int(argv[1]) # desired code-word length 
bf = '0{:d}b'.format(b) # fixed-width binary format
code = bruteforce(b) 
i = 0 # counter
for x in gray(b):
    print('{:s}\t{:d}\t{:d}'.format(format(x, bf), x, i)) # output    
    assert x == unrank(i, b) 
    assert x == int(code.pop(0), 2) # string as binary
    assert i == rank(x, b) 
    i += 1 # udpate
