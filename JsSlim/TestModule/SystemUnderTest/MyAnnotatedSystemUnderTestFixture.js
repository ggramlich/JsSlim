if (JsSlim.fileEvaluator) {
    JsSlim.loadJsFile('TestModule/SystemUnderTest/MySystemUnderTest.js');
} else {
    eval(loadFile('JsSlim/TestModule/SystemUnderTest/MySystemUnderTest.js'));
}

TestModule.SystemUnderTest.MyAnnotatedSystemUnderTestFixture = function () {
    this._echoCalled = false;
    this._mySut = new TestModule.SystemUnderTest.MySystemUnderTest();
    
    this.echo = function () {
        this._echoCalled = true;
    };
    
    this.echoCalled = function () {
        return this._echoCalled;
    };
    
    this.getSystemUnderTest = function () {
        return this._mySut;
    };
    
    this.sut = function () {
        return this._mySut;
    };
};
