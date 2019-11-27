from math import factorial                                                                                            
def binom(n, k):                                                                                                      
    value = 1                                                                                                         
    for factor in range(max(k, n - k) + 1, n + 1):                                                                    
        value *= factor                                                                                               
    return value // factorial(min(k, n - k))                                                                          
                                                                                                                      
assert binom(10, 2) == factorial(10) // (factorial(10 - 2) * factorial(2))                                                   
