var path = require("path");

var config = {

  db: 'mongodb://localhost:27017/mermaid',

  // admin_emails: ["tom@example.com"],

  log_level: 'debug',

  // mailgun: {
  //     apiKey: "key-XXXXXXXXXXXXXXXXXXX",
  //     domain: "XX.sagebots.com"
  // },

  services: ["facebook"],

  facebook: {
      PAGE_ID: process.env.FACEBOOK_PAGE_ID,
      PAGE_TOKEN: process.env.FACEBOOK_PAGE_TOKEN,
      VERIFY_TOKEN: process.env.FACEBOOK_VERIFY_TOKEN,
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

  data_directory: path.join(__dirname, '../meta'),

  validators_directory: path.join(__dirname, '../validators'),

  hooks_directory: path.join(__dirname, '../hooks'),

  types_directory: path.join(__dirname, '../types'),

  commands_pathname : path.join(__dirname, '../commands'),

  bot_username: "mermaid",

  company: "Mermaid",

  opening_message: 'Hello, this is mermaid. Type `hi` to get started.',

  default_error_message: "🚨 Seems to have been an issue with your last entry. Can you try again for me?",

  goto_message: "🚀 Taking to stage in workflow ...",

  restart_message: "♻️ Just a moment while I scrub your data and get your profile ready...",

};

module.exports = config;
