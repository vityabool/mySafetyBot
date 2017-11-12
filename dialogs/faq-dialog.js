var builder = require('botbuilder');
var h = require('../helper.js');
// var cognitiveservices = require('botbuilder-cognitiveservices');
   
module.exports = [
    function (session) {
        builder.Prompts.text(session, "QNAInitialQuestion");
    },
    function (session, results) {
        if (session.preferredLocale() == 'ua')
            session.beginDialog('ua_qna');
        else if (session.preferredLocale() == 'ru')
            session.beginDialog('ru_qna');
        else 
            session.beginDialog('en_qna');
    },
    function (session,results) {
        builder.Prompts.confirm(session, "QNAMoreQuestions");
    },
    function (session, results) {
        if(results.response) {
            session.replaceDialog('faq');
        } 
        else 
        {
            session.replaceDialog('mainmenu');
        }
    }
]