// Filtering tests
describe('Reductio filter value', function () {
    var dim, dim2;

    beforeEach(function () {
        var data = crossfilter([
            { foo: 'one', stack: "A", bar: 1 },
            { foo: 'two', stack: "A", bar: 2 },
            { foo: 'three', stack: "A", bar: 3 },
            { foo: 'one', stack: "B", bar: 4, sparseVal: 5 },
            { foo: 'one', stack: "B", bar: 5, sparseVal: 15 },
            { foo: 'two', stack: "B", bar: 6 },
            { foo: 'one', stack: "Unknown", bar: 1 },
            { foo: 'two', stack: "A", bar: 2 },
            { foo: 'three', stack: "A", bar: 3 },
            { foo: 'one', stack: "Unknown", bar: 4, sparseVal: 5 },
            { foo: 'one', stack: "Unknown", bar: 5, sparseVal: 15 },
            { foo: 'two', stack: "B", bar: 6 },
        ]);

        dim = data.dimension(function (d) { return d.foo; });
        dim2 = data.dimension(function (d) { return d.foo; });
    });

    it('group value should not contain the filtered value', function () {
        var group = reductio()
            .count(true)
            .sum("bar")
            .avg(true)
            .value(function (d) {
                return d.stack;
            }).filter(function (d) { return d.stack !== "Unknown"; })(dim.groupAll());

        expect(Object.keys(group.value())).not.toContain("Unknown");
    });

});
