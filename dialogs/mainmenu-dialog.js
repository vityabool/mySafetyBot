var builder = require('botbuilder');

module.exports =
[    
    function (session) {
        // session.send("greetings");
        //session.send('Hello, I am mySefety Bot. How can I help you?')
        var options = [
            session.localizer.gettext(session.preferredLocale(), "lost"),
            session.localizer.gettext(session.preferredLocale(), "found"),
            session.localizer.gettext(session.preferredLocale(), "services"),
            session.localizer.gettext(session.preferredLocale(), "faq"),
            session.localizer.gettext(session.preferredLocale(), "about"),
        ];

        builder.Prompts.choice(session, "questionAreaDescription", options);

    },
    function (session, result) {
            if (result.response.entity) {
             switch (result.response.entity) {
                case session.localizer.gettext(session.preferredLocale(), "lost"):
                    session.beginDialog('lost');
                    break;
                case session.localizer.gettext(session.preferredLocale(), "found"):
                    session.beginDialog('found');
                    break;
                case session.localizer.gettext(session.preferredLocale(), "services"):
                    session.beginDialog('services');
                break;    
                case session.localizer.gettext(session.preferredLocale(), "found"):
                    session.beginDialog('faq');
                break;
                case session.localizer.gettext(session.preferredLocale(), "about"):
                    session.beginDialog('about');
                break;    
                //default: 
                //    session.send("I do not understand." + result.response.entity + "  --  " + session.localizer.gettext(session.preferredLocale(), "lost"));
            }
        }
    }
]