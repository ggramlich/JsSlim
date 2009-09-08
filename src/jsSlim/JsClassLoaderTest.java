package jsSlim;


import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.Collection;

import org.junit.Before;
import org.junit.Test;

public class JsClassLoaderTest {

  private JsClassLoader loader;
  private FileFinderFake finder;
  private JsFileEvaluator fileEvaluator;
  
  @Before
  public void setUp() throws Exception {
    finder = new FileFinderFake();
    fileEvaluator = new JsFileEvaluator("path:anotherpath/:parent/child", finder, null);
    loader = new JsClassLoader(fileEvaluator, finder);
  }

  @Test
  public void appendDirSeparator() {
    assertEquals("x/", finder.appendDirSeparator("x"));
    assertEquals("x/", finder.appendDirSeparator("x/"));
  }
  
  @Test
  public void separatorsAreAsExpected() {
    assertEquals(":", finder.getPathSeparator());
  }
  
  @Test
  public void canFindSimpleClass() {
    String[] paths = new String[]{
        "path/",
        "anotherpath/",
        "parent/child/"
    };
    assertArrayEquals(paths, fileEvaluator.getIncludePaths());
  }
  
  @Test
  public void verifyFinderSetup() {
    finder.addFile("path/Class.js");
    assertTrue(finder.fileExists("path/Class.js"));
    assertFalse(finder.fileExists("anotherpath/Class.js"));
  }
  
  @Test
  public void findMissingClassFile()
  {
    finder.addFile("pathThatIsNotOnIncludePath/Class.js");
    assertClassFiles(new Object[]{}, loader.findClassFiles("Class"));
  }
  
  @Test
  public void findClassFile()
  {
    finder.addFile("path/Class.js");
    assertClassFiles(new Object[]{"path/Class.js"}, loader.findClassFiles("Class"));
  }
  
  @Test
  public void findClassFileInChild()
  {
    finder.addFile("parent/child/Class.js");
    assertClassFiles(new Object[]{"parent/child/Class.js"}, loader.findClassFiles("Class"));
  }
  
  @Test
  public void findClassFileWithImport()
  {
    finder.addFile("parent/child/package/xyz/Class.js");
    assertClassFiles(new Object[]{"parent/child/package/xyz/Class.js"}, loader.findClassFiles("package.xyz.Class"));
  }

  @Test
  public void findLowerCaseClassFileWithImport()
  {
    finder.addFile("parent/child/package/xyz/class.js");
    assertClassFiles(new Object[]{"parent/child/package/xyz/class.js"}, loader.findClassFiles("package.xyz.Class"));
  }

  @Test
  public void findParentClassFileWithImport()
  {
    finder.addFile("parent/child/package/xyz.js");
    assertClassFiles(new Object[]{"parent/child/package/xyz.js"}, loader.findClassFiles("package.xyz.Class"));
  }
  
  @Test
  public void findParentClassFileWithImportCapital()
  {
    finder.addFile("parent/child/Package/Xyz.js");
    assertClassFiles(new Object[]{"parent/child/Package/Xyz.js"}, loader.findClassFiles("package.xyz.Class"));
    assertClassFiles(new Object[]{"parent/child/Package/Xyz.js"}, loader.findClassFiles("package.xyz.Class"));
  }

  @Test
  public void findParentAndClassFileWithImport()
  {
    finder.addFile("parent/child/package/xyz/class.js");
    finder.addFile("parent/child/package/xyz.js");
    assertClassFiles(new Object[]{"parent/child/package/xyz.js", "parent/child/package/xyz/class.js"}, loader.findClassFiles("package.xyz.Class"));
  }

  @Test
  public void findManyPossibleClassFilesInOrder()
  {
    finder.addFile("parent/child/package/xyz.js");
    finder.addFile("anotherpath/package/xyz.js");
    finder.addFile("strangestuff/package.js");
    finder.addFile("anotherpath/package/xyz/Class.js");
    finder.addFile("path/package/xyz.js");
    finder.addFile("path/Package.js");
    Object[] paths = new Object[] {
        "path/Package.js",
        "path/package/xyz.js",
        "anotherpath/package/xyz.js",
        "anotherpath/package/xyz/Class.js",
        "parent/child/package/xyz.js",
    };
    assertClassFiles(paths , loader.findClassFiles("package.xyz.Class"));
  }
  
  private void assertClassFiles(Object[] expecteds, ArrayList<String> arrayList) {
    assertArrayEquals(expecteds, arrayList.toArray());
  }
  
  private class FileFinderFake extends FileFinder {
    Collection<String> fileNames = new ArrayList<String>();
    
    public void addFile(String fileName) {
      fileNames.add(fileName);
    }
    
    public boolean fileExists(String fileName) {
      return fileNames.contains(fileName);
    }
    
    public String getDirSeparator() {
      return "/";
    }

    public String getPathSeparator() {
      return ":";
    }
  }
}
