eval(loadFile("src/jsSlim/jsLib/JsSlim.js"));

function assertUcFirst(expected, given) {
    assert.that(JsSlim.ucfirst(given), eq(expected));
}

testCases(test,
    function setUp() { },

    function testUcFirstEmptyString() {
        assertUcFirst("", "");
    },

    function testUcFirstSingleLetter() {
        assertUcFirst("A", "a");
        assertUcFirst("A", "A");
    },

    function testUcFirstMultipleLetters() {
        assertUcFirst("AB", "aB");
        assertUcFirst("AB", "AB");
    }
);

