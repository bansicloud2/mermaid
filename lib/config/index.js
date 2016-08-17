var path = require("path");
var appDir = path.dirname(require.main.filename);

var config = {

    db: 'mongodb://localhost:27017/mermaid',

    data_directory: path.join(appDir, './meta'),
    
    validators_directory: path.join(appDir, './validators'),

    hooks_directory: path.join(appDir, './hooks'),

    types_directory: path.join(appDir, './types'),

    commands_pathname: path.join(appDir, './commands'),

    log_level: 'debug',

    facebook: {
        persistent_menu: {
            buttons: [{
                title: "Start",
                payload: "hi"
            }, {
                title: "Help",
                payload: "help"
            }]
        },
        greeting: {
            text: "Hello, this is mermaid. Type `hi` to get started.",
            payload: "hi"
        }
    },

    api: {

        host: "localhost",
        port: 3000,
        url: "http://localhost:3000"

    },

    bot_username: "mermaid",

    company: "Mermaid",

    opening_message: 'Hello, this is mermaid. Type `hi` to get started.',

    default_error_message: "🚨 Seems to have been an issue with your last entry. Can you try again for me?",

    goto_message: "🚀 Taking to stage in workflow ...",

    restart_message: "♻️ Just a moment while I scrub your data and get your profile ready...",

};

module.exports = config;
