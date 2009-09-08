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
