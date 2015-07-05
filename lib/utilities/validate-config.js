var Promise = require('ember-cli/lib/ext/promise');

var chalk  = require('chalk');
var yellow = chalk.yellow;
var blue   = chalk.blue;

function applyDefaultConfigIfNecessary(config, prop, defaultConfig, ui){
  if (!config[prop]) {
    var value = defaultConfig[prop];
    config[prop] = value;
    if (typeof value === "function") {
      value = "[Function]";
    }
    ui.write(blue('|    '));
    ui.writeLine(yellow('- Missing config: `' + prop + '`, using default: `' + value + '`'));
  }
}

module.exports = function(ui, config, projectName) {
  ui.write(blue('|    '));
  ui.writeLine(blue('- validating config'));

  var defaultConfig = {
    host: 'localhost',
    port: 6379,
    filePattern: 'dist/index.html',
    keyPrefix: projectName + ':index',
    didDeployMessage: function(context){
      if (context.revisionKey && !context.activatedRevisionKey) {
        return "Deployed but did not activate revision " + context.revisionKey + ". "
             + "To activate, run: "
             + "ember activate " + context.revisionKey + " --environment=" + process.env.DEPLOY_ENVIRONMENT + "\n";
      }
    }
  };

  if (!config.url) {
    ['host', 'port'].forEach(function(prop) {
      applyDefaultConfigIfNecessary(config, prop, defaultConfig, ui);
    });
  }
  ['filePattern', 'keyPrefix', 'didDeployMessage'].forEach(function(configKey){
    applyDefaultConfigIfNecessary(config, configKey, defaultConfig, ui);
  });

  ui.write(blue('|    '));
  ui.writeLine(blue('- config ok'));

  return Promise.resolve();
}
