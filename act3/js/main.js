const BigNumber = require('bignumber.js');

const MAX_DEC = 100

BigNumber.set({ DECIMAL_PLACES: MAX_DEC })
const MAX_RND = BigNumber(10).pow(MAX_DEC) // Max random 10 ^ MAX_DEC

BigNumber.prototype.factoritzar = function () {
    max_iteration = BigNumber(100000)
    iteration = BigNumber(0)

    // Arrel quadrada 
    sqrn = this.sqrt().integerValue()
    if (sqrn % 2 == 0)
        sqrn = sqrn.minus(1)
    // Busca el primer imparell que sigui divisible per el numero que volem factorizar
    for(; !this.mod(sqrn).eq(0) && iteration.lt(max_iteration); sqrn = sqrn.minus(2)){
        iteration = iteration.plus(1)
    }
    // Error no em trobat cap divisible aprop...
    if ( iteration.eq(max_iteration) ) {
        console.log("max iterations")
        return null
    } 
    return { p: sqrn, q: this.div(sqrn)}
}

n = BigNumber('123459259296296790129629703704567911111222220989329646370537655992609296463211544461111289984805767')
console.log("n = ",n.toFixed())
factor = n.factoritzar()
console.log("p = ",factor.p.toFixed())
console.log("q = ",factor.q.toFixed())



