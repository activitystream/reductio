var reductio_any = {
	add: function(a, prior, path) {
		return function(p, v, nf) {
			if (prior) prior(p, v, nf);
			if (!path(p).any) path(p).any = a(v);
			return p;
		};
	},
	remove: function(a, prior, path) {
		return function(p, v, nf) {
			if (prior) prior(p, v, nf);
			return p;
		};
	},
	initial: function(prior, path) {
		return function(p) {
			p = prior(p);
			path(p).any = '';
			return p;
		};
	},
};

module.exports = reductio_any;
