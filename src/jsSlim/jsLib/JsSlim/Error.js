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
