def xor(a, b): # +                                                                                                       
  return (a or b) and not (a and b)

def impl(a, b):	# ->                                                                                                     
    return (not a) or b

def equi(a, b):	# <->                                                                                                    
    return impl(a, b) and impl(b, a)

from random import random
for a in [True, False]:
    for b in [True, False]:
        print(f'{a} + {b} = {xor(a, b)}')
        print(f'{a} -> {b} = {xor(a, b)}')
        print(f'{a} <-> {b} = {xor(a, b)}')
