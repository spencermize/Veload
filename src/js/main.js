//init logging
import { Rollbar } from './modules/Rollbar.js';

import { V } from './modules/Veload.js';

import { Goals } from './modules/Goals.js';
import { HomePage } from './modules/HomePage.js';
import './modules/HandlebarsHelpers.js';
import { LocalPoller } from './modules/LocalPoller.js';
import { updatePhoto } from './modules/PhotoRefresher.js';
import { ConnectionStatus } from './modules/ConnectionStatus.js';
import { DataListeners } from './modules/DataListeners.js';
import './modules/SettingsPane.js';
import { RideListeners } from './modules/RideListeners.js';

Rollbar();

$(function(){
	V.poller = LocalPoller;
	V.poller.handleEvents();

	DataListeners();
	if (window.location.pathname == '/' || window.location.pathname == '/about'){
		HomePage();
		$('body').removeClass('loading');
	} else {
		Goals();
		RideListeners();
		V.loadInterface();
		V.loadProfile();
		ConnectionStatus();
	}
	updatePhoto();
});
