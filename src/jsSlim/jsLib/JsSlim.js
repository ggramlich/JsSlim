// Set the global object in Rhino context
// Take a look at
// http://ejohn.org/blog/bringing-the-browser-to-the-server/
if ('undefined' === typeof window) {
    var window = this;
}

var JsSlim = {
    EXCEPTION_TAG: "__EXCEPTION__:",

    tagErrorMessage: function (message) {
        return this.EXCEPTION_TAG + message;
    },

    errorMessage: function (message) {
        return "message:<<" + message + ">>";
    },
    
    ucfirst: function (str) {
        str += '';
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1);
    },
    
    extend: function (parent, child) {
        var F = function () {};
        F.prototype = parent.prototype;
        child.prototype = new F();
        child.prototype.constructor = child;
        return child;
    }
};

(function () {
    var InstantiationError = function (className, argCount, additional) {
        this.message = JsSlim.errorMessage("COULD_NOT_INVOKE_CONSTRUCTOR " + className + "[" + argCount + "]" + additional);
    };
    JsSlim.InstantiationError = JsSlim.extend(Error, InstantiationError);
})();

(function () {
    var StatementExecutor = function (variables) {
        this.init(variables);
    };

    StatementExecutor.prototype = {
        init: function (variables) {
            this.variables = variables;
            this._instances = {};
            this.paths = [];
        },
    
        setVariable: function (name, value) {
            this.variables.setVariable(name, value);
        },
        
        replaceVariables: function (args) {
            args = this._javaArrayToJsArray(args);
            result = this.variables.replaceVariables(args);
            return this._javaArrayToJsArray(result);
        },
        
        _javaArrayToJsArray: function (args) {
            result = [];
            for (var i = 0; i < args.length; i++) {
                result[i] = args[i];
            }
            return result;
        },
        
        create: function (instanceName, className, constructorArguments) {
            try {
                instance = this.constructInstance(
                    className, this.replaceVariables(constructorArguments)
                );
                this._instances[instanceName] = instance;
                return 'OK';
            } catch (e) {
                if (!(e instanceof JsSlim.InstantiationError)) {
                    e = new JsSlim.InstantiationError(className, constructorArguments.length, e.toString());
                }
                return JsSlim.tagErrorMessage(e.toString());
            }
        },
        
        addPath: function (path) {
            this.paths.unshift(path);
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
            if ('undefined' != typeof e) {
                additional = e.toString() + "\n";
            }
            throw new JsSlim.InstantiationError(className, argCount, additional);
        },
        
        getInstance: function (instanceName) {
            return this._instances[instanceName];
        },
        
        getFirstConstructorFromPath: function (className, global) {
            if ('undefined' == typeof global) {
                global = window;
            }
            var Constructor = this.getConstructor(className, global);
            if (null !== Constructor) {
                return Constructor;
            }
            for (var key in this.paths) {
                var fullClassName = this.paths[key] + '.' + className;
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
        }
    };
    JsSlim.StatementExecutor = StatementExecutor;
})();

function getStatementExecutor(variables) {
    return new JsSlim.StatementExecutor(variables);
}
