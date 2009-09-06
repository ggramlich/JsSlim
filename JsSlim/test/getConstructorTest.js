eval(loadFile("src/jsSlim/jsLib/JsSlim.js"));

var executor;

testCases(test,
    function setUp() {
        executor = new JsSlim.StatementExecutor(null);
    },
    
    function noConstructorFound() {
        assert.that(executor.getConstructor("ab", {}), isNull("unknown constructor is not null"));
    },
    
    function constructorFoundAtFirstLevel() {
        assert.that(executor.getConstructor("ab", {ab: "y"}), eq("y"));
    },
    
    function constructorFoundAtFirstLevelCapitalized() {
        assert.that(executor.getConstructor("ab", {Ab: "y"}), eq("y"));
    },
    
    function constructorFoundAtFirstLevelMostSpecific() {
        assert.that(executor.getConstructor("ab", {ab: "y", Ab: "z"}), eq("y"));
        assert.that(executor.getConstructor("Ab", {ab: "y", Ab: "z"}), eq("z"));
    },
    
    function constructorFoundAtSecondLevel() {
        assert.that(executor.getConstructor("ab.cd", {ab: {cd: "y"}}), eq("y"));
    },
    
    function constructorFoundAtSecondLevelCapitalized() {
        var obj = {Ab: {Cd: "y"}};
        assert.that(executor.getConstructor("Ab.cd", obj), eq("y"));
        assert.that(executor.getConstructor("ab.cd", obj), eq("y"));
        assert.that(executor.getConstructor("ab.Cd", obj), eq("y"));
    },
    
    function constructorFoundAtSecondLevelMostSpecific() {
        var obj = {ab: {cd: "a", Cd: "b"}, Ab: {cd: "x", Cd: "y"}};
        assert.that(executor.getConstructor("ab.cd", obj), eq("a"));
        assert.that(executor.getConstructor("ab.Cd", obj), eq("b"));
        assert.that(executor.getConstructor("Ab.cd", obj), eq("x"));
        assert.that(executor.getConstructor("Ab.Cd", obj), eq("y"));
    },
    
    function constructorReturnsObject() {
        var inner = {a: function () {
            return 1;
        }};
        assert.that(executor.getConstructor("ab.cd", {ab: {cd: inner}}), eq(inner));
    },
    
    function pathIsIgnoredIfClassMatchesExactly() {
        var obj = {ab: {ab: {cd: "a"}, cd: "b"}};
        executor.addPath("ab");
        assert.that(executor.getFirstConstructorFromPath("ab.cd", obj), eq("b"));
        assert.that(executor.getFirstConstructorFromPath("ab.ab.cd", obj), eq("a"));
    },
    
    function constructorIsFoundInPath() {
        var obj = {ab: {cd: {ef: "a"}}};
        assert.that(executor.getFirstConstructorFromPath("cd.ef", obj), isNull());
        executor.addPath("ab");
        assert.that(executor.getFirstConstructorFromPath("cd.ef", obj), eq("a"));
        executor.addPath("ab.cd");
        assert.that(executor.getFirstConstructorFromPath("cd.ef", obj), eq("a"));
        assert.that(executor.getFirstConstructorFromPath("ef", obj), eq("a"));
    },
    
    function constructorIsFoundInPathThatWasAddedLast() {
        var obj = {ab: {cd: {ef: "a"}, ef: "b"}};
        executor.addPath("ab.cd");
        assert.that(executor.getFirstConstructorFromPath("ef", obj), eq("a"));
        executor.addPath("ab");
        assert.that(executor.getFirstConstructorFromPath("ef", obj), eq("b"));
    }
);
