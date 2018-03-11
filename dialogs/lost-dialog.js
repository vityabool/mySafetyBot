
var builder = require('botbuilder');
var h = require('../helper.js');
var data = Object.create(require('../models/lost.js'));
//const sgMail = require('@sendgrid/mail');
require('dotenv-extended').load();
var storage = require('azure-storage');
var guid = require('guid');
var nodemailer = require('nodemailer');

// Long waterfall dialog aimed to fill Found form.
// The result is written to the Storage table
// Storage explorer could be downloaded at https://azure.microsoft.com/en-us/features/storage-explorer/
// And sent to e-mail

module.exports = 
[
    function (session) {
        // Choose item 
        var options = [
            h.text(session,"itemTypeLost_device"),
            h.text(session,"itemTypeLost_documents"),
            h.text(session,"itemTypeLost_keys"),
            h.text(session,"itemTypeLost_animal"),
            h.text(session,"itemTypeLost_bag"),
            h.text(session,"itemTypeLost_other"),
        ];
        builder.Prompts.choice(session,"itemTypeLost", options);          
    },

    function (session, result) {
        switch (result.response.entity) {
            case h.text(session,"itemTypeLost_device"): data.itemType.device = true; break;
            case h.text(session,"itemTypeLost_documents"): data.itemType.document = true; break;
            case h.text(session,"itemTypeLost_keys"): data.itemType.keys = true; break;
            case h.text(session,"itemTypeLost_animal"): data.itemType.animal = true; break;
            case h.text(session,"itemTypeLost_bag"): data.itemType.bag = true; break;
            case h.text(session,"itemTypeLost_other"): 
                data.itemType.other = true; 
            break;
            default: 
                session.send("I do not understand.");
            } 
        
        if (data.itemType.other)    
            builder.Prompts.text(session, "otherItemTypeLost");
        else        
            builder.Prompts.text(session, "itemDescriptionLost");        
    },

    function (session, result, next) {
        if (data.itemType.other) {    
            data.otherItemType = result.response;
            builder.Prompts.text(session, "itemDescriptionLost");
         } else {
            data.itemDescription = result.response;
            next();
        }
    },

    function (session, result) {
        if (!data.itemDescription)
            data.itemDescription = result.response;
        builder.Prompts.text(session, "nameLost");
    },

    function (session, result) {
        data.name = result.response;
        builder.Prompts.text(session, "cityLost");
    },

    function (session, result) {
        data.city = result.response;
        builder.Prompts.text(session, "idLost");
    },

    function (session, result) {
        data.id = result.response;
        builder.Prompts.time(session, "foundTimeLost");
    },

    function (session, result, next) {
        data.lostTime = builder.EntityRecognizer.resolveTime([result.response]);
        if (data.itemType.device) {
            builder.Prompts.confirm(session, "blockSIM");
        } 
        else {
            next();
        }
    },

    function (session, result) {
        data.simBlock = result.response;
        builder.Prompts.confirm(session, "policeCaseConfirm");
    },

    function (session, result) {
        data.policeCase = Boolean(result.response);
        if (!data.policeCase) {
            session.send("policeCaseRequired");
        }
        builder.Prompts.text(session, "phoneLost");
    },

    function (session, result) {
        data.phone = result.response;
        builder.Prompts.text(session, "phoneLostAlt");
    },

    function (session, result) {
        data.additionalPhone = result.response;
        builder.Prompts.text(session, "additioanInfoLost");
    },

    function (session, result) {
        data.additioanInfo = result.response;

        // Doing some multilanguage stuff
        if (data.simBlock) 
            var sim = h.text(session,"Yes");
        else 
            var sim = h.text(session,"No");
        
        if (data.policeCase) 
            var police = h.text(session,"Yes");
        else 
            var police = h.text(session,"No");

        var devType = h.text(session,"itemTypeLost_other") + ", " + data.otherItemType;

        if (data.itemType.device) devType = h.text(session,"itemTypeLost_device");
        if (data.itemType.document) devType = h.text(session,"itemTypeLost_documents");
        if (data.itemType.keys) devType = h.text(session,"itemTypeLost_keys");
        if (data.itemType.animal) devType = h.text(session,"itemTypeLost_animal");
        if (data.itemType.bag) devType = h.text(session,"itemTypeLost_bag");
        // if (data.itemType.other) devType = h.text(session,"itemTypeLost_other");

        var message = 
            h.text(session,"replost_itemType") + ' ' + devType + '\n\n' +
            h.text(session,"replost_itemDescription") + ' ' + data.itemDescription + '\n\n' +
            h.text(session,"replost_name") + ' ' + data.name + '\n\n' +
            h.text(session,"replost_id") + ' ' + data.id + '\n\n' +
            h.text(session,"replost_city") + ' ' + data.city + '\n\n' +
            h.text(session,"replost_lostTime") + ' ' + data.lostTime.toLocaleDateString() + " " + data.lostTime.toLocaleTimeString() + '\n\n' +
            h.text(session,"replost_blocksim") + ' ' + sim + '\n\n' +
            h.text(session,"replost_police") + ' ' + police + '\n\n' +
            h.text(session,"replost_phone") + ' ' + data.phone + '\n\n' +
            h.text(session,"replost_phonealt") + ' ' + data.additionalPhone + '\n\n' +
            h.text(session,"replost_additionalInfo") + ' ' + data.additioanInfo + '\n\n';

        session.send("lost_summary");
        session.send(message);
        session.userData.message = message;

        builder.Prompts.confirm(session, "confirmLostData");
    },

    function (session, result) {
        if (result.response) {
            // Writing record to Storage Table
            session.send("submittingRequest");

            var entGen = storage.TableUtilities.entityGenerator;
            var tableSvc = storage.createTableService(); 

            var devType = 'other';
            if (data.itemType.device) devType = "device";
            if (data.itemType.document) devType = "documents";
            if (data.itemType.keys) devType = "keys";
            if (data.itemType.animal) devType = "animal";
            if (data.itemType.bag) devType = "bag";

            var d = new Date();
            var month = d.getMonth() + 1;
            
            var entry = {
                PartitionKey: entGen.String(d.getFullYear() + '-' + month + '-' + d.getDate()),
                RowKey: entGen.String(guid.raw()),
                itemType: entGen.String(devType),
                itemDescription: entGen.String(data.itemDescription),
                name: entGen.String(data.name),
                id: entGen.String(data.id),
                city: entGen.String(data.city),
                lostTime: entGen.DateTime(data.lostTime),
                sim: entGen.String(data.simBlock),
                police: entGen.String(data.policeCase),
                additionalPhone: entGen.String(data.additionalPhone),
                phone: entGen.String(data.phone),
                additioanInfo: entGen.String(data.additioanInfo)
            }
            
            tableSvc.insertEntity('botLost',entry, function (error, result, response) {
                if (!error) {
                  // Entity inserted, sending e-mail
                  var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: process.env.GMAIL_LOGIN,
                      pass: process.env.GMAIL_PASSWORD
                    }
                  });
                  
                  var mailOptions = {
                    from: 'MySafety Bot <' + process.env.GMAIL_LOGIN + '>',
                    to: process.env.CALL_CENTER_EMAIL,
                    subject: 'New Item Lost request from MySafety Bot',
                    text: session.userData.message
                  };

                
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        // Somthing went wrong
                        session.send(h.text(session,"lostSubmitError"))
                        session.replaceDialog('mainmenu');
                    } else {
                      console.log('Email sent: ' + info.response);
                      session.send(h.text(session,"lostSubmitConfirm"));

                      session.replaceDialog('mainmenu');
                    }
                  }); 
                } 
                else {
                    // Somthing went wrong
                    session.send(h.text(session,"lostSubmitError"))
                    session.replaceDialog('mainmenu');
                }
            });
        
        } else {
            builder.Prompts.confirm(session, "lostTryAgain");
        }
    },
    
    function (session, result) {
        if (result.responce) {
            session.replaceDialog('lost');
        } 
        else {
            session.replaceDialog('mainmenu');
        }
    }
]