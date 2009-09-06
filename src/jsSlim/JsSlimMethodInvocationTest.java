// Copyright (C) 2003-2009 by Object Mentor, Inc. All rights reserved.
// Released under the terms of the CPL Common Public License version 1.0.
package jsSlim;

import static jsSlim.TestSuite.getTestIncludePath;
import static org.junit.Assert.assertEquals;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import fitnesse.slim.SlimFactory;
import fitnesse.slim.SlimMethodInvocationTestBase;


public class JsSlimMethodInvocationTest extends SlimMethodInvocationTestBase {
  private static SlimFactory slimFactory;

  @Override
  protected String getTestClassName() {
    return "TestModule.TestSlim";
  }
  
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
  @Override
  public void setUp() throws Exception {
    caller = slimFactory.getStatementExecutor();
    Object result = caller.create("testSlim", getTestClassName(), new Object[0]);
    assertEquals("OK", result);
    testSlim = new TestSlimProxy("testSlim", caller);
  }

  @Test
  public void convertArraysOfDoubles() throws Exception {
    // You cannot distinguish between ints and floats in Javascript.
    caller.call("testSlim", "setDoubleArray", "[1 ,2.2, -3e2,0.04]");
    //assertEquals("[1.0, 2.2, -300.0, 0.04]", caller.call("testSlim", "getDoubleArray"));
    assertEquals("[1, 2.2, -300, 0.04]", caller.call("testSlim", "getDoubleArray"));
  }
}
