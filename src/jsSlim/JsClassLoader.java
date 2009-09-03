package jsSlim;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class JsClassLoader {
  private String[] includePaths;
  private FileFinder finder;
  private Map<String, ArrayList<String>> classFiles = new HashMap<String, ArrayList<String>>();
  
  public JsClassLoader(String includePath, FileFinder finder) {
    this.finder = finder;
    this.setIncludePath(includePath);
  }

  private void setIncludePath(String includePath) {
    String[] myIncludePaths = includePath.split(getPathSeparator());
    includePaths = new String[myIncludePaths.length];
    for (int i = 0; i < myIncludePaths.length; i++) {
      String path = myIncludePaths[i];
      includePaths[i] = appendDirSeparator(path);
    }
  }

  private boolean fileExists(String path) {
    return finder.fileExists(path);
  }
  
  String[] getIncludePaths() {
    return includePaths;
  }

  public String appendDirSeparator(String path) {
    if (!path.endsWith(getDirSeparator())) {
      return path + getDirSeparator();
    }
    return path;
  }

  public String getDirSeparator() {
    return finder.getDirSeparator();
  }

  private char getDirSeparatorChar() {
    return getDirSeparator().toCharArray()[0];
  }

  public String getPathSeparator() {
    return finder.getPathSeparator();
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

  public ArrayList<String> getPossiblePackageClassNames(String fullClassName) {
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

  private void addToArrayListUnique(ArrayList<String> arrayList, String string) {
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

  private String ucFirst(String string) {
    return string.substring(0, 1).toUpperCase() + string.substring(1);
  }

  private String lcFirst(String string) {
    return string.substring(0, 1).toLowerCase() + string.substring(1);
  }
}
