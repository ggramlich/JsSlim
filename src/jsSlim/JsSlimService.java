package jsSlim;

import util.CommandLine;
import fitnesse.slim.SlimServer;
import fitnesse.slim.SlimService;

public class JsSlimService extends SlimService {
  private static String includePath;

  public static void main(String[] args) throws Exception {
    if (parseCommandLine(args)) {
      startWithFactory(args, new JsSlimFactory(includePath));
    } else {
      parseCommandLineFailed(args);
    }
  }

  protected static boolean parseCommandLine(String[] args) {
    CommandLine commandLine = new CommandLine("[-v] [-i includepath] port");
    if (commandLine.parse(args)) {
      verbose = commandLine.hasOption("v");
      if (commandLine.hasOption("i")) {
        includePath = commandLine.getOptionArgument("i", "includepath");
      } else {
        includePath = System.getProperty("java.class.path");
      }
      return determinePort(commandLine.getArgument("port"));
    }
    return false;
  }

  protected static boolean determinePort(String portString) {
    try {
      port = Integer.parseInt(portString);
      return true;
    } catch (NumberFormatException exception) {
      return false;
    }
  }

  public JsSlimService(int port, SlimServer slimServer) throws Exception {
    super(port, slimServer);
  }
}
