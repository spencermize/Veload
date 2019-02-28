import _ from 'lodash';
import moment from 'moment';
import geolib from 'geolib';

export function getAvg(u){
	var unit = u || V.user.units;
	if (V.rTrailPopped.length >= 2){
		var d = getVerifiedDistance(unit);
		var t = moment(_.last(V.rTrailPopped).time).diff(moment(V.rTrailPopped[0].time)) / 1000 / 3600;
		return d / t;
	} else {
		return 0;
	}
};
export function getDistance(u,veri){
	var unit = u || V.user.units;
	var dm = veri ? geolib.getPathLength(V.rTrailPopped) : geolib.getPathLength(V.points);
	return inUnits(dm,unit);
};
export function getVerifiedDistance(u){
	var unit = u || V.user.units;
	return getDistance(unit,true);
}
export function getRemainingDistance(u){
	var unit = u || V.user.units;
	var dm = geolib.getPathLength(V.rTrail);
	return inUnits(dm,unit);
};
export function inUnits(num,unit){
	if (unit == 'miles'){
		return geolib.convertUnit('mi',num,8);
	} else if (unit == 'meters'){
		return num;
	} else if (unit == 'kilometers'){
		return geolib.convertUnit('km',num,8);
	}
}
export function getElapsed(){
	return moment(_.last(V.points).time).diff(moment(V.points[0].time)) / 1000; //return time in seconds
};
export function getElapsedClock(){
	return new Date(getElapsed() * 1000).toISOString().substr(11,8); //clock time
}
