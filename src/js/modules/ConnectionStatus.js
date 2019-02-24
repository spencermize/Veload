function ConnectionStatus(){
	$(document).on('localInfo.veload',function(){
		//not connected
		if (!V.status.status){
			$('body').addClass('disconnected');
		} else {
			$('body').removeClass('disconnected');
		}
	});
}

export { ConnectionStatus };
