// Set the global object in Rhino context
// Take a look at
// http://ejohn.org/blog/bringing-the-browser-to-the-server/
if ('undefined' === typeof window) {
    var window = this;
}

importClass(java.util.List);
importClass(java.util.ArrayList);

var JsSlim = {
    EXCEPTION_TAG: "__EXCEPTION__:",
    EXCEPTION_STOP_TEST_TAG: "__EXCEPTION__:ABORT_SLIM_TEST:",
    
    tagError: function (e) {
        return this.tagErrorMessage(e.toString());
    },
    
    tagErrorMessage: function (message) {
        return this.EXCEPTION_TAG + message;
    },
    
    tagStopTestMessage: function (message) {
        return this.EXCEPTION_STOP_TEST_TAG + message;
    },
    
    errorMessage: function (message) {
        return "message:<<" + message + ">>";
    },
    
    ucfirst: function (str) {
        str += '';
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1);
    },
    
    extend: function (Parent, Child) {
        var F = function () {};
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        return Child;
    }
};

(function () {
    var SlimError = function (message) {
        this.name = 'SlimError';
        this.message = JsSlim.errorMessage(message);
    };
    
    var InstantiationError = function (className, argCount, additional) {
        this.name = 'InstantiationError';
        this.message = JsSlim.errorMessage("COULD_NOT_INVOKE_CONSTRUCTOR " + className + "[" + argCount + "]" + additional);
    };

    JsSlim.Error = JsSlim.extend(Error, SlimError);
    JsSlim.InstantiationError = JsSlim.extend(Error, InstantiationError);
})();

(function () {
    var StatementExecutor = function (variables) {
        this.init(variables);
    };

    StatementExecutor.prototype = {
        init: function (variables) {
            this._variables = variables;
            this._instances = {instances: {}, constructors: {}};
            this._paths = [];
            this._stopRequested = false;
        },
        
        setVariable: function (name, value) {
            this._variables.setVariable(name, value);
        },
        
        replaceVariables: function (args) {
            return this._variables.replaceVariables(args);
        },
        
        create: function (instanceName, className, constructorArguments) {
            try {
                instance = this.constructInstance(
                    className, this.replaceVariables(constructorArguments)
                );
                this.putInstance(instanceName, instance, className);
                return 'OK';
            } catch (e) {
                if (!(e instanceof JsSlim.InstantiationError)) {
                    e = new JsSlim.InstantiationError(className, constructorArguments.length, e.toString());
                }
                return this.exceptionToString(e);
            }
        },
        
        addPath: function (path) {
            this._paths.unshift(path);
            return 'OK';
        },
        
        constructInstance: function (className, args) {
            var Constructor = this.getFirstConstructorFromPath(className);
            if (null === Constructor) {
                this.throwInstantiationError(className, args.length);
            }
            if (this.getArgCount(Constructor) < args.length) {
                this.throwInstantiationError(className, args.length);
            }
            return this.instantiate(Constructor, args);
        },
        
        call: function (instanceName, methodName, args) {
            try {
                args = this.replaceVariables(args);
                instance = this.getInstance(instanceName);
                if ('function' !== typeof instance[methodName]) {
                    throw new JsSlim.Error('NO_METHOD_IN_CLASS ' + methodName + '[' + args.length + '] ' + this.getClassName(instanceName) + '.');
                }
                return instance[methodName].apply(instance, args);
            } catch (e) {
                return this.exceptionToString(e);
            }
        },
        
        exceptionToString: function (e) {
            if (this.isStopTestException(e)) {
                this._stopRequested = true;
                message = e.message;
                if ("" !== message) {
                    message = JsSlim.errorMessage(message);
                }
                return JsSlim.tagStopTestMessage(message);
            }
            return JsSlim.tagError(e);
        },
        
        isStopTestException: function (e) {
            return (-1 !== e.name.indexOf('StopTest'));
        },
        
        instantiate: function (Constructor, args) {
            if (undefined === args) {
                args = [];
            }
            if ('object' == typeof Constructor) {
                return this.getInitializedObject(Constructor, args);
            }
            return this.invokeConstructor(Constructor, args);
        },
        
        invokeConstructor: function (Constructor, args) {
            var F = function () {};
            F.prototype = Constructor.prototype;
            var o = new F();
            Constructor.apply(o, args);
            return o;
        },
        
        getInitializedObject: function (object, args) {
            if (undefined !== object.slimInit) {
                object.slimInit.apply(object, args);
            } else if (undefined !== object.slimFactory) {
                object = object.slimFactory.apply(object, args);
            }
            return object;
        },
        
        getArgCount: function (Constructor) {
            if ('object' == typeof Constructor) {
                return this.getArgCountForObject(Constructor);
            }
            return Constructor.length;
        },
        
        getArgCountForObject: function (object) {
            if (undefined !== object.slimInit) {
                return object.slimInit.length;
            } else if (undefined !== object.slimFactory) {
                return object.slimFactory.length;
            }
            return 0;
        },
        
        throwInstantiationError: function (className, argCount, e) {
            var additional = '';
            if (undefined === typeof e) {
                additional = e.toString() + "\n";
            }
            throw new JsSlim.InstantiationError(className, argCount, additional);
        },
        
        putInstance: function (instanceName, instance, className) {
            this._instances.instances[instanceName] = instance;
            this._instances.constructors[instanceName] = className;
        },
        
        getInstance: function (instanceName) {
            instance = this._instances.instances[instanceName];
            if (undefined === instance) {
                throw new JsSlim.Error('NO_INSTANCE ' + instanceName + '.');
            }
            return instance;
        },
        
        getClassName: function (instanceName) {
            return this._instances.constructors[instanceName];
        },
        
        getFirstConstructorFromPath: function (className, global) {
            if (undefined === global) {
                global = window;
            }
            var Constructor = this.getConstructor(className, global);
            if (null !== Constructor) {
                return Constructor;
            }
            for (var key in this._paths) {
                var fullClassName = this._paths[key] + '.' + className;
                Constructor = this.getConstructor(fullClassName, global);
                if (null !== Constructor) {
                    return Constructor;
                }
            }
            return null;
        },
        
        getConstructor: function (fullyQualifiedName, base) {
            var patharray = fullyQualifiedName.split(".");
            var part = patharray.shift();
            var inner = this.getConstructorPropertyFromObject(base, part);
            if (null === inner) {
                return null;
            }
            if (patharray.length > 0) {
                return this.getConstructor(patharray.join("."), inner);
            }
            return inner;
        },
        
        getConstructorPropertyFromObject: function (object, property) {
            if (undefined === object[property]) {
                property = JsSlim.ucfirst(property);
            }
            if (undefined === object[property]) {
                return null;
            }
            return object[property];
        },
        
        stopHasBeenRequested: function () {
            return this._stopRequested;
        },
        
        reset: function () {
            this._stopRequested = false;
        }
    };
    JsSlim.StatementExecutor = StatementExecutor;
})();

(function () {
    // private class
    var VariableDecorator = function (variables) {
        this._variables = variables;
    };
    
    VariableDecorator.prototype = {
        setVariable: function (name, value) {
            this._variables.setVariable(name, value);
        },
        
        replaceVariables: function (args) {
            stringArgs = this._jsArrayToJavaArray(args);
            result = this._variables.replaceVariables(stringArgs);
            return this._javaArrayToJsArray(result);
        },
        
        _javaArrayToJsArray: function (args) {
            return JsSlim.Converter.toArray(args);
        },
        
        _jsArrayToJavaArray: function (args) {
            var result = [];
            for (var i in args) {
                result[i] = JsSlim.Converter.toJava(args[i]);
            }
            return result;
        }
    };
    
    var StatementExecutorProxy = function (variables) {
        this.init(variables);
    };
    
    StatementExecutorProxy.prototype = {
        init: function (variables) {
            variables = new VariableDecorator(variables);
            this.executor = new JsSlim.StatementExecutor(variables);
        },
        
        setVariable: function (name, value) {
            return this.executor.setVariable(name, value);
        },
        
        replaceVariables: function (args) {
            return this.executor.replaceVariables(args);
        },
        
        addPath: function (path) {
            return this.executor.addPath(path);
        },
        
        create: function (instanceName, className, args) {
            args = JsSlim.Converter.toArray(args);
            return this.executor.create(instanceName, className, args);
        },
        
        getInstance: function (instanceName) {
            return this.executor.getInstance(instanceName);
        },
        
        call: function (instanceName, methodName, args) {
            Array.prototype.toString = function () {
                return '[' + this.join(',') + ']';
            };
            args = JsSlim.Converter.toArray(args);
            var result = this.executor.call(instanceName, methodName, args);
            javaResult = JsSlim.Converter.toJavaString(result);
            resultString = JsSlim.Converter.toString(result);
            return javaResult;
        },
        
        stopHasBeenRequested: function () {
            return this.executor.stopHasBeenRequested();
        },
        
        reset: function () {
            this.executor.reset();
        }
    };
    JsSlim.StatementExecutorProxy = StatementExecutorProxy;

})();

(function () {
    // static class
    var Converter = {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        
        toBool: function (value) {
            if ('boolean' === typeof value) {
                return value;
            }
            if (value instanceof Boolean) {
                return value.valueOf();
            }
            if ('object' === typeof value) {
                value = "" + value;
            }
            if ('string' !== typeof value) {
                return false;
            }
            value = value.toLowerCase();
            return ('true' == value || 'yes' == value);
        },
        
        toNumber: function (value) {
            return this.returnValidNumber(1 * value);
        },
        
        toInt: function (value) {
            return this.returnValidNumber(parseInt(value, 10));
        },
        
        toDouble: function (value) {
            return this.returnValidNumber(parseFloat(value));
        },
        
        returnValidNumber: function (number) {
            if (isNaN(number)) {
                throw new JsSlim.Error('Type conversion error');
            }
            return number;
        },
        
        toArray: function (value) {
            if (value instanceof List) {
                value = value.toArray();
            } else {
                if (value instanceof String) {
                    value = "" + value;
                }
                if ('string' === typeof value) {
                    return self.stringToArray(value);
                }
            }
            var result = [];
            for (var i in value) {
                result[i] = self.javaToJs(value[i]);
            }
            return result;
        },
        
        javaToJs: function (value) {
            if (value instanceof List) {
                return self.toArray(value);
            }
            return value;
        },
        
        stringToArray: function (string) {
            if (('[' != string.charAt(0)) || (']' != string.charAt(string.length - 1))) {
                throw new JsSlim.Error('Invalid array serialization ' + string);
            }
            string = string.substr(1, string.length - 2);
            var array = string.split(',');
            for (var i in array) {
                array[i] = self.trim(array[i]);
            }
            return array;
        },
        
        trim: function (string) {
            return string.replace(/^\s+/, '').replace(/\s+$/, '');
        },
        
        toDate: function (value) {
            // Expected "dd-MMM-yyyy"
            var parts = value.split('-');
            return new Date(parts[0] + ' ' + parts[1] + ' ' + parts[2]);
        },
        
        toString: function (value) {
            if (undefined === value) {
                return '/__VOID__/';
            }
            if (value instanceof Date) {
                return self.dateToString(value);
            }
            if (value instanceof Array) {
                return '[' + value.join(', ') + ']';
            }
            return "" + value;
        },
        
        dateToString: function (date) {
            return date.getDate() + '-' + self.getMonthString(date) + '-' + date.getFullYear();
        },
        
        getMonthString: function (date) {
            return self.months[date.getMonth()];
        },
        
        toJava: function (value) {
            if (value instanceof Array) {
                return self.toJavaList(value);
            }
            if (null === value) {
                return null;
            }
            return value;
        },
        
        toJavaList: function (array) {
            var list = new java.util.ArrayList();
            for (var i in array) {
                list.add(self.toJava(array[i]));
            }
            return list;
        },
        
        toJavaString: function (value) {
            if (value instanceof Array) {
                return self.toJavaListString(value);
            }
            if (null === value) {
                return null;
            }
            return self.toString(value);
        },
        
        toJavaListString: function (array) {
            var list = new java.util.ArrayList();
            for (var i in array) {
                list.add(self.toJavaString(array[i]));
            }
            return list;
        }
    };
    var self = Converter;
    JsSlim.Converter = Converter;
})();

function getStatementExecutor(variables) {
    return new JsSlim.StatementExecutorProxy(variables);
}
