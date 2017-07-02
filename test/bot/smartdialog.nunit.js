var process = require('process');
var root = '../../js';
//var debuglog = require('debug')('plainRecoginizer.nunit');

var debug = require('debug');
const debuglog = debug('smartdialog.nunit');

process.on('unhandledRejection', function onError(err) {
  console.log(err);
  console.log(err.stack);
  throw err;
});


var logger = require(root + '/utils/logger');
var HTMLConnector = require(root + '/ui/htmlconnector.js');
const SmartDialog = require(root + '/bot/smartdialog.js');


/*
var mongooseMock = require('mongoose_record_replay').instrumentMongoose(require('mongoose'),
  'node_modules/mgnlq_testmodel_replay/mgrecrep/',
  'REPLAY');
*/

var Model = require('mgnlq_model').Model;

var getTestModel = require('mgnlq_testmodel_replay').getTestModel;

// Create bot and bind to console
function getBotInstance() {
  var connector = new HTMLConnector.HTMLConnector();
  /** the model is lazily obatained, if it is not obtained, there is no model */
  var res = getTestModel();
  res.then((theModel) => connector.theModel = theModel);

  function getM() {
    //res.then((theModel) => connector.theModel = theModel);
    return res;
  }
  SmartDialog.makeBot(connector, getM);
  return res.then( ()=> connector);
}

function releaseConnector(connector) {
  if(!connector) {
    throw Error('empty connector???? ');
  }
  debuglog('releasing ');
  if (connector.theModel) {
    debuglog('releasing with model');
    Model.releaseModel(connector.theModel);
  }
}

//var conn = getBotInstance();

function testOne(str, cb, iconn) {
  var conn = (iconn && Promise.resolve(iconn))  || getBotInstance();
  return conn.then( (conn) => {
    conn.setAnswerHook(cb.bind(undefined, conn));
    conn.processMessage(str, 'unittest');
    return conn;
  });
//  return conn;
}

//SimpleUpDownRecognizer

function doRecognize(sText, cb) {
  debuglog('type ' + typeof SmartDialog.SimpleUpDownRecognizer);
  var recognizer = new (SmartDialog.SimpleUpDownRecognizer)();
  recognizer.recognize({
    message: {
      text: sText
    }
  }, cb);
}

exports.testUpDownRecognizerQuit2 = function (test) {
  doRecognize('quit', function (err, res) {
    test.deepEqual(res.intent, 'intent.up');
    test.done();
  });
};

exports.testUpDownRecognizerUp = function (test) {
  doRecognize('up', function (err, res) {
    test.deepEqual(res.intent, 'intent.up');
    test.done();
  });
};

exports.testUpDownRecognizerNothing = function (test) {
  doRecognize('this aint nothing', function (err, res) {
    test.deepEqual(res.intent, 'None');
    test.done();
  });
};

exports.testUpDownRecognizerDown = function (test) {
  doRecognize('down', function (err, res) {
    test.deepEqual(res.intent, 'intent.down');
    test.done();
  });
};

exports.testUpDownRecognizerDone = function (test) {
  doRecognize('done', function (err, res) {
    test.deepEqual(res.intent, 'intent.up');
    test.done();
  });
};

exports.testUpDownRecognizerExit = function (test) {
  doRecognize('exit', function (err, res) {
    test.deepEqual(res.intent, 'intent.up');
    test.done();
  });
};

exports.testUpDownRecognizer2 = function (test) {
  doRecognize('donenothing', function (err, res) {
    test.deepEqual(res.intent, 'intent.up');
    test.done();
  });
};


// bot tests

exports.testdescribeDontKnowQuotes = function (test) {
  testOne('describe "ABASDFSR"', function (conn, res) {
    test.deepEqual(res, 'I don\'t know anything about "ABASDFSR".\n');
    test.done();
    releaseConnector(conn);
  });
};

//I don't know anything about ""DDF/DDEL_MON"".

exports.testUpDownWhatIsBSPNameManageLables = function (test) {
  testOne('what is the bspname for manage labels', function (conn, res) {
    test.deepEqual(res, 'The bspname of manage labels is "n/a"\n', ' correct stream');
    test.done();
    releaseConnector(conn);
  });
};


exports.testUpDownWhatIsBSPNameManageLablesQuote = function (test) {
  testOne('what is the bspname for "manage labels"', function (conn, res) {
    test.deepEqual(res, 'The bspname of "manage labels" is "n/a"\n', 'correct string');
    test.done();
    releaseConnector(conn);
  });
};


exports.testUpDownWhatIsBSPNameFioriIntentManageLabels = function (test) {
  testOne('what is the bspname, fiori intent, appname for manage labels', function (conn, res) {
    test.deepEqual(res,
     'The bspname, fiori intent, appname of manage labels are ...\n"n/a", "#ProductLabel-manage" and "Manage Labels"',

      //    'Many comparable results, perhaps you want to specify a discriminating uri,appId,ApplicationComponent,RoleName,ApplicationType,BSPApplicationURL,releaseName,releaseId,BusinessCatalog,TechnicalCatalog,detailsurl,BSPPackage,AppDocumentationLinkKW,BusinessRoleName,BusinessGroupName,BusinessGroupDescription,PrimaryODataServiceName,SemanticObject,FrontendSoftwareComponent,TransactionCodes,PrimaryODataPFCGRole,ExternalReleaseName,ArtifactId,ProjectPortalLink,AppKey,UITechnology or use "list all ..."' );
      'correct result');
    test.done();
    releaseConnector(conn);
  });
};

exports.testUpDownWhatIsBSPNameFioriIntentManageLablesQuote = function (test) {
  testOne('what is the bspname, fiori intent, appname for "manage labels"', function (conn, res) {
    test.deepEqual(res,
      // 'the bspname, fiori intent, appname for manage labels are ...\n"n/a", "#ProductLabel-manage" and "Manage Labels"'
    'The bspname, fiori intent, appname of "manage labels" are ...\n"n/a", "#ProductLabel-manage" and "Manage Labels"' ,
   'correct result'
//      'The "BSPName", "fiori intent" and "AppName" of "manage labels" are "n/a", "#ProductLabel-manage" and "Manage Labels"\n'
    );
    test.done();
    releaseConnector(conn);
  });
};

exports.testListAllSemObjFI = function (test) {
  testOne('list all SemanticObject  for FI-FIO-GL with ApplicationType "FPM/WEbDynpro" Maintain', function (conn, res) {
    test.deepEqual(res,
'I did not find any SemanticObject  for FI-FIO-GL with ApplicationType "FPM/WEbDynpro" Maintain.\n'

//OK

   //   'the SemanticObject for FI-FIO-GL with ApplicationType "FPM/WEbDynpro" Maintain are ...\nGLAccount'

      // 'the bspname, fiori intent, appname for manage labels are ...\n"n/a", "#ProductLabel-manage" and "Manage Labels"'
      // 'the SemanticObject for FI-FIO-GL with ApplicationType "FPM/WEbDynpro" Maintain are ...\nGLAccount;\nProfitCenter'
    );
    test.done();
    releaseConnector(conn);
  });
};


exports.testListAllSemObjFImanage = function (test) {
  testOne('list all SemanticObject  for FI-FIO-GL with ApplicationType "FPM/WEbDynpro" manage', function (conn, res) {
    test.deepEqual(res,
//'I did not find any SemanticObject  for FI-FIO-GL with ApplicationType "FPM/WEbDynpro" manage.\n'
'the SemanticObject  for FI-FIO-GL with ApplicationType "FPM/WEbDynpro" manage are ...\n"GLAccount"'
     //'the SemanticObject for FI-FIO-GL with ApplicationType "FPM/WEbDynpro" Maintain are ...\nGLAccount'

      // 'the bspname, fiori intent, appname for manage labels are ...\n"n/a", "#ProductLabel-manage" and "Manage Labels"'
      // 'the SemanticObject for FI-FIO-GL with ApplicationType "FPM/WEbDynpro" Maintain are ...\nGLAccount;\nProfitCenter'
    );
    test.done();
    releaseConnector(conn);
  });
};

exports.testUpDWhatisTransactionCodeALR = function (test) {
  testOne('What is the TransactionCodes for S_ALR_87012394 "PrepareTax Report"', function (conn, res) {
    test.deepEqual(res,
     'The TransactionCodes of S_ALR_87012394 "PrepareTax Report" is "S_ALR_87012394"\n'
      // 'the bspname, fiori intent, appname for manage labels are ...\n"FRA_ALERT_MAN", "#ComplianceAlerts-manage" and "Manage Alerts";\n"n/a", "#ProductLabel-manage" and "Manage Labels"'
    );
    test.done();
    releaseConnector(conn);
  });
};



exports.testUpDownListAllBSPName = function (test) {
  testOne('list all bspname, fiori intent, appname for manage labels', function (conn, res) {
    test.deepEqual(res,
//      'the bspname, fiori intent, appname for manage labels are ...\n"n/a", "#ProductLabel-manage" and "Manage Labels"'
//TODO!!!!????
    'the bspname, fiori intent, appname for manage labels are ...\n"n/a", "#ProductLabel-manage" and "Manage Labels";\n"FRA_ALERT_MAN", "#ComplianceAlerts-manage" and "Manage Alerts"'
      // 'the bspname, fiori intent, appname for manage labels are ...\n"FRA_ALERT_MAN", "#ComplianceAlerts-manage" and "Manage Alerts";\n"n/a", "#ProductLabel-manage" and "Manage Labels"'
    );
    test.done();
    releaseConnector(conn);
  });
};


exports.testUpDownListAllBSPNameManageLAables = function (test) {
  testOne('list all bspname, fiori intent, appname for "manage labels"', function (conn, res) {
    test.deepEqual(res,
      'the bspname, fiori intent, appname for "manage labels" are ...\n"n/a", "#ProductLabel-manage" and "Manage Labels"');
    test.done();
    releaseConnector(conn);
  });
};


exports.testListAllMultipleCategories = function (test) {
  testOne('List all atomic weight, element name, element symbol for element name silver', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes, 'the atomic weight, element name, element symbol for element name silver are ...\n"107.8682(2)", "silver" and "Ag"');
    test.done();
    releaseConnector(conn);
  });
};


/* TODO!

exports.testShowMe1 = function (test) {
  var cnt = 0;
  testOne('start SU01 in', function(conn, res) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    cnt = cnt + 1;
    test.deepEqual((cnt === 1) && (sRes.indexOf('Not enough') < 0), false);
    test.deepEqual((cnt === 2) && (sRes.indexOf('Please provide') < 0), false, 'first call');
    if(cnt === 2) {
      testOne('UV2', function(conn, res) {
        debuglog(JSON.stringify(oRes));
        testOne('120', function(conn, res) {
          debuglog(JSON.stringify(oRes));
          test.done(); releaseConnector(conn); });
      });
    }
  });
};
*/


exports.testListAllMultipleCategories = function (test) {
  testOne('List all atomic weight, element name, element symbol for element name silver', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes, 'the atomic weight, element name, element symbol for element name silver are ...\n"107.8682(2)", "silver" and "Ag"');
    test.done(); releaseConnector(conn);

  });
};


exports.testListAllDomainsOBJ = function (test) {
  testOne('List all Tables in domain SOBJ Tables', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes,
    'the Tables in domain SOBJ Tables are ...\n"/UIF/LREPDATTR";\n"/UIF/LREPDATTRCD";\n"/UIF/LREPDCONT";\n"/UIF/LREPDCONTCD";\n"/UIF/LREPDEREF";\n"/UIF/LREPDEREFCD";\n"/UIF/LREPDLTXT";\n"/UIF/LREPDLTXTCD";\n"/UIF/LREPDREF";\n"/UIF/LREPDREFCD";\n"/UIF/LREPDSTXT";\n"/UIF/LREPDSTXTCD";\n"/UIF/LREPDTEXT";\n"/UIF/LREPDTEXTCD";\n"LTDHTRAW";\n"LTDHTTMPL";\n"LTR_REPOSITORY";\n"SWOTDI";\n"SWOTDQ";\n"TZS02"'
    ,'correct tables'
    );
    test.done();
    releaseConnector(conn);
  });
};


//"list all Transport Tables in domain "SOBJ TAbles"

exports.testListAllTablesInDomainsOBJIUPAC = function (test) {
  testOne('List all Tables in domain IUPAC', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes,
     'I don\'t know anything about "Tables in domain IUPAC" ("").\nError: EarlyExitException: expecting at least one iteration which starts with one of these possible Token sequences::\n  <[Comma] ,[and] ,[ACategory]> but found: \'FACT\'\nError: EarlyExitException: expecting at least one iteration which starts with one of these possible Token sequences::\n  <[Comma] ,[and] ,[ACategory]> but found: \'FACT\'\nError: EarlyExitException: expecting at least one iteration which starts with one of these possible Token sequences::\n  <[Comma] ,[and] ,[ACategory]> but found: \'FACT\''
     // TODO NICER ERROR?
     , 'correct tables');
    test.done(); releaseConnector(conn);
  });
};


exports.testListAllInDomainsQuoted = function (test) {
  testOne('List all Tables in domain "SOBJ Tables"', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes,
    'the Tables in domain "SOBJ Tables" are ...\n"/UIF/LREPDATTR";\n"/UIF/LREPDATTRCD";\n"/UIF/LREPDCONT";\n"/UIF/LREPDCONTCD";\n"/UIF/LREPDEREF";\n"/UIF/LREPDEREFCD";\n"/UIF/LREPDLTXT";\n"/UIF/LREPDLTXTCD";\n"/UIF/LREPDREF";\n"/UIF/LREPDREFCD";\n"/UIF/LREPDSTXT";\n"/UIF/LREPDSTXTCD";\n"/UIF/LREPDTEXT";\n"/UIF/LREPDTEXTCD";\n"LTDHTRAW";\n"LTDHTTMPL";\n"LTR_REPOSITORY";\n"SWOTDI";\n"SWOTDQ";\n"TZS02"'
    );
//      'the Tables for domain "SOBJ Tables" are ...\n/UIF/LREPDATTR;\n/UIF/LREPDATTRCD;\n/UIF/LREPDCONT;\n/UIF/LREPDCONTCD;\n/UIF/LREPDEREF;\n/UIF/LREPDEREFCD;\n/UIF/LREPDLTXT;\n/UIF/LREPDLTXTCD;\n/UIF/LREPDREF;\n/UIF/LREPDREFCD;\n/UIF/LREPDSTXT;\n/UIF/LREPDSTXTCD;\n/UIF/LREPDTEXT;\n/UIF/LREPDTEXTCD;\nLTDHTRAW;\nLTDHTTMPL;\nLTR_REPOSITORY;\nSWOTDI;\nSWOTDQ;\nTZS02', 'correct tables');
    test.done(); releaseConnector(conn);
  });
};

exports.testListAllInImplicitDomainQuoted = function (test) {
  testOne('List all Tables in "SOBJ Tables"', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes,
     'the Tables in "SOBJ Tables" are ...\n"/UIF/LREPDATTR";\n"/UIF/LREPDATTRCD";\n"/UIF/LREPDCONT";\n"/UIF/LREPDCONTCD";\n"/UIF/LREPDEREF";\n"/UIF/LREPDEREFCD";\n"/UIF/LREPDLTXT";\n"/UIF/LREPDLTXTCD";\n"/UIF/LREPDREF";\n"/UIF/LREPDREFCD";\n"/UIF/LREPDSTXT";\n"/UIF/LREPDSTXTCD";\n"/UIF/LREPDTEXT";\n"/UIF/LREPDTEXTCD";\n"LTDHTRAW";\n"LTDHTTMPL";\n"LTR_REPOSITORY";\n"SWOTDI";\n"SWOTDQ";\n"TZS02"'
      , 'correct tables');
    test.done(); releaseConnector(conn);
  });
};


/*
exports.testListAllCAtegoryInNonDomain = function (test) {
  testOne('List all categories in TWF', function(conn, res) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes,
    'the Tables for "SOBJ Tables" are ...\n/UIF/LREPDATTR;\n/UIF/LREPDATTRCD;\n/UIF/LREPDCONT;\n/UIF/LREPDCONTCD;\n/UIF/LREPDEREF;\n/UIF/LREPDEREFCD;\n/UIF/LREPDLTXT;\n/UIF/LREPDLTXTCD;\n/UIF/LREPDREF;\n/UIF/LREPDREFCD;\n/UIF/LREPDSTXT;\n/UIF/LREPDSTXTCD;\n/UIF/LREPDTEXT;\n/UIF/LREPDTEXTCD;\nLTDHTRAW;\nLTDHTTMPL;\nLTR_REPOSITORY;\nSWOTDI;\nSWOTDQ;\nTZS02'
    , 'correct tables');
    test.done(); releaseConnector(conn); });
};
*/

exports.testListAllCAtegoryInDomainNonDomain = function (test) {
  testOne('List all categories in domain ELOM', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes,
      /*   'the Tables for domain SOBJ Tables are ...\n/UIF/LREPDATTR;\n/UIF/LREPDATTRCD;\n/UIF/LREPDCONT;\n/UIF/LREPDCONTCD;\n/UIF/LREPDEREF;\n/UIF/LREPDEREFCD;\n/UIF/LREPDLTXT;\n/UIF/LREPDLTXTCD;\n/UIF/LREPDREF;\n/UIF/LREPDREFCD;\n/UIF/LREPDSTXT;\n/UIF/LREPDSTXTCD;\n/UIF/LREPDTEXT;\n/UIF/LREPDTEXTCD;\nLTDHTRAW;\nLTDHTTMPL;\nLTR_REPOSITORY;\nTZS02'  */
      /*  'I did not infer a domain restriction from "domain ELOM", all my categories are ...\nAppDocumentationLinkKW;\nAppKey;\nAppName;\nApplicationComponent;\nApplicationType;\nArtifactId;\nBSPApplicationURL;\nBSPName;\nBSPPackage;\nBusinessCatalog;\nBusinessGroupDescription;\nBusinessGroupName;\nBusinessRoleName;\nCategory;\nExternalReleaseName;\nFrontendSoftwareComponent;\nLPDCustInstance;\nObject name length;\nPrimaryODataPFCGRole;\nPrimaryODataServiceName;\nPrimaryTable;\nRoleName;\nSemanticAction;\nSemanticObject;\nShortText;\nTable;\nTableTransportKeySpec;\nTechnicalCatalog;\nTransactionCodes;\nTranslationRelevant;\nTransportObject;\nType;\nURLParameters;\n_url;\nalbedo;\nappId;\natomic weight;\nclient;\nclientSpecific;\ndetailsurl;\ndevclass;\ndistance;\neccentricity;\nelement name;\nelement number;\nelement properties;\nelement symbol;\nfiori catalog;\nfiori group;\nfiori intent;\nisPublished;\nmass;\nobject name;\nobject type;\norbit radius;\norbital period;\norbits;\nradius;\nrecordKey;\nreleaseId;\nreleaseName;\nsystemId;\ntcode;\ntool;\ntransaction;\ntransaction description;\nunit test;\nuri;\nurl;\nvisual luminosity;\nvisual magnitude;\nwiki'
        */
     'I don\'t know anything about "categories in domain ELOM" ("").\nI do not understand "ELOM".'
        , 'correct tables');
    test.done(); releaseConnector(conn);
  });
};




exports.testMakeTable = function (test) {
  testOne('make table for element name, element symbol and atomic weight', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes,
      'I had to drop "atomic weight". But here you go ...\nCreating and starting table with "element name" and "element symbol"', 'wiki present');
    test.done(); releaseConnector(conn);
  });
};


exports.testListAllSingleSimple = function (test) {
  testOne('List all element names with element number 10', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes,
    'the element names with element number 10 are ...\n"neon";\n"10"',
    // TODO
    'result should be the element names for element number 10 are ...\n"neon"');
    test.done(); releaseConnector(conn);
  });
};




exports.testWhatIsNonParseable = function (test) {
  testOne('What is the atomic weight, element name for element name silver sowasgibts nicht', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes,
    'I don\'t know anything about "atomic weight, element name" ("atomic weight" and "element name") in relation to "element name silver sowasgibts nicht".\nI do not understand "sowasgibts".\nI do not understand "nicht".'
//    'I don\'t know anything about "atomic weight for element name silver sowasgibts nicht" ("").\nI do not understand "sowasgibts".\nI do not understand "nicht".'
    // deepEqual 'I don\'t know anything about "atomic weight for element name silver sowasgibts nicht(Error: "atomic weight for element name silver sowasgibts nicht" is not a category!)'
//   'I don\'t know anything about "atomic weight, element name" ("atomic weight" and "element name") in relation to "element name silver sowasgibts nicht".\nI do not understand "sowasgibts".\nI do not understand "nicht".' );
//    'I don\'t know anything about "atomic weight, element name" ("atomic weight" and "element name")" in relation to "element name silver sowasgibts nicht"\nI do not understand "sowasgibts".\nI do not understand "nicht".');
    );
    test.done();
    releaseConnector(conn);
  });
};

exports.testListAllNonParseableSingleCat = function (test) {
  testOne('List all atomic weight for element name silver sowasgibts nicht', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes,
// TODO:
 'I don\'t know anything about "atomic weight for element name silver sowasgibts nicht" ("").\nI do not understand "sowasgibts".\nI do not understand "nicht".'
// deepEqual 'I don\'t know anything about "atomic weight, sowasgibtsgarnicht, element symbol"(Error: "sowasgibtsgarnicht" is not a category!)'
//    'I don\'t know anything about "atomic weight for element name silver sowasgibts nicht(Error: "atomic weight for element name silver sowasgibts nicht" is not a category!)'
     // 'i did not find any atomic weight for element name silver sowasgibts nicht.\n\nI do not understand "sowasgibts".\nI do not understand "nicht".'
    );
    test.done();
    releaseConnector(conn);
  });
};

exports.testListAllMultipleCategoriesJunk = function (test) {
  testOne('List all atomic weight, sowasgibtsgarnicht, element symbol for element name silver', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes,
    'I don\'t know anything about "atomic weight, sowasgibtsgarnicht, element symbol for element name silver" ("").\nI do not understand "sowasgibtsgarnicht".'
    // 'I don\'t know anything about "atomic weight, sowasgibtsgarnicht, element symbol"(Error: "sowasgibtsgarnicht" is not a category!)
    );
    test.done();
    releaseConnector(conn);
  });
};

exports.testListAllMultipleCategories2 = function (test) {
  testOne('What is the atomic weight and element symbol for gold', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes,
    //  'I don\'t know anything about "atomic weight and element symbol" ("atomic weight" and "element symbol") in relation to "gold".\nError: parsing error in  input[{"name":"NotAllInputParsedException","message":"Redundant input, expecting EOF but found: and"' deepEqual 'The "atomic weight" and "element symbol" of gold are "196.966 569(5)" and "Au"\n'
'The atomic weight and element symbol of gold are ...\n"196.966 569(5)" and "Au"'
     //'The "atomic weight" and "element symbol" of gold are "196.966 569(5)" and "Au"\n'
     );
    test.deepEqual(sRes.indexOf('966') >= 0, true, 'wiki present');
    test.done();
    releaseConnector(conn);
  });
};

exports.testListAllMultipleCategoriesBadMix = function (test) {
  testOne('What is the unit test and element symbol for gold', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes,
    'I don\'t know anything about "unit test and element symbol" ("") in relation to "gold".\nI do not understand "unit".\nI do not understand "test".'
     );
     // TODO other crossdomain unit test
     // deepEqual 'I don\'t know anything about "unit test and element symbol" ("unit test" and "element symbol")" in relation to "gold"'

    //'I don\'t know anything about "unit test and element symbol" ("unit test" and "element symbol")" in relation to "gold"');
    test.done();
    releaseConnector(conn);
  });
};

exports.testListAllMultipleOK2 = function (test) {
  testOne('list all element name, atomic weight for mercury', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes,
    // TODO Horrible wrong!
    'the element name, atomic weight for mercury are ...\n"mercury" and "200.592(3)";\n"80" and "200.592(3)"'

    //'the element name, atomic weight for mercury are ...\n"mercury" and "200.592(3)"'
    );

    test.done();
    releaseConnector(conn);
  });
};

exports.testTooLongWordCount = function (test) {
  test.expect(1);
  testOne('a b c d e f g h i j "k l m n o p" r s t ad so on is very short a', function (conn, oRes) {
    //console.log('here answeres', SmartDialog.aResponsesOnTooLong.join('\n'));
    test.deepEqual(SmartDialog.aResponsesOnTooLong.indexOf(oRes) >= 0, true);
    test.done();
    releaseConnector(conn);
  });
};

exports.testTooLongSentence = function (test) {
  test.expect(1);
  testOne('ahasdfasdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd'
    + ' kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk '
    + ' kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk '
    + ' kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk '
    + ' jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj jjjjjjjjjjjjjjjjjjjj'
    + ' llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll',
    function (conn, oRes) {
      test.deepEqual(SmartDialog.aResponsesOnTooLong.indexOf(oRes) >= 0, true);
      test.done();
      releaseConnector(conn);
    });
};

exports.testListAllMultipleBadCombine = function (test) {
  test.expect(1);
  testOne('list all element name, wiki for mercury', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes,
     'I don\'t know anything about "element name, wiki for mercury" ("").\nI do not understand "wiki".'
    // TODO corresponding testcase and error for cross-domain nofit
     //'I cannot combine "element name, wiki(Error: categories "element name" and "wiki" have no common domain.)'

     );
    test.done();
    releaseConnector(conn);
  });
};



exports.testShowMe2 = function (test) {
  testOne('What is the element weight for element name silver', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes.indexOf('107.') >= 0, true, 'wiki present');
    test.done(); releaseConnector(conn);
  });
};


exports.testDomainsListAllIn = function (test) {
  testOne('list all categories in domain IUPAC', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes.indexOf('wiki') >= 0, false, 'wiki present');
    test.deepEqual(sRes.indexOf('element name') >= 0, true, 'element name present');
    test.done(); releaseConnector(conn);
  });
};


exports.testDomains = function (test) {
  testOne('list all domains', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes.indexOf('IUPAC') >= 0, true, ' IUPAC present');
    test.deepEqual(sRes.indexOf('FioriBOM') >= 0, true, 'fiori bom present');
    test.done();
    releaseConnector(conn);
  });
};


exports.testSuggest = function (test) {
  testOne('help me', function (conn, oRes) {
    //var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.done();
    releaseConnector(conn);
  });
};


exports.testListWithContextDontKnow = function (test) {
  test.expect(1);
  testOne('list abcnames for silver', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes.indexOf('know anything about \"abcnames') >= 0, true, 'not found');
    test.done();
    releaseConnector(conn);
  });
};

exports.testListWithContextKnow = function (test) {
  test.expect(1);
  testOne('list all element name for silver', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes.indexOf('silver') >= 0, true, 'silver present');
    test.done();
    releaseConnector(conn);
  });
};


exports.testEliza = function (test) {
  testOne('i am sad', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes.indexOf('sad') >= 0, true, 'sad present');
    test.done();
    releaseConnector(conn);
  });
};

exports.testTrain = function (test) {
  testOne('i am sad', function (conn, oRes) {
    testOne('Wrong', function (conn, oRes) {
      testOne('down', function (conn, oRes) {
        testOne('What is this', function (conn, oRes) {
          testOne('done', function (conn, oRes) {
            testOne('done', function (conn, oRes) {
              testOne('list all domains', function (conn, oRes) {
                var sRes = oRes;
                debuglog(JSON.stringify(oRes));
                test.deepEqual(sRes.indexOf('FioriBOM') >= 0, true, 'fiori bom present');
                test.deepEqual(sRes.indexOf('Cosmos') >= 0, true, 'Cosmospresent');
                test.done();
                releaseConnector(conn);
              },conn);
            }, conn);
          }, conn);
        }, conn);
      }, conn);
    }, conn);
  });
};


exports.testListAllNotACat = function (test) {
  testOne('list all NOTACATEGORY', function (conn, oRes) {
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes,
    'I don\'t know anything about "NOTACATEGORY" ("").\nI do not understand "NOTACATEGORY".'
    );
     //
     // 'I don\'t know anything about "NOTACATEGORY"(Error: "NOTACATEGORY" is not a category!)');
    test.done(); releaseConnector(conn);
  });
};

//TODO; this should accept undefined and list more!
exports.testListAllMultOnlyCat = function (test) {
  testOne('list all orbits, object type', function (conn, oRes) {
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes,
    // TODO CHECK
     'the orbits, object type are ...\n"null" and "null";\n"null" and "star";\n"Alpha Centauri C" and "planet";\n"Sun" and "planet";\n"n/a" and "star, red dwarf"'
//    'the orbits, object type are ...\n"null";\n"Alpha Centauri C" and "planet";\n"Sun" and "planet";\n"n/a" and "star, red dwarf"'
  //  'the orbits, object type are ...\n"Alpha Centauri C" and "planet";\n"Sun" and "planet";\n"n/a" and "star, red dwarf";\n"null"'
   //   'the orbits, object type are ...\n"Alpha Centauri C" and "planet";\n"n/a" and "star";\n"n/a" and "star, red dwarf";\n"Sun" and "planet"'
      //    'the orbits, object type are ...\n"Alpha Centauri C" and "planet";\n"n/a" and "star, red dwarf";\n"Sun" and "planet"'
    );
    test.done(); releaseConnector(conn);
  });
};


exports.testListWeirdNoCatError = function (test) {
  testOne('list all silver', function (conn, oRes) {
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes,
    'I don\'t know anything about "silver" ("").\nError: EarlyExitException: expecting at least one iteration which starts with one of these possible Token sequences::\n  <[Comma] ,[and] ,[ACategory]> but found: \'FACT\''
    ,'correct'
   // TODO PRIO2 Better error
    );
   //   'I don\'t know anything about "silver"(Error: "silver" is not a category!)');
    test.done(); releaseConnector(conn);
  });
};

exports.testListWeirdUnknownError = function (test) {
  testOne('list all NOTANYWHERE', function (conn, oRes) {
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes,
       'I don\'t know anything about "NOTANYWHERE" ("").\nI do not understand "NOTANYWHERE".'
       );
    test.done();
    releaseConnector(conn);
  });
};


exports.testListAllCategories = function (test) {
  testOne('list all categories', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes.indexOf('orbits') >= 0, true, 'orbits present');
    test.deepEqual(sRes.indexOf('FioriBOM') < 0, true, 'Fioir bom not present');
    test.done();
    releaseConnector(conn);
  });
};

exports.testListAllCategoriesInDomain = function (test) {
  testOne('list all categories in domain FioriBOM', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes.indexOf('orbits') < 0, true, 'orbits present');
    test.deepEqual(sRes.indexOf('SemanticObject') >= 0, true, 'Semantic Object present');
    test.deepEqual(sRes.indexOf('SemanticAction') >= 0, true, 'Semantic Action present');
    test.done();
    releaseConnector(conn);
  });
};

exports.testListAllCategoriesInDirectDomainname = function (test) {
  testOne('list all categories in FioriBOM', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes.indexOf('orbits') < 0, true, 'orbits present');
    test.deepEqual(sRes.indexOf('SemanticObject') >= 0, true, 'Semantic Object present');
    test.deepEqual(sRes.indexOf('SemanticAction') >= 0, true, 'Semantic Action present');
    test.done();
    releaseConnector(conn);
  });
};

exports.testListAllCategoriesInDirectSynonym = function (test) {
  testOne('list all categories in Fiori BOM', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes.indexOf('orbits') < 0, true, 'orbits present');
    test.deepEqual(sRes.indexOf('SemanticObject') >= 0, true, 'Semantic Object present');
    test.deepEqual(sRes.indexOf('SemanticAction') >= 0, true, 'Semantic Action present');
    test.done();
    releaseConnector(conn);
  });
};

exports.testListAllCategoriesInDomainSynonym = function (test) {
  testOne('list all categories in domain Fiori BOM', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes.indexOf('orbits') < 0, true, 'orbits present');
    test.deepEqual(sRes.indexOf('SemanticObject') >= 0, true, 'Semantic Object present');
    test.deepEqual(sRes.indexOf('SemanticAction') >= 0, true, 'Semantic Action present');
    test.done();
    releaseConnector(conn);
  });
};

exports.testListAllCategoriesRelatedTo = function (test) {
  testOne('list all categories related to unit test', function (conn, oRes) {
    var sRes = oRes;
    debuglog(JSON.stringify(oRes));
    test.deepEqual(sRes.indexOf('wiki') < 0, true, 'wiki present');
    test.deepEqual(sRes.indexOf('unit test') >= 0, true, 'wiki present');
    test.done(); releaseConnector(conn);
  });
};

exports.testDescribeStupidDomain = function (test) {
  testOne('describe ABC in domain NODomain', function (conn, oRes) {
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes,
  //   'I did not infer a domain restriction from "wiki". Specify an existing domain. (List all domains) to get exact names.\n',
  //   'correct error msg');

   'I did not infer a domain restriction from "NODomain". Specify an existing domain. (List all domains) to get exact names.\n');
    test.done();
    releaseConnector(conn);
  });
};


exports.testDescribeCategory = function (test) {
  testOne('describe category', function (conn, oRes) {
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes,
      '"category" is ' + SmartDialog.metawordsDescriptions['category']);
    test.done();
    releaseConnector(conn);
  });
};

exports.testDescribeCategorySenselessDomain = function (test) {
  testOne('describe category in domain wiki', function (conn, oRes) {
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes,
//      '"in domain "wiki" make no sense when matching a metaword.\n' +
'I did not infer a domain restriction from "wiki". Specify an existing domain. (List all domains) to get exact names.\n'
//      '"category" is ' + SmartDialog.metawordsDescriptions['category']
);
    test.done(); releaseConnector(conn);
  });
};

exports.testDescribeOneAtATime = function (test) {
  testOne('describe silver and gold', function (conn, oRes) {
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes, 'Whoa, i can only explain one thing at a time, not "silver and gold". Please ask one at a time.');
    test.done(); releaseConnector(conn);
  });
};

exports.testDescribeADomain = function (test) {
  testOne('describe cosmos', function (conn, oRes) {
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes,
    '"cosmos"is a domain with 13 categories and 7 records\nDescription:a model with a small subset of cosmological entities. Main purpose is to test \na)properties which occur multiple times (e.g. "Sun" in "object name" as key and in "orbits"; \nb) "earth" as a property which is also present in a different model\n"cosmos" has a meaning in one domain "metamodel":\n"cosmos" is a value for category "domain" present in 13(14.3%) of records;\n'
//  '"cosmos"is a domain with 13 categories and 7 records\nDescription:a model with a small subset of cosmological entities. Main purpose is to test \na)properties which occur multiple times (e.g. "Sun" in "object name" as key and in "orbits"; \nb) "earth" as a property which is also present in a different model\n"cosmos" has a meaning in one domain "metamodel":\n"cosmos" is a value for category "domain" present in 13(14.8%) of records;\n'
   );//  '"cosmos"is a domain with 13 categories and 7 records\nDescription:a model with a small subset of cosmological entities. Main purpose is to test \na)properties which occur multiple times (e.g. "Sun" in "object name" as key and in "orbits"; \nb) "earth" as a property which is also present in a differnt model\n');
    test.done(); releaseConnector(conn);
  });
};


exports.testDescribeEcc = function (test) {
  testOne('describe eccentricity', function (conn, oRes) {
    debuglog(JSON.stringify(oRes));
    const DESCRIBE_ECCEN = '"eccentricity"  is a category in domain "Cosmos"\nIt is present in 2 (28.6%) of records in this domain,\nhaving 2(+1) distinct values.\nPossible values are ...\n"0.0167" or "0.0934"';

    //const DESCRIBE_ECCEN =  '"eccentricity"  is a category in domain "Cosmos"\nIt is present in 2 (33.3%) of records in this domain,\n'
    //+ 'having 2(+1) distinct values.\nPossible values are ...\n"0.0167" or "0.0934"';
    test.deepEqual(oRes,
      DESCRIBE_ECCEN);
    test.done(); releaseConnector(conn);
  });
};

exports.testIsAnyonymous = function (test) {
  test.deepEqual(SmartDialog.isAnonymous('ano:abc'), true);
  test.deepEqual(SmartDialog.isAnonymous('somebody'), false);
  test.deepEqual(SmartDialog.isAnonymous('somano:xx'), false);
  test.done();
};



exports.testRestrictData = function (test) {

  test.deepEqual(SmartDialog.restrictData([1, 2, 3, 4]), [1, 2, 3, 4]);

  test.deepEqual(SmartDialog.restrictData([1, 2, 3, 4, 5, 6, 7, 8, 9]), [1, 2, 3, 4, 5, 6, 7]);

  test.deepEqual(SmartDialog.restrictData([1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => '' + i)),

    [1, 2, 3, 4, 5, 6, 7,].map(i => '' + i).concat('... and 2 more entries for registered users'));
  test.done();
};


exports.testDescribe = function (test) {
  testOne('describe silver', function (conn, oRes) {
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes,
      '"silver" has a meaning in one domain "IUPAC":\n"silver" is a value for category "element name" present in 1(0.8%) of records;\n'
    );
    test.done(); releaseConnector(conn);
  });
};



exports.testDescribeEarth = function (test) {
  testOne('describe earth', function (conn, oRes) {
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes,
      '"earth" has a meaning in 2 domains: "Cosmos" and "Philosophers elements"\nin domain "Cosmos" "earth" is a value for category "object name" present in 1(14.3%) of records;\nin domain "Philosophers elements" "earth" is a value for category "element name" present in 1(25.0%) of records;\n'
    );
    test.done(); releaseConnector(conn);
  });
};

exports.testListAllDomainContaining = function (test) {
  testOne('list all domains containing IU', function (conn, oRes) {
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes,
      'the domains containing IU are ...\n"IUPAC"'
    );
    test.done(); releaseConnector(conn);
  });
};


exports.testListAllDomainContainingNotPresent = function (test) {
  testOne('list all domains containing IUNIXDA', function (conn, oRes) {
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes,
    'I did not find any domains containing IUNIXDA.\n'
    );
    test.done(); releaseConnector(conn);
  });
};


exports.testBadOP = function (test) {
  testOne('list all element names overfroombolding ea', function (conn, oRes) {
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes,
    'I don\'t know anything about "element names overfroombolding ea" ("").\nI do not understand "overfroombolding".\nI do not understand "ea".',
    'correct error msg'
    // deepEqual 'ouch, this was in internal error. Recovering from a weird operator "overfroombolding"\n'
//    at Object.deepEqual (C:\Users\Gerd\AppData\Roaming\npm\node_modules\nodeunit\lib\types.js:83:39)

    //  'ouch, this was in internal error. Recovering from a weird operator "overfroombolding"\n'
    );
    test.done(); releaseConnector(conn);
  });
};



exports.testOperatorStartsWith = function (test) {
  logPerf('testPerfListAll');
  // var u = 'list all AppNames in FIN-GL Account Manage fiori intent MM-PUR Work Center WBS Elements Planning related to unit test';
  testOne('list all element names starting with ni', function (conn, oRes) {
    //  var sRes = oRes;
    logPerf('testPerfListAll');
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes,
    'the element names starting with ni are ...\n"nickel";\n"nihonium";\n"niobium";\n"nitrogen"'
    ,'ok' );
    //TODO sort results
//    'my element names starting with "ni" are ...\nnickel;\nnihonium;\nniobium;\nnitrogen');
    test.done(); releaseConnector(conn);
  });
};

exports.testOperatorStartsWithFI = function (test) {
  logPerf('testPerfListAll');
  // var u = 'list all AppNames in FIN-GL Account Manage fiori intent MM-PUR Work Center WBS Elements Planning related to unit test';
  testOne('list all KURUMBA LUBUMBA starting with FI', function (conn, oRes) {
    //  var sRes = oRes;
    logPerf('testPerfListAll');
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes,
    'I don\'t know anything about "KURUMBA LUBUMBA starting with FI" ("").\nI do not understand "KURUMBA".\nI do not understand "LUBUMBA".\nI do not understand "FI".'
    );
    test.done(); releaseConnector(conn);
  });
};


exports.testOperatorCatEndingUPAC = function (test) {
  logPerf('testPerfListAll');
  // var u = 'list all AppNames in FIN-GL Account Manage fiori intent MM-PUR Work Center WBS Elements Planning related to unit test';
  testOne('list all categories ending with UPA!', function (conn, oRes) {
    //  var sRes = oRes;
    logPerf('testPerfListAll');
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes, 'I did not find any categories ending with UPA.\n' );
    test.done(); releaseConnector(conn);
  });
};



exports.testTrainMe = function (test) {
  //logPerf('testPerfListAll');
  // var u = 'list all AppNames in FIN-GL Account Manage fiori intent MM-PUR Work Center WBS Elements Planning related to unit test';
  testOne('I think ABC is related to DEF', function (conn, oRes) {
    //  var sRes = oRes;
    //logPerf('testPerfListAll');
    test.deepEqual(SmartDialog.aTrainReplies.indexOf(oRes) >= 0, true);
    test.done(); releaseConnector(conn);
  });
};

//"list all ApplicationComponent, devclass, FioriBackendCatalogs with TransactionCode S_ALR_87012394."

exports.testListAllWithModelDataCollision = function (test) {
  //logPerf('testPerfListAll');
  // var u = 'list all AppNames in FIN-GL Account Manage fiori intent MM-PUR Work Center WBS Elements Planning related to unit test';
  testOne('list all ApplicationComponent, devclass, FioriBackendCatalogs with TransactionCode S_ALR_87012394.', function (conn, oRes) {
    //  var sRes = oRes;
    //logPerf('testPerfListAll');
    test.deepEqual(oRes,
    'the ApplicationComponent, devclass, FioriBackendCatalogs with TransactionCode S_ALR_87012394 are ...\n"FI-AR", "APPL_FIN_APP_DESCRIPTORS" and "SAP_TC_FIN_ACC_BE_APPS";\n"FI-LOC-FI", "ODATA_GLO_FIN_APP_DESCRIPTORS" and "SAP_TC_FIN_GLO_AC_BE_APPS"'
    , 'correct result');
    test.done(); releaseConnector(conn);
  });
};

exports.testListAllWithModelDataCollisionProperCat = function (test) {
  //logPerf('testPerfListAll');
  // var u = 'list all AppNames in FIN-GL Account Manage fiori intent MM-PUR Work Center WBS Elements Planning related to unit test';
  testOne('list all ApplicationComponent, devclass, BackendCatalogId for S_ALR_87012394.', function (conn, oRes) {
    //  var sRes = oRes;
    //logPerf('testPerfListAll');
    test.deepEqual(oRes,
    'the ApplicationComponent, devclass, BackendCatalogId for S_ALR_87012394 are ...\n"FI-AR", "APPL_FIN_APP_DESCRIPTORS" and "SAP_TC_FIN_ACC_BE_APPS";\n"FI-LOC-FI", "ODATA_GLO_FIN_APP_DESCRIPTORS" and "SAP_TC_FIN_GLO_AC_BE_APPS"'
    , 'correct result');
    test.done(); releaseConnector(conn);
  });
};

exports.testListAllWithModelDataCollisionProperCat2 = function (test) {
  //logPerf('testPerfListAll');
  // var u = 'list all AppNames in FIN-GL Account Manage fiori intent MM-PUR Work Center WBS Elements Planning related to unit test';
  testOne('list all ApplicationComponent, devclass, Fiori Backend Catalog with TransactionCode S_ALR_87012394.', function (conn, oRes) {
    //  var sRes = oRes;
    //logPerf('testPerfListAll');

    test.deepEqual(oRes,

    'the ApplicationComponent, devclass, Fiori Backend Catalog with TransactionCode S_ALR_87012394 are ...\n"FI-AR", "APPL_FIN_APP_DESCRIPTORS" and "SAP_TC_FIN_ACC_BE_APPS";\n"FI-LOC-FI", "ODATA_GLO_FIN_APP_DESCRIPTORS" and "SAP_TC_FIN_GLO_AC_BE_APPS"'
    ,'correct result');
    test.done(); releaseConnector(conn);
  });
};


//list all Application Component, fiori intent, Backendcatalog for GRM3...
exports.testListAllWithModelDataCollisionEXample2 = function (test) {
  //logPerf('testPerfListAll');
  // var u = 'list all AppNames in FIN-GL Account Manage fiori intent MM-PUR Work Center WBS Elements Planning related to unit test';
  testOne('list all Application Component, fiori intent, Backendcatalog for GRM3.', function (conn, oRes) {
    //  var sRes = oRes;
    //logPerf('testPerfListAll');
    test.deepEqual(oRes, 'the Application Component, fiori intent, Backendcatalog for GRM3 are ...\n"PS", "#WBSElement-assignToGroupingWBSElementCollectively" and "SAP_TC_PS_BE_APPS"', 'correct x');
    test.done(); releaseConnector(conn);
  });
};


exports.testTrainMeKlingon = function (test) {
  logPerf('testPerfListAll');
  // var u = 'list all AppNames in FIN-GL Account Manage fiori intent MM-PUR Work Center WBS Elements Planning related to unit test';
  testOne('I think Klingon is related to kronos', function (conn, oRes) {
    //  var sRes = oRes;
    logPerf('testPerfListAll');
    debuglog(JSON.stringify(oRes));
    test.deepEqual(SmartDialog.aTrainNoKlingon.indexOf(oRes) >= 0, true);
    test.done(); releaseConnector(conn);
  });
};




exports.testOperatorContainingUPAC = function (test) {
  logPerf('testPerfListAll');
  // var u = 'list all AppNames in FIN-GL Account Manage fiori intent MM-PUR Work Center WBS Elements Planning related to unit test';
  testOne('list all domains containing "UPA"', function (conn, oRes) {
    //  var sRes = oRes;
    logPerf('testPerfListAll');
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes, 'the domains containing "UPA" are ...\n"IUPAC"' );
    test.done(); releaseConnector(conn);
  });
};

exports.testOperatorContainingNit = function (test) {
  logPerf('testPerfListAll');
  // var u = 'list all AppNames in FIN-GL Account Manage fiori intent MM-PUR Work Center WBS Elements Planning related to unit test';
  testOne('list all categories containing "lem"', function (conn, oRes) {
    //  var sRes = oRes;
    logPerf('testPerfListAll');
    debuglog(JSON.stringify(oRes));
    // TODO what about element name ????
    test.deepEqual(oRes,
    'the categories containing "lem" are ...\n"element name";\n"element number";\n"element properties";\n"element symbol"'
    );
    test.done(); releaseConnector(conn);
  });
};


exports.testOperatorEndingWith = function (test) {
  logPerf('testPerfListAll');
  // var u = 'list all AppNames in FIN-GL Account Manage fiori intent MM-PUR Work Center WBS Elements Planning related to unit test';
  testOne('list all domains ending with "ABC"', function (conn, oRes) {
    //  var sRes = oRes;
    logPerf('testPerfListAll');
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes, 'I did not find any domains ending with "ABC".\n');
    test.done(); releaseConnector(conn);
  });
};


exports.testOperatorCategoriesStartsWith = function (test) {
  logPerf('testPerfListAll');
  // var u = 'list all AppNames in FIN-GL Account Manage fiori intent MM-PUR Work Center WBS Elements Planning related to unit test';
  testOne('list all categories starting with elem?', function (conn, oRes) {
    //  var sRes = oRes;
    logPerf('testPerfListAll');
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes,
     'the categories starting with elem are ...\n"element name";\n"element number";\n"element properties";\n"element symbol"'
    //'my categories starting with "elem" are ...\nelement name;\nelement number;\nelement properties;\nelement symbol'
    );
    test.done(); releaseConnector(conn);
  });
};

exports.testOperatorStartsWithQuoted = function (test) {
  logPerf('testPerfListAll');
  // var u = 'list all AppNames in FIN-GL Account Manage fiori intent MM-PUR Work Center WBS Elements Planning related to unit test';
  testOne('list all categories starting with "elem"', function (conn, oRes) {
    //  var sRes = oRes;
    logPerf('testPerfListAll');
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes,
    'the categories starting with "elem" are ...\n"element name";\n"element number";\n"element properties";\n"element symbol"'
    );
    test.done(); releaseConnector(conn);
  });
};

exports.testOperatorStartsWithQuotedInDomain = function (test) {
  logPerf('testPerfListAll');
  // var u = 'list all AppNames in FIN-GL Account Manage fiori intent MM-PUR Work Center WBS Elements Planning related to unit test';
  testOne('list all categories starting with "elem" in domain IUPAC', function (conn, oRes) {
    //  var sRes = oRes;
    logPerf('testPerfListAll');
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes,
    'the categories starting with "elem" in domain IUPAC are ...\n"element name";\n"element number";\n"element symbol"' );
    test.done(); releaseConnector(conn);
  });
};

exports.testOperatorStartsWithQuotedInDomainSloppy = function (test) {
  logPerf('testPerfListAll');
  // var u = 'list all AppNames in FIN-GL Account Manage fiori intent MM-PUR Work Center WBS Elements Planning related to unit test';
  testOne('list all categories starting with "elem" in domain IUPAD', function (conn, oRes) {
    //  var sRes = oRes;
    logPerf('testPerfListAll');
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes,
 'the categories starting with "elem" in domain IUPAD are ...\n"element name";\n"element number";\n"element symbol"'
    );
    test.done(); releaseConnector(conn);
  });
};


exports.testOperatorStartsWithQuotedInNoDomain = function (test) {
  logPerf('testPerfListAll');
  // var u = 'list all AppNames in FIN-GL Account Manage fiori intent MM-PUR Work Center WBS Elements Planning related to unit test';
  testOne('list all categories starting with "elem" in domain NONEXSITENT', function (conn, oRes) {
    //  var sRes = oRes;
    logPerf('testPerfListAll');
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes,
    // TODO better error 'I did not infer a domain restriction from "NONEXSITENT". Specify an existing domain. (List all domains) to get exact names.\n'
    'I don\'t know anything about "categories starting with "elem" in domain NONEXSITENT" ("").\nI do not understand "NONEXSITENT".'
    );
    test.done(); releaseConnector(conn);
  });
};

exports.testOperatorStartsWithQuotedMemberInDomain = function (test) {
  logPerf('testPerfListAll');
  // var u = 'list all AppNames in FIN-GL Account Manage fiori intent MM-PUR Work Center WBS Elements Planning related to unit test';
  testOne('list all element names starting with e in domain IUPAC', function (conn, oRes) {
    //  var sRes = oRes;
    logPerf('testPerfListAll');
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes,
    //TODO SORTING
     'the element names starting with e in domain IUPAC are ...\n"einsteinium";\n"erbium";\n"europium"'
    );
    test.done(); releaseConnector(conn);
  });
};

exports.testShowMeQueryOK = function (test) {
  testOne('show me orbits with earth', function (conn, oRes) {
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes,
 'starting uri https://en.wikipedia.org/wiki/Earth'
 //  '"cosmos"is a domain with 13 categories and 7 records\nDescription:a model with a small subset of cosmological entities. Main purpose is to test \na)properties which occur multiple times (e.g. "Sun" in "object name" as key and in "orbits"; \nb) "earth" as a property which is also present in a different model\n"cosmos" has a meaning in one domain "metamodel":\n"cosmos" is a value for category "domain" present in 13(14.8%) of records;\n'
   );//  '"cosmos"is a domain with 13 categories and 7 records\nDescription:a model with a small subset of cosmological entities. Main purpose is to test \na)properties which occur multiple times (e.g. "Sun" in "object name" as key and in "orbits"; \nb) "earth" as a property which is also present in a differnt model\n');
    test.done(); releaseConnector(conn);
  });
};


exports.testShowMeBad = function (test) {
  testOne('show me funny', function (conn, oRes) {
    debuglog(JSON.stringify(oRes));
    test.deepEqual(oRes,
 'I did not get what you want'
 //  '"cosmos"is a domain with 13 categories and 7 records\nDescription:a model with a small subset of cosmological entities. Main purpose is to test \na)properties which occur multiple times (e.g. "Sun" in "object name" as key and in "orbits"; \nb) "earth" as a property which is also present in a different model\n"cosmos" has a meaning in one domain "metamodel":\n"cosmos" is a value for category "domain" present in 13(14.8%) of records;\n'
   );//  '"cosmos"is a domain with 13 categories and 7 records\nDescription:a model with a small subset of cosmological entities. Main purpose is to test \na)properties which occur multiple times (e.g. "Sun" in "object name" as key and in "orbits"; \nb) "earth" as a property which is also present in a differnt model\n');
    test.done(); releaseConnector(conn);
  });
};


//var debug = require('debug');

var logPerf = logger.perf('perflistall');
//var perflog = debug('perf');


exports.testPerfListAll1 = function (test) {
  logPerf('testPerfListAll1');
  testOne('list all AppNames in FIN-GL Account Manage fiori intent MM-PUR Work Center WBS Elements Planning', function (conn, oRes) {
    // var sRes = oRes;
    logPerf('testPerfListAll1');
    debuglog(JSON.stringify(oRes));
    test.deepEqual(true, true);
    test.done(); releaseConnector(conn);
  });
};





exports.testPerfListAll2 = function (test) {
  logPerf('testPerfListAll');
  // var u = 'list all AppNames in FIN-GL Account Manage fiori intent MM-PUR Work Center WBS Elements Planning related to unit test';
  testOne('list all AppNames in FIN-GL Account Manage fiori intent related to unit test', function (conn, oRes) {
    //  var sRes = oRes;
    logPerf('testPerfListAll');
    debuglog(JSON.stringify(oRes));
    test.deepEqual(true, true);
    test.done(); releaseConnector(conn);
  });
};


exports.testUpDownRecognizerUp = function (test) {
  doRecognize('up', function (err, res) {
    test.deepEqual(res.intent, 'intent.up');
    test.done();
  });
};


