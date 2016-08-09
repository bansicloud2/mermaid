var logger = require("../../../logger");
var async = require("async");

var Hooks = function(app, context, hooks) {
    this.app = app;
    this.context = context;
    this.hookObjects = hooks;
};

Hooks.prototype.wrapFn = function(fn) {
    return (...args) => {

        async.eachSeries(this.hookObjects, (data, done) => {

            var type = data.type;

            var hook = this.app.mermaid.hooks[type];

            hook.call(this, done);

        }, () => {

            fn.apply(null, args);
        })
    }
};

Hooks.prototype.run = function(){

  async.eachSeries(this.hookObjects, (data, done) => {

      var type = data.type;

      var hook = this.app.mermaid.hooks[type];

      hook.call(this, done);

  }, () => {

      logger.debug("Hooks run.");
  })

}

module.exports = Hooks;
