$(document).on('routeCompleted.veload',function(){
    V.pause();
    var config = {
        title: "ride completed!"
    }

    V.pop(config);
});