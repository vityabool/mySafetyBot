var builder = require('botbuilder');
var restify = require('restify');

// var connector = new builder.ConsoleConnector().listen();
var connector = new builder.ChatConnector();
var bot = new builder.UniversalBot(connector);

// bot.dialog('/', function(session) {
//     // session.send('Hello, bot!');
//     var userMessage = session.message.text;
//     session.send('Your message was: ' + userMessage);
// });

bot.dialog('/', [
    function (session) {
        builder.Prompts.text(session, 'What is your name?')
    },
    function (session, result) {
            session.send('Hello ' + result.response);
    }
]);

var server = restify.createServer();
server.listen (3388, function() {
    console.log('%s listening at %s', server.name, server.url);
});
server.post('/api/messages', connector.listen());