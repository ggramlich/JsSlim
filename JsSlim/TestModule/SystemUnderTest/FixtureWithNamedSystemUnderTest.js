JsSlim.loadJsFile('TestModule/SystemUnderTest/MySystemUnderTest.js');

TestModule.SystemUnderTest.FixtureWithNamedSystemUnderTest = function () {
    this._echoCalled = false;
    this.systemUnderTest = new TestModule.SystemUnderTest.MySystemUnderTest();
    
    this.echo = function () {
        this._echoCalled = true;
    };
    
    this.echoCalled = function () {
        return this._echoCalled;
    };
    
    this.getSystemUnderTest = function () {
        return this.systemUnderTest;
    };
};
