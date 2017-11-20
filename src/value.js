var reductio_value = {
	add: function (a, prior, path, multi, filter, originalAdd) {
		if (multi) return reductio_value.multi_add(a, prior, path, filter, originalAdd);
		return function (p, v, nf) {
			if (originalAdd) originalAdd(p, v, nf);
			var property = a(v);
			if (filter && !filter(v)) return p;
			if (!path(p)[property]) path(p)[property] = prior.reduceInitial();
			if (prior && prior.reduceAdd) {
				prior.reduceAdd(path(p)[property], v, nf);
			}
			return p;
		};
	},
	remove: function (a, prior, path, multi, filter, originalRemove) {
		if (multi) return reductio_value.multi_remove(a, prior, path, filter, originalRemove);
		return function (p, v, nf) {
			if (originalRemove) originalRemove(p, v, nf);
			if (filter && !filter(v)) return p;
			var property = a(v);
			if (prior && prior.reduceRemove) {
				prior.reduceRemove(path(p)[property], v, nf);
			}
			return p;
		};
	},
	initial: function (prior, path) {
		return function (p) {
			return prior(p);
		};
	},

	multi_add: function (a, prior, path, filter, originalAdd) {
		return function (p, v, nf) {
			if (originalAdd) originalAdd(p, v, nf);
			var properties = a(v);
			if (filter && !filter(v)) return p;
			properties.forEach(function (prop) {
				if (!path(p)[prop]) {
					path(p)[prop] = prior.reduceInitial();
				}
				if (prior.reduceAdd) prior.reduceAdd(path(p)[prop], v, nf);
			});

			return p;
		};
	},
	multi_remove: function (a, prior, path, filter, originalRemove) {
		return function (p, v, nf) {
			if (originalRemove) originalRemove(p, v, nf);
			var properties = a(v);
			if (filter && !filter(v)) return p;
			properties.forEach(function (prop) {
				if (prior.reduceRemove) prior.reduceRemove(path(p)[prop], v, nf);
			});

			return p;
		};
	},
};

module.exports = reductio_value;
