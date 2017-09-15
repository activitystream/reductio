// Counting tests
describe('Multiple values', function () {

    var values = {};

    beforeEach(function () {
        var data = crossfilter([
            { foo: 'one', x: 1, other: 2 },
            { foo: 'two', x: 2, other: 1 },
            { foo: 'three', x: 3, other: 4 },
            { foo: 'one', x: 4, other: 1 },
            { foo: 'one', x: 5, other: 2 },
            { foo: 'two', x: 6, other: 3 },
        ]);

        var dim = data.dimension(function(d) { return d.foo; });
        var group = dim.group();

        var reducer = reductio()
                .avg(function(d) { return d.x; })
                .count(true);

        reducer.value("x").count(true).sum(function (d) { return d.x; });
        reducer.value("y", function(d) { return d.other; }).count(true).sum(function(d) { return d.other; }).avg(true);

        reducer(group);

        values = group;
    });

    it('has three groups with proper counts', function (topic) {
        expect(values.top(Infinity).length).toEqual(3);

        var vals = {};
        values.top(Infinity).forEach(function (d) {
            vals[d.key] = d.value['x'];
        });

        expect(vals['one'].count).toEqual(3);
        expect(vals['two'].count).toEqual(2);
        expect(vals['three'].count).toEqual(1);

        values.top(Infinity).forEach(function (d) {
            vals[d.key] = d.value['y'];
        });

        expect(vals['one'].count).toEqual(3);
        expect(vals['two'].count).toEqual(2);
        expect(vals['three'].count).toEqual(1);
    });

    it('has sums as expected', function (topic) {
        expect(values.top(Infinity).length).toEqual(3);

        var vals = {};
        values.top(Infinity).forEach(function (d) {
            vals[d.key] = d.value['x'];
        });

        expect(vals['one'].sum).toEqual(10);
        expect(vals['two'].sum).toEqual(8);
        expect(vals['three'].sum).toEqual(3);

        values.top(Infinity).forEach(function (d) {
            vals[d.key] = d.value['y'];
        });

        expect(vals['one'].sum).toEqual(5);
        expect(vals['two'].sum).toEqual(4);
        expect(vals['three'].sum).toEqual(4);
    });

    it('has averages as expected', function (topic) {
        expect(values.top(Infinity).length).toEqual(3);

        var vals = {};
        values.top(Infinity).forEach(function (d) {
            vals[d.key] = d.value['x'];
        });

        expect(vals['one'].avg).toBeUndefined();
        expect(vals['two'].avg).toBeUndefined();
        expect(vals['three'].avg).toBeUndefined();

        values.top(Infinity).forEach(function (d) {
            vals[d.key] = d.value['y'];
        });

        expect(Math.round(vals['one'].avg)).toEqual(Math.round(5/3));
        expect(Math.round(vals['two'].avg)).toEqual(Math.round(4/2));
        expect(Math.round(vals['three'].avg)).toEqual(Math.round(4/1));
    });

    it('can take a function to create keys dynamically', function() {
      var data = crossfilter([
          { foo: 'one', x: 1, other: 2 },
          { foo: 'two', x: 2, other: 1 },
          { foo: 'three', x: 3, other: 4 },
          { foo: 'one', x: 4, other: 1 },
          { foo: 'one', x: 5, other: 2 },
          { foo: 'two', x: 6, other: 3 },
      ]);

      var dim = data.dimension(function(){return 'all';});

      var group = reductio()
        .count('x')
        .sum('other')
        .avg(true)
        .value(function(d){
          return d.foo;
        })(dim.groupAll());

        expect(group.value().one.count).toBe(10);
        expect(group.value().one.sum).toBe(5);
        expect(group.value().one.avg).toBe(0.5);

        expect(group.value().two.count).toBe(8);
        expect(group.value().two.sum).toBe(4);
        expect(group.value().two.avg).toBe(0.5);

        expect(group.value().three.count).toBe(3);
        expect(group.value().three.sum).toBe(4);
        expect(group.value().three.avg).toBe(4/3);
    });

    it('they keys function can be marked as multi in which case the aggregation is run once for every key in the array returned', function() {
      var data = crossfilter([
          { foo: ['one', 'two'], x: 1, other: 2 },
          { foo: ['two', 'three'], x: 2, other: 1 },
          { foo: ['three'], x: 3, other: 4 },
          { foo: ['one'], x: 4, other: 1 },
          { foo: ['one', 'two'], x: 5, other: 2 },
          { foo: ['two'], x: 6, other: 3 },
      ]);

      var dim = data.dimension(function(){return 'all';});

      var group = reductio()
        .count('x')
        .sum('other')
        .avg(true)
        .value(function(d){
          return d.foo;
        }, true)(dim.groupAll());

        expect(group.value().one.count).toBe(10);
        expect(group.value().one.sum).toBe(5);
        expect(group.value().one.avg).toBe(0.5);

        expect(group.value().two.count).toBe(14);
        expect(group.value().two.sum).toBe(8);
        expect(group.value().two.avg).toBe(8/14);

        expect(group.value().three.count).toBe(5);
        expect(group.value().three.sum).toBe(5);
        expect(group.value().three.avg).toBe(1);
    });
});
