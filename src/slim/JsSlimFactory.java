package slim;

import fitnesse.slim.Jsr232Bridge;
import fitnesse.slim.SlimFactory;
import fitnesse.slim.StatementExecutorInterface;

public class JsSlimFactory extends SlimFactory {
  private static Jsr232Bridge jsBridge;
  
  public Jsr232Bridge getBridge() {
    if (null == jsBridge) {
      jsBridge = new JsBridge();
    }
    return jsBridge;
  }
  
  public StatementExecutorInterface getStatementExecutor() throws Exception {
    return new JsStatementExecutor(getBridge());
  }
  
}
