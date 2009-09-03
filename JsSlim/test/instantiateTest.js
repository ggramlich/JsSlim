eval(loadFile("src/jsSlim/jsLib/JsSlim.js"));

var executor;

testCases(test,
    function setUp() {
        executor = getStatementExecutor(null);
    },
    
    function simpleObjectGivesSimpleObject() {
        var obj = {};
        assert.that(executor.instantiate(obj), eq(obj));
    },
    
    function simpleObjectWithInitMethodCallsInit() {
        var obj = {slimInit: function () {}};
        assert.mustCall(obj, "slimInit");
        assert.that(executor.instantiate(obj), eq(obj));
    },
    
    function simpleObjectWithInitMethodAndArguments() {
        var inner = {x: 1};
        var obj = {slimInit: function (a, b) {
            obj.a = a;
            obj.b = b;
        }};
        var result = executor.instantiate(obj, ['a', inner]);
        assert.that(result.a, eq('a'));
        assert.that(result.b, eq(inner));
    },
    
    function simpleObjectWithInitMethodAndArgumentsSetsThisContext() {
        var inner = {x: 1};
        var obj = {slimInit: function (a, b) {
            this.a = a;
            this.b = b;
        }};
        var result = executor.instantiate(obj, ['a', inner]);
        assert.that(result.a, eq('a'));
        assert.that(result.b, eq(inner));
    },
    
    function simpleObjectWithFactoryMethodCallsFactory() {
        var inner = {x: 1};
        var obj = {slimFactory: function () {
            return inner;
        }};
        assert.mustCall(obj, "slimFactory");
        assert.that(executor.instantiate(obj), eq(inner));
    },
    
    function simpleObjectInitOverridesFactory() {
        var inner = {x: 1};
        var obj = {
            slimInit: function (a, b) {
                this.a = a;
                this.b = b;
            },
            slimFactory: function () {
                return inner;
            }
        };
        var result = executor.instantiate(obj, ['a', inner]);
        assert.that(result.a, eq('a'));
        assert.that(result.b, eq(inner));
        assert.that('undefined' === typeof result.x, isTrue());
    },
    
    function simpleObjectWithFactoryMethodCallsFactoryWithArguments() {
        var inner = {x: 1};
        var obj = {slimFactory: function (a, b) {
            return {a: a, b: inner};
        }};
        var result = executor.instantiate(obj, ['a', inner]);
        assert.that(result.a, eq('a'));
        assert.that(result.b, eq(inner));
    },
    
    function simpleObjectWithFactoryMethodSetsThisContext() {
        var inner = {x: 1};
        var obj = {
            slimFactory: function (a, b) {
                return {a: a, b: this.addTwo(b.x)};
            },
            addTwo: function (x) {
                return x + 2;
            }
        };
        var result = executor.instantiate(obj, ['a', inner]);
        assert.that(result.a, eq('a'));
        assert.that(result.b, eq(3));
    },
    
    function simpleConstructor() {
        function Constructor() {
            this.x = 1;
        }
        var result = executor.instantiate(Constructor);
        assert.that(result.x, eq(1));
        assert.that(result, hasConstructor('Constructor'));
    },
    
    function constructorWithArguments() {
        var inner = {x: 1};
        function Constructor(a, b) {
            this.a = a;
            this.b = b;
        }
        var result = executor.instantiate(Constructor, ['a', inner]);
        assert.that(result, hasConstructor('Constructor'));
        assert.that(result.__proto__.constructor, eq(Constructor));
        assert.that(result.a, eq('a'));
        assert.that(result.b, eq(inner));
    },
    
    function anonymousConstructor() {
        var c = function (x) {
            this.x = x;
        };
        var result = executor.instantiate(c, [2]);
        assert.that(result.x, eq(2));
        assert.that(result.__proto__.constructor, eq(c));
    },
    
    function getArgCountForSimpleObject() {
        var obj = {};
        assert.that(executor.getArgCount(obj), eq(0));
    },

    function getArgCountForInit() {
        var obj = {slimInit: function (a, b) {}};
        assert.that(executor.getArgCount(obj), eq(2));
    },

    function getArgCountForFactory() {
        var obj = {slimFactory: function (a, b, c) {}};
        assert.that(executor.getArgCount(obj), eq(3));
    },

    function getArgCountForInitOverridesFactory() {
        var obj = {
            slimInit: function (a, b) {},
            slimFactory: function (a, b, c) {}
        };
        assert.that(executor.getArgCount(obj), eq(2));
    },

    function getArgZeroCountForConstructor() {
        var obj = function () {};
        assert.that(executor.getArgCount(obj), eq(0));
    },

    function getArgCountForConstructor() {
        function Constructor(a, b, c, d) {}
        assert.that(executor.getArgCount(Constructor), eq(4));
    }
);

