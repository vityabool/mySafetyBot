var builder = require('botbuilder');
var h = require('../helper.js');

module.exports = [
    function (session) {
        session.send("About message");
        builder.Prompts.choice(session, "Back to Main menu", ["OK"]);
    },

    function (session, result) {
        session.replaceDialog('mainmenu');
    }
]