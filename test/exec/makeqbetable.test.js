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

it("testMakeTableNoColumns", async done => {
  expect.assertions(1);
  getModel().then((theModel) => {
    var res = MakeTable.makeTable(['element name', 'element properties'], theModel);
    expect(res).toEqual({
      text: 'Apologies, but i cannot make a table for domain Philosophers elements ',
      action: {}
    });
    done();
    Model.releaseModel(theModel);
  });
});



it("testMakeTableNoCommonDomain", done => {
  //console.log(JSON.stringify(theModel));
  getModel().then((theModel) => {
    var res = MakeTable.makeTable(['element name', 'orbit radius'], theModel);
    expect(res).toEqual({
      text: 'No commxon domains for "element name" and "orbit radius"',
      action: {}
    });
    done();
    Model.releaseModel(theModel);
  });
});

it("testMakeTable", done => {
  getModel().then((theModel) => {
    var res = MakeTable.makeTable(['element name', 'element number'], theModel);
    expect(res.text).toEqual('Creating and starting table with "element name" and "element number"');
    expect(res.action.url).toEqual('table_iupac?c2,1');
    done();
    Model.releaseModel(theModel);
  });
});

it("testMakeTableIllegalCol", done => {
  getModel().then((theModel) => {
    var res = MakeTable.makeTable(['element name', 'element number', 'atomic weight'], theModel);
    expect(res.text).toEqual(
      'I had to drop "atomic weight". But here you go ...\nCreating and starting table with "element name" and "element number"'
    );
    expect(res.action.url).toEqual('table_iupac?c2,1');
    done();
    Model.releaseModel(theModel);
  });
});
