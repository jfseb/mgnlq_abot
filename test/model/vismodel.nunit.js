var process = require('process');
var root = (process.env.FSD_COVERAGE) ? '../../gen_cov' : '../../gen';

//var debug = require('debug')('vismodel.nunit');

const Vismodel = require(root + '/model/vismodel.js');

const Model = require('mgnlq_model').Model;

const getModel = require('mgnlq_testmodel_replay').getTestModel;

//var m = Model.loadModels();

exports.testCalcCategoryRecord = function (test) {
  getModel().then((m) => {
    Vismodel.calcCategoryRecord(m, 'element name', 'IUPAC').then((rec) => {
      test.deepEqual(rec, {
        otherdomains: ['Philosophers elements'],
        nrDistinctValues: 122,
        nrDistinctValuesInDomain: 118,
        nrRecords: 122,
        nrRecordsInDomain: 118,
        nrTotalRecordsInDomain: 118
      });
      test.done();
      Model.releaseModel(m);
    });
  });
};

exports.testCalcCategoryRecordOtherDomain = function (test) {
  getModel().then((m) => {
    Vismodel.calcCategoryRecord(m, 'element name', 'Philosophers elements').then((rec) => {
      test.deepEqual(rec, {
        otherdomains: ['IUPAC'],
        nrDistinctValues: 122,
        nrDistinctValuesInDomain: 4,
        nrRecords: 122,
        nrRecordsInDomain: 4,
        nrTotalRecordsInDomain: 4
      });
      test.done();
      Model.releaseModel(m);
    });
  });
};

