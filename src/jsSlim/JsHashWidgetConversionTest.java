package jsSlim;

import static jsSlim.TestSuite.getTestIncludePath;

import org.junit.AfterClass;
import org.junit.BeforeClass;

import fitnesse.slim.HashWidgetConversionTestBase;
import fitnesse.slim.StatementExecutorInterface;

public class JsHashWidgetConversionTest extends HashWidgetConversionTestBase {

  private static JsSlimFactory slimFactory;

  @BeforeClass
  public static void setUpClass() {
    slimFactory = new JsSlimFactory(getTestIncludePath());
  }

  @AfterClass
  public static void tearDownClass() {
    slimFactory.stop();
  }

  @Override
  protected StatementExecutorInterface createStatementExecutor()
      throws Exception {
    StatementExecutorInterface statementExecutor = slimFactory
        .getStatementExecutor();
    statementExecutor.addPath("TestModule");
    return statementExecutor;
  }

  @Override
  protected String mapReceptorClassName() {
    return "MapReceptor";
  }

  @Override
  protected String mapConstructorClassName() {
    return "MapInConstructor";
  }
}
