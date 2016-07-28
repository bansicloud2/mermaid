var async = require("async");

var HOOKS = {
    "mark-completed": require("./mark-completed")
}

var Hooks = function(app, context, hooks) {
    this.app = app;
    this.context = context;
    this.hookObjects = hooks;
};

Hooks.prototype.wrapFn = function(fn) {
    return (...args) => {

        async.eachSeries(this.hookObjects, (data, done) => {

            var type = data.type;

            var hook = HOOKS[type];

            hook.call(this, done);

        }, () => {

            fn.apply(null, args);
        })
    }
};

module.exports = Hooks;
