#!/usr/bin/env python3
"""Factorització de N, Activita 3 - Agustí Moll"""

import argparse
import datetime
import time
from decimal import *

def arrelQuadrada(num):
    # L'Arrel qudarda i ens quedem amb la part decimal.
    sqrt = Decimal(num).sqrt().quantize(Decimal(1), ROUND_DOWN)
    # Si l'arrel qudardada és parell li restem 1 pq sigui inparell.
    if sqrt%2 == 0 :
        sqrt = sqrt - 1
    return sqrt

def findP(num,pInicial):
    max_iteration = 100000000
    iteration = 0
    while (num % pInicial != 0) and (iteration  < max_iteration) :
        pInicial = Decimal(pInicial - 2)
        iteration = iteration + 1
    if ( max_iteration == iteration):
        print("ERROR: s'han fet",max_iteration,"iteracions!")
        return
    return(pInicial)

def factoriza(num):
    sqrn = arrelQuadrada(num)
    # Busquem p
    p = findP(num,sqrn)
    # Per tant q = num/p
    q = Decimal(num/p)
    return p, q

def main():
    argparser = argparse.ArgumentParser(description=__doc__)
    argparser.add_argument(
        'N',
        help='número a facturitzar.',
        type=int,
    )
    args = argparser.parse_args()
    tstart = time.perf_counter()
    # n = Decimal(123459259296296790129629703704567911111222220989329646370537655992609296463211544461111289984805767)
    n = Decimal(args.N)
    print('factoració de n: ',n)
    getcontext().prec = 100
    p,q = factoriza(n)

    print("p = ",p)
    print("q = ",q)

    tend = time.perf_counter()
    tsec = int(tend - tstart)
    print("Temps de computació:", datetime.timedelta(seconds=tsec))

if __name__ == '__main__':
    main()
