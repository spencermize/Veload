import _ from 'lodash';
import { EE } from './EventBus.js';
import Options from './Options.js';
import Templates from './Templates.js';
import Modals from './Modals.js';
import { grid } from './Grid.js';
import { loading } from './Loading.js';

function SettingsPane(){
	var self = this;
	['SettingsPane.addCustomModule','SettingsPane.show'].forEach(function(eventName){
		EE.on(eventName,function(el){
			self[eventName.split('.')[1]](el);
		});
	});
	if (!(this instanceof SettingsPane)){
		return new SettingsPane();
	}
}

SettingsPane.prototype.show = function(){
	loading();
	$.getJSON(Options.urls.remote.modules,function(data){
		_.remove(data,function(el){
			return el == 'customChart';
		});
		var opts = {
			enabledMods: _.map(V.enabledMods,function(e){ return [e,_.startCase(e)]; }),
			allMods: _.map(data,function(e){ return [e,_.startCase(e)]; }),
			links: ['bike','connection','modules']
		};
		//console.log(opts);
		var comp = Templates.get('settings')(opts);
		var popts = {
			title: 'Veload Settings',
			body: comp,
			accept: false,
			modalClass: 'veload-settings'
		};
		var events = {
			cancelClick: function(){
				if (!$('#modal .is-invalid').length){
					Modals.unpop();
				}
			}
		};
		V.getUser(function(){
			Modals.unpop();
			Modals.pop(popts,events);
			EE.emit('SettingsPane.shown');
		});

		//match UI to server settings
		EE.once('SettingsPane.shown',function(){
			$('button[data-name="map"]').attr('disabled',true);
			_.forEach(_.difference(data,grid.enabledMods),function(el){
				$(`[data-name=${el}].btn-toggle`).removeClass('active');
			});
			_.forEach(V.status,function(value,key){
				var el = $(`[data-param="${key}"]:not(:focus)`);
				if (el.is('button')){
					el.toggleClass('active',value);
				} else {
					el.val(value);
				}
			});
			_.forEach(V.user,function(value,key){
				var el = $(`[data-param="${key}"]:not(:focus)`);
				if (el.is('button')){
					el.toggleClass('active',value);
				} else {
					el.val(value);
				}
			});
			$('.custom-creator .chart-type').on('change',function(e){
				var el = $(e.target).find(':selected');
				$('.custom-creator .parameter-type').prop('multiple',el.data('multiple-capable'));
			});
		});
	});
};

SettingsPane.prototype.addCustomModule = function(el){
	Modals.unpop();
	loading();
	var e = $(el).closest('.custom-creator');
	var title = e.find('.title').val();
	var p = e.find('.parameter-type').val();
	var param = Array.isArray(p) ? p.join(',') : p;
	var listen = Array.isArray(p) ? p.join('Updated,') : p;
	listen += 'Updated';
	var config = {
		param: param,
		type: e.find('.chart-type :selected').val(),
		listen: listen,
		title: _.startCase(title)
	};
	EE.once('CustomChart.initialized',function(){
		grid.saveLayout();
		Modals.unpop();
	});
	grid.enableModule('customChart',config);
};

export let settings = new SettingsPane();
