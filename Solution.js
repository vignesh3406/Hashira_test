const fs = require('fs');

// Read the file - make sure this filename is EXACTLY right
const input = fs.readFileSync('testcase2.json', 'utf8');
const data = JSON.parse(input);

const k = data.keys.k;
let points = [];

// Instead of a loop that might skip keys, we look for them specifically
// Your JSON has keys "1" through "10"
for (let i = 1; i <= 15; i++) {
    if (data[i]) {
        let x = BigInt(i);
        let base = BigInt(data[i].base);
        let valueStr = data[i].value;

        // Perfect BigInt decoding
        let y = 0n;
        for (let char of valueStr) {
            let digit = BigInt(parseInt(char, 36)); 
            y = y * base + digit;
        }
        points.push({ x, y });
    }
}

// 1. Sort numerically
points.sort((a, b) => (a.x < b.x ? -1 : 1));

// 2. Select exactly the first k points
const subPoints = points.slice(0, k);

// 3. Lagrange Math
let secret = 0n;
for (let i = 0; i < k; i++) {
    let xi = subPoints[i].x;
    let yi = subPoints[i].y;
    let num = 1n;
    let den = 1n;
    for (let j = 0; j < k; j++) {
        if (i !== j) {
            let xj = subPoints[j].x;
            num *= (0n - xj);
            den *= (xi - xj);
        }
    }
    secret += (yi * num) / den;
}

console.log(secret.toString());