var els = $('[id$="-temp"]');
var temps = [];
const Templates = {
	init: function(){
		els.each(function(_i,e){
			var el = $(e);
			temps[el.attr('id').split('-')[0]] = Handlebars.compile(el.html());
		});
	},
	get: function(name){
		return temps[name];
	}
};

Templates.init();

Object.freeze(Templates);

export default Templates;
