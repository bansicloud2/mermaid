var _ = require("lodash");
var BaseTemplate = require("./base");

var RedirectTemplate = BaseTemplate.extend({

	isFinalMessage : true

});

module.exports = RedirectTemplate;
