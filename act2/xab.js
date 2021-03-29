/*

Cripto sistema - Crear claus:
 
1. Crear 2 enters aleatoris a, b

2. calcular M  = ab - 1

3. Crear 2 enters aleatoris a', b'

4. Calcular e, d i n
    e = a'·M + a
    d = b'·M + b
    n = (e*d - 1) / M

5. Calular claus pk = ( n, e) i sk = (d[, n])

Encript

Epk(m) = m*e mod n


Descript 
Dsk(c) = c*d mod n


*/
const BigNumber = require('bignumber.js');

const MAX_DEC = 2

BigNumber.set({ DECIMAL_PLACES: MAX_DEC })
const MAX_RND = BigNumber(10).pow(MAX_DEC) // Max random 10 ^ MAX_DEC
const ℕ = true


aleatorEnter = function (max) { // Retorna un BigNumber
    let rnd = BigNumber.random().multipliedBy(max).integerValue()
    if (ℕ) {
        return rnd
    }
    // Aquí tenim un numero N el convertim en Z fent que dividim per 2 els imparella son els negatius i parells positius.
    if ( rnd.mod(2) == 1 ) {
        return rnd.idiv(2).times(-1)
    } else {
        return rnd.idiv(2)
    } 
}


calculateKeys = function () {
    cs = {}

    cs.a =  aleatorEnter(MAX_RND)
    cs.b =  aleatorEnter(MAX_RND)
    cs.a2 = aleatorEnter(MAX_RND)
    cs.b2 = aleatorEnter(MAX_RND)

    cs.M = cs.a.multipliedBy(cs.b).minus(1)
    cs.e = cs.a2.multipliedBy(cs.M).plus(cs.a)
    cs.d = cs.b2.multipliedBy(cs.M).plus(cs.b)
    cs.n = (cs.e.multipliedBy(cs.d).minus(1)).div(cs.M)

    cs.pk = {k : cs.e, n : cs.n}
    cs.sk = {k : cs.d, n: cs.n}


    return cs
}


enc = function (pk, m) {
    return  m.multipliedBy(pk.k).mod(pk.n)
}

dec = function (sk, e) {
    return e.multipliedBy(sk.k).mod(sk.n)
}

toPrintCS = function(cs) {
    console.log("cs.a =", cs.a.toFixed())
    console.log("cs.b =", cs.b.toFixed())
    console.log("cs.a2 =", cs.a2.toFixed())
    console.log("cs.b2 =", cs.b2.toFixed())
    console.log("cs.M =", cs.M.toFixed())
    console.log("cs.e =", cs.e.toFixed())
    console.log("cs.d =", cs.d.toFixed())
    console.log("cs.n =", cs.n.toFixed())

}


cryptoSystem = calculateKeys()
toPrintCS(cryptoSystem)
console.log("ed mod n = ", cryptoSystem.e.multipliedBy(cryptoSystem.d).mod(cryptoSystem.n).toFixed())

missatge = aleatorEnter(MAX_RND)
console.log("missatge =",missatge.toFixed())

mencrypt = enc(cryptoSystem.pk, missatge)
console.log("encriptat =",mencrypt.toFixed())

// És el màxim fake que pots fer n-1 / missatge,
// Donat que si missatge > n la formula de desencriptar e
let maxfake = cryptoSystem.n.minus(1).idiv(missatge)
console.log("n/m =",maxfake.toFixed())

fakeme = mencrypt.multipliedBy(maxfake)
fakeme = aleatorEnter(MAX_RND)
console.log("fakeme =",fakeme.toFixed())

mdecrypt = dec(cryptoSystem.sk, mencrypt)
console.log("desencriptat =",mdecrypt.toFixed())

console.log("decript fake(",maxfake.toFixed(),") =",dec(cryptoSystem.sk, fakeme).toFixed())
console.log("max_fake = ", dec(cryptoSystem.sk, fakeme).div(maxfake).toFixed())

if (missatge.eq(mdecrypt)) {
    console.log("Correcte!")
} else {
    console.log("Incorrecte!")
}
