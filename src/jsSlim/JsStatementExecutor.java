package jsSlim;

import java.util.ArrayList;

import fitnesse.slim.Jsr223Bridge;
import fitnesse.slim.Jsr223StatementExecutor;

public class JsStatementExecutor extends Jsr223StatementExecutor {

  private JsClassLoader loader;
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
    try {
      loadClassDefinition(className);
    } catch (Exception e) {
      return e.getMessage();
    }
    return callMethod("create", new Object[] {instanceName, className, args});
  }

  private void loadClassDefinition(String className) throws Exception {
    ArrayList<String> possibleClassNames = new ArrayList<String>();
    possibleClassNames.add(className);
    for (String path: paths) {
      possibleClassNames.add(path + "." + className);
    }
    loadFilesForClassNames(possibleClassNames);
  }

  private void loadFilesForClassNames(ArrayList<String> classNames) throws Exception {
    for (String fullClassName: classNames) {
      loader.loadFilesForClassName(fullClassName);
    }
  }

  @Override
  public Object callAndAssign(String variable, String instanceName,
      String methodName, Object[] args) {
    Object result = call(instanceName, methodName, args);
    setVariable(variable, result);
    return result;
  }
}
