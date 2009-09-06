eval(loadFile("src/jsSlim/jsLib/JsSlim.js"));

Array.prototype.toString = function () {
    return '[' + this.join(',') + ']';
};

Array.prototype.equals = function (other) {
    if (!(other instanceof Array)) {
        return false;
    }
    return (this.toString() == other.toString());
};

testCases(test,
    function setUp() { },

    function testDateConverts() {
        var date = JsSlim.Converter.toDate('5-Sep-2009');
        assert.that(date, isA(Date));
        assert.that(JsSlim.Converter.dateToString(date), eq('5-Sep-2009'));
    },

    function testArraysEqual() {
        var array1 = ['a', 'b', ['c', 'd'], 'e'];
        var array2 = ['a', 'b', ['c', 'd'], 'e'];
        var array3 = ['a', 'b', ['c', 'f'], 'e'];
        assert.that(array1.equals(array1), isTrue());
        assert.that(array1.equals(array2), isTrue());
        assert.that(array1.equals(array3), isFalse());
    },

    function testArraysEqualSingleWrap() {
        var array1 = [['c', 'd']];
        var array2 = [['c', 'd']];
        var array3 = ['c', 'd'];
        assert.that(array1.length, eq(1));
        assert.that(array3.length, eq(2));
        assert.that(array1.equals(array1), isTrue());
        assert.that(array1.equals(array2), isTrue());
        assert.that(array1.equals(array3), isFalse());
        assert.that(array3.equals(array1), isFalse());
        assert.that(array3.equals(array3), isTrue());
    },

    function testJavaListToArraySingleElement() {
        var list = new ArrayList();
        list.add('a');
        var result = JsSlim.Converter.toArray(list);
        assert.that(result, isA(Array));
        assert.that(['a'].equals(result), isTrue());
        assert.that(['b'].equals(result), isFalse());
    },
    
    function testJavaListToArrayMultipleElements() {
        var list = new ArrayList();
        list.add('a');
        list.add('c');
        list.add('b');
        var result = JsSlim.Converter.toArray(list);
        assert.that(['a', 'c', 'b'].equals(result), isTrue());
    },
    
    function testJavaListToArrayNestedList() {
        var list = new ArrayList();
        list.add('a');
        list.add('b');
        var inner = new ArrayList();
        inner.add('c');
        inner.add('d');
        list.add(inner);
        list.add('e');
        var result = JsSlim.Converter.toArray(list);
        var array = ['a', 'b', ['c', 'd'], 'e'];
        assert.that(array.equals(result), isTrue());
    },
    
    function testJavaListToArrayNestedArray() {
        var list = new ArrayList();
        list.add('a');
        list.add('b');
        var inner = ['c', 'd'];
        list.add(inner);
        list.add('e');
        var result = JsSlim.Converter.toArray(list);
        var array = ['a', 'b', ['c', 'd'], 'e'];
        assert.that(array.equals(result), isTrue());
    },
    
    function testArrayToArrayNestedList() {
        var inner = new ArrayList();
        inner.add('c');
        inner.add('d');
        var list = ['a', 'b', inner, 'e'];
        var result = JsSlim.Converter.toArray(list);
        var array = ['a', 'b', ['c', 'd'], 'e'];
        assert.that(array.equals(result), isTrue());
    },
    
    function testJavaListToArrayJustWrapped() {
        var list = new ArrayList();
        var inner = new ArrayList();
        inner.add('c');
        inner.add('d');
        list.add(inner);
        var result = JsSlim.Converter.toArray(list);
        var array = [['c', 'd']];
        var innerArray = ['c', 'd'];
        assert.that(array.equals(innerArray), isFalse());
        assert.that(array.equals(result), isTrue());
        assert.that(innerArray.equals(result), isFalse());
    }
);
