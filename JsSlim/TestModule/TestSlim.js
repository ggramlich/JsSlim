(function () {
    function TestSlim(x) {
        this.init(x);
    }
    
    TestSlim.prototype = {
        _constructorArg: 0,
        _niladCalled: false,
        value: null,
        
        init: function (x) {
            if (undefined === x) {
                x = 0;
            } else {
                x = parseInt(x, '10');
            }
            if (isNaN(x)) {
                throw new Error('Bad Argument');
            }
            this._constructorArg = x;
        },
        
        returnConstructorArg: function () {
            return this._constructorArg;
        },
        
        nilad: function () {
            this._niladCalled = true;
        },
        
        niladWasCalled: function () {
            return this._niladCalled;
        },
        
        returnString: function () {
            return "string";
        },
        
        returnInt: function () {
            return 7;
        },
        
        echoBoolean: function (value) {
            return JsSlim.Converter.toBool(value);
        },
        
        getValue: function () {
            return this.value;
        },
        
        oneString: function (value) {
            this.value = "" + value;
        },
        
        oneInt: function (value) {
            this.value = JsSlim.Converter.toNumber(value);
        },
        
        oneDouble: function (value) {
            this.value = 1 * value;
        },
        
        oneDate: function (value) {
            this.value = JsSlim.Converter.toDate(value);
        },
        
        oneList: function (value) {
            this.list = JsSlim.Converter.toArray(value);
        },
        
        getListArg: function () {
            return this.list;
        },
        
        manyArgs: function (intArg, doubleArg, charArg) {
            this.intArg = JsSlim.Converter.toNumber(intArg);
            this.doubleArg = JsSlim.Converter.toNumber(doubleArg);
            this.charArg = charArg;
        },
        
        getIntegerObjectArg: function () {
            return this.intArg;
        },
        
        getDoubleObjectArg: function () {
            return this.doubleArg;
        },
        
        getCharArg: function () {
            return this.charArg;
        },
        
        setStringArray: function (value) {
            this.stringArray = JsSlim.Converter.toArray(value);
        },
        
        getStringArray: function () {
            return JsSlim.Converter.toString(this.stringArray);
        },
        
        setIntegerArray: function (value) {
            try {
                this.integerArray = this.convertListToIntegerArray(value);
            } catch (e) {
                throw new JsSlim.Error('CANT_CONVERT_TO_INTEGER_LIST');
            }
        },
        
        convertListToIntegerArray: function (list) {
            array = JsSlim.Converter.toArray(list);
            for (var i in array) {
                array[i] = JsSlim.Converter.toNumber(array[i]);
            }
            return array;
        },
        
        getIntegerArray: function () {
            return JsSlim.Converter.toString(this.integerArray);
        },
        
        setBooleanArray: function (value) {
            this.booleanArray = this.convertListToBooleanArray(value);
        },
        
        convertListToBooleanArray: function (list) {
            array = JsSlim.Converter.toArray(list);
            for (var i in array) {
                array[i] = JsSlim.Converter.toBool(array[i]);
            }
            return array;
        },
        
        getBooleanArray: function () {
            return JsSlim.Converter.toString(this.booleanArray);
        },
        
        setDoubleArray: function (value) {
            try {
                this.doubleArray = this.convertListToDoubleArray(value);
            } catch (e) {
                throw new JsSlim.Error('CANT_CONVERT_TO_DOUBLE_LIST');
            }
        },
        
        convertListToDoubleArray: function (list) {
            array = JsSlim.Converter.toArray(list);
            for (var i in array) {
                array[i] = JsSlim.Converter.toDouble(array[i]);
            }
            return array;
        },
        
        getDoubleArray: function () {
            return JsSlim.Converter.toString(this.doubleArray);
        },
        
        nullString: function () {
            return null;
        },
        
        echoString: function (string) {
            return string;
        },
        
        addTo: function (x, y) {
            return (1 * x) + (1 * y);
        },
        
        echoInt: function (value) {
            return JsSlim.Converter.toInt(value);
        },
        
        echoList: function (list) {
            return list;
        },
        
        voidFunction: function () {
        },
        
        throwNormal: function () {
            throw new Error('normal exception');
        },
        
        throwStopping: function () {
            var StopError = new Error('test stopped in TestSlim');
            StopError.name = 'StopTest';
            throw StopError;
        },
        
        getClass: function () {
            return "TestModule.TestSlim";
        }
    };
    TestModule.TestSlim = TestSlim;
})();

