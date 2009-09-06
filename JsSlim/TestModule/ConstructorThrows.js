if ('undefined' == typeof TestModule) {
    TestModule = {};
}

TestModule.ConstructorThrows = function (message) {
    throw new Error(message);
};
