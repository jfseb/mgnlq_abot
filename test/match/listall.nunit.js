/**
 * @file
 * @module toolmatcher.nunit
 * @copyright (c) 2016 Gerd Forstmann
 */

var process = require('process');
var root =  '../../js';

//var debuglog = require('debug')('listall.nunit');

const ListAll = require(root + '/match/listall.js');
//const WhatIs = require(root + '/match/whatis');

const Model = require('mgnlq_model').Model;

//const theModel = Model.loadModels();


var getModel = require('mgnlq_testmodel_replay').getTestModel;

process.on('unhandledRejection', function onError(err) {
  console.log(err);
  console.log(err.stack);
  throw err;
});

/*
const mRules = InputFilterRules.getMRulesSample();


var records = [
  {
    'unit test': 'NavTargetResolution',
    'url': 'com.sap.NTA'
  },
  {
    'unit test': 'CrossApplcationNavigatiofn',
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
        //console.log(JSON.stringify(res));
       // test.deepEqual(ListAll.formatDistinctFromWhatIfResult([]), '');
        var res3 = ListAll.joinResultsFilterDuplicates(res);
        //test.deepEqual(res3, ['com.sap.NTA' ]);
        test.deepEqual(res3, []);

        var res2 = ListAll.formatDistinctFromWhatIfResult(res);

        test.deepEqual(res2, ''); // '"com.sap.NTA"');
        test.done();
      });
    Model.releaseModel(theModel);
  });
};

exports.testJoinResultsTupel = function (test) {
  var result = [{
    // 'sentence': [{ 'string': 'mercury', 'matchedString': 'mercury', 'category': 'element name', '_ranking': 0.95 }],
    'columns': ['element name', 'atomic weight'], 'results': [
      { 'element name' : 'mercury',  'atomic weight' : '200.592(3)'}]
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
        test.deepEqual(ListAll.flattenToStringArray(res),
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
        test.deepEqual(ListAll.flattenToStringArray(res),

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
        test.deepEqual(ListAll.flattenToStringArray(res),
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
        test.deepEqual(ListAll.flattenToStringArray(res),
          [['CA', 'SAP_TC_FIN_ACC_BE_APPS:S4FIN'],
          ['CA', 'SAP_TC_FIN_ACC_BE_APPS:S4FIN']]
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

exports.testProjectResultToStringArray = function (test) {
  var src = {
    columns: ['b', 'a', 'c', 'e'],
    results: [{ a: 1, b: true, c: null, e: 'abc' }
        , { a: -17.5, b: false, c: null, e: 'abc' }
    ]
  };
  var res = ListAll.projectResultsToStringArray(
   src);
  test.deepEqual('' + src.results[0].c, 'null' );
  test.deepEqual('' + res[0][2], 'null', 'is null' );
  test.deepEqual(res,
    [['true', '1', 'null', 'abc'],
    ['false', '-17.5', 'null', 'abc']
    ]);
  test.done();
};

exports.testFlattenErrors = function (test) {
  var r = [{ errors: false }, { errors: { abc: 1 } }];
  var res = ListAll.flattenErrors(r);
  test.deepEqual(res, [ { abc: 1 }]);
  test.done();
};

exports.testListAllMultWithCompareBECategories = function (test) {
  //"list all ApplicationComponent, devclass, FioriBackendCatalogs with TransactionCode S_ALR_87012394."4
  getModel().then(theModel => {
    theModel.rules.wordCache = {};
    ListAll.listAllShowMe('orbits with earth', theModel).then((res) => {
      //console.log(JSON.stringify(res));
      test.deepEqual(res.bestURI, 'https://en.wikipedia.org/wiki/Earth',
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
        test.deepEqual(ListAll.flattenToStringArray(res),
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

        test.deepEqual(ListAll.flattenToStringArray(res),
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
        test.deepEqual(ListAll.flattenToStringArray(res),
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
        test.deepEqual(ListAll.flattenToStringArray(res),
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
        var res2 = ListAll.formatDistinctFromWhatIfResult(res);
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
        var res2 = ListAll.formatDistinctFromWhatIfResult(res);
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
        var res2 = ListAll.formatDistinctFromWhatIfResult(res);
        test.deepEqual(res2,
          '"/UIF/LREPDATTR"; "/UIF/LREPDATTRCD"; "/UIF/LREPDCONT"; "/UIF/LREPDCONTCD"; "/UIF/LREPDEREF"; "/UIF/LREPDEREFCD"; "/UIF/LREPDLTXT"; "/UIF/LREPDLTXTCD"; "/UIF/LREPDREF"; "/UIF/LREPDREFCD"; "/UIF/LREPDSTXT"; "/UIF/LREPDSTXTCD"; "/UIF/LREPDTEXT"; "/UIF/LREPDTEXTCD"; "LTDHTRAW"; "LTDHTTMPL"; "LTR_REPOSITORY"; "SWOTDI"; "SWOTDQ"; "TZS02"'
        ); // '"com.sap.NTA"; "com.sap.SNav"');
        test.done();
        Model.releaseModel(theModel);
      });
  });
};

exports.testGetDistinctDomains = function(test) {
  var res = [{ domain : 'a'},{ domain: undefined }];
  test.deepEqual(ListAll.getDistinctOKDomains(res),['a']);
  var res1b = [{ domain : 'a'},{ domain : 'a'},{ domain: undefined }];
  test.deepEqual(ListAll.getDistinctOKDomains(res1b),['a']);
  var res2 = [{ domain : 'a', errors: {} },{ domain: undefined }];
  test.deepEqual(ListAll.getDistinctOKDomains(res2),[]);
  var res3 = [{ domain : 'a', errors : false}, { domain : 'A', errors: false }, { domain : 'a'}, { domain: 'b'}];
  test.deepEqual(ListAll.getDistinctOKDomains(res3),['a','A', 'b']);
  test.done();
};

exports.testhasOKAnswer = function(test) {
  var res = [{ domain : 'a'},{ domain: undefined }];
  test.deepEqual(ListAll.hasOKAnswer(res), true);
  var res2 = [{ domain : 'a', errors: {} },{ domain: undefined }];
  test.deepEqual(ListAll.hasOKAnswer(res2),false);
  test.done();
};

exports.testFilterOKAnswer = function(test) {
  test.deepEqual(ListAll.isOKAnswer({ domain : undefined}),false);
  test.done();
};

exports.testremoveErrorsIfOKAnswers = function(test) {
  var res = [{ domain : 'a'},{ domain: undefined }];
  test.deepEqual(ListAll.removeErrorsIfOKAnswers(res),[{ domain : 'a'}]);
  var res2 = [{ domain : 'a', errors: {} },{ domain: undefined }];
  test.deepEqual(ListAll.removeErrorsIfOKAnswers(res2), [{ domain : 'a', errors: {} },{ domain: undefined }] );
  var res3 = [{ domain : 'a', errors : false}, { domain : 'A', errors: false }, { domain : 'a'}, { domain : undefined}, { domain : 'b', errors: {}} ,{ domain: 'b'}];
  test.deepEqual(ListAll.removeErrorsIfOKAnswers(res3),[{ domain : 'a', errors : false},
  { domain : 'A', errors: false }, { domain : 'a'}, { domain: 'b'}], ' filter list'
  );
  test.done();
};

exports.testRemoveEmptyResults = function(test) {
  var res = [{ domain : 'a', results: []},{ domain: 'b', results: [{}]} ];
  test.deepEqual(ListAll.removeEmptyResults(res),[{ domain : 'b', results: [{}]}]);
  test.done();
};

/*
exports.testSortMetamodelLast = function(test) {
  var res = [{ domain : 'b', results: []},{ domain: 'metamodel', results: ['a']},
  { domain: 'a', results: [{}]},
  { domain: 'metamodel', results: ['a']},
  ];
  test.deepEqual(ListAll.sortMetamodelsLast(res),[{ domain : 'b', results: [{}]}]);
  test.done();
};
*/

exports.testHasEmpty = function(test) {
  var res = [{ domain : 'b', results: ['x']},{ domain: 'metamodel', results: ['a']},
  { domain: 'a', results: [{}]},
  { domain: 'metamodel', results: ['a']},
  ];
  test.deepEqual(ListAll.hasEmptyResult(res), false);
  test.done();
};



exports.testRemoveMetamodelsResultIfOthersThrowsEmpty = function(test) {
  var res = [{ domain : 'b', results: []},{ domain: 'metamodel', results: ['a']},
    { domain: 'a', results: [{}]},
    { domain: 'metamodel', results: ['a']},
  ];
  try {
    ListAll.removeMetamodelResultIfOthers(res);
    test.equal(0,1);
  } catch(e) {
    test.equal(0,0);
  }
  test.done();
};

exports.testRemoveMetamodelsResultIfOthersThrowsError = function(test) {
  var res = [{ domain : 'b', errors :{}, results: ['a']}];
  try {
    ListAll.removeMetamodelResultIfOthers(res);
    test.equal(0,1);
  } catch(e) {
    test.equal(0,0);
  }
  test.done();
};


exports.testRemoveMetamodelsResultIfOthersOthers = function(test) {
  var res = [{ domain : 'b', results: ['x']},{ domain: 'metamodel', results: ['a']},
  { domain: 'a', results: [{}]},
  { domain: 'metamodel', results: ['a']},
  ];
  test.deepEqual(ListAll.removeMetamodelResultIfOthers(res),[{ domain : 'b', results: ['x']},
  { domain: 'a', results: [{}]}]);
  test.done();
};

exports.testRemoveMetamodelsResultIfOthersOnlyMetamodel = function(test) {
  var res = [{ domain: 'metamodel', results: ['a']},
    { domain: 'metamodel', results: [{}]},
    { domain: 'metamodel', results: ['a']}
  ];
  test.deepEqual(ListAll.removeMetamodelResultIfOthers(res),[{ domain: 'metamodel', results: ['a']},
    { domain: 'metamodel', results: [{}]},
    { domain: 'metamodel', results: ['a']}
  ]);
  test.done();
};

exports.testSortByDomains = function(test) {

  test.done();
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

/*
exports.testListAllFilterStringList = function (test) {
  var res = ListAll.filterStringListByOp({
    operator: 'contains'
  }, 'abc', ['', 'abc', 'def abc hij', 'soabc', 'sonothing', 'abbutnotc']);
  test.deepEqual(res, ['abc', 'def abc hij', 'soabc']);
  test.done();
};
*/


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


