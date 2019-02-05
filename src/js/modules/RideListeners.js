$(document).on('routeCompleted.veload',function(){
    V.pause();
    var config = {
        title: "ride completed!"
    }

    var over = $(self.cTemps['overlay'](config));
});