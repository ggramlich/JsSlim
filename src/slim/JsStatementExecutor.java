package slim;

import fitnesse.slim.Jsr232Bridge;
import fitnesse.slim.Jsr232StatementExecutor;

public class JsStatementExecutor extends Jsr232StatementExecutor {

  public JsStatementExecutor(Jsr232Bridge bridge) throws Exception {
    super(bridge);
  }
}
