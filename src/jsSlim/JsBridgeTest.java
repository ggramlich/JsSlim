package jsSlim;

import static org.junit.Assert.*;

import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptException;

import org.junit.*;

import static jsSlim.TestSuite.getTestIncludePath;

public class JsBridgeTest {
  private static JsBridge bridge;
  
  @BeforeClass
  public static void setUpClass() {
    // Creates Bridge only once
    bridge = new JsBridge();
  }
  
  @AfterClass
  public static void tearDownClass() {
    bridge.close();
  }

  @Test
  public void getInternalJavascriptPath() throws Exception {
    File path = new File(getTestIncludePath());
    assertTrue(path.exists());
    assertTrue(path.isAbsolute());
    assertTrue(path.isDirectory());
    assertEquals("JsSlim", path.getName());
  }

  @Test
  public void engineIsOfCorrectType() {
    assertEquals("ECMAScript", bridge.getScriptEngine().getFactory().getLanguageName());
  }

  @Test
  public void getJavascriptFile() throws ScriptException {
    ScriptEngine engine = bridge.getScriptEngine();
    engine.put("x", 4);
    InputStream in = getClass().getResourceAsStream("jsLib/addOne.js");
    InputStreamReader reader = new InputStreamReader(in);
    engine.eval(reader);
    assertEquals(5.0, engine.get("y"));
  }

  @Test
  public void getJsStatementExecutor() throws Exception {
    bridge.setJsFileEvaluator(new JsFileEvaluator(getTestIncludePath(), new FileFinder(), bridge.getScriptEngine()));
    Object statementExecutor = bridge.getStatementExecutor();
    assertNotNull(statementExecutor);
    Invocable inv = (Invocable) bridge.getScriptEngine();
    inv.invokeMethod(statementExecutor, "setVariable", new Object[]{"name", "Bob"});
  }
}
