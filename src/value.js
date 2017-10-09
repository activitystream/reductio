var reductio_value = {
	add: function(a, prior, path, multi, originalAdd) {
		if (multi) return reductio_value.multi_add(a, prior, path, originalAdd);
		return function(p, v, nf) {
			if (originalAdd) originalAdd(p, v, nf);
			var property = a(v);
			if (!path(p)[property]) path(p)[property] = prior.reduceInitial();
			if (prior && prior.reduceAdd) {
				prior.reduceAdd(path(p)[property], v, nf);
			}
			return p;
		};
	},
	remove: function(a, prior, path, multi, originalRemove) {
		if (multi) return reductio_value.multi_remove(a, prior, path, originalRemove);
		return function(p, v, nf) {
			if (originalRemove) originalRemove(p, v, nf);
			var property = a(v);
			if (prior && prior.reduceRemove) {
				prior.reduceRemove(path(p)[property], v, nf);
			}
			return p;
		};
	},
	initial: function(prior, path) {
		return function(p) {
			return prior(p);
		};
	},

	multi_add: function(a, prior, path, originalAdd) {
		return function(p, v, nf) {
			if (originalAdd) originalAdd(p, v, nf);
			var properties = a(v);
			properties.forEach(function(prop) {
				if (!path(p)[prop]) {
					path(p)[prop] = prior.reduceInitial();
				}
				if (prior.reduceAdd) prior.reduceAdd(path(p)[prop], v, nf);
			});

			return p;
		};
	},
	multi_remove: function(a, prior, path, originalRemove) {
		return function(p, v, nf) {
			if (originalRemove) originalRemove(p, v, nf);
			var properties = a(v);
			properties.forEach(function(prop) {
				if (prior.reduceRemove) prior.reduceRemove(path(p)[prop], v, nf);
			});

			return p;
		};
	},
};

module.exports = reductio_value;
