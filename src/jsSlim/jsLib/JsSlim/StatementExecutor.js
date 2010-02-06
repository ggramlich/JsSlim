(function () {
    var StatementExecutor = function (variables) {
        this.init(variables);
    };

    StatementExecutor.prototype = {
        init: function (variables) {
            this._variables = variables;
            this._instances = {instances: {}, constructors: {}};
            this._libraries = [];
            this._paths = [];
            this._stopRequested = false;
            this._global = window;
        },
        
        setGlobal: function (global) {
            this._global = global;
        },
        
        setVariable: function (name, value) {
            this._variables.setVariable(name, value);
        },
        
        replaceVariables: function (args) {
            return this._variables.replaceVariables(args);
        },
        
        convertHashTableInArguments: function (args) {
            for (var i = 0; i < args.length; i++) {
                var hash = JsSlim.Converter.htmlTableToHash(args[i]);
                if (undefined !== hash) {
                    args[i] = hash;
                } else {
                    // Remove side effects from java.lang.String
                    if (args[i] instanceof String) {
                        args[i] = String(args[i]);
                    }
                }
            }
            return args;
        },
        
        create: function (instanceName, className, constructorArguments) {
            try {
                constructorArguments = this.replaceVariables(constructorArguments);
                constructorArguments = this.convertHashTableInArguments(constructorArguments);
                var instance = this.constructInstance(className, constructorArguments);
                if (this.isLibraryName(instanceName)) {
                    this._libraries.unshift(instance);
                }
                this.putInstance(instanceName, instance, className);
                return 'OK';
            } catch (e) {
                if (!(e instanceof JsSlim.InstantiationError)) {
                    e = new JsSlim.InstantiationError(className, constructorArguments.length, e.toString());
                }
                return this.exceptionToString(e);
            }
        },
        
        isLibraryName: function (instanceName) {
            return 'library' === instanceName.substr(0, 'library'.length);
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
                args = this.convertHashTableInArguments(args);
                var callback = this.getCallback(instanceName, methodName, args);
                // Under Windows, error is not caught if method invocation is returned directly.
                var result = callback.apply(args);
                return result;
            } catch (e) {
                return this.exceptionToString(e);
            }
        },
        
        createCallback: function (instance, method) {
            return new JsSlim.Callback(instance, method);
        },
        
        createCallbackFromMethodName: function (instance, methodName) {
            var method;
            if (undefined === instance) {
                method = undefined;
            } else {
                method = instance[methodName];
            }
            return this.createCallback(instance, method);
        },
        
        getCallback: function (instanceName, methodName, args) {
            var instance = this.getInstance(instanceName);
            var callback = this.createCallbackFromMethodName(instance, methodName);
            if ('function' !== typeof callback.method) {
                callback = this.getCallbackFromSystemUnderTest(instance, methodName);
            }
            if ('function' !== typeof callback.method) {
                callback = this.getCallbackFromLibrary(methodName);
            }
            if ('function' === typeof callback.method) {
                return callback;
            }
            if (undefined === instance) {
                throw new JsSlim.Error('NO_INSTANCE ' + instanceName + '.');
            }
            throw new JsSlim.Error('NO_METHOD_IN_CLASS ' + methodName + '[' + args.length + '] ' + this.getClassName(instanceName) + '.');
        },
        
        getCallbackFromSystemUnderTest: function (instance, methodName) {
            var systemUnderTest = this.getSystemUnderTestFromInstance(instance);
            return this.createCallbackFromMethodName(systemUnderTest, methodName);
        },
        
        getSystemUnderTestFromInstance: function (instance) {
            if (undefined === instance) {
                return;
            }
            if ('function' === typeof instance.sut) {
                return instance.sut.apply(instance);
            }
            if (undefined !== instance.systemUnderTest) {
                return instance.systemUnderTest;
            }
        },
        
        getCallbackFromLibrary: function (methodName) {
            for (var key in this._libraries) {
                var instance = this._libraries[key];
                if ('function' === typeof instance[methodName]) {
                    return this.createCallbackFromMethodName(instance, methodName);
                }
            }
            return this.createCallbackFromMethodName();
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
            return this._instances.instances[instanceName];
        },
        
        getClassName: function (instanceName) {
            return this._instances.constructors[instanceName];
        },
        
        getFirstConstructorFromPath: function (className, global) {
            if (undefined === global) {
                global = this._global;
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

    JsSlim.Callback = function (instance, method) {
        this.instance = instance;
        this.method = method;
        this.apply = function (args) {
            return this.method.apply(this.instance, args);
        };
    };

})();
