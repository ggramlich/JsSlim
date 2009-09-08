package jsSlim;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class FileFinder {
  private Map<String, Boolean> fileExistance = new HashMap<String, Boolean>();

  public boolean fileExists(String fileName) {
    if (!fileExistance.containsKey(fileName)) {
      fileExistance.put(fileName, new File(fileName).exists());
    }
    return fileExistance.get(fileName);
  }
  
  public String getDirSeparator() {
    return File.separator;
  }

  public String getPathSeparator() {
    return File.pathSeparator;
  }

  public char getDirSeparatorChar() {
    return getDirSeparator().toCharArray()[0];
  }

  public String appendDirSeparator(String path) {
    if (!path.endsWith(getDirSeparator())) {
      return path + getDirSeparator();
    }
    return path;
  }
}
