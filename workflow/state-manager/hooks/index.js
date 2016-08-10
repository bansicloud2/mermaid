var logger = require("../../../logger");
var async = require("async");

var Hooks = function(app, context, hooks) {
    this.app = app;
    this.context = context;
    this.hookObjects = hooks;
};

Hooks.prototype._wrapFn = function(fn) {
    return (...args) => {

        async.eachSeries(this.hookObjects, (data, done) => {

            try {
                var type = data.type;

                logger.debug('Type: %s', type)

                var hook = this.app.mermaid.hooks[type];

                hook.call(this, done);

            } catch (e) {
                logger.error(e);
                done(e);
            }

        }, () => {

            fn.apply(null, args);
        })
    }
};

Hooks.prototype.wrapFn = function(fn) {
    return (...args) => {
        return this.run(function() {
            fn.apply(null, args);
        });
    };
}

Hooks.prototype.run = function(cb) {

    async.eachSeries(this.hookObjects, (data, done) => {

        var type = data.type;

        var hook = this.app.mermaid.hooks[type];

        hook.call(this, done);

    }, () => {

        logger.debug("Hooks run.");

        return cb && cb();
    })

}

module.exports = Hooks;
