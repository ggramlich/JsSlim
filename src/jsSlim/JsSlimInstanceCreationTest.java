// Copyright (C) 2003-2009 by Object Mentor, Inc. All rights reserved.
// Released under the terms of the CPL Common Public License version 1.0.
package jsSlim;

import static jsSlim.TestSuite.getTestIncludePath;
import static org.junit.Assert.assertEquals;
import junit.framework.AssertionFailedError;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;

import fitnesse.slim.SlimInstanceCreationTestBase;

public class JsSlimInstanceCreationTest extends SlimInstanceCreationTestBase {

  private static JsSlimFactory slimFactory;
  
  @BeforeClass
  public static void setUpClass() {
    // Creates Bridge only once
    slimFactory = new JsSlimFactory(getTestIncludePath());
  }

  @AfterClass
  public static void tearDownClass() {
    slimFactory.stop();
  }
  
  @Before
  public void setUp() throws Exception {
    caller = slimFactory.getStatementExecutor();
  }

  @Override
  protected void assertInstanceOfTestSlim(Object x) {
    try {
      Object className = ((JsBridge)slimFactory.getBridge()).getInvocable().invokeMethod(x, "getClass", new Object[]{});
      assertEquals("TestModule.TestSlim", className);
    } catch (Exception e) {
      throw new AssertionFailedError(e.getMessage());
    }
  }

  @Override
  protected String getTestClassPath() {
    return "TestModule";
  }

}
