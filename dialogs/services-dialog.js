var builder = require('botbuilder');
var h = require('../helper.js');

module.exports = [
    function (session) {
        var msg = new builder.Message(session);
        msg.attachmentLayout(builder.AttachmentLayout.carousel)
        msg.attachments([
            new builder.HeroCard(session)
                .title("Pets security")
                .subtitle("349 UAH / Year")
                .text("Attach keychin to your pet to find it easy")
                .images([builder.CardImage.create(session, 'http://mysafety.ua/sites/default/files/product3.jpg')])
                .buttons([
                    builder.CardAction.openUrl(session, "http://mysafety.ua/ru/pets?s=970B8497D5D2681A8DE1B98CC0AEBE1D317A94CB", "More information")
                ]),
            new builder.HeroCard(session)
                .title("Mobile phone security")
                .subtitle("3,5 UAH / week")
                .text("Put sticker on the phone and return it if lost")
                .images([builder.CardImage.create(session, 'http://mysafety.ua/sites/default/files/product2.jpg')])
                .buttons([
                    builder.CardAction.openUrl(session, "http://mysafety.ua/ru/gadgets?s=3A2A8BF3C66EF23B7578330B4B1ACEC5C056FA84", "More information")
                ])
        ]);
        session.send(msg);
        
        builder.Prompts.choice(session, "Back to Main menu", ["OK"]);
    
    },

    function (session, result) {
        session.replaceDialog('mainmenu');
    }
]