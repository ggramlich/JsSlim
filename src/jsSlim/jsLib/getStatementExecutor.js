function getStatementExecutor(variables, fileEvaluator) {
    fileEvaluator.evaluateFileResource('JsSlim.js');
    JsSlim.setFileEvaluator(fileEvaluator);
    JsSlim.loadModules();
    return new JsSlim.StatementExecutorProxy(variables);
}
