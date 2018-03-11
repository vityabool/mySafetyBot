var builder = require('botbuilder');
var h = require('../helper.js');

// Just saying Good Buy!
module.exports = [
    function (session) {
        session.endConversation("ExitMessage");
    }
]