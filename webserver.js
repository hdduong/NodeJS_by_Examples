var http = require('http')
, url = require('url')
, fs = require('fs')
, server;

server = http.createServer(function(req,res) {
	var path = url.parse(req.url).pathname;
	
	//console.log(path);
	switch(path) {
	
		case '/test':
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.write('It works!\n');
			res.end(); 
		break;
		
		case '/':
			fs.readFile(__dirname + '/index.html', function(err, data){
	    	if (err) return send404(res);
	        	res.writeHead(200, {'Content-Type': 'text/html'})
	            res.write(data, 'utf8');
	            res.end();
	     });
		 break;
		 
		case '/twitter':
		fs.readFile(__dirname + '/twitter.html', function(err, data){
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

server.listen(8282);