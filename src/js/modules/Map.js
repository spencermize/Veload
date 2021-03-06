import List from 'list.js';
import moment from 'moment';
import { EE } from './EventBus.js';
import Options from './Options.js';
import Modals from './Modals.js';
import { Point } from './Point.js';
import { loading } from './Loading.js';

var L,omni,geolib;

function Map(){
	var self = this;
	EE.once(`Map.enabling`,function(_e){
		self.init();
	});
	if (!(this instanceof Map)){
		return new Map();
	}
}
Map.prototype.init = async function(){
	L = await import('leaflet');
	await import('@ansur/leaflet-pulse-icon');
	await import('../../../node_modules/leaflet-providers/leaflet-providers.js');
	omni = await import('@mapbox/leaflet-omnivore');
	geolib = await import('geolib');
	this.create();
	this.listen();
	EE.emit('Map.initialized');
	EE.emit('Map.moduleLoaded');
};
Map.prototype.get = function(){
	return $('.map').data('map');
};
Map.prototype.create = function(){
	var el = $('.map');
	el.data('map',L.map(el[0],{
		zoom: 9,
		center: [51.505,-0.09],
		attributionControl: false
	}));
	L.tileLayer.provider('CartoDB.Positron').addTo(this.get());
};

Map.prototype.listen = function(){
	var self = this;
	[`Map.loadGPX`,'Map.stravaLoader','Map.gpsLoader','Map.gpsSearch'].forEach(function(eventName){
		EE.on(eventName,function(el){
			self[eventName.split('.')[1]](el);
		});
	});
	EE.on('Veload.choosingRoute',self.pickTrackGUI);
	EE.on('Veload.locationUpdated',function(){
		var l = V.points[V.points.length - 1];
		self.get().flyTo(l,14,{
			animate: false
		});
		self.myIcon.setLatLng(l);
	});
	EE.on('Veload.gridResized',function(){
		self.get().invalidateSize();
	});
	EE.on('Map.gridItemResized',function(){
		self.get().invalidateSize();
	});
	EE.on('Veload.clear',function(){
		self.get().remove();
		self.init();
	});
};

Map.prototype.loadGPX = function(e){
	var self = this;
	var url = e.closest('[data-ref]').data('ref');
	Modals.unpop();
	loading();
	EE.emit('Map.trackLoading');
	var om = omni.gpx(url);
	V.points = [];
	om.on('ready',function(e){
		var route = om.toGeoJSON().features[0].geometry.coordinates;
		var gpx = e.target;
		var distance = 0;
		var bearing = 0;
		self.get().fitBounds(gpx.getBounds());
		for (var coord = 0; coord < route.length - 1; coord++){
			var s = route[coord];
			var f = route[coord + 1];
			var sl = { lat: s[1],lng: s[0] };
			var fl = { lat: f[1],lng: f[0] };
			V.rTrail.push({ distance: distance,bearing: bearing,latitude: sl.lat,longitude: sl.lng,latlng: { lat: sl.lat,lng: sl.lng } });

			//distance remaining from previous waypoint. first waypoint should be zero
			distance = geolib.getDistance(sl,fl,1,15);
			bearing = geolib.getBearing(sl,fl);
		}
		var l = new Point(V.rTrail[0].latlng.lat,V.rTrail[0].latlng.lng);
		V.points.push(l);

		var pulsingIcon = L.icon.pulse({
			iconSize: [20,20],
			color: Options.colors.GOOD,
			fillColor: Options.colors.GOOD
		});
		self.myIcon = L.marker([l.lat,l.lng],{ icon: pulsingIcon,opacity: 0.8 }).addTo(self.get());
		EE.emit('Map.trackLoaded');
	}).on('error',function(e){
		Modals.error(e);
	}).addTo(self.get());
};

Map.prototype.pickTrackGUI = function(){
	var config = {
		title: 'Route Selection',
		accept: false,
		body: $('.StravaOrRide').html()
	};
	Modals.unpop();
	Modals.pop(config);
};
Map.prototype.gpsLoader = function(){
	var options = this.listOptions();
	Modals.unpop();
	var html = $('.rwgpsSearch').html() + $('.search-wrap').html();
	Modals.pop(this.listModalOptions(html));
	$('#modal .searcher').attr('id','searchme');
	var list = new List('searchme',options);
	$('#modal').data('list',list);
	list.clear();
};
Map.prototype.gpsSearch = function(){
	var kw = $('#modal .gpsSearchKeywords');
	var di = $('#modal .gpsSearchDistance');
	var keywords = kw.val();
	var distance = di.val();

	kw.toggleClass('is-invalid',!keywords.length);
	di.toggleClass('is-invalid',!distance.length);

	if (keywords.length && distance.length){
		var list = $('#modal').data('list');
		list.clear();
		$('#searchme .list').loader();
		$.getJSON(`${Options.urls.remote.rwgpsRouteSearch}?keywords=${keywords}&distance=${distance}`,function(routes){
			$('#searchme .list').empty();
			routes.results.forEach(async function(e){
				var el = e[e.type];
				el.distance = el.distance / 1000;
				if (V.user.units == 'miles'){
					el.distance = el.distance / 1.609;
				}
				list.add({
					name: el.name,
					timestamp: el.created_at,
					days: moment(el.created_at).fromNow(),
					description: `${el.short_location} - ${Number(el.distance).toFixed(2)} ${V.user.units}`,
					ref: `/api/rwgpsRouteGPX/${el.id}/${e.type}s`
				});
			});
		});
	}
};
Map.prototype.listOptions = function(){
	var item = $('.search-wrap ul.list').cleanWhitespace().html();
	return {
		valueNames: [
			'name',
			'days',
			'description',
			{ 'data': ['ref','timestamp'] }
		],
		item: item,
		page: 5,
		pagination: true
	};
};
Map.prototype.listModalOptions = function(body){
	return {
		title: 'Route Selection',
		accept: false,
		body: body
	};
};
Map.prototype.stravaLoader = function(){
	var self = this;
	var options = this.listOptions();
	loading();
	$.getJSON(Options.urls.remote.athleteRoutes,function(routes){
		$.getJSON(Options.urls.remote.athleteActivities,function(activities){
			var data = routes.concat(activities);
			Modals.unpop();
			Modals.pop(self.listModalOptions($('.search-wrap').html()));
			$('#modal .searcher').attr('id','searchme');
			var list = new List('searchme',options);
			list.clear();

			//add each item to modal
			data.forEach(function(el){
				if (el.map.summary_polyline){
					var type;
					var dist = Number(geolib.convertUnit('mi',el.distance)).toFixed(2);
					var desc;
					var created;
					if (el.type == 'Run' || el.type == 'Bike'){
						var avg = Number(el.average_speed).toFixed(2);
						type = 'activities';
						created = el.start_date;
						desc = `You averaged ${avg} mph and traveled ${dist} miles.`;
					} else if (el.type == 1){
						type = 'routes';
						created = el.created_at;
						desc = `You own this ${dist} mile route.`;
					} else {
						type = false;
					}
					if (type){
						var days = moment(created).fromNow();
						list.add({
							name: el.name,
							timestamp: created,
							days: days,
							description: desc,
							ref: `/api/${type}GPX/${el.id}`
						});
					}
				}
			});
		});
	});
};

//this is here specifically for List.js, which freaks out on whitespace
$.fn.cleanWhitespace = function(){
	this.contents().filter(
		function(){ return (this.nodeType == 3 && !/\S/.test(this.nodeValue)); })
		.remove();
	return this;
};

export let map = new Map();
