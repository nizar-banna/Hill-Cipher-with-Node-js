// import math from 'mathjs';
// import pad from 'array-pad';
// import dictionary from './dictionary.js';
const decodingDict = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
    "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
     "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
     "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    ".", "?", " ",
    "!", "-"
];
var encodingDict={};

decodingDict.forEach(function(value, index) {
    encodingDict[value] = index;
});

const modulo = decodingDict.length;
// function pad(augment, array, length, value) {
//     var total
//       , method;
//     // augment is optional
//     if (typeof arguments[0] !== 'boolean') {
//       value = length;
//       length = array;
//       array = augment;
//       augment = false;
//     }
  
//     if (!Array.isArray(array)) {
//       throw new TypeError('must be an array');
//     }
  
//     array = (augment) ? array : array.slice(0);
//     method = (length < 0) ? 'unshift' : 'push';
//     total = Math.abs(length);
  
//     if (typeof length !== 'number' || (total % 1) !== 0) {
//       throw new TypeError('length must be an integer');
//     }
  
//     while (array.length < total) {
//       array[method](value);
//     }
  
//     return  ;
//   };
  
var text = "Over 60 million people came to New York City last year, but this downtown yoga class offers a quiet place to go with the flow....with cats. ";
var  text = "hello";
var pad = function(arr,len,fill) {
    return arr.concat(Array(len).fill(fill)).slice(0,len);
  }

// readFiles(['hello.txt', 'world.txt'], 'utf8', (err, contents) => {
//   if (err) {
//     throw err;
//   }
//
//   console.log(contents);
// });

function adjugate(matrix) {
    var det = math.det(matrix);

    return math.chain(matrix).inv().map(function(val) {
        return (math.round(val * det));
    }).done();

}

function createEncodingKey(n, max) {
    var det = 0;
    var encodingKey
    while (det === 0) {
        encodingKey = math.random([n, n], 1, max);
        encodingKey = math.map(encodingKey, function(val) {
            return math.round(val);
        });
        det = math.det(encodingKey);

        if(det<0){
            console.log("det is less than 0");
        }
    }

    return math.matrix(encodingKey);
}
// console.log(createEncodingKey(3,2000))

function createDecodingKey(encodingKey) {
    var det = Math.ceil(math.det(encodingKey));
    console.log(modulo,""+"det::"+det);
    
    var detInv = math.xgcd(det, modulo).toArray()[1];
    console.log(modulo,""+"det::"+det);
    var decodingKey = math.map(adjugate(encodingKey), function(val) {
        return math.mod((detInv * val), modulo);
    });
    return decodingKey;
}

function generateKeyPair(n = 3, max = 2000) {
    var clearText = "abcdefghijklmnopqrstuvwxyz .?";
    var key;
    var genText;

    while (clearText.localeCompare(genText) !== 0) {
        key = createEncodingKey(n, max);
        console.log("key enc:"+key);            
        genText = code(createDecodingKey(key), code(key, clearText));
    }
    return key;
}

function code(key, text) {
    var block = math.size(key)._data[0];
    console.log("block"+block);    
    //filter text for anything that can be coded
    text = text.match(/[A-Z .?a-z0-9!-]/gi);
    console.log("After lower"+text);
    //padding, if required
    text = math.mod(text.length, block) == 0 ? text : pad(text, text.length + block - math.mod(text.length, block), " ");
    console.log("after padding:"+text);
    //chunking
    text = math.matrix(math.reshape(text, [block, text.length / block]));
    console.log("reshape"+text);
    
    //converting text to numbers
    var codedText = math.map(text, function(val) {
        return encodingDict[val];
    });

    //encoding
    codedText = math.chain(key).multiply(codedText).mod(modulo).map(function(val) {
        return decodingDict[val];
    }).done();

    //turning back into string
    codedText = math.flatten(codedText).toArray().join("").trim();

    return codedText;
}



key2 = generateKeyPair();
var t ='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';
console.log("image:"+code(key2, t));
console.log(code(createDecodingKey(key2), code(key2, text)));


