var reductio_value = {
	add: function (a, prior, path, reduceInitial) {
		return function (p, v, nf) {
      var property = a(v);
      if (!path(p)[property]) path(p)[property] = reduceInitial();
      if (prior) {
        prior(path(p)[property], v, nf);
      }
			return p;
		};
	},
	remove: function (a, prior, path) {
		return function (p, v, nf) {
      var property = a(v);
      if (prior) {
        prior(path(p)[property], v, nf);
      }
			return p;
		};
	},
	initial: function (prior, path) {
		return function (p) {
			return {};
		};
	},

  multi_add: function (a, prior, path, reduceInitial) {
		return function (p, v, nf) {
      var properties = a(v);
      properties.forEach(function(prop) {
        if (!path(p)[prop]) {
          path(p)[prop] = reduceInitial();

          console.log('initialValue for prop', path(p)[prop]);
        }
        if (prior) prior(path(p)[prop], v, nf);
      });

      return p;
		};
	},
	multi_remove: function (a, prior, path) {
		return function (p, v, nf) {
      var properties = a(v);
      properties.forEach(function(prop) {
        if (prior) prior(path(p)[prop], v, nf);
      });

      return p;
		};
	},
	multi_initial: function (prior, path) {
		return function (p) {
			return {};
		};
	}
};

module.exports = reductio_value;
