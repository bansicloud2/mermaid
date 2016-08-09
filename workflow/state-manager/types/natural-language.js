var _ = require("lodash"),
    BaseTemplate = require("./base"),
    natural = require('natural'),
    tokenizer = new natural.WordTokenizer(),
    Utils = require("../../../utils"),
    dot = require("dot-object"),
    logger = require("../../../logger")

var getKeywordsFromResponse = function(response, keywords) {

    var used_keywords = [];

    var tokens = tokenizer.tokenize(response);

    logger.debug("Tokens found from response: %s", tokens);

    keywords.forEach(function(keyword) {
        if (_.indexOf(tokens, keyword) !== -1) {
            used_keywords.push(keyword);
        }
    });

    return used_keywords;
};

var NaturalLanguageTemplate = BaseTemplate.extend({

    getEnd: function(stateManager, callback) {

        var self = this;

        return function(convo) {

            if (convo.status == 'completed') {

                var platform = stateManager.bot.type,
                    platform_id = stateManager.message.user,
                    id = Utils.getUserId(platform, platform_id),
                    query = {
                        id: id
                    },
                    data = {};

                var response = convo.response;

                var keywords_included = getKeywordsFromResponse(response, stateManager.context.keywords);

                data[stateManager.context["storage-property"]] = keywords_included;

                stateManager.controller.storage.users.update(query, data, function(err, id) {

                    if (err) {
                        logger.error("Error updating using storage controller", err);
                    }

                    NaturalLanguageTemplate.__super__.getEnd(stateManager, callback)(convo);

                });


            } else {
                logger.warn("The conversation ended abruptly.")
            }
        }
    }
});

module.exports = NaturalLanguageTemplate;
