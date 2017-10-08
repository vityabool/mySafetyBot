var builder = require('botbuilder');

module.exports = [
    function (session) {
            
            var options = [
                session.localizer.gettext(session.preferredLocale(), "found_optionsQuestion1"),
                session.localizer.gettext(session.preferredLocale(), "found_optionsQuestion2"),
                session.localizer.gettext(session.preferredLocale(), "found_optionsQuestion3")
            ];
            
            builder.Prompts.choice(session,"found_optionsQuestion", options);
            
    },
    function (session, result) {
            if (result.response.entity) {
             switch (result.response.entity) {
                case session.localizer.gettext(session.preferredLocale(), "found_optionsQuestion1"):
                    session.send(session.localizer.gettext(session.preferredLocale(), "OurPhoneNumber"));
                    break;
                case session.localizer.gettext(session.preferredLocale(), "found_optionsQuestion2"):
                    session.beginDialog('requestPhoneNumber');
                    break;
                case session.localizer.gettext(session.preferredLocale(), "found_optionsQuestion3"):
                    session.send(session.localizer.gettext(session.preferredLocale(), "LinkOnOurWebSite"))
                    break;
                default: 
                    session.send("I do not understand.");
             }
            }
             //session.send(session.localizer.gettext(session.preferredLocale(), "EndOfDialog"));
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