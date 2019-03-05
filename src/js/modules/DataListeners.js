import _ from 'lodash';
import { EE } from './EventBus.js';
import Options from './Options.js';
import * as Trail from './Utils.Trail.js';

const DataListeners = {
	handleEvents: function(){
		$(document).on('click','[data-cmd]:not([disabled])',function(e){
			buttonCmd(e);
		});
		$(document).on('submit','form:has([data-submit])',function(e){
			e.preventDefault();
			buttonCmd(e);
		});
		$(document).on('blur','[type="text"][data-update]',function(e){
			sendUpdates(e);
		});
		$(document).on('click','button[data-update]',function(e){
			sendUpdates(e);
		});
		$(document).on('change','select[data-update]',function(e){
			sendUpdates(e);
		});
		$(document).on('blur','[data-finish]',function(e){
			//handle finishing functions
			var el = $(e.target).closest('[data-finish]');
			var f = el.data('finish');
			if (f){
				if (f.indexOf('.') > -1){
					//V.something.something
					f = f.split('.');
					V[f[0]][f[1]](el.val());
				} else {
					//V.something
					V[f](el.val());
				}
			}
		});
		//TODO: bind to anywhere in document on location update
		$(document).on('locationUpdated.veload',function(){
			_.forEach(_.last(V.points),function(value,key){
				var el = $(`[data-param="${key}"]:not(:focus)`);
				if (el.is('button')){
					el.toggleClass('active',value);
				} else {
					if (value > 0){
						if (el.is('input,select,textarea')){
							el.val(Number(value).toFixed(2));
						} else {
							var parsed = Number(value).toFixed(2);
							if (isNaN(parsed)){
								el.text(value);
							} else {
								el.text(parsed);
							}
						}
					}
				}
			});
			$(`[data-param$="()"]`).each(function(_i,el){
				var fnc = $(el).data('param').replace('()','');
				var val = Trail[fnc]();
				if (val > 0){
					var parsed = Number(val).toFixed(2);
					if (isNaN(parsed)){
						$(el).text(val);
					} else {
						$(el).text(parsed);
					}
				}
			});
		});
		EE.on('localInfo.veload',function(){
			_.forEach(V.status.sensors,function(value,key){
				$(`[data-sensor="${key}"]`).toggleClass('btn-primary',value).toggleClass('btn-outline-secondary',!value);
			});
		});

		EE.on('urlsUpdated.veload',function(){
			$.post(`${Options.urls.remote.userUrl}?value=${Options.urlComponents.local.url}`,function(){

			}).fail(function(){

			});
		});
	}
};
async function buttonCmd(e){
	var fnc = $(e.target).closest('[data-cmd]').data('cmd') ? $(e.target).closest('[data-cmd]').data('cmd') : $(e.target).closest('form').find('[data-submit]').data('submit');
	var fncs = fnc.split('.');
	if (fncs.length == 1 && V[fnc]){
		V[fncs[0]]($(e.target));
	} else if (fncs.length == 2){
		EE.emit(fnc);
	}
}
function sendUpdates(e){
	//handle direct bindings to url endpoint
	var el = $(e.target).closest('[data-update]');
	var fnc = el.data('update');
	var hosts = $(fnc.split(','));
	var remHosts = [];
	var val;
	load(el);
	if (el.is('button')){
		val = el.hasClass('active');
	} else {
		val = el.val();
	}
	hosts.each(function(_i,h){
		var host = h.split('.')[0];
		var path = h.split('.')[1];

		$.post(`${Options.urls[host][path]}?value=${val}`,function(data){
			if (data.status == 'success'){
				remHosts.push(h);
				if (hosts.length == remHosts.length){
					loadSuccess(el);
				}
			} else {
				loadFail(el);
			}
		}).fail(function(){
			loadFail(el,h);
		});
	});
}

function load(el){
	el.parent().loader(36,36).find('.spin').css({ right: '5px',top: '1px' });
}
function loadSuccess(el){
	V.getUser();
	el.removeClass('is-invalid').addClass('is-valid').parent().find('.spin').remove();
	setTimeout(function(){
		el.removeClass('is-valid');
	},3000);
}

function loadFail(el){
	el.addClass('is-invalid').parent().find('.spin').remove();
}

DataListeners.handleEvents();
Object.freeze(DataListeners);

export default DataListeners;
