if ('undefined' == typeof TestModule) {
    TestModule = {};
}
if ('undefined' == typeof TestModule.TestSlimInThisPackageShouldNotBeTheOneUsed) {
    TestModule.TestSlimInThisPackageShouldNotBeTheOneUsed = {};
}

(function () {
    function TestSlim(x) {
        this.init(x);
    }
    
    TestSlim.prototype = {
        returnString: function () {
            return "other string";
        }
    };
    TestModule.TestSlimInThisPackageShouldNotBeTheOneUsed.TestSlim = TestSlim;
})();

