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
	mods : function(list){
		var v =  "'" + list.join("','") + "'";
		return `<script>var modules=[${v}]</script>`;
		
	}

}