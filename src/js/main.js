//init logging
import { Rollbar } from './modules/Rollbar.js';

import { V } from './modules/Veload.js';

import './modules/HandlebarsHelpers.js';
import { updatePhoto } from './modules/PhotoRefresher.js';
import { DataListeners } from './modules/DataListeners.js';

Rollbar();

$(async function(){
	let poll = await import('./modules/LocalPoller.js');
	V.poller = poll.LocalPoller;
	V.poller.handleEvents();

	DataListeners();
	if (window.location.pathname == '/' || window.location.pathname == '/about'){
		let home = await import('./modules/HomePage.js');
		home.HomePage();
		$('body').removeClass('loading');
	} else {
		let goals = await import('./modules/Goals.js');
		let ride = await import('./modules/RideListeners.js');
		let conn = await import('./modules/ConnectionStatus.js');	
		await import('./modules/SettingsPane.js');					
		goals.Goals();
		ride.RideListeners();
		conn.ConnectionStatus();

		V.loadInterface();
		V.loadProfile();

	}
	updatePhoto();
});
