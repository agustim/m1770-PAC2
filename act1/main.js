const bitwise = require('bitwise')
const BigNumber = require('bignumber.js');

const MAX_DEC = 128

let Ys = []
let Yxs = []

BigNumber.set({ DECIMAL_PLACES: MAX_DEC })
const MAX_RND = BigNumber(2).pow(MAX_DEC) // Max random 10 ^ MAX_DEC

generarYs = function () {
    let arrReturn = []
    for(let x=0; x < MAX_DEC; x++) {
        let tempArr = []
        for( let y=0; y < MAX_DEC; y++) {
            if (x == y) { 
                tempArr.push(0)
            } else {
                tempArr.push(1)
            }
        }
        arrReturn.push(tempArr)
    }
    return arrReturn
}

calculaYxs = function(arrIn){
    let arrReturn = []
    for( let x=0; x < arrIn.length; x++){
        let bwTmp = crypt(arrIn[x])
        arrReturn.push(bwTmp)
    }
    return arrReturn
}

generateRandomHex = function () { // Retorna un BigNumber
    let rnd = BigNumber.random().multipliedBy(MAX_RND).integerValue()
    let sRnd = rnd.toString(16)
    if (sRnd.length % 2 == 1) {
        return "0"+sRnd
    } else {
        return sRnd
    }
}
generateRandomBitwise = function () {
    return bitwise.buffer.read(Buffer.from(generateRandomHex(),'hex'))
}

generaNeutre = function() {
    let arrReturn = []
    for(let x=0; x < MAX_DEC; x ++) {
        arrReturn.push(0)
    }
    return arrReturn
}

crypt = function(bw){
    // Aquesta funció NO és conneguda, però hem de tenir un sistema d'encriptació tal que
    // E(x XOR y) = E(x) XOR E(y)
    // Faig servir un NOT XOR d'una clau aleatoria.
    return bitwise.bits.xnor(bw,key)
}

pconsole = function(strPre, bw) {
    console.log(strPre, bitwise.bits.toString(bw))
}


// Comença el programa
// Definim variables "ocultes"
const key = generateRandomBitwise()
let x = generateRandomBitwise()
let c = crypt(x)
// Mostrem les variables x
pconsole("key =",key)
pconsole("x =",x)
pconsole("c =",c)

// Generem Ys tal que cada bit tingui un 0 i la resta 1.
Ys = generarYs()
// Calculem el seus textos encriptats.
Yxs = calculaYxs(Ys)

// A partir d'aquí només podem fer servir c,Ys,Yxs i la funció xor

bw = bitwise.bits

let myX1 = []
for (let i=0; i < MAX_DEC; i++) {
    let cXORYxs = bitwise.buffer.xor(c,Yxs[i])
//    console.log("Ys[",i,"] =",bw.toString(Ys[i]),"Yxs[",i,"] =",bw.toString(Yxs[i]), "XOR =",bw.toString(cXORYxs))
    myX1.push(bw.toString(cXORYxs).substr(i,1))
}
pconsole("myX =",myX1)

// Validem que X i myX1 son iguals.
// bitwise.bits.reduceOr(bitwise.bits.xor(x,myX1)) -> 0 si x = myX1, 1 si x <> myX1
if (bitwise.bits.reduceOr(bitwise.bits.xor(x,myX1)) == 0) {
    console.log("correcte!")
} else {
    console.log("incorrecte.")
}

// En realitat pot existir un element neutre que seria un x tal que E(x) = 0 
let neutre = crypt(generaNeutre())
let XNeutre = bitwise.buffer.xor(c,neutre)
pconsole("c XOR neture=",XNeutre)

if (bitwise.bits.reduceOr(bitwise.bits.xor(x,XNeutre)) == 0) {
    console.log("correcte!")
} else {
    console.log("incorrecte.")
}