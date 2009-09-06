package jsSlim;

import static jsSlim.TestSuite.getTestIncludePath;
import fitnesse.slim.SlimServiceTestBase;

public class JsSlimServiceTest extends SlimServiceTestBase {
  protected void startSlimService() throws Exception {
    JsSlimService.main(new String[]{getTestIncludePath(), "8099"});
  }
  
  protected String getImport() {
    return "TestModule";
  }
  
  protected String expectedExceptionMessage() {
    return "Error: normal exception";
  }
  
  protected String expectedStopTestExceptionMessage() {
    return "ABORT_SLIM_TEST:message:<<test stopped in TestSlim>>";
  }
}
