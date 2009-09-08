package jsSlim;

import java.io.FileReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;

import javax.script.ScriptEngine;
import javax.script.ScriptException;

public class JsFileEvaluator {

  private ScriptEngine scriptEngine;
  private ArrayList<String> loadedFiles = new ArrayList<String>();
  private FileFinder finder;
  private String[] includePaths;

  public JsFileEvaluator(String includePath, FileFinder finder, ScriptEngine engine) {
    this.finder = finder;
    this.setIncludePath(includePath);
    this.scriptEngine = engine;
  }

  public void evaluateFile(String jsFile) throws Exception {
    ArrayList<String> absoluteFiles = getAbsoluteFiles(jsFile);
    for (String absoluteFile: absoluteFiles) {
      loadAndEvaluateJsFile(absoluteFile);
    }
  }
  
  public void evaluateFileResource(String jsFile) throws ScriptException {
    scriptEngine.eval(getJsFileAsStreamReader(jsFile));
  }

  private InputStreamReader getJsFileAsStreamReader(String jsFile) {
    InputStream in = getClass().getResourceAsStream(jsFile);
    return new InputStreamReader(in);
  }

  public void loadAndEvaluateJsFile(String absoluteFile) throws Exception {
    if (!loadedFiles.contains(absoluteFile)) {
      scriptEngine.eval(new FileReader(absoluteFile));
      loadedFiles.add(absoluteFile);
    }
  }

  private void setIncludePath(String includePath) {
    String[] myIncludePaths = includePath.split(getPathSeparator());
    includePaths = new String[myIncludePaths.length];
    for (int i = 0; i < myIncludePaths.length; i++) {
      String path = myIncludePaths[i];
      includePaths[i] = appendDirSeparator(path);
    }
  }

  private ArrayList<String> getAbsoluteFiles(String fileName) {
    ArrayList<String> files = new ArrayList<String>();
    for (String path: getIncludePaths()) {
      String absoluteFile = path + getDirSeparatorChar() + fileName;
      if (fileExists(absoluteFile)) {
        addToArrayListUnique(files, absoluteFile);
      }
    }
    return files;
  }

  private static void addToArrayListUnique(ArrayList<String> arrayList, String string) {
    if (!arrayList.contains(string)) {
      arrayList.add(string);
    }
  }

  private boolean fileExists(String path) {
    return finder.fileExists(path);
  }

  public String[] getIncludePaths() {
    return includePaths;
  }

  private String appendDirSeparator(String path) {
    return finder.appendDirSeparator(path);
  }

  private String getPathSeparator() {
    return finder.getPathSeparator();
  }

  private char getDirSeparatorChar() {
    return finder.getDirSeparatorChar();
  }

}
