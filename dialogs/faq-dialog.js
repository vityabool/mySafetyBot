var builder = require('botbuilder');
var h = require('../helper.js');

module.exports = [
    function (session) {
        session.send("FAQ dialog");
        builder.Prompts.choice(session, "Back to Main menu", ["OK"]);
    },

    function (session, result) {
        session.replaceDialog('mainmenu');
    }
]