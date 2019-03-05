import { EE } from './EventBus.js';
function ConnectionStatus(){
	EE.on('Veload.localInfo',function(){
		//not connected
		if (!V.status.status){
			$('body').addClass('disconnected');
		} else {
			$('body').removeClass('disconnected');
		}
	});
}

export { ConnectionStatus };
