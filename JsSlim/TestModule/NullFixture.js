if ('undefined' == typeof TestModule) {
    TestModule = {};
}

TestModule.NullFixture = function () {
    this.getNull = function () {
        return null;
    };
};
