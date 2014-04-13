var net = require('net');

var client_ctr = 0;

var server = net.createServer(function(socket) { //socket here is become real socket
	client_ctr++;
	console.log("@Server: Connected! Client no: ", + client_ctr);
	socket.write("@Server-> Client: Connect successfully to server \r\n");
	
	socket.on('data',function(clientCmd) {
		var strCmd = clientCmd.toString().trim();
		
		if (strCmd === "disconnect") {
			console.log("@Server: Disconnect cmd received!");
			socket.write("@Server->Client: Have a nice day!");
			socket.destroy();
			client_ctr--;
		}
		
		else if (strCmd === "server address") {
			console.log("@Server: Request address received!");
			var serverAddress = socket.address();
			socket.write("@Server->Client: address: " +serverAddress.address + " port: "+ serverAddress.port); 
		}
		 else if (strCmd.match(/add\(/i)) {
            var vals = strCmd.split(/,|\(|\)/);
            var val1 = parseInt(vals[1]);
            var val2 = parseInt(vals[2]);
            if(testInts(val1,val2))
                socket.write('Result: ' + (val1+val2) + '\n');
            else sendIntError(socket);
        }
        else if (strCmd.match(/subtract\(/i)) {
            var vals = strCmd.split(/,|\(|\)/);
            var val1 = parseInt(vals[1]);
            var val2 = parseInt(vals[2]);
            if(testInts(val1,val2))
                socket.write('Result: ' + (val1-val2) + '\n');
            else sendIntError(socket);
        }
        else if (strCmd.match(/multiply\(/i)) {
            var vals = strCmd.split(/,|\(|\)/);
            var val1 = parseInt(vals[1]);
            var val2 = parseInt(vals[2]);
            if(testInts(val1,val2))
                socket.write('Result: ' + (val1*val2) + '\n');
            else sendIntError(socket);
        }
        else if (strCmd.match(/divide\(/i)) {
            var vals = strCmd.split(/,|\(|\)/);
            var val1 = parseInt(vals[1]);
            var val2 = parseInt(vals[2]);
            if(testInts(val1,val2))
                socket.write('Result: ' + (val1/val2) + '\n');
            else sendIntError(socket);
        }
		else {
			socket.write("@Server->Client: Not a valid command!");
		}
	});
	//socket.pipe(socket);
});

    function testInts(val1, val2) {
        if(!isInt(val1) || !isInt(val2)) return false;
        return true;
    }
	
    // test whether a value is an integer
    function isInt(val){
      // parse value for int and float will be the same if the value is actually an int
      if((parseFloat(val) == parseInt(val)) && !isNaN(val)){
        return true;
      } else { 
        return false;
      } 
    }
	
server.listen(8282,"127.0.0.1");
