const { DownloaderHelper } = require('node-downloader-helper');
const fs = require('fs');
const path = require('path');
var Photos = {
    getRandomPhoto: function(dir,callback){
        fs.readdir(dir, (err, files) => {
            if (err) return callback(err);

            function checkRandom () {
                if (!files.length) {
                    // callback with an empty string to indicate there are no files
                    return callback(null, undefined);
                }
                const randomIndex = Math.floor(Math.random() * files.length);
                const file = files[randomIndex]
                fs.stat(path.join(dir, file), (err, stats) => {
                    if (err) return callback(err);
                    if (stats.isFile()) {
                        return callback(null, file);
                    }
                    // remove this file from the array because for some reason it's not a file
                    files.splice(randomIndex, 1);

                    // try another random one
                    checkRandom();
                })
            }
            checkRandom();
        })
    },
    getPhotos: function(qs,callback,res){
        const axios = require('axios');
        var tags = ["beautiful","sunset","sunrise","architecture","landscape","building","outdoors","trail","travel","-car"].join(",");
        var sort = 'relevance';
        var text = '';
        const mode = 'any';
        const format = 'json';
        const perpage = 50;
        const q = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${config.flickr}&text=${text}&tag_mode=${mode}&sort=${sort}&format=${format}&extras=url_k,url_h&per_page=${perpage}&nojsoncallback=1&tags=${tags}&content_type=1&${qs}`;
        axios.get(q)
            .then(function(response){
                var url = "";
                var data = response.data
                try{
                    if (data.photos.total > 0) {
                        var attempts = 0;
                        while (!url && attempts < (data.photos.photo.length)) {
                            const p = data.photos.photo[Math.floor(Math.random() * (data.photos.photo.length - 1))];
                            url = p.url_k ? p.url_k : p.url_h;
                            attempts++;
                        }
                        if (url) {
                            callback({'url':url,'permanent':false},res);
                        }
                    } else {
                        console.log('no results');
                        callback(response,res);
                    }
                }catch(error){
                    console.log(error);
                    if(error){
                        throw response.data;
                    }else{
                        throw {"error": "unknown"};
                    }
                    
                }
            })
            .catch(function(error){
                callback(error);
            });
    },
    photosCallback: function(rs,res){
        try{
            if(rs.url){
                const file = rs.url.split("/")[rs.url.split("/").length-1];
                var p;
                if(rs.permanent){
                    p = `${appRoot}/public/img/backgrounds/`;
                }else{
                    p = os.tmpdir() + '/backgrounds/';
                }
                const full = p + file;
                const rurl = '/photos/'+ file;
                const { getColorFromURL } = require('color-thief-node');

                if(fs.existsSync(full)){
                    console.log(full)
                    getColorFromURL(full).then(function(color){
                        res.json({url: rurl,color:color});
                    });
                }else{
                    const dl = new DownloaderHelper(rs.url, p);
                    dl.on('start',function(){
                        console.log('starting ' + rs.url);
                    }).on('end',function(){
                        getColorFromURL(full).then(function(color){
                            res.json({url: rurl,color:color});
                        });
                    }).on('error',function(error){
                        console.log('uh oh');
                        res.json(error)	
                    });

                    dl.start();
                }
            }else{
                res.json(rs)
            }
        }catch(err){
            res.json(err);
        }
    }
}
module.exports = Photos;