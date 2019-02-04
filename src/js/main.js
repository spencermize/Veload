var DEBUG = true;
if(!DEBUG){
    if(!window.console) window.console = {};
    var methods = ["log", "debug", "warn", "info"];
    for(var i=0;i<methods.length;i++){
        console[methods[i]] = function(){};
    }
}


import _ from 'lodash';
window._ = _;

//init Veload Core
import {Options} from './modules/Options.js';
import {Veload} from './modules/Veload.js';
import {HomePage} from './modules/HomePage.js';
import './modules/HandlebarsHelpers.js';
import {LocalPoller} from './modules/LocalPoller.js';
import {updatePhoto} from './modules/PhotoRefresher.js';
import {SettingsPane} from './modules/SettingsPane.js';
import {ConnectionStatus} from './modules/ConnectionStatus.js';
import {DataListeners} from './modules/DataListeners.js';

window.Veload = Veload;

//create an instance;
$(function(){
	var V = new Veload(Options);	
	window.V = V;	
	V.poller = LocalPoller;
	V.poller.handleEvents();
	require('./modules/Modals.js');	
	require('./modules/Veload.initialize.js');

	DataListeners();
	if(window.location.pathname=="/" || window.location.pathname=="/about"){
		HomePage();
		$("body").removeClass("loading");
	}else{
		V.SettingsPane = SettingsPane;
		V.loadInterface();
		V.loadProfile();
		ConnectionStatus();
	}
	updatePhoto();
});

