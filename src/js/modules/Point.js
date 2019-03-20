function Point(lat,lng,time,hr,cadence,speed,est,goal,heading){
	this.lat = lat;
	this.lng = lng;
	this.time = time;
	this.hr = hr;
	this.heading = heading;
	this.cadence = cadence;
	this.speed = speed;
	this.est = est;
	this.goal = goal;
}

export { Point };
