if ('undefined' == typeof TestModule) {
    TestModule = {};
}

TestModule.TestSlim = function (x) {
    if (0 === arguments.length) {
        x = 0;
    } else {
        x = parseInt(x, '10');
    }
    if (isNaN(x)) {
        throw new Error('Bad Argument');
    }
    this.constructorArg = x;
};
TestModule.TestSlim.prototype = {
    constructorArg: 0,

    getClass: function () {
        return "TestModule.TestSlim";
    }
};
