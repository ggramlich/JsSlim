package slim;

import fitnesse.slim.SlimFactory;
import fitnesse.slim.StatementExecutorInterface;

public class JsSlimFactory extends SlimFactory {
  private static Bridge jsBridge;
  
  public Bridge getBridge() {
    if (null == jsBridge) {
      jsBridge = new JsBridge();
    }
    return jsBridge;
  }
  
  public StatementExecutorInterface getStatementExecutor() throws Exception {
    return new JsStatementExecutor(getBridge());
  }
  
}
