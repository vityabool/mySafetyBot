



var f = Object.create(require('./found'));
var ff = Object.create(require('./found'));
f.otherItemType = "aaa";
f.itemType.animal = true;

ff.otherItemType = "bbbb"

console.log(JSON.stringify(f));
console.log('-----------------');
console.log(f.getitemType());
