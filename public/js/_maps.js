document.addEventListener('veloaded',function(){
	console.log("trying to load map...");
	Veload.prototype.map;
	Veload.prototype.maps = function(){
		var self = this;
		console.log("called...");
		var el = $('.map')[0];
		self.map = Leaflet.map(el,{
			zoom: 9,
			center: [51.505, -0.09]
		});
		navigator.geolocation.getCurrentPosition(function(position) {
			self.map.panTo([position.coords.latitude,position.coords.longitude]);
			currLoc = {lat:position.coords.latitude,lng:position.coords.longitude};
		});		
		Leaflet.tileLayer('https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=9550bf2f19b74edfbf935882be6d687e', {

		}).addTo(self.map);
		$(document).on('vUpdated',function(){
			self.map.flyTo(currLoc,18);
		});
	}
	Veload.prototype.getMap = function(){
		return self.maps;
	}
	$(document).trigger("mapsLoaded");
});