var builder = require('botbuilder');
var h = require('../helper.js');
var data = Object.create(require('../models/found.js'));
//const sgMail = require('@sendgrid/mail');
require('dotenv-extended').load();
//sgMail.setApiKey(process.env.SENDGRID_API_KEY);
var storage = require('azure-storage');
var guid = require('guid');
var nodemailer = require('nodemailer');



module.exports = [
    function (session) {
        // Choose item 
        //session.send("itemType");
        //session.conversationData.formData = data;
        //var data = Object.create(require('../models/found.js'));
        var options = [
            h.text(session,"itemType_device"),
            h.text(session,"itemType_documents"),
            h.text(session,"itemType_keys"),
            h.text(session,"itemType_animal"),
            h.text(session,"itemType_bag"),
            h.text(session,"itemType_other"),
        ];
            
            builder.Prompts.choice(session,"itemType", options);
            
    },

    function (session, result) {
        switch (result.response.entity) {
            case h.text(session,"itemType_device"): data.itemType.device = true; break;
            case h.text(session,"itemType_documents"): data.itemType.document = true; break;
            case h.text(session,"itemType_keys"): data.itemType.device = true; break;
            case h.text(session,"itemType_animal"): data.itemType.device = true; break;
            case h.text(session,"itemType_bag"): data.itemType.device = true; break;
            case h.text(session,"itemType_other"): 
                data.itemType.other = true; 
                //session.beginDialog('found-other');
            break;
            default: 
                session.send("I do not understand.");
            } 
        
            //session.send(JSON.stringify(data.itemType));
        if (data.itemType.other)    
            builder.Prompts.text(session, "otherItemType");
        else        
            builder.Prompts.text(session, "itemDescription");        
    },

    function (session, result, next) {
        if (data.itemType.other) {    
            data.otherItemType = result.response;
            builder.Prompts.text(session, "itemDescription");
         } else {
            data.itemDescription = result.response;
            next();
        }
    },

    function (session, result) {
        if (!data.itemDescription)
            data.itemDescription = result.response;
        builder.Prompts.text(session, "name");
    },

    function (session, result) {
        data.name = result.response;
        builder.Prompts.text(session, "id");
    },

    function (session, result) {
        data.id = result.response;
        if (data.itemType.document) 
            builder.Prompts.text(session, "documentName");
        else
            builder.Prompts.time(session, "foundTime");
    },

    function (session, result, next) {
        if (data.itemType.document) {
            data.documentName = result.response;
            builder.Prompts.text(session, "documentNumber");
        } else {
            data.foundTime = builder.EntityRecognizer.resolveTime([result.response]);
            next();
        }
    },

    function (session, result, next) {
        if (data.itemType.document) {
            data.documentNumber = result.response;
            builder.Prompts.time(session, "foundTime");
        } else {
            next();
        }
    },

    function (session, result) {
        if (!data.foundTime) data.foundTime = builder.EntityRecognizer.resolveTime([result.response]);
        
        var options = [
            h.text(session,"contact_phone"),
            h.text(session,"contact_email"),
            h.text(session,"contact_mail"),
        ];
            
            builder.Prompts.choice(session,"contactMethod", options);
    },

    function (session, result) {
        switch (result.response.entity) {
            case h.text(session,"contact_phone"): 
                data.contactMethod.phone = true; 
                builder.Prompts.text(session, "phone");
            break;
            case h.text(session,"contact_email"): 
                data.contactMethod.email = true; 
                builder.Prompts.text(session, "email");
            break;
            case h.text(session,"contact_mail"): 
                data.contactMethod.mail = true; 
                builder.Prompts.text(session, "mail");
            break;
        }
    },

    function (session, result) {
        if (data.contactMethod.phone) data.phone = result.response;
        if (data.contactMethod.email) data.email = result.response;
        if (data.contactMethod.mail) data.mail = result.response;
        
        //session.send(JSON.stringify(data));

        var options = [
            h.text(session,"contact_phone"),
            h.text(session,"contact_email"),
            h.text(session,"contact_mail"),
            h.text(session,"contact_none"),
        ];
            
        builder.Prompts.choice(session,"contactMethodAlt", options);
    },

    function (session, result, next) {
        switch (result.response.entity) {
            case h.text(session,"contact_phone"): 
                data.contactMethodAlt.phone = true; 
                builder.Prompts.text(session, "phone");
            break;
            case h.text(session,"contact_email"): 
                data.contactMethodAlt.email = true; 
                builder.Prompts.text(session, "email");
            break;
            case h.text(session,"contact_mail"): 
                data.contactMethodAlt.mail = true; 
                builder.Prompts.text(session, "mail");
            break;
            case h.text(session,"contact_none"): 
                data.contactMethodAlt.none = true; 
                next();
            break;
        }
    },

    function (session, result) {
        if (data.contactMethodAlt.phone) data.altphone = result.response;
        if (data.contactMethodAlt.email) data.altemail = result.response;
        if (data.contactMethodAlt.mail) data.altmail = result.response;

        //session.send(JSON.stringify(data));

        builder.Prompts.text(session, "additioanInfo");
    },

    function (session, result) {
        data.additioanInfo = result.response;

        //session.send(JSON.stringify(data));

        var contact = "";
        if (data.contactMethod.phone) contact = h.text(session,"rep_contact_phone") + data.phone;
        if (data.contactMethod.email) contact = h.text(session,"rep_contact_email") + data.email;
        if (data.contactMethod.mail) contact = h.text(session,"rep_contact_mail") + data.mail;

        var altcontact = "";
        if (data.contactMethodAlt.phone) altcontact = h.text(session,"rep_altcontact_phone") + data.altphone;
        if (data.contactMethodAlt.email) altcontact = h.text(session,"rep_altcontact_email") + data.altemail;
        if (data.contactMethodAlt.mail) altcontact = h.text(session,"rep_altcontact_mail") + data.altmail;

        var devType = h.text(session,"itemTypeLost_other") + ", " + data.otherItemType;
        
        if (data.itemType.device) devType = h.text(session,"itemType_device");
        if (data.itemType.document) devType = h.text(session,"itemType_documents");
        if (data.itemType.keys) devType = h.text(session,"itemType_keys");
        if (data.itemType.animal) devType = h.text(session,"itemType_animal");
        if (data.itemType.bag) devType = h.text(session,"itemType_bag");

        var message = 
            h.text(session,"rep_itemType") + ' ' + devType + '\n\n' +
            h.text(session,"rep_itemDescription") + ' ' + data.itemDescription + '\n\n' +
            h.text(session,"rep_name") + ' ' + data.name + '\n\n' +
            h.text(session,"rep_id") + ' ' + data.id + '\n\n' +
            h.text(session,"rep_foundTime") + ' ' + data.foundTime.toLocaleDateString() + " " + data.foundTime.toLocaleTimeString() + '\n\n' +
            h.text(session,"rep_documentNumber") + ' ' + data.documentNumber + '\n\n' +
            contact + '\n\n' +
            altcontact + '\n\n' +
            h.text(session,"rep_additionalInfo") + ' ' + data.additioanInfo + '\n\n';

            session.send("found_summary");
            session.send(message);
            session.userData.message = message;
            builder.Prompts.confirm(session,"confirm_found_email");
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
                foundTime: entGen.DateTime(data.foundTime),
                documentNumber: entGen.String(data.documentNumber),
                phone: entGen.String(data.phone),
                email: entGen.String(data.email),
                mail: entGen.String(data.mail),
                altphone: entGen.String(data.altphone),
                altemail: entGen.String(data.altemail),
                altmail: entGen.String(data.altmail),
                additioanInfo: entGen.String(data.additioanInfo)
            }
        
            tableSvc.insertEntity('botFound', entry, function (error, result, response) {
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
                    subject: 'New Found request from MySafety Bot',
                    text: session.userData.message
                  };

                
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        // Somthing went wrong
                        session.send(h.text(session,"foundSubmitError"))
                        session.replaceDialog('mainmenu');
                    } else {
                      console.log('Email sent: ' + info.response);
                      session.send(h.text(session,"foundSubmitConfirm"));
                      session.replaceDialog('mainmenu');
                    }
                  }); 
                } 
                else {
                    // Somthing went wrong
                    session.send(h.text(session,"foundSubmitError"))
                    session.replaceDialog('mainmenu');
                }
            });
        
        } else {
            builder.Prompts.confirm(session, "foundTryAgain");
        }
    },
    
    function (session, result) {
        if (result.response) {
            session.replaceDialog('found');
        } 
        else {
            session.replaceDialog('mainmenu');
        }
    }

]