import _ from 'lodash';
import { EE } from './EventBus.js';
import Options from './Options.js';
import Templates from './Templates.js';
import Modals from './Modals.js';
import { grid } from './Grid.js';
import { loading } from './Loading.js';

function SettingsPane(){
	EE.builder(['SettingsPane.addCustomModule','SettingsPane.show'],this);
}

SettingsPane.prototype.show = function(){
	loading();
	$.getJSON(Options.urls.remote.modules,function(data){
		_.pull(data,'customChart','customElement');
		var opts = {
			enabledMods: _.map(V.enabledMods,function(e){ return [e,_.startCase(e)]; }),
			allMods: _.map(data,function(e){ return [e,_.startCase(e)]; }),
			links: ['bike','connection','modules']
		};
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
			$('.custom-creator .module-type').on('change',function(e){
				var el = $(e.target).find(':selected');
				var type = el.data('type');

				$('.module-options').children().addClass('d-none');
				switch (type){
				case 'param':
					$('.custom-creator .option-param').removeClass('d-none').prop('multiple',el.data('multiple-capable'));
					break;
				case 'custom':
					$('.custom-creator .option-custom').removeClass('d-none');
					break;
				}
			});
		});
	});
};

SettingsPane.prototype.addCustomModule = function(el){
	Modals.unpop();
	loading();
	var e = $(el).closest('.custom-creator');
	var title = _.startCase(e.find('.title').val());
	var type = $('.custom-creator .module-type :selected').data('type');
	var mod;
	var p = e.find(`.option-${type}`).val();
	var config = {
		title,
		type: e.find('.module-type :selected').val()
	};
	switch (type){
	case 'param':
		mod = 'customChart';
		var listen = Array.isArray(p) ? p.join('Updated,') : p;
		listen += 'Updated';
		Object.assign(config,{
			param: Array.isArray(p) ? p.join(',') : p,
			listen
		});
		break;
	case 'custom':
		mod = 'customElement';
		p = e.find('.option-custom').val();
		Object.assign(config,{
			srcUrl: p
		});
		break;
	}
	EE.once(`${_.capitalize(mod)}.initialized`,function(){
		grid.saveLayout();
		Modals.unpop();
	});
	grid.enableModule(mod,config);
};

export let settings = new SettingsPane();
