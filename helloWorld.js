var rl = require('readline');

var strInterface = rl.createInterface(process.stdin,process.stdout,null);

strInterface.question("What is your name?", function(answer) {
	console.log("Hello ," + answer + " !");
	process.stdin.destroy();
});

// console.log("Hello World!");