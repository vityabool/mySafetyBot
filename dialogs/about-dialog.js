var builder = require('botbuilder');
var h = require('../helper.js');

// Adaptive cards are used card designer is at http://adaptivecards.io
module.exports = [
    function (session) {
        if (session.preferredLocale() == 'ua')
            var vcard = require('../locale/ua/about.json');
        else if (session.preferredLocale() == 'ru')   
            var vcard = require('../locale/ru/about.json');
        else
            var vcard = require('../locale/en/about.json');

        var msg = new builder.Message(session).addAttachment(vcard);

        session.send(msg);

        builder.Prompts.confirm(session, "ProductBackMain");
    },

    function (session, results) {
       session.replaceDialog('mainmenu');
    }
]