var builder = require('botbuilder');
var h = require('../helper.js');

module.exports = [
    function (session) {
        
        var vcard = require('../locale/ua/about.json');

        var msg = new builder.Message(session).addAttachment(vcard);

        session.send(msg);

        builder.Prompts.confirm(session, "Повернутись до головного меню?");
    },

    function (session, results) {
       session.replaceDialog('mainmenu');
    }
]