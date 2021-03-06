/*global appRoot, config */
/*eslint no-console: "off" */
const fs = require('fs').promises;
const os = require('os');

var PhotosUncached = {
	getRandomPhotoList: async function(){
		var photosDir = `${appRoot}/public/img/backgrounds/`;
		var dir = await fs.readdir(photosDir);
		return dir;
	},
	getPhotos: async function(lat,lon,rad){
		const axios = require('axios');
		var tags = ['sunset','sunrise','architecture','landscape','building','outdoors','park','trees','nature','trail','travel','-car','-baby','-hospital'].join(',');
		var sort = 'relevance';
		var text = '';
		const mode = 'any';
		const format = 'json';
		const perpage = 50;
		const q = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${config.flickr}&text=${text}&tag_mode=${mode}&sort=${sort}&format=${format}&extras=url_k,url_h&per_page=${perpage}&nojsoncallback=1&tags=${tags}&content_type=1&lat=${lat}&lon=${lon}&radius=${rad}`;
		var response = await axios(q);
		var url = '';
		var data = response.data;
		if (data.photos.total > 0){
			var attempts = 0;
			while (!url && attempts < (data.photos.photo.length)){
				const p = data.photos.photo[Math.floor(Math.random() * (data.photos.photo.length - 1))];
				url = p.url_k ? p.url_k : p.url_h;
				attempts++;
			}
			if (url){
				return url;
			}
		} else {
			console.log('no results');
			throw Error('no results found');
		}
	},
	downloadPhoto: async function(photo){
		const { DownloaderHelper } = require('node-downloader-helper');
		try {
			await fs.mkdir(`${os.tmpdir()}/backgrounds/`);
		} catch (e){
			//directory exists
		}
		const dl = new DownloaderHelper(photo,`${os.tmpdir()}/backgrounds/`);
		return new Promise(function(resolve,reject){
			dl.on('start',function(){
				console.log('starting ' + photo);
			}).on('end',function(){
				resolve(`${os.tmpdir()}/backgrounds/`);
			}).on('error',function(error){
				console.log('uh oh');
				reject(error);
			});

			dl.start();
		}).then(function(path){
			console.log('file downlaoded');
			return path;
		});
	},
	getPhotoColors: async function(file){
		const { getColorFromURL } = require('color-thief-node');
		try {
			await fs.access(`${appRoot}/public/img/backgrounds/${file}`);
			return await getColorFromURL(`${appRoot}/public/img/backgrounds/${file}`);
		} catch (e){
			console.log('checking colors');
			var color = await getColorFromURL(`${os.tmpdir()}/backgrounds/${file}`);
			return color;
		}
	}
};
const mem = require('mem');
const Photos = {
	colors: mem(PhotosUncached.getPhotoColors),
	randos: mem(PhotosUncached.getRandomPhotoList),
	photos: PhotosUncached.getPhotos,
	download: mem(PhotosUncached.downloadPhoto)
};

module.exports = Photos;
