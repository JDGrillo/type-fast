/*
const fs = require('fs')

module.exports = function getRandomLine(){
    fs.readFile("words.txt", "utf8", function(err, data){
      if(err) throw err;
      let lines = data.split('\n');
      document.querySelector("word").innerHTML = (lines[Math.floor(Math.random()*lines.length)]);
   })
  }
*/
module.exports = {
    sayHi() {
      console.log("hello")
    }
  }