// var globalTunnel = require('global-tunnel')
//  host: 'proxy.exxxample.com',
//  port: 8080
// })

var builder = require('botbuilder');
var process = require('process');
var ABOT_MONGODB = process.env.ABOT_MONGODB || 'testdb';

var MONGO_DBURL = 'mongodb://localhost/' + ABOT_MONGODB;

// Create bot and bind to console
var connector = new builder.ConsoleConnector().listen();

var botdialog = require('./js/bot/smartdialog.js');


var mongoose = require('mongoose');

var Model = require('mgnlq_model').Model;

function loadModel() {
  return Model.loadModelsOpeningConnection(mongoose, MONGO_DBURL, 'smbmodel');
}


botdialog.makeBot(connector, loadModel, { showModelLoadTime: true});
