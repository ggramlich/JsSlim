package jsSlim;

import static jsSlim.TestSuite.getTestIncludePath;

import org.junit.BeforeClass;

import fitnesse.slim.Jsr223StatementExecutorTestBase;

public class JsStatementExecutorTest extends Jsr223StatementExecutorTestBase {

  @BeforeClass
  public static void setUpClass() {
    slimFactory = new JsSlimFactory(getTestIncludePath());
    bridge = slimFactory.getBridge();
  }

  protected String getTestModulePath() {
    return "TestModule.SystemUnderTest";
  }

  @Override
  protected String deleteMethodName() {
    return "callDelete";
  }

}
