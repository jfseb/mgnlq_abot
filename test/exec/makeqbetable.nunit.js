/**
 * @file
 * @module toolmatcher.nunit
 * @copyright (c) 2016 Gerd Forstmann
 */

var root = '../../js';

//var debuglog = require('debug')('maketable.nunit');

const MakeTable = require(root + '/exec/makeqbetable.js');
const Model = require('mgnlq_model').Model;

var mongooseMock = require('mongoose_record_replay').instrumentMongoose(require('mongoose'),
  'node_modules/mgnlq_testmodel_replay/mgrecrep/',
  'REPLAY');

function getModel() {
  return Model.loadModelsOpeningConnection(mongooseMock, 'mongodb://localhost/testdb');
}

exports.testMakeTableNoColumns = function (test) {
  //console.log(JSON.stringify(theModel));
  test.expect(1);
  getModel().then((theModel) => {
    var res = MakeTable.makeTable(['element name', 'element properties'], theModel);
    test.deepEqual(res,
      {
        text: 'Apologies, but i cannot make a table for domain Philosophers elements ',
        action: {}
      }
    );
    test.done();
    Model.releaseModel(theModel);
  });
};



exports.testMakeTableNoCommonDomain = function (test) {
  //console.log(JSON.stringify(theModel));
  getModel().then((theModel) => {
    var res = MakeTable.makeTable(['element name', 'orbit radius'], theModel);
    test.deepEqual(res,
      {
        text: 'No commxon domains for "element name" and "orbit radius"',
        action: {}
      }
    );
    test.done();
    Model.releaseModel(theModel);
  });
};

exports.testMakeTable = function (test) {
  getModel().then((theModel) => {
    var res = MakeTable.makeTable(['element name', 'element number'], theModel);
    test.equal(res.text, 'Creating and starting table with "element name" and "element number"', 'text ok');
    test.equal(res.action.url, 'table_iupac?c2,1', 'acttion ok ');
    test.done();
    Model.releaseModel(theModel);
  });
};

exports.testMakeTableIllegalCol = function (test) {
  getModel().then((theModel) => {
    var res = MakeTable.makeTable(['element name', 'element number', 'atomic weight'], theModel);
    test.equal(res.text,
      'I had to drop "atomic weight". But here you go ...\nCreating and starting table with "element name" and "element number"',
      'text ok');
    test.equal(res.action.url, 'table_iupac?c2,1', 'acttion ok ');
    test.done();
    Model.releaseModel(theModel);
  });
};
