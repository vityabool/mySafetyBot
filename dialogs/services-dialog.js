var builder = require('botbuilder');
var h = require('../helper.js');

module.exports = [
    function (session) {
        var msg = new builder.Message(session);
        msg.attachmentLayout(builder.AttachmentLayout.carousel)
        msg.attachments([
            new builder.HeroCard(session)
                .title("Classic White T-Shirt")
                .subtitle("100% Soft and Luxurious Cotton")
                .text("Price is $25 and carried in sizes (S, M, L, and XL)")
                .images([builder.CardImage.create(session, 'http://mysafetybot.azurewebsites.net/img/img_pet.png')])
                .buttons([
                    builder.CardAction.imBack(session, "buy classic white t-shirt", "Buy")
                ]),
            new builder.HeroCard(session)
                .title("Classic Gray T-Shirt")
                .subtitle("100% Soft and Luxurious Cotton")
                .text("Price is $25 and carried in sizes (S, M, L, and XL)")
                .images([builder.CardImage.create(session, 'http://mysafetybot.azurewebsites.net/img/img.phone')])
                .buttons([
                    builder.CardAction.imBack(session, "buy classic gray t-shirt", "Buy")
                ])
        ]);
        session.send(msg).endDialog();
    
    },

    function (session, result) {
    }
]