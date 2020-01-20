const fs = require('fs')

module.exports = function getRandomLine(filename){
    fs.readFile(filename, "utf8", function(err, data){
      if(err) throw err;
      let lines = data.split('\n');
      console.log(lines[Math.floor(Math.random()*lines.length)]);
   })
  }
