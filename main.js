const Handlebars = require('handlebars');
const $ = require("jquery");

//expose a common language
window.$ = $;
window.Handlebars = Handlebars;

var Veload = require("./Veload.js");
var V = Veload();

window.Veload = Veload;

$(function(){
	V.loadInterface();
	V.loadProfile();
	$(document).on('click','button[data-cmd]', function(e){
		let fnc = $(e.target).closest('button[data-cmd]').data('cmd');
		console.log(fnc);
		V[fnc]($(e.target));
	});	
	if(window.location.pathname=="/dashboard"){
		V.loadDash();
	}
	window.V = V;
});

