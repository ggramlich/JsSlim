package jsSlim;

import fitnesse.slim.Jsr223Bridge;
import fitnesse.slim.NameTranslator;
import fitnesse.slim.NameTranslatorIdentity;
import fitnesse.slim.SlimFactory;
import fitnesse.slim.StatementExecutorInterface;

public class JsSlimFactory extends SlimFactory {
  private static JsBridge jsBridge;
  private String includePath;
  private FileFinder fileFinder;
  
  public JsSlimFactory(String includePath) {
    this.includePath = includePath;
  }
  
  public Jsr223Bridge getBridge() {
    return this.getJsBridge();
  }
  
  private JsBridge getJsBridge() {
    if (null == jsBridge) {
      jsBridge = new JsBridge();
      JsFileEvaluator jsFileEvaluator = new JsFileEvaluator(includePath, getFileFinder(), jsBridge.getScriptEngine());
      jsBridge.setJsFileEvaluator(jsFileEvaluator);
    }
    return jsBridge;
  }
  
  public StatementExecutorInterface getStatementExecutor() throws Exception {
    return new JsStatementExecutor(getBridge(), getClassLoader());
  }
  
  private JsClassLoader getClassLoader() {
    return new JsClassLoader(getJsFileEvaluator(), getFileFinder());
  }
  
  private JsFileEvaluator getJsFileEvaluator() {
    return this.getJsBridge().getJsFileEvaluator();
  }
  
  @Override
  public NameTranslator getMethodNameTranslator() {
    return new NameTranslatorIdentity();
  }
  
  private FileFinder getFileFinder() {
    if (null == fileFinder) {
      fileFinder = new FileFinder();
    }
    return fileFinder;
  }
  
}
