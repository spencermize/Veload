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
	},
	mods : function(){
		var list = [];
		for(var i = 0; i < arguments.length - 1; ++i) {
			list.push(arguments[i]);
		}
		var v =  "'" + list.join("','") + "'";
		return `<script>var modules=[${v}]</script>`;
		
	}
}