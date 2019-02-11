import _ from 'lodash';


function SettingsPane(opts){
	this.opts = opts;
	if (!(this instanceof SettingsPane)) return new SettingsPane(opts);
};

SettingsPane.prototype.show = function(){
		V.loading();
		$.getJSON(V.opts.urls.remote.modules, function (data) {
			var opts = {
				enabledMods: _.map(V.enabledMods, function (e) { return [e, _.startCase(e)] }),
				allMods: _.map(data, function (e) { return [e, _.startCase(e)] }),
				links: ["bike","connection","modules"]
			}
			//console.log(opts);
			var comp = self.cTemps.settings(opts)
			var popts = {
				title: "Veload Settings",
				body: comp,
				accept: false,
				modalClass: "veload-settings"
			}
			var events = {
				cancelClick: function (e) {
					if(!$('#modal .is-invalid').length){
						V.unpop();
					}
				},
			}
			V.getUser(function(data){
				V.unpop();
				V.pop(popts,events);
				$(document).trigger('settingsShown.veload');
			})

			//match UI to server settings
			$(document).one("settingsShown.veload",function(){
				_.forEach(_.difference(data, V.enabledMods), function (el) {
					console.log("disabled: " + el)
					$(`[data-name=${el}] .btn-toggle`).removeClass('active');
				});
				_.forEach(V.status,function(value,key){
					var el = $(`[data-param="${key}"]:not(:focus)`);
					if(el.is('button')){
						el.toggleClass("active",value);
					}else{
						el.val(value);
					}    
				});        
				_.forEach(V.user,function(value,key){
					var el = $(`[data-param="${key}"]:not(:focus)`);
					if(el.is('button')){
						el.toggleClass("active",value);
					}else{
						el.val(value);
					}  
				});
				$('.custom-creator .chart-type').on("change",function(e){
					var el = $(e.target).find(":selected");
					$('.custom-creator .parameter-type').prop("multiple",el.data("multiple-capable"));
				});
			})

		})
	}

export {SettingsPane};