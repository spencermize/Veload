import moment from 'moment';

import Templates from './Templates.js';
import { EE } from './EventBus.js';
import Modals from './Modals.js';
import Options from './Options.js';

function RideControls(){
	EE.builder(['Ride.start','Ride.pause','Ride.upload','Ride.stop'],this);
}

RideControls.prototype.start = function(){
	var self = this;
	if (V.points.length){
		var config = {
			title: 'waiting for sensors to connect',
			overClass: 'bigButtons',
			content: Templates.get('buttons')()
		};
		var over = $(Templates.get('overlay')(config));
		var b = $('body').append(over);

		var connected = setInterval(function(){ V.sensorsConnected(V); },100);
		EE.on('Veload.sensorsConnected',function(){
			clearInterval(connected);
			over.remove();
			b.addClass('playing stoppable').removeClass('paused');

			EE.emit('Veload.start');
		});
	} else {
		$('body').append(Templates.get('start')());
		EE.emit('Veload.choosingRoute');

		EE.once('Map.trackLoading',function(){
			Modals.unpop();
			Modals.pop({
				title: 'Select or Create a Workout?',
				body: $('.GoalSelectOrBuild').html(),
				accept: false
			});
		});
		EE.once('Goals.workoutSaved',function(){
			Modals.unpop();
			self.start();
		});
		EE.once('Goals.workoutLoaded',function(){
			Modals.unpop();
			self.start();
		});
	}
};

RideControls.prototype.pause = function(){
	$('body').removeClass('playing');
	$('body').addClass('paused');
	EE.emit('Veload.pause');
};

RideControls.prototype.stop = function(){
	this.pause();
	if (V.points.length){
		var config = {
			title: 'End ride?',
			body: 'Are you sure you want to end this ride and upload to Strava?',
			accept: true,
			close: true,
			acceptText: 'Finish',
			cancelText: 'Go back'
		};
		const events = {
			acceptClick: function(){
				V.upload();
			}
		};
		Modals.pop(config,events);
	}
	EE.emit('Veload.stop');
};

RideControls.prototype.clear = function(){
	this.pause();
	var config = {
		title: 'Clear this ride?',
		body: 'Are you sure you want to clear your ride? You will lose all data in this window.',
		accept: true,
		close: true,
		acceptText: 'Clear',
		acceptClass: 'btn-danger',
		cancelText: 'Go back'
	};
	const events = {
		acceptClick: function(){
			V.points = [];
			V.rTrailPopped = [];
			$('body').removeClass('stoppable');
			Modals.unpop();
			EE.emit('Veload.clear');
		}
	};
	Modals.pop(config,events);
};

RideControls.prototype.upload = async function(){
	var self = this;
	$('.modal-footer').loader(36,36,true);
	self.rTrailPopped.forEach(function(val,i){
		self.rTrailPopped[i].time = moment(val.time).format();
	});
	$.post(Options.urls.remote.publish,{ points: self.rTrailPopped },function(data){
		if (data.id){
			var config = {
				title: 'Congrats!',
				body: 'Congratulations, your ride has been uploaded!',
				accept: false,
				close: true,
				cancelText: 'Finish'
			};
			$('#modal').on('hidden.bs.modal',function(){
				Modals.pop(config);
			});
			Modals.unpop();
		} else {
			Modals.error('Error uploading to Strava');
		}
	}).fail(function(err){
		Modals.error(`<p>Error uploading. <strong>Please contact support.</strong></p><p class="text-danger font-weight-light">Diagnostic Info: Server (${self.remote.publish}) responded (${err.status} ${err.statusText})</p>`);
	});
};

export let controls = new RideControls();
