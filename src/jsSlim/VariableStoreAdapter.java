package jsSlim;

import fitnesse.slim.MethodExecutionResult;
import fitnesse.slim.VariableStore;

public class VariableStoreAdapter {
  VariableStore variableStore = new VariableStore();
  public void setVariable(String name, Object value) {
    variableStore.setSymbol(name, new MethodExecutionResult(value, Object.class));
  }

  public Object[] replaceVariables(Object[] args) {
    return variableStore.replaceSymbols(args);
  }
}
