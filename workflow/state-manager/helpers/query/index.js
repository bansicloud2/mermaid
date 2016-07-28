var request = require("request");
var logger = require("../../../../../../logger");
var utils = require("../../../../utils");
var _ = require("lodash");
var ejs = require("ejs");
var Q = require("q");
var Formatters = require("./formatters");

var QueryHelper = function(state) {
    this.state = state;
};

QueryHelper.prototype.getDataForQuery = function() {

    var self = this;
    var query = self.state.context.query;
    var deferred = Q.defer();

    if (!query) {
        logger.info("No query was provided so setting data to: %s", JSON.stringify({}));
        deferred.resolve({});
    } else {

        var endpoint = utils.injectVariables(query.endpoint, self.state.context);

        var method = query.method || "GET";

        var r = {
            uri: endpoint,
            method: method,
            json: true
        };

        if (method === "POST" && query.data) {

            var data = {};

            for (var key in query.data) {

                data[key] = utils.injectVariables(query.data[key], self.state.context)

            }

            r = _.extend(r, {
                headers: {
                    "content-type": "application/json",
                },
                body: data
            });
        }

        logger.debug("Sending out %s request with following properties: %s", method, JSON.stringify(r, null, 4));

        request(r, function(err, response, data) {

            logger.debug("Response body for request: %s", JSON.stringify(data, null, 4));

            if (err) {
                logger.error("Failed to make HTTP request: %s", err);
                return deferred.reject("Failed to make HTTP request to: " + endpoint);
            }

            if (self.state.context.query.store) {

                logger.debug("Formatting 'store' section of meta data with \
                  following data: %s and \
                  these fields %s", JSON.stringify(data, null, 4), JSON.stringify(self.state.context.query.store, null, 4));

                var updateQuery = self.format(data, self.state.context.query.store);

                if (updateQuery.length > 1) {
                    throw new Error("Can only apply store operation if query limit to one record.");
                }

                logger.debug("Updating user with following query: %s", JSON.stringify(updateQuery, null, 4));

                self.state.app.service("/v1/users").update(self.state.userId, updateQuery).then(function(user) {

                    /* Update the in-memory context */
                    self.state.context.user = user;

                    logger.debug("Formatting 'fields' section of meta data with following data: %s \
                          and these fields %s", JSON.stringify(data, null, 4), JSON.stringify(self.state.context.query.fields, null, 4));
                    deferred.resolve(self.format(data, self.state.context.query.fields));

                }).catch(function(err) {

                    logger.error("Failed to update user: %s", err);
                    return deferred.reject(err);
                })

            } else {
                logger.debug("Formatting 'fields' section of meta data with following \
                  data: %s and these fields %s", JSON.stringify(data, null, 4), JSON.stringify(self.state.context.query.fields, null, 4));
                return deferred.resolve(self.format(data, self.state.context.query.fields));
            }
        });
    }

    return deferred.promise;
};

QueryHelper.prototype.format = function(data, fields) {

    var self = this;

    if (_.isArray(data)) {
        return self.formatRecords(data, fields);
    } else {
        return self.formatRecord(data, fields);
    }

}

QueryHelper.prototype.formatRecords = function(records, fields) {


    logger.debug("Records going into formatter: %s", JSON.stringify(records, null, 4));

    var self = this;
    var result;

    if (fields.options) {

        fields = fields.options; //Options Definition

        records = _.map(records, function(record) {
            return self.formatRecord(record, fields);
        });

        if (self.state.context.query.limit) {
            records = records.slice(0, self.state.context.query.limit);
        }

        result = {
            options: records
        };

    } else {

        records = _.map(records, function(record) {
            return self.formatRecord(record, fields);
        });

        if (self.state.context.query.limit) {

            if (self.state.context.query.limit === 1) {
                result = records[0];
            } else {
                result = records.slice(0, self.state.query.limit);
            }

        } else {
            result = records;
        }

    }

    return result;

};


QueryHelper.prototype.formatRecord = function(record, fields) {

    logger.debug("Fields: %s", JSON.stringify(fields, null, 4));

    var self = this;

    var formattedRecord = {};

    for (var key in fields) {

        var value = [key];

        formattedRecord[key] = self.formatField(key, value, fields, record);

    };

    return formattedRecord;

};


QueryHelper.prototype.formatField = function(key, value, fields, record) {

    logger.debug("Key: %s", key);

    var self = this;

    var result;

    if (key === "custom_fields") {

        result = _.map(fields[key], function(customField) {
            return {
                key: customField["key"],
                title: customField["keyTitle"],
                value: record[customField["key"]]
            }
        });

    } else if (key === "actions") {

        result = _.map(fields[key], function(action, idx) {

            return {
                title: action.title,
                payload: action.payload,
                uri: action.uri
            }
        });

    } else {

        var fieldObj = fields[key];

        if (fieldObj.template) {

            logger.debug("Record: %s", JSON.stringify(record, null, 4))

            result = ejs.render(fieldObj.template, record)

        } else if (fieldObj.key) {

            result = record[fieldObj.key];

        } else {
            logger.error("Don't know how to handle this case for fieldObj: %s", JSON.stringify(fieldObj, null, 4));
        }

        if (fieldObj.formatters) {
            result = Formatters.processFormatters(result, fieldObj.formatters);
        }

    }

    return result;

}

module.exports = QueryHelper;
