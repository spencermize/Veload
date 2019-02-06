import _ from 'lodash';
import { setColors } from './ColorControls';
function DataListeners(){
    $(document).on('click','[data-cmd]', function(e){
        let fnc = $(e.target).closest('[data-cmd]').data('cmd');
        console.log(fnc);
        var fncs = fnc.split(".");
        var one = fncs[0];
        var two = fncs[1] || 0;
        if(fncs.length == 1 && V[fnc]){
            V[fncs[0]]($(e.target));
        }else if(fncs.length == 2 && V[one][two] ){
            V[one][two]($(e.target));
        }else{
            console.log("couldn't find fnc");
        }

    });
    $(document).on('blur','[type="text"][data-update]',function(e){
       sendUpdates(e)
    }); 
    $(document).on('click','button[data-update]',function(e){
        sendUpdates(e)
     });    
     $(document).on('change','select[data-update]',function(e){
        sendUpdates(e)
     });       

    function sendUpdates(e){
       //handle direct bindings to url endpoint
       var el = $(e.target).closest('[data-update]');
       var fnc = el.data('update');
       var hosts = $(fnc.split(","));
       var remHosts = [];
       var val;       
       load(el);
       if (el.is('button')){
           val = el.hasClass('active')
       }else{
           val = el.val()
       }       
       hosts.each(function(_i,h){
           var host = h.split(".")[0];
           var path = h.split(".")[1];

           $.post(`${V.opts.urls[host][path]}?value=${val}`,function(data){
               if(data.status="success"){
                   remHosts.push(h);
                   if(hosts.length == remHosts.length){
                       loadSuccess(el);
                   }
               }else{
                   loadFail(el);    
               }
           }).fail(function(e){
               loadFail(el,h);
           });
       }) 
    }

    $(document).on('blur','[data-finish]',function(e){
        //handle finishing functions
        var el = $(e.target).closest('[data-finish]');        
        var f = el.data('finish');
        if(f){
            if(f.indexOf(".")>-1){
                // V.something.something
                f = f.split(".");
                console.log(el.val())
                V[f[0]][f[1]](el.val())
            }else{
                // V.something
                V[f](el.val())
            }
        }
    })
    $(document).on("localInfo.veload",function(_e){
        _.forEach(V.status.sensors,function(value,key){
            $(`[data-sensor="${key}"]`).toggleClass("btn-primary",value).toggleClass("btn-outline-secondary",!value);
        });
        setColors();
    })
    $(document).on("settingsShown.veload",function(){
        _.forEach(V.status,function(value,key){
            var el = $(`[data-param="${key}"]:not(:focus)`);
            if(el.is('button')){
                el.toggleClass("active",value);
            }else{
                el.val(value);
            }    
        });        
        _.forEach(V.user,function(value,key){
            var el = $(`[data-param="${key}"]:not(:focus)`);
            if(el.is('button')){
                el.toggleClass("active",value);
            }else{
                el.val(value);
            }  
        });
        setColors();
    })
    $(document).on("urlsUpdated.veload",function(_e){
        $.post(`${V.opts.urls.remote.userUrl}?value=${V.opts.urlComponents.local.url}`,function(){

        }).fail(function(){

        });
    });
}

function load(el){
    el.parent().loader(36,36).find(".spin").css({right: "5px", top:"1px"});
}
function loadSuccess(el){
    V.getUser();
    el.removeClass("is-invalid").addClass("is-valid").parent().find(".spin").remove();
    setTimeout(function(){
        el.removeClass("is-valid");
    },3000)
}

function loadFail(el,h){
    el.addClass("is-invalid").parent().find(".spin").remove();
    console.log(`error saving to ${h}`)    
}
export {DataListeners}