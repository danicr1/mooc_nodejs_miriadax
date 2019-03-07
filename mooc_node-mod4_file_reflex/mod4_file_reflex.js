/* eslint-disable */
// Imports user module mod4-quote_of_the_day.js
let my_mod = require("./mod4_quote_of_the_day");

let fs = require("fs");   // Imports file system module

console.log();
my_mod.quote_of_the_day();


let delay = ((Math.ceil(Math.random() * 5)) * 1000).toFixed(0);
setTimeout(reflexes, delay);


function reflexes() {
    console.log("\nPress return:");
    let start = new Date().getTime(); //Instante inicial

    process.stdin.setEncoding('utf8');
    process.stdin.on('data', line => {
        let time = new Date().getTime() - start;
        console.log(`Your time: ${time}ms`);
        process.exit();
    });
};

