TestModule.NormalConstructor = function (value) {
    this._value = value;
    
    this.getValue = function () {
        return this._value;
    };
};
