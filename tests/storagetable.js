require('dotenv-extended').load();
var storage = require('azure-storage');
var guid = require('guid');


var entGen = storage.TableUtilities.entityGenerator;

var entry = {
    PartitionKey: entGen.String('lostitem'),
    RowKey: entGen.String(guid.raw()),
    description: entGen.String('take out the trash'),
    dueDate: entGen.DateTime(new Date(Date.UTC(2015, 6, 20))),
    itemType: entGen.String('device'),
    itemDescription: entGen.String('My cool iphone'),
    name: entGen.String('Ivan Petrov'),
    id: entGen.String('X7777Z777'),
    city: entGen.String('Kiev'),
    lostTime: entGen.DateTime(new Date(Date.UTC(2017, 6, 20))),
    sim: entGen.String('ture'),
    police: entGen.String('false'),
    additionalPhone: entGen.String('+3806788733'),
    phone: entGen.String('+38900883333'),
    additioanInfo: entGen.String('Some additional information')
}

var tableSvc = storage.createTableService(); 

tableSvc.insertEntity('botLost',entry, function (error, result, response) {
    if(!error){
      // Entity inserted
        console.log(result);
    }
  });