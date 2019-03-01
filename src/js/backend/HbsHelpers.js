/*global hbs, config */
/*eslint no-console: "off" */
hbs.registerHelper('debug',function(optionalValue){
	console.log('====================');
	console.log('Current Context');
	console.log(this);

	if (optionalValue){
		console.log('Value');
		console.log('====================');
		console.log(optionalValue);
	}
});

hbs.registerHelper('partial',function(name,options){
	hbs.handlebars.registerPartial(name,options.fn);
});
function loadPartial(name){
	var partial = hbs.handlebars.partials[name];
	if (typeof partial === 'string'){
		console.log('compiling');
		partial = hbs.compile(partial);
	}
	return partial;
}

hbs.registerHelper('blk',function(name,options){
	/*Look for partial by name. */
	var partial = loadPartial(name) || options.fn;
	//console.log("blk partial " + partial(this, {data:options.hash}));
	console.log(partial);

	//make sure to clear out partial for next call in loop!!
	hbs.handlebars.partials[name] = null;

	return partial(this,{ data: options.hash });
});

hbs.registerHelper('startCase',function(name){
	var _ = require('lodash');
	return _.startCase(name);
});

hbs.registerHelper('production',function(){
	if (config.env == 'development'){
		return false;
	} else {
		return true;
	}
});
