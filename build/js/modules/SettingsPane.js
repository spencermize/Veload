function SettingsPane() {
	var src = $('#settings-temp').html();
	V.loading();
	$.getJSON(V.opts.urls.remote.userModules, function (data) {
		var opts = {
			enabledMods: _.map(V.enabledMods, function (e) { return [e, _.startCase(e)] }),
			allMods: _.map(data, function (e) { return [e, _.startCase(e)] }),
			links: ["visibility", "connection"]
		}
		//console.log(opts);
		var comp = Handlebars.compile(src);
		comp = comp(opts);
		var popts = {
			title: "Veload Settings",
			body: comp,
			accept: false
		}
		V.unpop();
		V.pop(popts);
		_.forEach(_.difference(data, V.enabledMods), function (el) {
			$(`[data-name=${el}] .btn-toggle`).removeClass('active');
		});
	})
}

export {SettingsPane};