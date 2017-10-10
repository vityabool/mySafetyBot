var builder = require('botbuilder');
var h = require('../helper.js');

module.exports = 
[
    function (session) {
        session.send("help_message");
        builder.Prompts.choice(session, "ok_to_continue", ["OK"]);
    },
    function (session, result) {
        session.endDialog();
    }
]