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
    // E(x XOR y) = E(x) XOR E(y) i 
    // Com que és una funció simetrica 
    // crypt(crypt(x)) = x
    // Faig servir un NOT XOR d'una clau aleatoria.
    //return bitwise.bits.xnor(bw,key)
    const halfsize = MAX_DEC /2
    b = bitwise.bits
    return b.xnor(bw,key)
}

pconsole = function(strPre, bw) {
    console.log(strPre, bitwise.bits.toString(bw))
}


bwb = bitwise.bits
bwf = bitwise.buffer
// Comença el programa
// Definim variables "ocultes"
const key = generateRandomBitwise()
let x = generateRandomBitwise()
let c = crypt(x)
// Mostrem les variables x
pconsole("key =",key)
pconsole("x =",x)
pconsole("c = E(x) =",c)

// Test 
let tittle_test
title_test = "Protocol simètric => crypt(crypt(x))=x"
let t1_x1 = generateRandomBitwise()
let t1_EEx1 = crypt(crypt(t1_x1))
if (bwb.reduceOr(bwb.xor(t1_x1,t1_EEx1)) != 0) {
    console.log("Error on",title_test,"(debug):")
    pconsole("x1=",t1_x1)
    pconsole("crypt(crypt(x1))=",t1_EEx1)
} else {
    console.log(title_test,"ok")
}
title_test = "Propietat Distributiva de Ek i xor => Ek(x1 xor x2) = Ek(x1) xor Ek(x2)"
let t2_x1 = generateRandomBitwise()
let t2_x2 = generateRandomBitwise()
let t2_Ex1 = crypt(t2_x1)
let t2_Ex2 = crypt(t2_x2)
let t2_Ex1xorEx2 = bwf.xor(t2_Ex1,t2_Ex2)
let t2_Ex1xorx2 = crypt(bwf.xor(t2_x1,t2_x2))
if (bwb.reduceOr(bwb.xor(t2_Ex1xorEx2,t2_Ex1xorx2)) == 0) {
    console.log("Error on",title_test,"(debug):")
    pconsole("x1 =",t2_x1)
    pconsole("x2 =",t2_x2)
    pconsole("Ex1 =",t2_Ex1)
    pconsole("Ex2 =",t2_Ex2)
    pconsole("Ex1xorEx2 =",t2_Ex1xorEx2)
    pconsole("Ex1xorx2 =",t2_Ex1xorx2)
} else {
    console.log(title_test,"ok")
}
// Generem Ys tal que cada bit tingui un 0 i la resta 1.
Ys = generarYs()
// Calculem el seus textos encriptats.
Yxs = calculaYxs(Ys)

// A partir d'aquí només podem fer servir c,Ys,Yxs i la funció xor


let myX1 = []
for (let i=0; i < MAX_DEC; i++) {
    let cXORYxs = bwf.xor(c,Yxs[i])
    console.log("Ys[",i,"] =",bwb.toString(Ys[i]),"Yxs[",i,"] =",bwb.toString(Yxs[i]), "XOR",bwb.toString(c),"=",bwb.toString(cXORYxs))
    myX1.push(bwb.toString(cXORYxs).substr(i,1))
}
pconsole("myX =",myX1)

// Validem que X i myX1 son iguals.
// bwb.reduceOr(bwb.xor(x,myX1)) -> 0 si x = myX1, 1 si x <> myX1
if (bwb.reduceOr(bwb.xor(x,myX1)) == 0) {
    console.log("correcte!")
} else {
    console.log("incorrecte.")
}

// En realitat pot existir un element neutre que seria un x tal que E(x) = 0 
let neutre = generaNeutre()
pconsole("neutre =",neutre)
let Eneutre =crypt( neutre)
pconsole("Eneutre =",Eneutre)
let XNeutre = bwf.xor(c,Eneutre)
pconsole("c XOR Eneture=",XNeutre)

if (bwb.reduceOr(bwb.xor(x,XNeutre)) == 0) {
    console.log("correcte!")
} else {
    console.log("incorrecte.")
}