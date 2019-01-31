function DataListeners(){
    $(document).on('click','[data-cmd]', function(e){
        let fnc = $(e.target).closest('[data-cmd]').data('cmd');
        console.log(fnc);
        if(V[fnc]){
            V[fnc]($(e.target));
        }else if(fnc){
            console.log("couldn't find fnc");
        }

    });
    $(document).on('blur','[data-update]',function(e){
        var el = $(e.target).closest('[data-update]');
        var fnc = el.data('update');
        var host = fnc.split(".")[0];
        var path = fnc.split(".")[1];
        console.log(fnc);
        load(el);
        console.log(V.opts.urls[host][path]);
        if(el.val().length){
            $.post(`${V.opts.urls[host][path]}?value=${el.val()}`,function(data){
                if(data.status="success"){
                    loadSuccess(el);
                }else{
                    loadFail(el);    
                }
            }).fail(function(e){
                loadFail(el);
            });
        }

    });
    $(document).on("connectionInfo.veload",function(_e,status){
        _.forEach(status.sensors,function(value,key){
            $(`[data-sensor="${key}"]`).toggleClass('connected',value)
        });
        _.forEach(status,function(value,key){
            console.log(value);
            console.log(key)
            console.log(`[data-param="${key}"]`)
            $(`[data-param="${key}"]:not(:focus)`).val(value);
        });

    })
}

function load(el){
    el.parent().loader(36,36).find(".spin").css({right: "5px", top:"1px"});
}
function loadSuccess(el){
    el.removeClass("is-invalid").addClass("is-valid").parent().find(".spin").remove();
    setTimeout(function(){
        el.removeClass("is-valid");
    },3000)
}

function loadFail(el){
    el.addClass("is-invalid").parent().find(".spin").remove();
}
export {DataListeners}