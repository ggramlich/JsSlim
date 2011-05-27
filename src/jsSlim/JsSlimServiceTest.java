package jsSlim;

import static jsSlim.TestSuite.getTestIncludePath;
import static org.junit.Assert.*;

import org.junit.Test;

import fitnesse.slim.SlimServiceTestBase;

public class JsSlimServiceTest extends SlimServiceTestBase {
  protected void startSlimService() throws Exception {
    JsSlimService.main(new String[]{"-i", getTestIncludePath(), "8099"});
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

  @Test
  public void validCommandLineWithPort() throws Exception {
    String[] arguments = {"123"};
    assertTrue(JsSlimService.parseCommandLine(arguments));
    assertEquals(123, JsSlimService.port);
  }

  @Test
  public void invalidCommandLineWithoutPort() throws Exception {
    String[] arguments = {"-i", "dir"};
    assertFalse(JsSlimService.parseCommandLine(arguments));
  }
  
  @Test
  public void invalidCommandLineWithInvalidPort() throws Exception {
    String[] arguments = {"-i", "dir", "abc"};
    assertFalse(JsSlimService.parseCommandLine(arguments));
  }
}
