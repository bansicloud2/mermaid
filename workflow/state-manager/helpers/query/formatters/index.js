var logger = require("../../../../../../../logger");

var Formatters = {
    _formatters: {}
};

Formatters._formatters.CentsToDollars = require("./CentsToDollars");

Formatters.processFormatters = function(value, formattersArray) {
    for (var idx in formattersArray) {

        var formatterName = formattersArray[idx];

        var formatter = this._formatters[formatterName];

        if(!formatter){
          throw new Error("No formatter exists for name: " + formatterName);
        }

        value = formatter.applyFormat(value);

    }

    return value;
};

module.exports = Formatters;
