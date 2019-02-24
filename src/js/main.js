import _ from 'lodash';

//init logging
import {Rollbar} from './modules/Rollbar.js';
Rollbar();

//init Veload Core
import {Options} from './modules/Options.js';
import {Veload} from './modules/Veload.js';

window.Veload = Veload;
var V = new Veload(Options);	
window.V = V;

import {Goals} from './modules/Goals.js';
import {HomePage} from './modules/HomePage.js';
import './modules/HandlebarsHelpers.js';
import {LocalPoller} from './modules/LocalPoller.js';
import {updatePhoto} from './modules/PhotoRefresher.js';
import {ConnectionStatus} from './modules/ConnectionStatus.js';
import {DataListeners} from './modules/DataListeners.js';
import {SettingsPane} from './modules/SettingsPane.js';
import {Grid} from './modules/Grid.js';

import {Modals} from './modules/Modals.js';
import {RideListeners} from './modules/RideListeners.js';
import {Initialize} from './modules/Veload.initialize.js';

$(function(){
	V.poller = LocalPoller;
	V.poller.handleEvents();

	DataListeners();
	if(window.location.pathname=="/" || window.location.pathname=="/about"){
		HomePage();
		$("body").removeClass("loading");
	}else{
		Grid();
		Modals();
		RideListeners();		
		Initialize();
		V.loadInterface();
		V.loadProfile();
		V.Goals = new Goals();
		V.SettingsPane = new SettingsPane();
		ConnectionStatus();
	}
	updatePhoto();
});

