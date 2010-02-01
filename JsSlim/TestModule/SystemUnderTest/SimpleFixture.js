TestModule.SystemUnderTest.SimpleFixture = function () {
    this._echoCalled = false;
    
    this.echo = function () {
        this._echoCalled = true;
    };
    
    this.echoCalled = function () {
        return this._echoCalled;
    };
};
