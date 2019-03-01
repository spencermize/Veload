import _ from 'lodash';
var api = 'https://api.github.com/repos/spencermize/VeloadListener';
export default (function(){
	$.getJSON(`${api}/releases/latest`,function(data){
		$(data.assets).each(function(_num,el){
			if (_.endsWith(el.name,'.exe')){
				$('a.download-link').attr('href',el.browser_download_url);
				$('a.download-link .downloaded').text(el.download_count);
				$('a.download-link .version').text(data.name);
			}
		});
	});
})();
