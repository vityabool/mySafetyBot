var builder = require('botbuilder');
var h = require('../helper.js');

module.exports = [
    function (session) {
        session.send("About message");
        session.replaceDialog('mainmenu');
    },

    function (session, result) {
    }
]