// Set the global object in Rhino context
// Take a look at
// http://ejohn.org/blog/bringing-the-browser-to-the-server/
if ('undefined' === typeof window) {
    var window = this;
}

importClass(java.util.List);
importClass(java.util.ArrayList);
var JsSlim = {};
(function () {
    JsSlim = {
        EXCEPTION_TAG: "__EXCEPTION__:",
        EXCEPTION_STOP_TEST_TAG: "__EXCEPTION__:ABORT_SLIM_TEST:",
        
        setFileEvaluator: function (fileEvaluator) {
            self.fileEvaluator = fileEvaluator;
        },
        
        loadJsFile: function (fileName) {
            return self.fileEvaluator.evaluateFile(fileName);
        },
        
        loadJsFileResource: function (fileName) {
            return self.fileEvaluator.evaluateFileResource(fileName);
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
    var self = JsSlim;
})();

function getStatementExecutor(variables, fileEvaluator) {
    JsSlim.setFileEvaluator(fileEvaluator);
    JsSlim.loadJsFileResource('JsSlim/Error.js');
    JsSlim.loadJsFileResource('JsSlim/StatementExecutor.js');
    JsSlim.loadJsFileResource('JsSlim/StatementExecutorProxy.js');
    JsSlim.loadJsFileResource('JsSlim/Converter.js');
    return new JsSlim.StatementExecutorProxy(variables);
}
