module.exports = {
	debug : function(optionalValue) {
		console.log("====================");
		console.log("Current Context");
		console.log(this);

		if (optionalValue) {
			console.log("Value");
			console.log("====================");
			console.log(optionalValue);
		}
	}
}