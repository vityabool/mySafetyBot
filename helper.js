var builder = require('botbuilder');

module.exports = { 
    text: function (session, str) {
        return session.localizer.gettext(session.preferredLocale(), str);
    }
};