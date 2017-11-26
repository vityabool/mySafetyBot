
var found = {
    itemType : {
        device : false,
        document : false,
        keys : false,
        animal : false,
        bag : false,
        other: false
    },
    // if itemType = other
    otherItemType : "",
    //
    itemDescription : "",
    name : "",
    id : "",
    foundTime : "",
    // if docuemnt
    documentName : "",
    documentNumber : "",
    //
    contactMethod : {
        phone : false,
        email : false,
        mail : false
    },
    contactMethodAlt : {
        phone : false,
        email : false,
        mail : false,
        none : false
    },

    phone : "",
    email : "",
    mail : "",

    altphone : "",
    altemail : "",
    altmail : "",
    
    additioanInfo : "",

    getitemType: function() {
        if (this.itemType.device) return "device";
        if (this.itemType.documents) return "documents";
        if (this.itemType.keys) return "keys";
        if (this.itemType.animal)  return "animal";
        if (this.itemType.bag) return "bag";
        if (this.itemType.other) return "other";
    },
    
    getcontactMethod: function() {
        if (this.contactMethod.phone) return "phone";
        if (this.contactMethod.email) return "email";
        if (this.contactMethod.mail) return "mail"
    },

    getcontactMethodAlt: function() {
        if (this.contactMethodAlt.phone) return "phone";
        if (this.contactMethodAlt.email) return "email";
        if (this.contactMethodAlt.mail) return "mail";
        if (this.contactMethodAlt.none) return "none";
    },

}

module.exports = found; 