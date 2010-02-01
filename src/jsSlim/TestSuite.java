package jsSlim;
import java.io.File;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)
@Suite.SuiteClasses(
  {
    JsClassLoaderTest.class,
    JsBridgeTest.class,
    JsSlimInstanceCreationTest.class,
    JsSlimMethodInvocationTest.class,
    JsListExecutorTest.class,
    JsSlimServiceTest.class,
    JsStatementExecutorTest.class
  }
)
public class TestSuite {
  public static String getTestIncludePath() {
    return new File("JsSlim").getAbsolutePath();
  }
  
}
