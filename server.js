const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const SerPort = new SerialPort("COM4", { baudRate: 9600 })

const parser = new Readline()
SerPort.pipe(parser)

var fs = require('fs');
var path = require('path')

var currSpeed = 0;
// Open the port
parser.on('data', function(data){
	currSpeed = data;
})

const http = require('http');

const hostname = '127.0.0.1';
const WebPort = 3000;

const server = http.createServer((request, response) => {
  const { method, url } = request;
 // response.end('Current Speed: ' + currSpeed);
  var data = "";
  try {
	if(url.includes("/api/")){
		var req = path.basename(url);
		switch (req) {
			case 'speed' :
				data = currSpeed;
				break;
			default:
				data = "Sorry, operation unsupported";
				break;
		}
		header = "application/json";
	}else{
		var file = url=="/" ? "index.html" : url.replace(/^\/|\/$/g, '');
		data = fs.readFileSync(file, 'utf8');		

		var header = "";
		var ext = path.extname(file);
		
		switch (ext) {
			case '.js': 
				header = "application/javascript";
				break;
			case '.css':
				header = "text/css";
				break;
			default:
				header = "text/html";
		}
	}
	response.setHeader('Content-Type', header);
    response.statusCode = 200;
    response.write(data);    
  }catch(e) {	
	response.statusCode = 404;
  }
  response.end();
});

server.listen(WebPort, hostname, () => {
  console.log(`Server running at http://${hostname}:${WebPort}/`);
});