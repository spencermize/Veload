function SettingsPane() {
	var src = $('#settings-temp').html();
	V.loading();
	$.getJSON(V.opts.urls.remote.modules, function (data) {
		var opts = {
			enabledMods: _.map(V.enabledMods, function (e) { return [e, _.startCase(e)] }),
			allMods: _.map(data, function (e) { return [e, _.startCase(e)] }),
			links: ["connection","visibility"]
		}
		//console.log(opts);
		var comp = Handlebars.compile(src);
		comp = comp(opts);
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
		_.forEach(_.difference(data, V.enabledMods), function (el) {
			$(`[data-name=${el}] .btn-toggle`).removeClass('active');
		});
	})
}

export {SettingsPane};