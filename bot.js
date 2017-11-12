var builder = require('botbuilder');
var restify = require('restify');
var h = require('./helper.js');
require('dotenv-extended').load();
var cognitiveservices = require('botbuilder-cognitiveservices');

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
 });

var bot = new builder.UniversalBot(connector, {
    localizerSettings: { 
        defaultLocale: "en" 
    }
});

bot.dialog('/', [
    function (session) {
        session.send(h.text(session, "greetings"));
        session.beginDialog('mainmenu');
    }
    //,
    //function (session, resuls) {
    //    session.beginDialog('mainmenu');
    //}
]);

// Dialogs definition
bot.dialog('mainmenu', require('./dialogs/mainmenu-dialog.js')).triggerAction({ matches: /^main$/i});
bot.dialog('lost', require('./dialogs/lost-dialog.js'));
bot.dialog('found', require('./dialogs/found-dialog.js'));
bot.dialog('services', require('./dialogs/services-dialog.js'));
bot.dialog('faq', require('./dialogs/faq-dialog.js'));
bot.dialog('about', require('./dialogs/about-dialog.js'));

// QNA Dialogs definitions
var ua_recognizer = new cognitiveservices.QnAMakerRecognizer({
	knowledgeBaseId: process.env.QNA_UA_KBID, 
	subscriptionKey: process.env.QNA_UA_KEY});

var ua_qnadialog = new cognitiveservices.QnAMakerDialog({ 
	recognizers: [ua_recognizer],
	defaultMessage: 'Не можу знайти відповідь за вашим запитанням. Спробуйте переформулювати ваше питання.',
    qnaThreshold: process.env.QNA_THRESHOLD});

bot.dialog('ua_qna', ua_qnadialog);

var ru_recognizer = new cognitiveservices.QnAMakerRecognizer({
	knowledgeBaseId: process.env.QNA_RU_KBID, 
	subscriptionKey: process.env.QNA_RU_KEY});

var ru_qnadialog = new cognitiveservices.QnAMakerDialog({ 
	recognizers: [ru_recognizer],
	defaultMessage: 'Не могу найти ответ на ваш вопрос. Попробуйте его переформулировать.',
    qnaThreshold: process.env.QNA_THRESHOLD});

bot.dialog('ru_qna', ua_qnadialog);

var en_recognizer = new cognitiveservices.QnAMakerRecognizer({
	knowledgeBaseId: process.env.QNA_EN_KBID, 
	subscriptionKey: process.env.QNA_EN_KEY});

var en_qnadialog = new cognitiveservices.QnAMakerDialog({ 
	recognizers: [en_recognizer],
	defaultMessage: 'I cannot find mutch for your question. Try to change it',
    qnaThreshold: process.env.QNA_THRESHOLD});

bot.dialog('en_qna', ua_qnadialog);

// Support dialogs
bot.dialog('localePicker', require('./dialogs/locale-dialog.js')).triggerAction({ matches: /^lang$/i });

bot.dialog('help', require('./dialogs/help-dialog.js')).triggerAction({ 
        matches: /^help$/i,
        onSelectAction: (session, args, next) => {
            session.beginDialog(args.action, args);
        }

    });

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3388, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
server.post('/api/messages', connector.listen());