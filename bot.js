var builder = require('botbuilder');
var restify = require('restify');
var h = require('./helper.js');
// require('dotenv-extended').load();

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
 });

var connector = new builder.ChatConnector();
var bot = new builder.UniversalBot(connector, {
    localizerSettings: { 
        defaultLocale: "en" 
    }
});

// Bot Dialogs
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
bot.dialog('found', require('./dialogs/found-dialog.js') );
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