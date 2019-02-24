Handlebars.registerHelper({
	eq: function (v1, v2) {
		return v1 === v2;
	},
	ne: function (v1, v2) {
		return v1 !== v2;
	},
	lt: function (v1, v2) {
		return v1 < v2;
	},
	gt: function (v1, v2) {
		return v1 > v2;
	},
	lte: function (v1, v2) {
		return v1 <= v2;
	},
	gte: function (v1, v2) {
		return v1 >= v2;
	},
	and: function () {
		return Array.prototype.slice.call(arguments).every(Boolean);
	},
	or: function () {
		return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
	},
	ifIn: function (elem, list, options) {
		if (list) {
			if (list.indexOf(elem) > -1) {
				return options.fn(this);
			}
			return options.inverse(this);
		} else {
			return false;
		}
	}
});