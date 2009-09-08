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
