var _ = require("lodash");
var BaseTemplate = require("./base");

var TerminationTemplate = BaseTemplate.extend({

	isFinalMessage : true

});

module.exports = TerminationTemplate;