package jsSlim;

import java.io.FileReader;
import java.util.ArrayList;

import fitnesse.slim.Jsr223Bridge;
import fitnesse.slim.Jsr223StatementExecutor;

public class JsStatementExecutor extends Jsr223StatementExecutor {

  private JsClassLoader loader;
  private ArrayList<String> loadedFiles = new ArrayList<String>();
  private ArrayList<String> paths = new ArrayList<String>();
  
  public JsStatementExecutor(Jsr223Bridge bridge, JsClassLoader loader) throws Exception {
    super(bridge);
    this.loader = loader;
  }
  
  public Object addPath(String path) {
    paths.add(path);
    return callMethod("addPath", new Object[] {path});
  }
  
  public Object create(String instanceName, String className, Object[] args) {
    ArrayList<String> possibleClassNames = new ArrayList<String>();
    possibleClassNames.add(className);
    for (String path: paths) {
      possibleClassNames.add(path + "." + className);
    }
    try {
      loadFilesForClassNames(possibleClassNames);
    } catch (Exception e) {
      return e.getMessage();
    }
    return callMethod("create", new Object[] {instanceName, className, args});
  }

  private void loadFilesForClassNames(ArrayList<String> classNames) throws Exception {
    for (String fullClassName: classNames) {
      loadFilesForClassName(fullClassName);
    }
  }
  
  private void loadFilesForClassName(String className) throws Exception {
    ArrayList<String> classFiles = loader.findClassFiles(className);
    for (String classFile: classFiles) {
      loadJsFile(classFile);
    }
  }
  
  private void loadJsFile(String classFile) throws Exception {
    if (!loadedFiles.contains(classFile)) {
      bridge.getScriptEngine().eval(new FileReader(classFile));
      loadedFiles.add(classFile);
    }
  }
}
