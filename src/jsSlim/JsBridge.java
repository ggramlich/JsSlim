package jsSlim;

import java.io.InputStream;
import java.io.InputStreamReader;

import javax.script.Invocable;
import javax.script.ScriptEngine;

import fitnesse.slim.Jsr223Bridge;
import fitnesse.slim.VariableStore;

public class JsBridge extends Jsr223Bridge {
  private String includePath;
  private boolean isJsInitialized = false;
  private static final String ENGINE_NAME = "javascript";
  private static final String STATEMENT_EXECUTOR_FACTORY_FUNCTION = "getStatementExecutor";
  private static final String JS_SLIM_SCRIPT = "jsLib/JsSlim.js";

  public JsBridge(String includePath) {
    this.includePath = includePath;
  }

  @Override
  public Object getStatementExecutor() throws Exception {
    initJsSlim();
    return getInvocable().invokeFunction(STATEMENT_EXECUTOR_FACTORY_FUNCTION, new Object[]{new VariableStore()});
  }

  public Invocable getInvocable() {
    return (Invocable) getScriptEngine();
  }

  @Override
  public Object invokeMethod(Object thiz, String name, Object... args) throws Exception {
    return getInvocable().invokeMethod(thiz, name, args);
  }

  @Override
  public String getEngineName() {
    return ENGINE_NAME;
  }

  public String getIncludePath() {
    return includePath;
  }

  @Override
  public void close() {
  }

  private void initJsSlim() throws Exception {
    if (isJsInitialized) {
      return;
    }
    ScriptEngine engine = getScriptEngine();
    engine.eval(getJsSlimScriptAsStreamReader());
    isJsInitialized = true;
  }

  private InputStreamReader getJsSlimScriptAsStreamReader() {
    InputStream in = getClass().getResourceAsStream(JS_SLIM_SCRIPT);
    return new InputStreamReader(in);
  }

}
