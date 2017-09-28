var builder = require('botbuilder');
var restify = require('restify');
var config = require('./phrases');

var connector = new builder.ChatConnector();
var bot = new builder.UniversalBot(connector, {
    localizerSettings: { 
        defaultLocale: "en" 
    }
});



// Bot Dialogs
bot.dialog('/', [
    function (session) {
        session.send("greetings");
        builder.Prompts.text(session, "continue");
    },
    function (session, resuls) {
        session.beginDialog('mainmenu');
    }
]);
        
bot.dialog('mainmenu', [    
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

        builder.Prompts.choice(session, "questionAreaDescription", options, builder.ListStyle.button);

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
                default: 
                    session.send("I do not understand." + result.response.entity + "  --  " + session.localizer.gettext(session.preferredLocale(), "lost"));
            }
        }
    }
]);


bot.dialog('lost', [
    function (session) {
        var lostOptions = [
            session.localizer.gettext(session.preferredLocale(), "lost_callcenter"),
            session.localizer.gettext(session.preferredLocale(), "lost_make_lost_request"),
            session.localizer.gettext(session.preferredLocale(), "lost_block_phone"),
        ];
        builder.Prompts.choice(session, "lost_nextsteps", lostOptions);
    },

    function (session, results) {
        if (result.response.entity) {
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
        }
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
]);

bot.dialog('found', [
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
]);

// Locale picker dialog 
bot.dialog('localePicker', [
    function (session) {
        // Prompt the user to select their preferred locale
        builder.Prompts.choice(session, "What's your preferred language?", 'English|Russian|Ukrainian');
    },
    function (session, results) {
        // Update preferred locale
        var locale;
        switch (results.response.entity) {
            case 'English':
                locale = 'en';
                break;
            case 'Russian':
                locale = 'ru';
                break;
            case 'Ukrainian':
                locale = 'ua';
                break;
        }
        session.preferredLocale(locale, function (err) {
            if (!err) {
                // Locale files loaded
                session.endDialog("Your preferred language is now %s.", results.response.entity);
            } else {
                // Problem loading the selected locale
                session.error(err);
            }
        });
    }
]).triggerAction({ matches: /^lang$/i });

// Setting-up APIs
var server = restify.createServer();
server.listen (3388, function() {
    console.log('%s listening at %s', server.name, server.url);
});
server.post('/api/messages', connector.listen());