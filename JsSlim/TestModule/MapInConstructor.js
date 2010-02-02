TestModule.MapInConstructor = function (map) {
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
    
    if (map instanceof String) {
        map = {};
    }
    
    this._map = this.getSortedMap(map);

    this.query = function () {
        return JsSlim.Converter.hashToPairs(this._map);
    };
};
