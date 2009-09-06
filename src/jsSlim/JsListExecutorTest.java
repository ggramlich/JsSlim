// Copyright (C) 2003-2009 by Object Mentor, Inc. All rights reserved.
// Released under the terms of the CPL Common Public License version 1.0.
package jsSlim;

import static jsSlim.TestSuite.getTestIncludePath;

import org.junit.AfterClass;
import org.junit.BeforeClass;

import fitnesse.slim.ListExecutor;
import fitnesse.slim.ListExecutorTestBase;
import fitnesse.slim.SlimFactory;

public class JsListExecutorTest extends ListExecutorTestBase {

  private static SlimFactory slimFactory;
  
  @BeforeClass
  public static void setUpClass() {
    slimFactory = new JsSlimFactory(getTestIncludePath());
  }

  @AfterClass
  public static void tearDownClass() {
    slimFactory.stop();
  }

  @Override
  protected ListExecutor getListExecutor() throws Exception {
    return slimFactory.getListExecutor(false);
  }

  @Override
  protected String getTestClassPath() {
    return "testModule";
  }

}
