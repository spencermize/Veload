function ConnectionStatus(){
    $(document).on("connectionInfo.veload",function(_e,status){
        //not connected
        if(!status.status){
            if(!$('.connectionFailed').length){
                var config = {
                    title: 'Error!',
                    body: 'Please check that your sensor is connected in the veload monitor!',
                    accept: true,
                    close: false,
                    acceptText: 'Retry',
                    modalClass: 'connectionFailed'
                }
                const events = {
                    acceptClick: function () {
                        V.poll()
                    }
                }
                V.pop(config, events);
            }

        }else{
            self.currentConnection = status.status;
            if($('.connectionFailed').length){
                V.unpop();
            }
        }        
    })
}


export {ConnectionStatus};