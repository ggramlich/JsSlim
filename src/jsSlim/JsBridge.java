package jsSlim;

import javax.script.Invocable;

import fitnesse.slim.Jsr223Bridge;
import fitnesse.slim.VariableStore;

public class JsBridge extends Jsr223Bridge {
  private boolean isJsInitialized = false;
  private static final String ENGINE_NAME = "javascript";
  private static final String STATEMENT_EXECUTOR_FACTORY_FUNCTION = "getStatementExecutor";
  private static final String JS_SLIM_SCRIPT = "getStatementExecutor.js";
  private JsFileEvaluator jsFileEvaluator;
  

  @Override
  public Object getStatementExecutor() throws Exception {
    initJsSlim();
    return getInvocable().invokeFunction(STATEMENT_EXECUTOR_FACTORY_FUNCTION, new Object[]{new VariableStore(), jsFileEvaluator});
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

  @Override
  public void close() {
  }

  private void initJsSlim() throws Exception {
    if (isJsInitialized) {
      return;
    }
    jsFileEvaluator.evaluateFileResource(JS_SLIM_SCRIPT);
    isJsInitialized = true;
  }

  public JsFileEvaluator getJsFileEvaluator() {
    return jsFileEvaluator;
  }

  public void setJsFileEvaluator(JsFileEvaluator jsFileEvaluator) {
    this.jsFileEvaluator = jsFileEvaluator;
  }
}
