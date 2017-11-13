var builder = require('botbuilder');
var h = require('../helper.js');

module.exports = [
    function (session) {
        session.endConversation("ExitMessage");
    }

    /* function (session, result) {
        session.replaceDialog('mainmenu');
    }*/
]