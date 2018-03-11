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
        defaultLocale: "ua" 
    },
    storage: new builder.MemoryBotStorage()
});

bot.dialog('/', [
    function (session) {
        session.beginDialog('mainmenu');
        
    }
]);

// Dialogs definition
bot.dialog('mainmenu', require('./dialogs/mainmenu-dialog.js')).triggerAction({ matches: /^main$/i});
bot.dialog('lost', require('./dialogs/lost-dialog.js'));
bot.dialog('found', require('./dialogs/found-dialog.js'));
bot.dialog('services', require('./dialogs/services-dialog.js'));
bot.dialog('faq', require('./dialogs/faq-dialog.js'));
bot.dialog('about', require('./dialogs/about-dialog.js'));
bot.dialog('exit', require('./dialogs/exit-dialog.js'));

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

bot.dialog('ru_qna', ru_qnadialog);

var en_recognizer = new cognitiveservices.QnAMakerRecognizer({
	knowledgeBaseId: process.env.QNA_EN_KBID, 
	subscriptionKey: process.env.QNA_EN_KEY});

var en_qnadialog = new cognitiveservices.QnAMakerDialog({ 
	recognizers: [en_recognizer],
	defaultMessage: 'I cannot find mutch for your question. Try to change it',
    qnaThreshold: process.env.QNA_THRESHOLD});

bot.dialog('en_qna', en_qnadialog);

// Support dialogs
bot.dialog('localePicker', require('./dialogs/locale-dialog.js')).triggerAction({ matches: /^lang$/i });

bot.dialog('help', require('./dialogs/help-dialog.js')).triggerAction({ 
        matches: /^help$/i,
        onSelectAction: (session, args, next) => {
            session.beginDialog(args.action, args);
        }

});

// Add first run dialog
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {

                var greetings = "Привіт/Привет/Hi!";
                // Looks like there is no way to get loacale when the user joins. 
                // The only option is to have generalized message
/*                if (bot.settings.localizerSettings.defaultLocale == 'ua')
                    var greetings = "Привіт! Я Бот MySafety. На протязі розмови наберіть 'help' для допомоги, 'lang' для зміни мови та 'main' для повернення в до початку. \n\n Почнемо розмову?"
                if (bot.settings.localizerSettings.defaultLocale == 'ru')
                    var greetings = "Привет! Я Бот MySafety. В течении разговора наберите 'help' для помощи, 'lang' для изменения языка и 'main' для возврата в начало. \n\n ПНачнем разговор?"
*/
                bot.send(new builder.Message()
                    .address(message.address)
                    .text(greetings));
              }
        });
    }
});
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3388, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
server.post('/api/messages', connector.listen());