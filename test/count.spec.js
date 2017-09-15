// Counting tests
describe('Reductio count', function () {
    var group;

    beforeEach(function () {
        var data = crossfilter([
            { foo: 'one', count: 1 },
            { foo: 'two', count: 2 },
            { foo: 'three', count: 3 },
            { foo: 'one', count: 4 },
            { foo: 'one', count: 5 },
            { foo: 'two', count: 6 },
        ]);

        var dim = data.dimension(function(d) { return d.foo; });
        group = dim.group();

        var reducer = reductio()
                .count(true);

        reducer(group);
    });

    it('has three groups', function () {
        expect(group.top(Infinity).length).toEqual(3);
    });

    it('grouping have the right counts', function () {
        var values = {};
        group.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(values['one'].count).toEqual(3);
        expect(values['two'].count).toEqual(2);
        expect(values['three'].count).toEqual(1);
    });

    it('has can function precisely like sum', function() {
      reductio().count('count')(group);
      var values = {};
      group.top(Infinity).forEach(function (d) {
          values[d.key] = d.value;
      });

      expect(values['one'].count).toBe(10);
      expect(values['two'].count).toBe(8);
      expect(values['three'].count).toBe(3);
    })
});
