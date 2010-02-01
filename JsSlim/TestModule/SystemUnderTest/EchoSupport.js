TestModule.SystemUnderTest.EchoSupport = function () {
    this._echoCalled = false;
    this._speakCalled = false;
    
    this.echo = function () {
        this._echoCalled = true;
    };
    
    this.echoCalled = function () {
        return this._echoCalled;
    };
    
    this.speak = function () {
        this._speakCalled = true;
    };
    
    this.speakCalled = function () {
        return this._speakCalled;
    };
};
