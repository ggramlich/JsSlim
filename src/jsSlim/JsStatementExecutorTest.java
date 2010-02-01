package jsSlim;

import static jsSlim.TestSuite.getTestIncludePath;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;

import fitnesse.slim.Jsr223Bridge;
import fitnesse.slim.StatementExecutorTestBase;

public class JsStatementExecutorTest extends StatementExecutorTestBase {

  public static class FixtureProxy implements Echo, Speak, Delete,
      SystemUnderTestFixture {

    private Object proxy;

    public FixtureProxy(Object instance) {
      proxy = instance;
    }

    @Override
    public void echo() {
    }

    @Override
    public boolean echoCalled() {
      return (Boolean) callMethod("echoCalled");
    }

    @Override
    public void speak() {
    }

    @Override
    public boolean speakCalled() {
      return (Boolean) callMethod("speakCalled");
    }

    @Override
    public void delete(String fileName) {
    }

    @Override
    public boolean deleteCalled() {
      return (Boolean) callMethod("deleteCalled");
    }

    @Override
    public MySystemUnderTestBase getSystemUnderTest() {
      return new MySystemUnderTestJs(new FixtureProxy(
          callMethod("getSystemUnderTest")));
    }

    private Object callMethod(String method, Object... args) {
      try {
        return bridge.invokeMethod(proxy, method, args);
      } catch (Throwable e) {
        return e.toString();
      }
    }
  }

  public static class MySystemUnderTestJs extends MySystemUnderTestBase {
    private FixtureProxy fixtureProxy;

    public MySystemUnderTestJs(FixtureProxy fixtureProxy) {
      this.fixtureProxy = fixtureProxy;
    }

    @Override
    public void echo() {
      fixtureProxy.echo();
    }

    @Override
    public boolean echoCalled() {
      return fixtureProxy.echoCalled();
    }

    @Override
    public void speak() {
      fixtureProxy.speak();
    }

    @Override
    public boolean speakCalled() {
      return fixtureProxy.speakCalled();
    }
  }

  public static class MyAnnotatedSystemUnderTestFixtureJs extends
      MyAnnotatedSystemUnderTestFixture {
    private FixtureProxy fixtureProxy;

    public MyAnnotatedSystemUnderTestFixtureJs(FixtureProxy fixtureProxy) {
      this.fixtureProxy = fixtureProxy;
    }

    @Override
    public void echo() {
      fixtureProxy.echo();
    }

    @Override
    public boolean echoCalled() {
      return fixtureProxy.echoCalled();
    }

    @Override
    public MySystemUnderTestBase getSystemUnderTest() {
      return fixtureProxy.getSystemUnderTest();
    }
  }

  public static class FileSupportJs extends FileSupport {

    private FixtureProxy fixtureProxy;

    public FileSupportJs(FixtureProxy fixtureProxy) {
      this.fixtureProxy = fixtureProxy;
    }

    @Override
    public void delete(String fileName) {
      fixtureProxy.delete(fileName);
    }

    @Override
    public boolean deleteCalled() {
      return fixtureProxy.deleteCalled();
    }
  }

  public static class EchoSupportJs extends EchoSupport {

    private FixtureProxy fixtureProxy;

    public EchoSupportJs(FixtureProxy fixtureProxy) {
      this.fixtureProxy = fixtureProxy;
    }

    @Override
    public void echo() {
      fixtureProxy.echo();
    }

    @Override
    public boolean echoCalled() {
      return fixtureProxy.echoCalled();
    }

    @Override
    public void speak() {
      fixtureProxy.speak();
    }

    @Override
    public boolean speakCalled() {
      return fixtureProxy.speakCalled();
    }
  }

  public static class SimpleFixtureJs extends SimpleFixture {
    private FixtureProxy fixtureProxy;

    public SimpleFixtureJs(FixtureProxy fixtureProxy) {
      this.fixtureProxy = fixtureProxy;
    }

    @Override
    public void echo() {
      fixtureProxy.echo();
    }

    @Override
    public boolean echoCalled() {
      return fixtureProxy.echoCalled();
    }
  }

  public static class FixtureWithNamedSystemUnderTestJs extends
      FixtureWithNamedSystemUnderTestBase {

    private FixtureProxy fixtureProxy;

    public FixtureWithNamedSystemUnderTestJs(FixtureProxy fixtureProxy) {
      this.fixtureProxy = fixtureProxy;
    }

    @Override
    public void echo() {
      fixtureProxy.echo();
    }

    @Override
    public boolean echoCalled() {
      return fixtureProxy.echoCalled();
    }

    @Override
    public MySystemUnderTestBase getSystemUnderTest() {
      return fixtureProxy.getSystemUnderTest();
    }
  }

  private static JsSlimFactory slimFactory;
  private static Jsr223Bridge bridge;

  @BeforeClass
  public static void setUpClass() {
    slimFactory = new JsSlimFactory(getTestIncludePath());
    bridge = slimFactory.getBridge();
  }

  @AfterClass
  public static void tearDownClass() {
    slimFactory.stop();
  }

  @Override
  @Before
  public void init() throws Exception {
    statementExecutor = slimFactory.getStatementExecutor();
    statementExecutor.addPath("TestModule.SystemUnderTest");
  }

  @Override
  protected String annotatedFixtureName() {
    // return "TestModule_SystemUnderTest_" +
    // "MyAnnotatedSystemUnderTestFixture";
    return "MyAnnotatedSystemUnderTestFixture";
  }

  @Override
  protected MyAnnotatedSystemUnderTestFixture createAnnotatedFixture() {
    createFixtureInstance(annotatedFixtureName());
    return new MyAnnotatedSystemUnderTestFixtureJs(
        (FixtureProxy) getVerifiedInstance());
  }

  @Override
  protected FixtureWithNamedSystemUnderTestBase createNamedFixture() {
    createFixtureInstance(namedFixtureName());
    return new FixtureWithNamedSystemUnderTestJs(
        (FixtureProxy) getVerifiedInstance());
  }

  @Override
  protected String namedFixtureName() {
    return "FixtureWithNamedSystemUnderTest";
  }

  @Override
  protected SimpleFixture createSimpleFixture() {
    createFixtureInstance(simpleFixtureName());
    return new SimpleFixtureJs((FixtureProxy) getVerifiedInstance());
  }

  @Override
  protected String simpleFixtureName() {
    return "SimpleFixture";
  }
  
  @Override
  protected EchoSupport createEchoLibrary() {
    String instanceName = "library" + library++;
    Object created = statementExecutor.create(instanceName, echoLibraryName(),
        new Object[] {});
    assertEquals("OK", created);
    return new EchoSupportJs(new FixtureProxy(statementExecutor
        .getInstance(instanceName)));
  }

  @Override
  protected String echoLibraryName() {
    return "EchoSupport";
  }
  
  @Override
  protected FileSupport createFileSupportLibrary() {
    String instanceName = "library" + library++;
    Object created = statementExecutor.create(instanceName, fileSupportName(),
        new Object[] {});
    assertEquals("OK", created);
    return new FileSupportJs(new FixtureProxy(statementExecutor
        .getInstance(instanceName)));
  }

  @Override
  protected String fileSupportName() {
    return "FileSupport";
  }
  
  @Override
  protected String deleteMethodName() {
    return "callDelete";
  }

  @Override
  protected Echo getVerifiedInstance() {
    FixtureProxy myInstance = new FixtureProxy(statementExecutor
        .getInstance(INSTANCE_NAME));
    assertFalse(myInstance.echoCalled());
    return myInstance;
  }


}
