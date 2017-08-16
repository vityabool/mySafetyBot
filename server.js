var server = require('http');
var port = process.env.port || 1010;

server.createServer(function(req,res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end("Hello World from server!");
    console.log('Got request!');
}).listen(port);

console.log('server running');
