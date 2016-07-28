var path = require("path");
var fs = require("fs");

var Templates = {};

Templates.attachment = fs.readFileSync(path.join(__dirname, 'attachment.ejs'), 'utf8');
Templates.receipt = fs.readFileSync(path.join(__dirname, 'receipt.ejs'), 'utf8');

module.exports = Templates;
