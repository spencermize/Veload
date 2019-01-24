const Handlebars = require('handlebars');
const $ = require("jquery");

//expose a common language
window.$ = $;
window.Handlebars = Handlebars;

//init Veload Core, expose globally
var Veload = require("./build/js/Veload.js");
window.Veload = Veload;

//add to the prototype;
var initialize = require('./build/js/Veload.initialize.js');

//create an instance;
$(function(){
	var V = Veload();	
	V.loadInterface();
	V.loadProfile();
	$(document).on('click','[data-cmd]', function(e){
		let fnc = $(e.target).closest('[data-cmd]').data('cmd');
		console.log(fnc);
		V[fnc]($(e.target));
	});	
	if(window.location.pathname=="/dashboard"){
		V.loadDash();
	}
	window.V = V;
});

