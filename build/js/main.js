var DEBUG = true;
if(!DEBUG){
    if(!window.console) window.console = {};
    var methods = ["log", "debug", "warn", "info"];
    for(var i=0;i<methods.length;i++){
        console[methods[i]] = function(){};
    }
}

//init Veload Core, expose globally
import {Options} from './modules/Options.js';
import {Veload} from './modules/Veload.js';
import {HomePage} from './modules/HomePage.js';
import HandlebarsHelpers from './modules/HandlebarsHelpers.js';
import {updatePhoto} from './modules/PhotoRefresher.js';
import {SettingsPane} from './modules/SettingsPane.js';

window.Veload = Veload;

//create an instance;
$(function(){
	var V = new Veload(Options);	
	window.V = V;	

	var initialize = require('./modules/Veload.initialize.js');

	updatePhoto();

	if(window.location.pathname=="/" || window.location.pathname=="/about"){
		HomePage();
		$("body").removeClass("loading");
	}else{
		V.SettingsPane = SettingsPane;
		V.loadInterface();
		V.loadProfile();
	}

	
	$(document).on('click','[data-cmd]', function(e){
		let fnc = $(e.target).closest('[data-cmd]').data('cmd');
		console.log(fnc);
		if(V[fnc]){
			V[fnc]($(e.target));
		}else if(fnc){
			console.log("couldn't find fnc");
		}

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

