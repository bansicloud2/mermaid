var mermaid = require("../lib");
var logger = require("../lib/logger");
var config = require("./config");

if (!process.env.FACEBOOK_PAGE_ID || !process.env.FACEBOOK_PAGE_ID || !process.env.FACEBOOK_VERIFY_TOKEN) {
    return logger.error("Please specify FACEBOOK_PAGE_ID, FACEBOOK_PAGE_ID, and FACEBOOK_VERIFY_TOKEN as environment variables.");
}

mermaid(config);
