TestModule.MapReceptor = function () {
    this._map = {};
    
    this.setMap = function (map) {
        if (map instanceof String) {
            map = {};
        }
        this._map = this.getSortedMap(map);
        return true;
    };
    
    this.getSortedMap = function (map) {
        var keys = [];
        for (var key in map) {
            keys.push(key);
        }
        keys.sort();
        var sortedMap = {};
        for (var i = 0; i < keys.length; i++) {
            key = keys[i];
            sortedMap[key] = map[key];
        }
        return sortedMap;
    };
    
    this.query = function () {
        return JsSlim.Converter.hashToPairs(this._map);
    };
};
