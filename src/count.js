var reductio_count = {
	add: function (a, prior, path) {
		return function (p, v, nf) {
			if (prior) prior(p, v, nf);
			path(p).count = path(p).count + a(v);
			return p;
		};
	},
	remove: function (a, prior, path) {
		return function (p, v, nf) {
			if (prior) prior(p, v, nf);
			path(p).count = path(p).count - a(v);
			return p;
		};
	},
	initial: function (prior, path) {
		return function (p) {
			p = prior(p);
			path(p).count = 0;
			return p;
		};
	}
};

module.exports = reductio_count;
