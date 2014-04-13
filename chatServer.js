var http = require('http')
, url = require('url')
, fs = require('fs')
, server;

server = http.createServer(function(req,res) {
	var path = url.parse(req.url).pathname;
	
	//console.log(path);
	switch(path) {
		
		case '/':
			fs.readFile(__dirname + '/chatClient.html', function(err, data){
	    	if (err) return send404(res);
	        	res.writeHead(200, {'Content-Type': 'text/html'})
	            res.write(data, 'utf8');
	            res.end();
	     });
		 break;
		 
		
		default: send404(res);
	}
	
	
});

send404 = function(res){
    res.writeHead(404);
    res.write('404');
    res.end();
};

server.listen(8282, "127.0.0.1");
console.log('Server is running at http://127.0.0.1:8282');

var io = require('socket.io').listen(server);

var connectedCients = [];

var isUserExists = function(arrUsernames, username) {
	var  i = 0;
	for (; i < arrUsernames.length;i++) {
		if (username === arrUsernames[i].username)
			return true;
	}
	return false;
}

var getUsernameIndex = function(arrUsernames, socketid) {
	var  i = 0;
	for (; i < arrUsernames.length;i++) {
		if (socketid === arrUsernames[i].socketId)
			return i;
	}
	return -1;
}

var getSocketId = function(arrUsernames, username) {
	var  i = 0;
	for (; i < arrUsernames.length;i++) {
		if (username === arrUsernames[i].username)
			return arrUsernames[i].socketId;
	}
	return -1;
}

io.sockets.on('connection', function(socket) {
	
	//usernameRequest = {username:'hien1'} 
	socket.on('username', function(usernameRequest) { 
		console.log("Client with username:" + usernameRequest.username + " trying to connect...");
		if (isUserExists(connectedCients, usernameRequest.username)) {
			socket.emit('disconnect', {message: 'DisConnected from server: Username already exists!'});
			socket.disconnect();
			 //{name:"disconnect", args:[{message: '...'}];
		}
		else {
			socket.emit('accpetUsername',{ message: 'From server: Connected to Server!' });
			connectedCients.push({
				username:usernameRequest.username,
				socketId:socket.id
			});
			console.log("Connection to " + usernameRequest.username + " " + socket.id + " accepted!");
		}
	});
	
	socket.on('disconnect', function() {
		var removeUserIndex = getUsernameIndex(connectedCients,socket.id);
		
		//console.log(connectedCients);
		//console.log(removeUserIndex);
		
		if (removeUserIndex > -1 ) {
			//console.log(removeUserIndex);
			connectedCients.splice(removeUserIndex,1);
		}
		console.log("Connection " + socket.id + " terminated!");
	});
	
	socket.on('privateMsg',function(data) {
		// get who to who
		var from = data.from; //original username
		var to = data.to;     //to username
		var message = data.message;
		
		var toSocket = getSocketId(connectedCients,to);
		io.sockets.socket(toSocket).emit('privateMsg', {
			from:from,				
			to: to,
			message: message
		});
		
		//forward message
		
	});
});