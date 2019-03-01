//init logging
import { Rollbar } from './modules/Rollbar.js';

import './modules/HandlebarsHelpers.js';

var V = null;

if (window.location.hostname == 'veload.bike'){
	Rollbar();
}

$(async function(){
	if (window.location.pathname == '/dashboard'){
		V = await import('./modules/Veload.js');
		await import('./modules/LocalPoller.js');
		await import('./modules/SettingsPane.js');
		await import('./modules/DataListeners.js');

		let goals = await import('./modules/Goals.js');
		let ride = await import('./modules/RideListeners.js');
		let conn = await import('./modules/ConnectionStatus.js');

		goals.Goals();
		ride.RideListeners();
		conn.ConnectionStatus();

		V.loadInterface();
		V.loadProfile();
	} else {
		import('./modules/DownloadLink.js');
		import('./modules/Weather.js');
		$('body').removeClass('loading');
	}
	import('./modules/PhotoRefresher.js');
});
