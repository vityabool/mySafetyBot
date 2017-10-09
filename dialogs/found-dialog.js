var builder = require('botbuilder');
var h = require('../helper.js');
var data = Object.create(require('../models/found.js'));
const sgMail = require('@sendgrid/mail');
require('dotenv-extended').load();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



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
        //session.send(JSON.stringify(data));
        builder.Prompts.text(session, "name");
    },

    function (session, result) {
        data.name = result.response;
        //session.send(JSON.stringify(data));
        builder.Prompts.text(session, "id");
    },

    function (session, result) {
        data.id = result.response;
        //session.send(JSON.stringify(data));
        if (data.itemType.document) 
            builder.Prompts.text(session, "documentName");
        else
            builder.Prompts.text(session, "foundTime");
    },

    function (session, result, next) {
        if (data.itemType.document) {
            data.documentName = result.response;
            builder.Prompts.text(session, "documentNumber");
        } else {
            data.foundTime = result.response;
            next();
        }
    },

    function (session, result, next) {
        if (data.itemType.document) {
            data.documentNumber = result.response;
            builder.Prompts.text(session, "foundTime");
        } else {
            next();
        }
    },

    function (session, result) {
        if (!data.foundTime) data.foundTime = result.response;
        //session.send(JSON.stringify(data));
        
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
        if (data.contactMethod.phone) data.phone = result.response;
        if (data.contactMethod.email) data.email = result.response;
        if (data.contactMethod.mail) data.mail = result.response;

        //session.send(JSON.stringify(data));

        builder.Prompts.text(session, "additioanInfo");
    },

    function (session, result) {
        data.additioanInfo = result.response;

        //session.send(JSON.stringify(data));

        var message = 
            h.text(session,"rep_itemType") + ' ' + data.getitemType() + '\n\n' +
            h.text(session,"rep_itemDescription") + ' ' + data.itemDescription + '\n\n' +
            h.text(session,"rep_name") + ' ' + data.name + '\n\n' +
            h.text(session,"rep_id") + ' ' + data.id + '\n\n' +
            h.text(session,"rep_foundTime") + ' ' + data.foundTime + '\n\n' +
            h.text(session,"rep_documentNumber") + ' ' + data.documentNumber + '\n\n' +
            h.text(session,"rep_contact") + ' ' + data.phone + '\n\n' +
            h.text(session,"rep_altcontact") + ' ' + data.email + '\n\n' +
            h.text(session,"rep_additionalInfo") + ' ' + data.additioanInfo + '\n\n';

            session.send("found_summary");
            session.send(message);
            session.userData.message = message;
            builder.Prompts.choice(session,"confirm_found_email", ["Yes", "No"]);
    },

    function (session, result) {
        if (result.response == "Yes") {
            // Sent e-mail
            var msg = {
                  to: process.env.CALL_CENTER_EMAIL,
                  from: 'mySafety BOT <bot@mysafety.ua>',
                  subject: 'New FOUND request received',
                  text: session.userData.message,
                };
                
            sgMail.send(msg);
            session.send(msg);
            
            session.endConversation("found_end_dialog");
        } 
        else {
            session.endDialog();
        }
    }

]