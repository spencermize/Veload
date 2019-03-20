import V from './modules/Veload.js';

$(async function(){
	if (window.location.hostname == 'veload.bike'){
		//init logging
		var Rollbar = await import('./modules/Rollbar.js');
		Rollbar();
	}
});

$(async function(){
	import('./modules/PhotoRefresher.js');
	if (window.location.pathname == '/dashboard'){
		await import('./modules/LocalPoller.js');
		await import('./modules/SettingsPane.js');
		await import('./modules/DataListeners.js');
		await import('./modules/Goals.js');
		await import('./modules/RideListeners.js');
		await import('./modules/RideControls.js');
		await import('./modules/ConnectionStatus.js');
		await import('./modules/Charts.js');
		await import('./modules/Voice.js');
		await import('./modules/Map.js');
		await import('./modules/Loading.js');

		V.loadInterface();
		V.loadProfile();
	} else {
		import('./modules/DownloadLink.js');
		import('./modules/Weather.js');
		var Load = await import('./modules/Loading.js');
		Load.notLoading();
	}
});
