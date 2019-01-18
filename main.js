const Handlebars = require('handlebars');
const $ = require("jquery");
const Veload = require("./Veload.js");

$(function(){
	Veload.loadInterface();
	Veload.loadProfile();
	$(document).on('click','button[data-cmd]', function(e){
		let fnc = $(e.target).closest('button[data-cmd]').data('cmd');
		console.log(fnc);
		Veload[fnc]($(e.target));
	});	
	if(window.location.pathname=="/dashboard"){
		Veload.loadDash();
	}
});