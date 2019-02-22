import _ from 'lodash';
function HomePage(){
    console.log('go')
    //load github info
    var api = 'https://api.github.com/repos/spencermize/VeloadListener';
    $.getJSON(`${api}/releases/latest`,function(data){
        $(data.assets).each(function(_num,el){
            if(_.endsWith(el.name,'.exe')){
                $('a.download-link').attr('href',el.browser_download_url);
                $('a.download-link .downloaded').text(el.download_count);
                $('a.download-link .version').text(data.name)
            }
        })
    });

    //load weather
    if($('.weather').length){
        try{
            navigator.geolocation.getCurrentPosition(function(position) {
        
                var status = [];
                $.getJSON(`${V.opts.urls.remote.weather}/${position.coords.latitude}/${position.coords.longitude}/public`,function(data){
                    var v = data.currently;
                    if(v.cloudCover > .5){
                        status.push('cloudy');
                    }
                    if(v.humidity > .6 && v.temperature > 70){
                        status.push('humid');
                    }
                    if(v.temperature < 45){
                        status.push('cold');
                    }
                    if(v.temperature > 80){
                        status.push('hot');
                    }
                    if(v.windGust > 15){
                        status.push('windy');
                    }
        
                    var max = 0;
                    $(status).each(function(_i,el){
                        var j = $(`<span class="rot">${el}</span>`);
                        $('.weather').append(j);
                        if(j.width()>max){max=j.width()}
                    })
                    $('.weather').width(max);
                    var loc = 1;
                    setInterval(function(){
                        $(`.rot.in`).removeClass('in');
                        var num = loc % $('.rot').length + 1;
                        $(`.rot:nth-of-type(${num})`).addClass('in');
                        loc++;
                    },1000);            
                })
              });
            
        }catch(error){
            
        }
    }
        
    
}

export {HomePage};