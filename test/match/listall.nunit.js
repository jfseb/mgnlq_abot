/**
 * @file
 * @module toolmatcher.nunit
 * @copyright (c) 2016 Gerd Forstmann
 */

var process = require('process');
var root = (process.env.FSD_COVERAGE) ? '../../gen_cov' : '../../gen';

//var debuglog = require('debug')('listall.nunit');

const ListAll = require(root + '/match/listall.js');
//const WhatIs = require(root + '/match/whatis');

const Model = require('mgnlq_model').Model;

//const theModel = Model.loadModels();


var getModel = require('mgnlq_testmodel_replay').getTestModel;

/*
const mRules = InputFilterRules.getMRulesSample();


var records = [
  {
    'unit test': 'NavTargetResolution',
    'url': 'com.sap.NTA'
  },
  {
    'unit test': 'CrossApplcationNavigation',
    'url': 'com.sap.NTA'
  },
  {
    'unit test': 'ShellNavigation',
    'url': 'com.sap.SNav'
  }
];
*/

//WhatIs.resetCache();

exports.testListAllWithContext = function (test) {
  getModel().then(theModel => {
    // NEW NOT RULES
    ListAll.listAllWithContext('url', 'unit test NavTargetResolution',
      theModel).then((res) => {


        test.deepEqual(ListAll.formatDistinctFromWhatIfResult([]), '');
        var res3 = ListAll.joinResults(res.answers);
        //test.deepEqual(res3, ['com.sap.NTA' ]);
        test.deepEqual(res3, []);

        var res2 = ListAll.formatDistinctFromWhatIfResult(res.answers);

        test.deepEqual(res2, ''); // '"com.sap.NTA"');
        test.done();
      });
    Model.releaseModel(theModel);
  });
};

exports.testJoinResultsTupel = function (test) {
  var result = [{
    'sentence': [{ 'string': 'mercury', 'matchedString': 'mercury', 'category': 'element name', '_ranking': 0.95 }],
    'record': {
      'element name': 'mercury', 'element symbol': 'Hg', 'element number': '80', 'atomic weight': '200.592(3)',
      'tool': 'NoTool', '_domain': 'IUPAC'
    },
    'categories': ['element name', 'atomic weight'], 'result': ['mercury', '200.592(3)'], '_ranking': 1.5
  }];

  var res = ListAll.joinResultsTupel(result);
  test.deepEqual(res, ['"mercury" and "200.592(3)"']);
  test.done();
};

exports.testListAllMultWithCompareOneBadCat = function (test) {
  getModel().then(theModel => {
    //"list all ApplicationComponent, devclass, FioriBackendCatalogs with TransactionCode S_ALR_87012394."
    ListAll.listAllTupelWithContext(['ApplicationComponent', 'devclass', 'FioriBackendCatalogs'], 'TransactionCode S_ALR_87012394',
      theModel).then((res) => {

        //console.log(JSON.stringify(res));
        test.deepEqual(res.tupelanswers.map(o => o.result),
          [['FI-AR', 'APPL_FIN_APP_DESCRIPTORS', 'SAP_TC_FIN_ACC_BE_APPS'],
            ['FI-LOC-FI',
              'ODATA_GLO_FIN_APP_DESCRIPTORS',
              'SAP_TC_FIN_GLO_AC_BE_APPS']]
/*
          [['CA', 'n/a', 'n/a'],
          ['FI-AR', 'APPL_FIN_APP_DESCRIPTORS', 'n/a'],
          ['FI-LOC-FI', 'ODATA_GLO_FIN_APP_DESCRIPTORS', 'n/a']] */,
          'correct result');
        test.done();
        Model.releaseModel(theModel);
      });
  });
};


exports.testListAllMultHavingCompareOneBadCat = function (test) {
  getModel().then(theModel => {
    //"list all ApplicationComponent, devclass, FioriBackendCatalogs with TransactionCode S_ALR_87012394."
    ListAll.listAllTupelWithContext(['ApplicationComponent', 'devclass', 'FioriBackendCatalogs'], 'TransactionCode S_ALR_87012394',
      theModel).then((res) => {

        //console.log(JSON.stringify(res));
        test.deepEqual(res.tupelanswers.map(o => o.result),

          [['FI-AR', 'APPL_FIN_APP_DESCRIPTORS', 'SAP_TC_FIN_ACC_BE_APPS'],
            ['FI-LOC-FI',
              'ODATA_GLO_FIN_APP_DESCRIPTORS',
              'SAP_TC_FIN_GLO_AC_BE_APPS']]
          /*
                    [['CA', 'n/a', 'n/a'],
                    ['FI-AR', 'APPL_FIN_APP_DESCRIPTORS', 'n/a'],
                    ['FI-LOC-FI', 'ODATA_GLO_FIN_APP_DESCRIPTORS', 'n/a']]
                    */
          ,
          'correct result');
        test.done();
        Model.releaseModel(theModel);
      });
  });
};

exports.testListAllMultHavingCompareBECategories = function (test) {
  //"list all ApplicationComponent, devclass, FioriBackendCatalogs with TransactionCode S_ALR_87012394."
  getModel().then(theModel => {
    theModel.rules.wordCache = {};
    ListAll.listAllTupelWithContext(['ApplicationComponent', 'devclass', 'BackendCatalogId'], 'TransactionCode S_ALR_87012394',
      theModel).then((res) => {
        //console.log(JSON.stringify(res));
        test.deepEqual(res.tupelanswers.map(o => o.result),
          [['FI-AR', 'APPL_FIN_APP_DESCRIPTORS', 'SAP_TC_FIN_ACC_BE_APPS'],
            ['FI-LOC-FI',
              'ODATA_GLO_FIN_APP_DESCRIPTORS',
              'SAP_TC_FIN_GLO_AC_BE_APPS']]
          /*
                    [['CA', 'n/a', 'n/a'],
                    ['FI-AR', 'APPL_FIN_APP_DESCRIPTORS', 'SAP_TC_FIN_ACC_BE_APPS'],
                      ['FI-LOC-FI',
                        'ODATA_GLO_FIN_APP_DESCRIPTORS',
                        'SAP_TC_FIN_GLO_AC_BE_APPS']]
                        */
          ,
          'correct result');
        test.done();
        Model.releaseModel(theModel);
      });
  });
};

exports.testListAllMultWithCompareBECategories = function (test) {
  //"list all ApplicationComponent, devclass, FioriBackendCatalogs with TransactionCode S_ALR_87012394."4
  getModel().then(theModel => {
    theModel.rules.wordCache = {};

    ListAll.listAllTupelWithContext(['ApplicationComponent', 'TechnicalCatalog'], 'TransactionCode S_ALR_87012394',
      theModel).then((res) => {

        //console.log(JSON.stringify(res));
        test.deepEqual(res.tupelanswers.map(o => o.result),
          [ [ 'CA', 'SAP_TC_FIN_ACC_BE_APPS:S4FIN' ],
            [ 'CA', 'SAP_TC_FIN_ACC_BE_APPS:S4FIN' ] ]
          /*
      [['CA', 'n/a', 'n/a'],
      ['FI-AR', 'APPL_FIN_APP_DESCRIPTORS', 'SAP_TC_FIN_ACC_BE_APPS'],
        ['FI-LOC-FI',
          'ODATA_GLO_FIN_APP_DESCRIPTORS',
          'SAP_TC_FIN_GLO_AC_BE_APPS']]*/
          ,
          'correct result');
        test.done();
        Model.releaseModel(theModel);
      });
  });
};


///// with category set !


exports.testListAllMultWithCompareBECategoriesWithSet = function (test) {
  getModel().then(theModel => {
    //"list all ApplicationComponent, devclass, FioriBackendCatalogs with TransactionCode S_ALR_87012394."
    var cats = ['ApplicationComponent', 'devclass', 'BackendCatalogId'];
    //var categorySet = Model.getDomainCategoryFilterForTargetCategories(theModel, cats, true);
    ListAll.listAllTupelWithContext(cats, 'TransactionCode S_ALR_87012394',
      theModel).then((res) => {

        //console.log(JSON.stringify(res));
        test.deepEqual(res.tupelanswers.map(o => o.result),
          [
            ['FI-AR', 'APPL_FIN_APP_DESCRIPTORS', 'SAP_TC_FIN_ACC_BE_APPS'],
            ['FI-LOC-FI',
              'ODATA_GLO_FIN_APP_DESCRIPTORS',
              'SAP_TC_FIN_GLO_AC_BE_APPS']],
          'correct result');
        test.done();
        Model.releaseModel(theModel);
      });
  });
};


exports.testListAllMultWithCompareBECategoriesWithSetDomain = function (test) {
  getModel().then(theModel => {
    //"list all ApplicationComponent, devclass, FioriBackendCatalogs with TransactionCode S_ALR_87012394."
    var cats = ['ApplicationComponent', 'devclass', 'BackendCatalogId'];
    //var categoryFilter = Model.getDomainCategoryFilterForTargetCategories(theModel, cats, true);
    ListAll.listAllTupelWithContext(cats, 'TransactionCode S_ALR_87012394',
      theModel).then((res) => {
        //console.log(JSON.stringify(res));

        test.deepEqual(res.tupelanswers.map(o => o.result),
          [
            ['FI-AR', 'APPL_FIN_APP_DESCRIPTORS', 'SAP_TC_FIN_ACC_BE_APPS'],
            ['FI-LOC-FI',
              'ODATA_GLO_FIN_APP_DESCRIPTORS',
              'SAP_TC_FIN_GLO_AC_BE_APPS']],
          'correct result');
        test.done();
        Model.releaseModel(theModel);
      });
  });
};




exports.testListAllMultHavingCompareBECategoriesWithSet = function (test) {
  getModel().then(theModel => {
    //"list all ApplicationComponent, devclass, FioriBackendCatalogs with TransactionCode S_ALR_87012394."
    var cats = ['ApplicationComponent', 'devclass', 'BackendCatalogId'];
    var categorySet = Model.getDomainCategoryFilterForTargetCategories(theModel, cats, true);
    ListAll.listAllTupelWithContext(cats, 'TransactionCode S_ALR_87012394',
      theModel, categorySet).then((res) => {

        //console.log(JSON.stringify(res));
        test.deepEqual(res.tupelanswers.map(o => o.result),
          [

            ['FI-AR', 'APPL_FIN_APP_DESCRIPTORS', 'SAP_TC_FIN_ACC_BE_APPS'],
            ['FI-LOC-FI',
              'ODATA_GLO_FIN_APP_DESCRIPTORS',
              'SAP_TC_FIN_GLO_AC_BE_APPS']],
          'correct result');
        test.done();
        Model.releaseModel(theModel);
      });
  });
};


exports.testListAllMultHavingCompareBECategoriesWithSetOrder = function (test) {
  getModel().then(theModel => {
    //"list all ApplicationComponent, devclass, FioriBackendCatalogs with TransactionCode S_ALR_87012394."
    var cats = ['devclass', 'ApplicationComponent', 'BackendCatalogId'];
    var categorySet = Model.getDomainCategoryFilterForTargetCategories(theModel, cats, true);
    ListAll.listAllTupelWithContext(cats, 'TransactionCode S_ALR_87012394',
      theModel, categorySet).then((res) => {
        //console.log(JSON.stringify(res));
        test.deepEqual(res.tupelanswers.map(o => o.result),
          [['APPL_FIN_APP_DESCRIPTORS', 'FI-AR', 'SAP_TC_FIN_ACC_BE_APPS'],
            ['ODATA_GLO_FIN_APP_DESCRIPTORS', 'FI-LOC-FI',

              'SAP_TC_FIN_GLO_AC_BE_APPS']],
          'correct result');
        test.done();
        Model.releaseModel(theModel);
      });
  });
};


//===




/*

exports.testListAllWithContextEmpty = function (test) {
  getModel().then(theModel => {
  var res = ListAll.listAllWithContext('url', '',
    mRules, records);
  test.deepEqual(res.answers, []);
  test.done();
  Model.releaseModel(theModel);
});
    };

exports.testListAllHavingContext = function (test) {
  getModel().then(theModel => {
  var res = ListAll.listAllWithContext('url', 'unit test',
    mRules, records);
  var res2 = ListAll.formatDistinctFromWhatIfResult(res.answers);

  test.deepEqual(res2, ''); // '"com.sap.NTA"; "com.sap.SNav"');
  test.done();
  Model.releaseModel(theModel);
});
  };


exports.testListAllHavingContextEmpty = function (test) {
  getModel().then(theModel => {
  var res = ListAll.listAllWithContext('url', '', mRules, records);
  var res2 = ListAll.formatDistinctFromWhatIfResult(res.answers);
  test.deepEqual(res2, '');
  test.done();
  Model.releaseModel(theModel);
});
};

*/

exports.testListAllWithContextDomainOPLike = function (test) {
  getModel().then(theModel => {
    ListAll.listAllWithContext('Table', 'domain "SOBJ Tables"',
      theModel).then((res) => {
        var res2 = ListAll.formatDistinctFromWhatIfResult(res.answers);
        test.deepEqual(res2, '"/UIF/LREPDATTR"; "/UIF/LREPDATTRCD"; "/UIF/LREPDCONT"; "/UIF/LREPDCONTCD"; "/UIF/LREPDEREF"; "/UIF/LREPDEREFCD"; "/UIF/LREPDLTXT"; "/UIF/LREPDLTXTCD"; "/UIF/LREPDREF"; "/UIF/LREPDREFCD"; "/UIF/LREPDSTXT"; "/UIF/LREPDSTXTCD"; "/UIF/LREPDTEXT"; "/UIF/LREPDTEXTCD"; "LTDHTRAW"; "LTDHTTMPL"; "LTR_REPOSITORY"; "SWOTDI"; "SWOTDQ"; "TZS02"'); // '"com.sap.NTA"; "com.sap.SNav"');
        test.done();
        Model.releaseModel(theModel);
      });
  });
};


exports.testListAllWithContextDomainLike = function (test) {
  getModel().then(theModel => {
    ListAll.listAllWithContext('Table', '"SOBJ Tables"',
      theModel).then((res) => {
        var res2 = ListAll.formatDistinctFromWhatIfResult(res.answers);
        test.deepEqual(res2, '"/UIF/LREPDATTR"; "/UIF/LREPDATTRCD"; "/UIF/LREPDCONT"; "/UIF/LREPDCONTCD"; "/UIF/LREPDEREF"; "/UIF/LREPDEREFCD"; "/UIF/LREPDLTXT"; "/UIF/LREPDLTXTCD"; "/UIF/LREPDREF"; "/UIF/LREPDREFCD"; "/UIF/LREPDSTXT"; "/UIF/LREPDSTXTCD"; "/UIF/LREPDTEXT"; "/UIF/LREPDTEXTCD"; "LTDHTRAW"; "LTDHTTMPL"; "LTR_REPOSITORY"; "SWOTDI"; "SWOTDQ"; "TZS02"'); // '"com.sap.NTA"; "com.sap.SNav"');
        test.done();
        Model.releaseModel(theModel);
      });
  });
};



exports.testListAllWithContextDomainLikeAmbiguous = function (test) {
  getModel().then(theModel => {
    ListAll.listAllWithContext('Table', 'SOBJ Tables',
      theModel).then((res) => {
        var res2 = ListAll.formatDistinctFromWhatIfResult(res.answers);
        test.deepEqual(res2,
          '"/UIF/LREPDATTR"; "/UIF/LREPDATTRCD"; "/UIF/LREPDCONT"; "/UIF/LREPDCONTCD"; "/UIF/LREPDEREF"; "/UIF/LREPDEREFCD"; "/UIF/LREPDLTXT"; "/UIF/LREPDLTXTCD"; "/UIF/LREPDREF"; "/UIF/LREPDREFCD"; "/UIF/LREPDSTXT"; "/UIF/LREPDSTXTCD"; "/UIF/LREPDTEXT"; "/UIF/LREPDTEXTCD"; "LTDHTRAW"; "LTDHTTMPL"; "LTR_REPOSITORY"; "SWOTDI"; "SWOTDQ"; "TZS02"'
        ); // '"com.sap.NTA"; "com.sap.SNav"');
        test.done();
        Model.releaseModel(theModel);
      });
  });
};

/*

exports.testListAllWithCategory = function (test) {
  getModel().then(theModel => {
    ListAll.listAllWithCategory('unit test',
      theModel).then((res) => {
        var res2 = ListAll.joinDistinct('unit test', res);
        test.deepEqual(res2, '"CrossApplcationNavigation"; "NavTargetResolution"; "ShellNavigation"');
        test.done();
        Model.releaseModel(theModel);
      });
  });
};

*/

exports.testinferDomain = function (test) {
  getModel().then(theModel => {
    var domain = ListAll.inferDomain(theModel, 'domain FioriBOM');
    // TODO CHECK THIS!
    test.equal(domain, 'FioriBOM', ' correct domain inferred');
    test.done();
    Model.releaseModel(theModel);
  });
};

exports.testinferDomainBOM = function (test) {
  getModel().then(theModel => {
    var domain = ListAll.inferDomain(theModel, '"fiori bom"');
    test.equal(domain, 'FioriBOM', ' correct domain inferred');
    test.done();
    Model.releaseModel(theModel);
  });
};



exports.testinferDomainUndef = function (test) {
  getModel().then(theModel => {
    var domain = ListAll.inferDomain(theModel, 'cannot be analyzed');
    test.equal(domain, undefined, ' correct undefined inferred');
    test.done();
    Model.releaseModel(theModel);
  });
};



exports.testinferDomain2_2 = function (test) {
  getModel().then(theModel => {
    var domain = ListAll.inferDomain(theModel, 'domain related to fiori backend catalogs');
    test.equal(domain, 'Fiori Backend Catalogs', ' correct domain inferred');
    test.done();
    Model.releaseModel(theModel);
  });
};


exports.testinferDomainTwoDomains = function (test) {
  getModel().then(theModel => {
    var domain = ListAll.inferDomain(theModel, 'domain FioriFLP domain wiki');
    test.equal(domain, undefined, ' correct domain inferred');
    test.done();
    Model.releaseModel(theModel);
  });
};

exports.testinferDomainDomainByCategory = function (test) {
  getModel().then(theModel => {
    var domain = ListAll.inferDomain(theModel, 'element symbol');

    test.equal(domain, 'IUPAC', ' correct domain inferred');
    test.done();
    Model.releaseModel(theModel);
  });
};

exports.testinferDomainDomainByCategoryAmbiguous = function (test) {
  getModel().then(theModel => {
    var domain = '';
    try {
      domain = ListAll.inferDomain(theModel, 'element name');
      test.equal(true, true);
    } catch (e) {
      test.equal(false, true);
      //empty
    }
    test.equal(domain, undefined, ' correct domain inferred');
    test.done();
    Model.releaseModel(theModel);
  });
};

exports.testinferDomainTwoDomainsByCategory = function (test) {
  getModel().then(theModel => {
    var domain = ListAll.inferDomain(theModel, 'element name country');
    //console.log('here domain: ' + domain);
    test.equal(domain, undefined, ' correct domain inferred');
    test.done();
    Model.releaseModel(theModel);
  });
};

exports.testListAllFilterStringList = function (test) {
  var res = ListAll.filterStringListByOp({
    operator: 'contains'
  }, 'abc', ['', 'abc', 'def abc hij', 'soabc', 'sonothing', 'abbutnotc']);
  test.deepEqual(res, ['abc', 'def abc hij', 'soabc']);
  test.done();
};


exports.testListAllRemoveCaseDuplicates = function (test) {
  var res = ListAll.removeCaseDuplicates(['abC', 'abc', 'Abc', 'ABC', 'abcD', 'ABCD', 'AB', 'a']);
  test.deepEqual(res, ['a', 'AB', 'ABC', 'ABCD']);
  test.done();
};

exports.testlikelyPluralDiff = function (test) {
  test.equal(ListAll.likelyPluralDiff('element name', 'element names'), true);
  test.equal(ListAll.likelyPluralDiff('element name', '"element names"'), true);
  test.equal(ListAll.likelyPluralDiff('element name', '"element nam"'), false);
  test.equal(ListAll.likelyPluralDiff('element names', '"element name"'), false);
  test.done();
};

exports.testListAllFilterStringList = function (test) {
  var res = ListAll.getCategoryOpFilterAsDistinctStrings({
    operator: 'starting with'
  }, 'aBc', 'cat1', [
      { 'cat1': 'abCAndMore' },
      { 'cat1': 'abCAndSomeMore' },
      { 'cat1': 'abcAndsomemore' },
      { 'cat1': 'abCAndAnything' },
      { 'cat1': 'AbcAndsomemore' },

    {
      'cat1': 'abCAndMore',
      'cat2': 'abcAndMore'
    },
    {
      'cat1': 'nononAndMore',
      'cat2': 'abcAndMore'
    },
      { 'cat0': 'abCAndMore' },
      { 'cat1': 'abCAndMore' },
  ]);
  test.deepEqual(res, ['abCAndAnything', 'abCAndMore', 'AbcAndsomemore']);
  test.done();
};


