function ConnectionStatus(){
    $(document).on("localInfo.veload",function(_e){
        //not connected
        if(!V.status.status){
            if(!$('.connectionFailed').length){
                var config = {
                    title: 'Error!',
                    body: `<p>Please check that your sensor is connected in the veload monitor!</p>${V.opts.resetConnection}`,
                    accept: true,
                    close: false,
                    acceptText: 'Retry',
                    modalClass: 'connectionFailed'
                }
                const events = {
                    acceptClick: function () {
                        V.poller.poll()
                    }
                }
                V.unpop();
                V.pop(config, events);
            }

        }else{
            self.currentConnection = V.status.status;
            if($('.connectionFailed').length){
                V.unpop();
            }
        }        
    })
}


export {ConnectionStatus};