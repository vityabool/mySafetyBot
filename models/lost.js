
var lost = {
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
    city : "",
    name : "",
    id : "",
    lostTime : "",
    // if device
    simBlock : false,
    // if docuemnt
    // documentName : "",
    // documentNumber : "",
    //
    policeCase : false,
    phone : "",
    additionalPhone : "",
    
    additioanInfo : "",

    getitemType: function() {
        if (this.itemType.device) return "device";
        if (this.itemType.documents) return "documents";
        if (this.itemType.keys) return "keys";
        if (this.itemType.animal)  return "animal";
        if (this.itemType.bag) return "bag";
        if (this.itemType.other) return "other";
    },
}

module.exports = lost; 