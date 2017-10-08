
var builder = require('botbuilder');

module.exports = 
[
    function (session) {
        var lostOptions = [
            session.localizer.gettext(session.preferredLocale(), "lost_callcenter"),
            session.localizer.gettext(session.preferredLocale(), "lost_make_lost_request"),
            session.localizer.gettext(session.preferredLocale(), "lost_block_phone"),
        ];
        builder.Prompts.choice(session, "lost_nextsteps", lostOptions);
    },

    function (session, results) {
        session.send("Ok");
        /*if (result.response.entity) {
            switch (result.response.entity) {
                case session.localizer.gettext(session.preferredLocale(), "lost_callcenter"):
                    session.send(session.localizer.gettext(session.preferredLocale(), "lost_callcenter_number"));
                    brake;
                case session.localizer.gettext(session.preferredLocale(), "lost_make_lost_request"):
                    session.beginDialog('lost_getform');
                    break;
                case session.localizer.gettext(session.preferredLocale(), "lost_block_phone"):
                    session.send(session.localizer.gettext(session.preferredLocale(), ""));
                    brake;
            }
        }*/
    },
    
    function (session) {
            session.send(session.localizer.gettext(session.preferredLocale(), "end_of_branch"));
            var yes = session.localizer.gettext(session.preferredLocale(), "Yes");
            var no = session.localizer.gettext(session.preferredLocale(), "No");
            builder.Prompts.choice(session,"ReturnMainMenu", yes + "|" + no);
            
    },
    function (session, result) {
            var yes = session.localizer.gettext(session.preferredLocale(), "Yes");
            if (result.response.entity == yes) {
                session.replaceDialog('mainmenu')
            } else {
                session.send(session.localizer.gettext(session.preferredLocale(), "Buy"));
                session.endConversation(); 
            }
    }
]