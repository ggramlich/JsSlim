package jsSlim;

import fitnesse.slim.Jsr223Bridge;
import fitnesse.slim.NameTranslator;
import fitnesse.slim.NameTranslatorIdentity;
import fitnesse.slim.SlimFactory;
import fitnesse.slim.StatementExecutorInterface;

public class JsSlimFactory extends SlimFactory {
  private static Jsr223Bridge jsBridge;
  private String includePath;

  public JsSlimFactory(String includePath) {
    this.includePath = includePath;
  }
  
  public Jsr223Bridge getBridge() {
    if (null == jsBridge) {
      jsBridge = new JsBridge(includePath);
    }
    return jsBridge;
  }
  
  public StatementExecutorInterface getStatementExecutor() throws Exception {
    return new JsStatementExecutor(getBridge(), getClassLoader());
  }

  private JsClassLoader getClassLoader() {
    return new JsClassLoader(includePath, new FileFinder());
  }

  @Override
  public NameTranslator getMethodNameTranslator() {
    return new NameTranslatorIdentity();
  }
  
}
