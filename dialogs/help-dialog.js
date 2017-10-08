var builder = require('botbuilder');
var h = require('../helper.js');

module.exports = 
[
    function (session) {
        session.send("help_message");
        builder.Prompts.text(session, h.text(session, "ok_to_continue"));
    },
    function (session, result) {
        session.endDialog();
    }


]