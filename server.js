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

const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'))

app.get('/',(req, res) => {
	res.sendFile('index.html');
});
app.get('/api/:action',function(req,res,next){
	let data = "";
	switch (req.params.action) {
		case 'speed' :
			data = currSpeed;
			break;
		default:
			data = "Sorry, operation unsupported";
			break;
	}
	res.json({"speed":data});
});
app.listen(port, () => {
  console.log(`Server listenening on ${port}`);
});