// var globalTunnel = require('global-tunnel')
//  host: 'proxy.exxxample.com',
//  port: 8080
// })

var builder = require('botbuilder');

var MONGO_DBURL = 'mongodb://localhost/testdb';

// Create bot and bind to console
var connector = new builder.ConsoleConnector().listen();

var botdialog = require('./gen/bot/smartdialog.js');


var mongoose = require('mongoose');

var Model = require('mgnlq_model').Model;

function loadModel() {
  return Model.loadModelsOpeningConnection(mongoose, MONGO_DBURL, 'smbmodel');
}
/**

var getTestModel = require('mgnlq_testmodel_replay').getTestModel;
/*
// Create bot and bind to console
function getBotInstance() {
  var connector = new HTMLConnector.HTMLConnector();
  / ** the model is lazily obatained, if it is not obtained, there is no model * /
  var res = getTestModel();
  res.then((theModel) => connector.theModel = theModel);

  function getM() {
    //res.then((theModel) => connector.theModel = theModel);
    return res;
  }
  SmartDialog.makeBot(connector, getM);
  return res.then( ()=> connector);
}
*/


botdialog.makeBot(connector, loadModel, { showModelLoadTime: true});
