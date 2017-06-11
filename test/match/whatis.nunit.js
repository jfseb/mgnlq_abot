/**
 * @file
 * @module whatis.nunit
 * @copyright (c) 2016 Gerd Forstmann
 */

var process = require('process');
var root = (process.env.FSD_COVERAGE) ? '../../gen_cov' : '../../gen';

var debuglog = require('debug')('analyze.nunit');

const WhatIs = require(root + '/match/whatis.js');

var Sentence = require('mgnlq_er').Sentence;

const MongoQueries = require(root + '/match/mongoqueries.js');
const ListAll = require(root + '/match/listall.js');

const InputFilterRules = require('mgnlq_er').InputFilterRules;

const mRules = InputFilterRules.getMRulesSample();


const Model = require('mgnlq_model').Model;
//const theModel = Model.loadModels();
//const theModel2 = Model.loadModels('testmodel2');

var getModel = require('mgnlq_testmodel_replay').getTestModel;
var getModel2 = require('mgnlq_testmodel2').getTestModel;

process.on('unhandledRejection', function onError(err) {
  console.log(err);
  console.log(err.stack);
  throw err;
});


function setMockDebug() {
  var obj = function (s) {
    //console.log(s);
  };
  obj.enabled = true;
  WhatIs.mockDebug(obj);
}
if (!debuglog.enabled) {
  setMockDebug();
}


exports.testCmbByResultTupel = function (test) {
  var aList = [
    {
      _ranking: 1.0,
      result: ['ABC']
    },
    {
      _ranking: 0.9,
      result: ['ABC']
    },
    {
      _ranking: 1.2,
      result: ['DEF']
    },
    {
      _ranking: 0.3,
      result: ['DEF']
    },
  ];

  var res = aList.sort(WhatIs.cmpByResultThenRankingTupel);

  test.deepEqual(res[0], { result: ['ABC'], _ranking: 1.0 }, 'sort order');
  test.deepEqual(res[1], { result: ['ABC'], _ranking: 0.9 }, 'sort order 2nd');

  var resx = WhatIs.filterDistinctResultAndSortTupel({ tupelanswers: res });
  res = resx.tupelanswers;

  debuglog(' after filter: ' + JSON.stringify(res));
  res.sort(WhatIs.cmpByRanking);
  debuglog(JSON.stringify(res));
  test.deepEqual(res[0], { result: ['DEF'], _ranking: 1.2 });
  test.deepEqual(res[1], { result: ['ABC'], _ranking: 1.0 });

  test.equal(res.length, 2);
  test.done();
};



exports.testCmbByRankTied = function (test) {
  var aList = [
    {
      _ranking: 1.0,
      result: 'ABC',
      record: { 'category': 'ccc' }
    },
    {
      _ranking: 1.0,
      result: 'ABC',
      record: { 'category': 'AAA', 'some': 'AAAA' }
    },
    {
      _ranking: 1.0,
      result: 'ABC',
      record: { 'category': 'AAA', 'nosome': 'AAAA' }
    },
    {
      _ranking: 1.0,
      result: 'ABC',
      record: { 'category': 'ZZZ' }
    }
  ];

  var res = aList.sort(WhatIs.cmpByRanking);

  test.deepEqual(res[0], {
    result: 'ABC', _ranking: 1.0,
    record: { 'category': 'AAA', 'nosome': 'AAAA' }
  }, 'sort order');
  test.deepEqual(res[1], {
    result: 'ABC', _ranking: 1.0,
    record: {
      'category': 'AAA',
      'some': 'AAAA'
    }
  }, 'sort order 2nd');


  test.done();
};


exports.testFilterAcceptingOnly = function (test) {

  var inp = [
    [
      {
        string: 'unit test',
        matchedString: 'unit test',
        category: 'category',
        _ranking: 1
      },
      {
        string: 'NavTargetResolution',
        matchedString: 'NavTargetResolution',
        category: 'unit test',
        _ranking: 1.1,
        reinforce: 1.1
      }
    ],
    [
      {
        string: 'unit test',
        matchedString: 'unit test',
        category: 'abc',
        _ranking: 1
      },
      {
        string: 'NavTargetResolution',
        matchedString: 'NavTargetResolution',
        category: 'unit test',
        _ranking: 1.1,
        reinforce: 1.1
      }
    ],
    [
      {
        string: 'unit test',
        matchedString: 'unit test',
        category: 'filler',
        _ranking: 1
      },
      {
        string: 'NavTargetResolution',
        matchedString: 'NavTargetResolution',
        category: 'category',
        _ranking: 1.1,
        reinforce: 1.1
      }
    ]
  ];
  var res = WhatIs.filterAcceptingOnly(inp, ['filler', 'category']);
  test.deepEqual(res, [inp[2]]);
  test.done();
};



exports.testcmpByNrCategoriesAndSameDomain2 = function (test) {
  var inp = [
    [
      {
        matchedString: 'abc',
        category: 'category'
      },
      {
        matchedString: 'abc',
        category: 'filler'
      }],
    [
      {
        matchedString: 'abc',
        'category': 'category'
      },
      {
        matchedString: 'abc',
        'category': 'category'
      },
      {
        matchedString: 'abc',
        'category': 'category'
      },
      {
        matchedString: 'def',
        category: 'category'
      }],
    [
      {
        matchedString: 'abc',
        'category': 'category'
      },
      {
        matchedString: 'hij',
        'category': 'category'
      },
      {
        matchedString: 'def',
        category: 'category'
      }],
    [
      {
        category: 'filler'
      },
      {
        category: 'filler'
      }
    ]
  ];
  var res = inp;
  res.sort(WhatIs.cmpByNrCategoriesAndSameDomain);
  var res2 = Sentence.getDistinctCategoriesInSentence(res[0]);
  test.deepEqual(res2, ['abc', 'hij', 'def']);
  test.done();
};



exports.testcmpByNrCategoriesAndSameDomain = function (test) {
  var inp = [
    [
      {
        matchedString: 'abc',
        category: 'category'
      },
      {
        matchedString: 'abc',
        category: 'filler'
      }],
    [
      {
        matchedString: 'abc',
        'category': 'category'
      },
      {
        matchedString: 'def',
        category: 'category'
      }],
    [
      {
        category: 'filler'
      },
      {
        category: 'filler'
      }
    ]
  ];
  var best = inp[1];
  var res = inp;
  res.sort(WhatIs.cmpByNrCategoriesAndSameDomain);
  test.deepEqual(res[0], best);
  test.done();
};



exports.testAnalyzeCategoryElemSingle = function (test) {
  test.expect(1);
  getModel().then(theModel => {
    var res = WhatIs.analyzeCategory('element names', theModel.rules, 'what is unit test wiki for abc');
    test.deepEqual(res, 'element name');
    test.done();
    Model.releaseModel(theModel);
  });

};



exports.testAnalyzeCategoryElem = function (test) {
  test.expect(1);
  getModel().then(theModel => {
    var res = WhatIs.analyzeCategory('element namess', theModel.rules, 'what is unit test wiki for abc');
    test.deepEqual(res, 'element name');
    test.done();
    Model.releaseModel(theModel);
  });
};


exports.testAnalyzeCategoryMult = function (test) {
  test.expect(1);
  getModel().then(theModel => {
    //    var res = WhatIs.analyzeCategoryMult('unit test and', theModel.rules, 'what is unit test wiki for abc');
    var res = WhatIs.analyzeCategoryMult('orbits and', theModel.rules, 'what is orbits albedo for sun');
    test.deepEqual(res, ['orbits']);
    test.done();
    Model.releaseModel(theModel);
  });
};

exports.testAnalyzeCategoryMult2 = function (test) {
  var res = WhatIs.analyzeCategoryMult('unit test and wiki', mRules, 'what is unit test wiki for abc');
  test.deepEqual(res, undefined); // ['unit test', 'wiki']);
  test.done();
};

// TODO, this is bullshit, complete cover must be better than sloppy matches!
exports.testCategorizeMultElement = function (test) {
  getModel().then(theModel => {
    var res = WhatIs.analyzeCategoryMult('element name and element number, element symbol', theModel.rules, 'what is unit test and wiki for abc');
    test.deepEqual(res, ['element name', 'element number', 'element symbol']);
    test.done();
    Model.releaseModel(theModel);
  });
};


// TODO, this is bullshit, complete cover must be better than sloppy matches!
exports.testAnalyzeCusmos = function (test) {
  getModel().then(theModel => {
    var res = WhatIs.analyzeContextString('cusmos', theModel.rules);
    delete res.sentences[0][0].rule;
    test.deepEqual(res.sentences, [
      [{
        string: 'cusmos',
        matchedString: 'Cosmos',
        category: 'domain',
        _ranking: 0.8913821472645002,
        levenmatch: 0.9382969971205265
      }],
      [{
        string: 'cusmos',
        rule:
        {
          category: 'domain',
          matchedString: 'Cosmos',
          type: 0,
          word: 'Cosmos',
          bitindex: 16,
          bitSentenceAnd: 16,
          exactOnly: false,
          wordType: 'F',
          _ranking: 0.95,
          lowercaseword: 'cosmos'
        },
        matchedString: 'Cosmos',
        category: 'domain',
        _ranking: 0.8913821472645002,
        levenmatch: 0.9382969971205265
      }]]
    );
    test.done();
    Model.releaseModel(theModel);
  });
};


exports.testCategorizeMultElement2 = function (test) {
  getModel().then(theModel => {
    var res = WhatIs.analyzeCategoryMultOnlyAndComma('element name and element number, element symbol', theModel.rules, 'what is unit test and wiki for abc');
    test.deepEqual(res, ['element name', 'element number', 'element symbol']);
    test.done();
    Model.releaseModel(theModel);
  });
};



exports.testCategorize = function (test) {
  var res = WhatIs.analyzeCategory('unit test', mRules, 'what is unit test for abc');
  test.equal(res, 'unit test');
  test.done();
};

exports.testCategorizeBad = function (test) {
  var res = WhatIs.analyzeCategory('NavTargetResolution', mRules, 'what is unit test for abc');
  test.equal(res, undefined);
  test.done();
};

exports.testanalyzeOperator = function (test) {
  var res = WhatIs.analyzeOperator('starting with', mRules, 'what is unit test for abc');
  test.equal(res, 'starts with');
  test.done();
};

exports.testanalyzeOperatorBad = function (test) {
  var res = WhatIs.analyzeOperator('ain no op', mRules, 'what is unit test for abc');
  test.equal(res, undefined);
  test.done();
};

/*
export function resolveCategory(category: string, sString: string,
  aRules: Array<IMatch.mRule>, aTools: Array<IMatch.ITool>, records: Array<IMatch.IRecord>): Array<IMatch.IWhatIsAnswer> {
  if (sString.length === 0) {
    return [];
  } else {
*/


/*
exports.testResolveCategory = function (test) {
  var cat = WhatIs.analyzeCategory('url', mRules);
  test.equal(cat, 'url', ' category present');

  var res = WhatIs.resolveCategory(cat, 'unit test NavTargetResolution',
    mRules, records);
  test.deepEqual(res.answers.length, 0);
  test.done();
  / *
  res.answers[0]._ranking = 777;
  res.answers.forEach(function(r) { stripResult(r); });
  test.deepEqual(res.answers,[ { sentence:
  [ {
    string: 'unit',
    matchedString: 'unit',
    category: 'transaction',
    _ranking: 0.7 },
  { string: 'test',
    matchedString: 'test',
    category: 'transaction',
    _ranking: 0.7 },
  { string: 'NavTargetResolution',
    matchedString: 'NavTargetResolution',
    category: 'unit test',
    _ranking: 1 } ],
    record: { 'unit test': 'NavTargetResolution', url: 'com.sap.NTA' },
    category: 'url',
    result: 'com.sap.NTA',
    _ranking: 777 } ]
    , 'compare result');
  test.done();
  * /
};
*/


/*
exports.testResolveCategoryNoAmb2 = function (test) {
  var cat = WhatIs.analyzeCategory('url', mRules);
  test.equal(cat, 'url', ' category present');
  var res = WhatIs.resolveCategory(cat, 'unit test NavTargetResolution',
    mRules, recordsNoAmb);
  test.equal(res.answers.length, 0, ' resolved length ok');
  test.done();
  return; / *
  res.answers[0]._ranking = 777;
  test.deepEqual(stripResult(res.answers[0]),{ sentence:
  [ {
    string: 'unit',
    matchedString: 'unit',
    category: 'transaction',
    _ranking: 0.7 },
  { string: 'test',
    matchedString: 'test',
    category: 'transaction',
    _ranking: 0.7 },
  { string: 'NavTargetResolution',
    matchedString: 'NavTargetResolution',
    category: 'unit test',
    _ranking: 1 } ],
    record:
    { 'unit test': 'NavTargetResolution',
      url: 'com.sap.NTA',
      systemId: 'UV2',
      client: '110' },
    category: 'url',
    result: 'com.sap.NTA',
    _ranking: 777 }, 'unit test compare 1');
  var indis = WhatIs.isIndiscriminateResult(res.answers);
  test.equal(indis, undefined, 'correct string');
  test.done();
  * /
};
*/

/*

function stripResult(r) {
  delete r.sentence.forEach(function(s) { delete s.rule;  delete s.span;});
  return r;
}
*/
/*
function doRecognize(cat, str , fn) {
  var res = WhatIs.resolveCategoryOld(cat, str,
    theModel2.rules, theModel2.records);
  debuglog(res.answers.map(o => {
    var u = Object.assign({}, o);
    delete u.record;
    return JSON.stringify(u);
  }).join(' \n**\n'));
  fn(undefined, res);
}
*/

function doRecognizeNew(cat, str, fn) {
  getModel2().then((theModel2) => {
    MongoQueries.listAll(cat + ' with ' + str, theModel2).then(resultWI => {
      debuglog(debuglog ? ('listall result2 >:' + JSON.stringify(resultWI)) : '-');
      var joinresults = ListAll.joinResultsTupel(resultWI.tupelanswers);
      debuglog(()=> JSON.stringify(joinresults));
      //var res = WhatIs.resolveCategory(cat, str,
      //  theModel2.rules);
      debuglog(resultWI.tupelanswers.map(o => {
        var u = Object.assign({}, o);
        delete u.record;
        return JSON.stringify(u);
      }).join(' \n**\n'));
      fn(undefined, resultWI, theModel2);
    });
  });
}

/*
function doRecognizeMult(cats, str , fn) {
  var resultArr = WhatIs.resolveCategoriesOld(cats, str,
          theModel2);
  debuglog(resultArr.tupelanswers.map(o => {
    var u = Object.assign({}, o);
    delete u.record;
    return JSON.stringify(u);
  }).join(' \n**\n'));
  fn(undefined, resultArr);
}*/

function doRecognizeMultNew(cats, str, fn) {
  // TODO SHOulD BE TESTMODEL2
  getModel2().then((theModel2) => {
    MongoQueries.listAll(cats.join(' ')+ ' with ' + str, theModel2).then(resultWI => {
      debuglog(debuglog ? ('listall result2 >:' + JSON.stringify(resultWI)) : '-');
      var joinresults = ListAll.joinResultsTupel(resultWI.tupelanswers);
      debuglog(()=> JSON.stringify(joinresults));
      //var res = WhatIs.resolveCategory(cat, str,
      //  theModel2.rules);
      debuglog(resultWI.tupelanswers.map(o => {
        var u = Object.assign({}, o);
        delete u.record;
        return JSON.stringify(u);
      }).join(' \n**\n'));
      fn(undefined, resultWI, theModel2);
/*
    var resultArr = WhatIs.resolveCategories(cats, str,
      theModel2);
    debuglog(resultArr.tupelanswers.map(o => {
      var u = Object.assign({}, o);
      delete u.record;
      return JSON.stringify(u);
    }).join(' \n**\n'));
    fn(undefined, resultArr, theModel2);
    */
    });
  });
}

/*
exports.testUpDownWhatIsBSPNameManageLabels = function (test) {
  doRecognize('BSPName', 'manage labels', function(err, res) {
    test.deepEqual(res.answers[0].result,  'n/a' ,' correct results');
    //console.log(JSON.stringify(Object.keys(res.answers[0])));
    test.deepEqual(res.answers[0].category, 'BSPName', ' category');
    test.deepEqual(res.answers[1].sentence[0].matchedString, 'Manage Alerts', ' category');
    test.deepEqual(res.answers.map(o => o.result),
    [ 'n/a', 'FRA_ALERT_MAN'],  'ranking');
    test.deepEqual(res.answers.map(o => o._ranking),
    [ 1.4249999999999998, 1.3383034353080143 ],  'ranking');
    var indis = WhatIs.isIndiscriminateResult(res.answers);
    test.deepEqual(indis, undefined);
    test.done();
  });
};
*/



exports.testcmpByRankingTupel = function (test) {
  var a1 = {
    _ranking: 1.0,
    record: { 'a': '1', 'b': '2' },
    result: ['a']
  };
  var b1 = {
    _ranking: 1.0,
    record: { 'a': '1', 'b': '3' },
    result: ['a']
  };
  var c1 = {
    _ranking: 1.0,
    record: { 'a': '1' },
    result: ['a']
  };
  var res = WhatIs.cmpByRankingTupel(a1, a1);
  test.equal(res, 0);
  res = WhatIs.cmpByRankingTupel(a1, b1, 'compare 2');
  // console.log('here res' + res);
  test.equal(res < 0, true, 'cmp 2'); //
  res = WhatIs.cmpByRankingTupel(b1, a1, 'def');
  test.equal(res < 0, false);
  res = WhatIs.cmpByRankingTupel(c1, a1);
  test.equal(res < 0, false);
  res = WhatIs.cmpByRankingTupel(a1, c1);
  test.equal(res < 0, true);
  test.done();
};

exports.testUpDownWhatIsBSPNameManageLabelsNew = function (test) {
  doRecognizeNew('BSPName', 'manage labels', function (err, res, aModel) {
    debuglog(()=>' here the result '+ JSON.stringify(res,undefined,2));
    test.deepEqual(res.tupelanswers[0].result[0], 'n/a', ' correct results');
    test.deepEqual(res.tupelanswers[1].result[0], 'FRA_ALERT_MAN', ' correct results');
    //console.log(JSON.stringify(Object.keys(res.answers[0])));
    test.deepEqual(res.tupelanswers[0].categories[0], 'BSPName', ' category');
    //  test.deepEqual(res.answers[1].sentence[0].matchedString, 'Manage Alerts', ' category');
  /*  test.deepEqual(res.answers.map(o => o.result),
      ['n/a'], 'ranking');
    test.deepEqual(res.answers.map(o => o._ranking),
      [1.3537499999999998]
      //[ 2.1374999999999997, 2.0074551529620215 ]
      , 'ranking');
*/
    var indis = WhatIs.isIndiscriminateResultTupel(res.tupelanswers);
    debuglog(()=>'here indis' + JSON.stringify(indis));
    test.deepEqual(indis, 'Your question does not have a specific answer');
    test.done();
    Model.releaseModel(aModel);
  });
};

/*
exports.testUpDownWhatIsBSPNameManageLablesQuote = function (test) {
  doRecognize('BSPName', '"manage labels"', function(err, res) {
    test.deepEqual(res.answers[0].result,  'n/a' ,' correct results');
    //console.log(JSON.stringify(Object.keys(res.answers[0])));
    test.deepEqual(res.answers[0].category, 'BSPName', ' category');
    test.deepEqual(res.answers.length, 1 , 'undefined');
    test.deepEqual(res.answers.map(o => o.result),
    [ 'n/a'],  'ranking');
    test.deepEqual(res.answers.map(o => o._ranking),
    [ 1.4249999999999998 ],  'ranking');
    test.done();
  });
};
*/

exports.testUpDownWhatIsBSPNameManageLabelQuoteNew = function (test) {
  doRecognizeNew('BSPName', '"manage labels"', function (err, res, aModel) {
    test.deepEqual(res.tupelanswers[0].result, ['n/a'], ' correct results');
    //console.log(JSON.stringify(Object.keys(res.answers[0])));
    test.deepEqual(res.tupelanswers.length, 1, 'one result');
    test.deepEqual(res.tupelanswers[0].categories[0], 'BSPName', ' category');
   //?? test.deepEqual(res.tupelanswers[0].categories[0], 'BSPName', ' category');
    test.deepEqual(res.tupelanswers[0].sentence[2].matchedString, 'Manage Labels', ' matched' );
    test.deepEqual(res.tupelanswers.map(o => o.result),
      [['n/a']], ' value');
      /*
    test.deepEqual(res.answers.map(o => o._ranking),
      // [ 2.1374999999999997 ]
      [1.3537499999999998]

      , 'ranking');
      */
    var indis = WhatIs.isIndiscriminateResultTupel(res.tupelanswers);
    test.deepEqual(indis, undefined);
    test.done();
    Model.releaseModel(aModel);
  });
};

/*
exports.testWhatIsBSPNameFioriIntentManageLabels = function (test) {
  doRecognizeMult(['BSPName','fiori intent', 'AppName'],'manage labels', function(err, resultArr) {
    test.deepEqual(resultArr.tupelanswers[1].result[0],  'n/a');
    test.deepEqual(resultArr.tupelanswers.map(o => o.result),
      [ [ 'FRA_ALERT_MAN', '#ComplianceAlerts-manage', 'Manage Alerts' ],
  [ 'n/a', '#ProductLabel-manage', 'Manage Labels' ] ],  'result');
    var indis = WhatIs.isIndiscriminateResultTupel(resultArr.tupelanswers);
    test.deepEqual(indis,  'Many comparable results, perhaps you want to specify a discriminating uri,appId,ApplicationComponent,RoleName,ApplicationType,BSPApplicationURL,releaseName,releaseId,BusinessCatalog,TechnicalCatalog,detailsurl,BSPPackage,AppDocumentationLinkKW,BusinessRoleName,BusinessGroupName,BusinessGroupDescription,PrimaryODataServiceName,SemanticObject,FrontendSoftwareComponent,TransactionCodes,PrimaryODataPFCGRole,ExternalReleaseName,ArtifactId,ProjectPortalLink,AppKey or use "list all ..."',
     'indis');
    test.done();
  });
};

exports.testUpWhatIsBSPNameFioriIntentManageLablesQuote = function (test) {
  doRecognizeMult(['BSPName','fiori intent', 'AppName'],'"manage labels"', function(err, resultArr) {
    test.deepEqual(resultArr.tupelanswers[0].result[0],  'n/a');
    test.deepEqual(resultArr.tupelanswers.map(o => o.result),
      [
  [ 'n/a', '#ProductLabel-manage', 'Manage Labels' ] ],  'result');
    var indis = WhatIs.isIndiscriminateResultTupel(resultArr.tupelanswers);
    test.deepEqual(indis, undefined, 'indis');
    test.done();
  });
};
*/

exports.testWhatIsBSPNameFioriIntentManageLabelsNew = function (test) {
  doRecognizeMultNew(['BSPName', 'fiori intent', 'AppName'], 'manage labels', function (err, resultArr, aModel) {
    test.deepEqual(resultArr.tupelanswers[0].result[0], 'n/a');
    test.deepEqual(resultArr.tupelanswers.map(o => o.result),
      [
        ['n/a', '#ProductLabel-manage', 'Manage Labels'],
    // TODO: 2nd result should not be there as it is not close enoough
    //AppNAme filters for it?
        [ 'FRA_ALERT_MAN', '#ComplianceAlerts-manage', 'Manage Alerts' ]
      ], 'result');
    var indis = WhatIs.isIndiscriminateResultTupel(resultArr.tupelanswers);
    test.deepEqual(indis !== undefined, true);
    // 'Many comparable results, perhaps you want to specify a discriminating uri,appId,ApplicationComponent,RoleName,ApplicationType,BSPApplicationURL,releaseName,releaseId,BusinessCatalog,TechnicalCatalog,detailsurl,BSPPackage,AppDocumentationLinkKW,BusinessRoleName,BusinessGroupName,//BusinessGroupDescription,PrimaryODataServiceName,SemanticObject,FrontendSoftwareComponent,TransactionCodes,PrimaryODataPFCGRole,ExternalReleaseName,ArtifactId,ProjectPortalLink,AppKey or use "list all ..."',
    // 'indis');
    test.done();
    Model.releaseModel(aModel);
  });
};

exports.testUpWhatIsBSPNameFioriIntentManageLabelsQuoteNew = function (test) {
  doRecognizeMultNew(['BSPName', 'fiori intent', 'AppName'], '"manage labels"', function (err, resultArr, aModel) {
    test.deepEqual(resultArr.tupelanswers[0].result[0],'n/a');
    test.deepEqual(resultArr.tupelanswers.map(o => o.result),
      [
        ['n/a', '#ProductLabel-manage', 'Manage Labels']], 'result');
    var indis = WhatIs.isIndiscriminateResultTupel(resultArr.tupelanswers);
    test.deepEqual(indis, undefined, 'indis');
    test.done();
    Model.releaseModel(aModel);
  });
};


/*
exports.testResolveCategoryAmb = function (test) {
  var cat = WhatIs.analyzeCategory('url', mRules);
  test.equal(cat, 'url', ' category present');
  var res = WhatIs.resolveCategory(cat, 'unit test NavTargetResolution',
    mRules, recordsAmb);
  //TODO
  //console.log(JSON.stringify(res.answers,undefined, 2));
  test.equal(res.answers.length, 0);
  / *
  res.answers[0]._ranking = 777;
  res.answers[1]._ranking = 777;
  test.deepEqual(stripResult(res.answers[1]), { sentence:
  [ {
    string: 'unit',
    matchedString: 'unit',
    category: 'fiori catalog',
    _ranking: 0.5 },
  { string: 'test',
    matchedString: 'test',
    category: 'transaction',
    _ranking: 0.7 },
  { string: 'NavTargetResolution',
    matchedString: 'NavTargetResolution',
    category: 'unit test',
    _ranking: 1 } ],
    record:
    { 'unit test': 'NavTargetResolution',
      url: 'com.sap.NTAUV2120',
      systemId: 'UV2',
      client: '120' },
    category: 'url',
    result: 'com.sap.NTAUV2120',
    _ranking: 777 }, ' result 1');
  test.deepEqual(stripResult(res.answers[0]), { sentence:
  [ {
    string: 'unit',
    matchedString: 'unit',
    category: 'transaction',
    _ranking: 0.7 },
  { string: 'test',
    matchedString: 'test',
    category: 'transaction',
    _ranking: 0.7 },
  { string: 'NavTargetResolution',
    matchedString: 'NavTargetResolution',
    category: 'unit test',
    _ranking: 1 } ],
    record:
    { 'unit test': 'NavTargetResolution',
      url: 'com.sap.NTAUV2110',
      systemId: 'UV2',
      client: '110' },
    category: 'url',
    result: 'com.sap.NTAUV2110',
    _ranking: 777 },
   'result 0');
  var dmp = WhatIs.dumpWeightsTop(res.answers, { top: 3 });
  var indis = WhatIs.isIndiscriminateResult(res.answers);
  test.equal(indis, 'Many comparable results, perhaps you want to specify a discriminating client', 'correct string for indiscriminate ');
  test.equal(dmp.indexOf('category'), 32, 'correct dump');
  * /
  test.done();
};
*/

var aResults = [{ _ranking: 1 }, { _ranking: 1 }, { _ranking: 0.7 }];
exports.testFilterOnlyTopRanked = function (test) {
  var res = WhatIs.filterOnlyTopRanked(aResults);
  test.equal(res.length, 2);
  test.done();
};

var aResultsMisOrdered = [{ _ranking: 1 }, { _ranking: 1 }, { _ranking: 1.2 }];
exports.testFilterOnlyTopRankedThrows = function (test) {
  test.expect(1);
  try {
    WhatIs.filterOnlyTopRanked(aResultsMisOrdered);
    test.equal(1, 0);
  } catch (e) {
    /*empty*/
    test.equal(1, 1);
  }
  test.done();
};




