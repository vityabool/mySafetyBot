var builder = require('botbuilder');
var h = require('../helper.js');

module.exports = [
    function (session) {
        var msg = new builder.Message(session);
        msg.attachmentLayout(builder.AttachmentLayout.carousel)
        msg.attachments([
            new builder.HeroCard(session)
                .title(h.text(session,"ProductPetTitle"))
                .subtitle(h.text(session,"ProductPetSubTitle"))
                .text(h.text(session,"ProductPetText"))
                .images([builder.CardImage.create(session, 'https://mysafetybot.blob.core.windows.net/img/pets.png')])
                .buttons([
                    builder.CardAction.openUrl(session, "http://mysafety.ua/pets?s=F8A76E2CF1075CA3A6ACFD55DDAEE1766CADFC14", h.text(session,"ProductMoreinfo"))
                ]),
            new builder.HeroCard(session)
                .title(h.text(session,"ProductBagTitle"))
                .subtitle(h.text(session,"ProductBagSubTitle"))
                .text(h.text(session,"ProductBagText"))
                .images([builder.CardImage.create(session, 'https://mysafetybot.blob.core.windows.net/img/Luggage.png')])
                .buttons([
                    builder.CardAction.openUrl(session, "http://mysafety.ua/ua/luggage?s=C4B7E7785BE87447112C7FE02BA4F330D039BC06", h.text(session,"ProductMoreinfo"))
                ]),
                new builder.HeroCard(session)
                .title(h.text(session,"ProductPhoneTitle"))
                .subtitle(h.text(session,"ProductPhoneSubTitle"))
                .text(h.text(session,"ProductPhoneText"))
                .images([builder.CardImage.create(session, 'https://mysafetybot.blob.core.windows.net/img/smartphone.png    ')])
                .buttons([
                    builder.CardAction.openUrl(session, "http://mysafety.ua/ua/gadgets?s=26AE64684FB47EB2D7A729551AB7D80EDD82B789", h.text(session,"ProductMoreinfo"))
                ]),
                new builder.HeroCard(session)
                .title(h.text(session,"ProductKeysTitle"))
                .subtitle(h.text(session,"ProductKeysSubTitle"))
                .text(h.text(session,"ProductKeysText"))
                .images([builder.CardImage.create(session, 'https://mysafetybot.blob.core.windows.net/img/keys.png')])
                .buttons([
                    builder.CardAction.openUrl(session, "http://mysafety.ua/ua/keychain?s=832FD530DD79C6BF68D431550A87C0B74592AD62", h.text(session,"ProductMoreinfo"))
                ]),
                new builder.HeroCard(session)
                .title(h.text(session,"ProductKidsTitle"))
                .subtitle(h.text(session,"ProductKidsSubTitle"))
                .text(h.text(session,"ProductKidsText"))
                .images([builder.CardImage.create(session, 'https://mysafetybot.blob.core.windows.net/img/kids.png')])
                .buttons([
                    builder.CardAction.openUrl(session, "http://mysafety.ua/ua/child?s=3BFC1D99BF5ABA18B77B5A3F631370A29F684193", h.text(session,"ProductMoreinfo"))
                ]),
                new builder.HeroCard(session)
                .title(h.text(session,"ProductDocumentsTitle"))
                .subtitle(h.text(session,"ProductDocumentsSubTitle"))
                .text(h.text(session,"ProductDocumentsText"))
                .images([builder.CardImage.create(session, 'https://mysafetybot.blob.core.windows.net/img/documents.png')])
                .buttons([
                    builder.CardAction.openUrl(session, "http://mysafety.ua/ua/documents?s=88C8CCB5E2765B91BA666978515C610CB99236FA", h.text(session,"ProductMoreinfo"))
                ])
        ]);
        session.send(msg);
        
        builder.Prompts.confirm(session, "ProductBackMain");
    
    },

    function (session, result) {
        session.replaceDialog('mainmenu');
    }
]