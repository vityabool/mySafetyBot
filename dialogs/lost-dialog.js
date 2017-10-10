
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
        builder.Prompts.choice(session, "This dialog still should be implemented", ["OK"]);
    },
    
    function (session) {
        session.replaceDialog('mainmenu');
    }
]