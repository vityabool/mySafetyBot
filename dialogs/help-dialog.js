var builder = require('botbuilder');
var h = require('../helper.js');

// Simple help message
module.exports = 
[
    function (session) {
        session.send("help_message");
        builder.Prompts.confirm(session, "ok_to_continue");
    },
    function (session, result) {
        session.endDialog();
    }
]