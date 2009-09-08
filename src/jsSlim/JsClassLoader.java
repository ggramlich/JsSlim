package jsSlim;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class JsClassLoader {
  private JsFileEvaluator fileEvaluator;
  private Map<String, ArrayList<String>> classFiles = new HashMap<String, ArrayList<String>>();
  private FileFinder fileFinder;
  
  public JsClassLoader(JsFileEvaluator fileEvaluator, FileFinder fileFinder) {
    this.fileEvaluator = fileEvaluator;
    this.fileFinder = fileFinder;
  }

  private boolean fileExists(String path) {
    return fileFinder.fileExists(path);
  }

  private String[] getIncludePaths() {
    return fileEvaluator.getIncludePaths();
  }

  private char getDirSeparatorChar() {
    return fileFinder.getDirSeparatorChar();
  }

  public ArrayList<String> findClassFiles(String className) {
    if (classFiles.containsKey(className)) {
      return classFiles.get(className);
    }
    ArrayList<String> files = new ArrayList<String>();
    for (String path: getIncludePaths()) {
      for (String file: getPossibleClassFiles(path, className)) {
        if (fileExists(file)) {
          addToArrayListUnique(files, file);
        }
      }
    }
    classFiles.put(className, files);
    return files;
  }
  
  private ArrayList<String> getPossibleClassFiles(String path, String fullClassName) {
    ArrayList<String> classFiles = new ArrayList<String>();
    for (String className: getPossiblePackageClassNames(fullClassName)) {
      classFiles.add(path + classToPath(className) + ".js");
    }
    return classFiles;
  }
  
  private String classToPath(String className) {
    return className.replace('.', getDirSeparatorChar());
  }

  private ArrayList<String> getPossiblePackageClassNames(String fullClassName) {
    ArrayList<String> partialNames = new ArrayList<String>();
    String packageClass = "";
    for (String part: fullClassName.split("\\.")) {
      packageClass = packageClass + "." + part;
      partialNames.add(packageClass.substring(1));
    }
    ArrayList<String> classNames = new ArrayList<String>();
    for(String partialName: partialNames) {
      addToArrayListUnique(classNames, partialName);
      addToArrayListUnique(classNames, getUpperCasePath(partialName));
      addToArrayListUnique(classNames, getLowerCasePath(partialName));
    }
    return classNames;
  }

  public void loadFilesForClassName(String fullClassName) throws Exception {
    ArrayList<String> classFiles = findClassFiles(fullClassName);
    for (String classFile: classFiles) {
      fileEvaluator.loadAndEvaluateJsFile(classFile);
    }
  }
  
  private static void addToArrayListUnique(ArrayList<String> arrayList, String string) {
    if (!arrayList.contains(string)) {
      arrayList.add(string);
    }
  }
  
  private String getLowerCasePath(String partialName) {
    String path = "";
    for (String part: partialName.split("\\.")) {
      path = path + "." + lcFirst(part);
    }
    return path.substring(1);
  }

  private String getUpperCasePath(String partialName) {
    String path = "";
    for (String part: partialName.split("\\.")) {
      path = path + "." + ucFirst(part);
    }
    return path.substring(1);
  }

  private static String ucFirst(String string) {
    return string.substring(0, 1).toUpperCase() + string.substring(1);
  }

  private static String lcFirst(String string) {
    return string.substring(0, 1).toLowerCase() + string.substring(1);
  }
}
