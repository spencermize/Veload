var DEBUG = true;
if(!DEBUG){
    if(!window.console) window.console = {};
    var methods = ["log", "debug", "warn", "info"];
    for(var i=0;i<methods.length;i++){
        console[methods[i]] = function(){};
    }
}

//init Veload Core, expose globally
import {Veload} from './build/js/Veload.js';
window.Veload = Veload;

//add to the prototype;
var initialize = require('./build/js/Veload.initialize.js');

//create an instance;
$(function(){
	var V = Veload();	
	window.V = V;	
	V.loadInterface();
	V.loadProfile();
	$(document).on('click','[data-cmd]', function(e){
		let fnc = $(e.target).closest('[data-cmd]').data('cmd');
		console.log(fnc);
		V[fnc]($(e.target));
	});
	$(document).on('blur','[data-update]',function(e){
		var el = $(e.target).closest('[data-update]');
		var fnc = el.data('update');
		var host = fnc.split(".")[0];
		var path = fnc.split(".")[1];
		console.log(fnc);
		el.parent().loader(36,36).find(".spin").css({right: "5px", top:"1px"});
		console.log(V);
		$.post(V[host][path],function(data){
			el.removeClass("is-invalid").addClass("is-valid").parent().find(".spin").remove();
			setTimeout(function(){
				el.removeClass("is-valid");
			},3000)
		}).fail(function(e){
			el.addClass("is-invalid").parent().find(".spin").remove();;
		});
	});
});

