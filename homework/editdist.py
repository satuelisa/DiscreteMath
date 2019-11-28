def editdist(p, q, ce = 1, ci = 1, cr = 1):
    d = dict()
    np = len(p) + 1
    nq = len(q) + 1
    for i in range(np):
        d[(i, 0)] = i * ci
    for j in range(nq):
        d[(0, j)] = j * ce
    for i in range(1, np):
        for j in range(1, nq):
            eli = d[(i - 1, j)] + ce
            ins = d[(i, j - 1)] + ci
            ree = d[(i - 1, j - 1)] + cr * (p[i - 1] != q[j - 1])
            d[(i, j)] = min(eli, ins, ree)
    return d[(np -1, nq - 1)]
 
print(editdist("esfuerzo", "esperanza"))
