TestModule.SystemUnderTest.FileSupport = function () {
    this._deleteCalled = false;
    
    this.callDelete = function () {
        this._deleteCalled = true;
    };
    
    this.deleteCalled = function () {
        return this._deleteCalled;
    };
};
