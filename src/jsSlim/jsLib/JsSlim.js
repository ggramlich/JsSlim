// Set the global object in Rhino context
// Take a look at
// http://ejohn.org/blog/bringing-the-browser-to-the-server/
if ('undefined' === typeof window) {
    var window = this;
}

importClass(java.util.List);
importClass(java.util.ArrayList);

var JsSlim;

(function () {
    var self = {
        EXCEPTION_TAG: "__EXCEPTION__:",
        EXCEPTION_STOP_TEST_TAG: "__EXCEPTION__:ABORT_SLIM_TEST:",
        
        _modules: ["Error", "StatementExecutor", "StatementExecutorProxy", "Converter"],
        
        setFileEvaluator: function (fileEvaluator) {
            self.fileEvaluator = fileEvaluator;
        },
        
        loadJsFile: function (fileName) {
            return self.fileEvaluator.evaluateFile(fileName);
        },
        
        loadJsFileResource: function (fileName) {
            return self.fileEvaluator.evaluateFileResource(fileName);
        },
        
        loadModules: function () {
            for (var i in self._modules) {
                self.loadModule(self._modules[i]);
            }
        },
        
        loadModule: function (module) {
            self.loadJsFileResource('JsSlim/' + module + '.js');
        },
        
        tagError: function (e) {
            return self.tagErrorMessage(e.toString());
        },
        
        tagErrorMessage: function (message) {
            return self.EXCEPTION_TAG + message;
        },
        
        tagStopTestMessage: function (message) {
            return self.EXCEPTION_STOP_TEST_TAG + message;
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
    JsSlim = self;
})();

