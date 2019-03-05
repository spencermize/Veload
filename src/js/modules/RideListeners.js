import { EE } from './EventBus.js';
import Modals from './Modals.js';

function RideListeners(){
	EE.on('Veload.routeCompleted',function(){
		V.pause();
		var config = {
			title: 'ride completed!'
		};

		Modals.pop(config);
	});
}

export { RideListeners };
