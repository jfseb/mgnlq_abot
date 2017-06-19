/**
 * @file
 * @module toolmatcher.nunit
 * @copyright (c) 2016 Gerd Forstmann
 */

var process = require('process');
var root = (process.env.FSD_COVERAGE) ? '../../gen_cov' : '../../gen';

var debuglog = require('debug')('describe.nunit');

//var debuglog = require('debug')('listall.nunit');

const Describe = require(root + '/match/describe.js');


const Model = require('mgnlq_model').Model;
process.on('unhandledRejection', function onError(err) {
  console.log(err);
  console.log(err.stack);
  throw err;
});


const getModel = require('mgnlq_testmodel_replay').getTestModel;



exports.testSloppyOrExactExact = function (test) {
  test.expect(1);
  getModel().then((theModel) =>{
    var res = Describe.sloppyOrExact('unit tests', 'unit tEsts', theModel);
    test.deepEqual(res, '"unit tEsts"');
    test.done();
    Model.releaseModel(theModel);
  });
};

exports.testSloppyOrExactPlural = function (test) {
  test.expect(1);
  getModel().then((theModel) =>{
    var res = Describe.sloppyOrExact('unit test', 'Unit tests', theModel);
    test.deepEqual(res, '"Unit tests" (interpreted as "unit test")');
    test.done();
    Model.releaseModel(theModel);
  });

};

exports.testSloppyOrExactSloppy = function (test) {
  test.expect(1);
  getModel().then((theModel) =>{
    var res = Describe.sloppyOrExact('unit tests', 'Uint tests', theModel);
    test.deepEqual(res, '"Uint tests" (interpreted as "unit tests")');
    test.done();
    Model.releaseModel(theModel);
  });

};

exports.testSloppyOrExactSyn = function (test) {
  test.expect(1);
  getModel().then((theModel) =>{
    var res = Describe.sloppyOrExact('element name','name', theModel);
    test.deepEqual(res, '"name" (interpreted as synonym for "element name")');
    test.done();
    Model.releaseModel(theModel);
  });

};

exports.testCountPresence = function (test) {
  test.expect(1);
  getModel().then((theModel) =>{
    Describe.countRecordPresence('orbits', 'Cosmos', theModel).then(res => {
      test.deepEqual(res, {
        totalrecords : 7,
        presentrecords : 3,
        values : { 'Sun' : 2, 'Alpha Centauri C' : 1, undefined : 3 , 'n/a' : 1 },
        multivalued : false
      });
      test.done();
      Model.releaseModel(theModel);
    });
  });
};

exports.testDescribeFactInDomain = function (test) {
  test.expect(1);
  getModel().then((theModel) =>{
    Describe.describeFactInDomain('nomatchnotevenclose', undefined, theModel).then(res =>{
      var cmp = 'I don\'t know anything about "nomatchnotevenclose".\n';
      debuglog(res);
      debuglog(cmp);
      test.equals(res,cmp);
      test.done();
      Model.releaseModel(theModel);
    });
  });
};

exports.testDescribeFactInDomainFilter = function (test) {
  test.expect(1);
  getModel().then((theModel) =>{
    Describe.describeFactInDomain('nomatchnotevenclose', 'IUPAC', theModel).then( res=>{
      var cmp = '"nomatchnotevenclose" is no known fact in domain "IUPAC".\n';
      debuglog(res);
      debuglog(cmp);
      test.equals(res,cmp);
      test.done();
      Model.releaseModel(theModel);
    });
  });
};

exports.testDescribeFactInDomainSun = function (test) {
  test.expect(1);
  getModel().then((theModel) =>{
    Describe.describeFactInDomain('sun', undefined, theModel).then( (res) =>{
    //var cmp = '"sun" has a meaning in domain "Cosmos":\n"sun" ...\nis a value for category "orbits" present in 2(28.6%) of records;\nis a value for category "object name" present in 1(14.3%) of records;\n' == '"sun" has a meaning in domain "Cosmos":\n"sun" is a value for category "orbits" present in 2(28.6%) of records;\n';
    //var cmp = '"sun" has a meaning in domain "Cosmos":\n"sun" ...\nis a value for category "orbits" present in 2(28.6%) of records;\nis a value for category "object name" present in 1(14.3%) of records;\n';
      var cmp =  '"sun" has a meaning in one domain "Cosmos":\n"sun" ...\n'  +
        'is a value for category "object name" present in 1(14.3%) of records;\n' +
        'is a value for category "orbits" present in 2(28.6%) of records;\n'
      ;
      cmp = '"sun" has a meaning in one domain "Cosmos":\n"sun" ...\nis a value for category "orbits" present in 2(28.6%) of records;\nis a value for category "object name" present in 1(14.3%) of records;\n';


      debuglog(res);
      debuglog(cmp);
      test.equals(res,cmp);
      test.done();
      Model.releaseModel(theModel);
    });
  });

};

exports.testDescribeFactInDomainSunCosmos = function (test) {
  test.expect(1);
  getModel().then((theModel) =>{
    Describe.describeFactInDomain('sun', 'Cosmos', theModel).then( res=>{
      var cmp = '"sun" has a meaning in domain "Cosmos":\n"sun" ...\nis a value for category "orbits" present in 2(28.6%) of records;\nis a value for category "object name" present in 1(14.3%) of records;\n';
      cmp = '"sun" has a meaning in domain "Cosmos":\n"sun" ...\nis a value for category "object name" present in 1(14.3%) of records;\nis a value for category "orbits" present in 2(28.6%) of records;\n';
      cmp =  '"sun" has a meaning in domain "Cosmos":\n"sun" ...\nis a value for category "orbits" present in 2(28.6%) of records;\nis a value for category "object name" present in 1(14.3%) of records;\n';
      debuglog(res);
      debuglog(cmp);
      test.equals(res,cmp);
      test.done();
      Model.releaseModel(theModel);
    });
  });
};

exports.testDescribeFactInDomainProxima2 = function (test) {
  test.expect(1);
  getModel().then((theModel) =>{
    Describe.describeFactInDomain('Proxima Centauri', 'Cosmos', theModel).then(res => {
      var cmp =`"Proxima Centauri" has a meaning in domain "Cosmos":
  "Proxima Centauri" (interpreted as "Alpha Centauri C") is a value for category "object name" present in 1(14.3%) of records;\n`;

      cmp = '"Proxima Centauri" has a meaning in domain "Cosmos":\n"Proxima Centauri" (interpreted as "Alpha Centauri C") is a value for category "object name" present in 1(14.3%) of records;\n"Proxima Centauri" (interpreted as "Proxima Centauri b") is a value for category "object name" present in 1(14.3%) of records;\n';

      cmp = '"Proxima Centauri" has a meaning in domain "Cosmos":\n"Proxima Centauri" (interpreted as "Alpha Centauri C") is a value for category "object name" present in 1(14.3%) of records;\n';

      cmp = '"Proxima Centauri" has a meaning in domain "Cosmos":\n"Proxima Centauri" (interpreted as "Alpha Centauri B") is a value for category "object name" present in 1(14.3%) of records;\n';
      debuglog(res);
      debuglog(cmp);
      test.equals(res,cmp);
      test.done();
      Model.releaseModel(theModel);
    });
  });
};

///TODO FIX THIS

exports.testDescribeFactInDomainAlpha = function (test) {
  test.expect(1);
  getModel().then((theModel) =>{
    Describe.describeFactInDomain('Alpha Centauri C', 'Cosmos', theModel).then(res=>{
      var cmp = '"Alpha Centauri C" has a meaning in domain "Cosmos":\n' +
    '"Alpha Centauri C" ...\n' +
        'is a value for category "object name" present in 1(14.3%) of records;\n' +
        'is a value for category "orbits" present in 1(14.3%) of records;\n' ;

      cmp =
  '"Alpha Centauri C" has a meaning in domain "Cosmos":\n"Alpha Centauri C" (interpreted as "Alpha Centauri A") is a value for category "object name" present in 1(14.3%) of records;\n"Alpha Centauri C" (interpreted as "Alpha Centauri B") is a value for category "object name" present in 1(14.3%) of records;\n"Alpha Centauri C" ...\nis a value for category "object name" present in 1(14.3%) of records;\nis a value for category "orbits" present in 1(14.3%) of records;\n';     debuglog(res);
      cmp = '"Alpha Centauri C" has a meaning in domain "Cosmos":\n"Alpha Centauri C" (interpreted as "Alpha Centauri B") is a value for category "object name" present in 1(14.3%) of records;\n"Alpha Centauri C" (interpreted as "Alpha Centauri A") is a value for category "object name" present in 1(14.3%) of records;\n"Alpha Centauri C" ...\nis a value for category "object name" present in 1(14.3%) of records;\nis a value for category "orbits" present in 1(14.3%) of records;\n';

      debuglog(cmp);
      test.equals(res,cmp);
      test.done();
      Model.releaseModel(theModel);
    });
  });

};

exports.testDescribeFactInDomainAlphaFuzz = function (test) {
  getModel().then((theModel) =>{
    Describe.describeFactInDomain('Alpha Centauri X', 'Cosmos', theModel).then(res=>{
      var cmp =`"Alpha Centauri X" has a meaning in domain "Cosmos":
  "Alpha Centauri X" (interpreted as "Alpha Centauri A") is a value for category "object name" present in 1(14.3%) of records;
  "Alpha Centauri X" (interpreted as "Alpha Centauri B") is a value for category "object name" present in 1(14.3%) of records;
  "Alpha Centauri X" (interpreted as "Alpha Centauri C") ...
  is a value for category "object name" present in 1(14.3%) of records;
  is a value for category "orbits" present in 1(14.3%) of records;\n`;

      cmp = '"Alpha Centauri X" has a meaning in domain "Cosmos":\n"Alpha Centauri X" (interpreted as "Alpha Centauri B") is a value for category "object name" present in 1(14.3%) of records;\n"Alpha Centauri X" (interpreted as "Alpha Centauri A") is a value for category "object name" present in 1(14.3%) of records;\n"Alpha Centauri X" (interpreted as "Alpha Centauri C") ...\nis a value for category "object name" present in 1(14.3%) of records;\nis a value for category "orbits" present in 1(14.3%) of records;\n';

      debuglog(res);
      debuglog(cmp);
      test.equals(res,cmp);
      test.done();
      Model.releaseModel(theModel);
    });
  });
};


exports.testDescribeFactInDomainBluePlanet = function (test) {
  test.expect(1);
  getModel().then((theModel) =>{
    Describe.describeFactInDomain('blue planet', 'Cosmos', theModel).then(res=>{

      var cmp = '"blue planet" has a meaning in domain "Cosmos":\n' +
      '"blue planet" (interpreted as "earth") is a value for category "object name" present in 1(14.3%) of records;\n';
      debuglog(res);
      debuglog(cmp);
      test.equals(res,cmp);
      test.done();
      Model.releaseModel(theModel);
    });
  });

};



exports.testDescribeFactInDomainEarth = function (test) {
  test.expect(1);
  getModel().then((theModel) => {
  //TODO , restrict synonyms per domain!
    var p = Describe.describeFactInDomain('earth', undefined, theModel);
  /*  console.log('here is p ' + p);
    console.log(JSON.stringify(p));
    console.log(typeof p.then);*/
    p.then( function(res) {
      var cmp = `"earth" has a meaning in 2 domains: "Cosmos" and "Philosophers elements"
in domain "Cosmos" "earth" is a value for category "object name" present in 1(14.3%) of records;
in domain "Philosophers elements" "earth" is a value for category "element name" present in 1(25.0%) of records;\n`;
      debuglog(res);
      debuglog(cmp);
      test.equals(res,cmp);
      test.done();
      Model.releaseModel(theModel);
    });
  });

};


exports.testDescribeFactInDomainBluePlanetAll = function (test) {
  test.expect(1);
  getModel().then((theModel) =>{
  //TODO , restrict synonyms per domain!
    Describe.describeFactInDomain('blue planet', undefined, theModel).then( res =>{
      var cmp = '"blue planet" has a meaning in one domain "Cosmos":\n"blue planet" (interpreted as "earth") is a value for category "object name" present in 1(14.3%) of records;\n';
      cmp = '"blue planet" has a meaning in one domain "Cosmos":\n"blue planet" (interpreted as "earth") is a value for category "object name" present in 1(14.3%) of records;\n';
      debuglog(res);
      debuglog(cmp);
      test.equals(res,cmp);
      test.done();
      Model.releaseModel(theModel);
    });
  });
};

exports.testDescribeFactInDomainSIUPAC = function (test) {
  test.expect(1);
  getModel().then((theModel) =>{
    Describe.describeFactInDomain('sun', 'IUPAC', theModel).then( res => {
      var cmp = '"sun" is no known fact in domain "IUPAC".\n';
      debuglog(res);
      debuglog(cmp);
      test.equals(res,cmp);
      test.done();
      Model.releaseModel(theModel);
    });
  });

};

exports.testDescribeDomain = function (test) {
  test.expect(1);
  getModel().then((theModel) =>{
    Describe.describeDomain('cusmos', 'Cosmos', theModel).then((oRes) => {
      test.deepEqual(oRes,
//  '"cusmos" (interpreted as "Cosmos")is a domain with 13 categories and 7 records\nDescription:a model with a small subset of cosmological entities. Main purpose is to test \na)properties which occur multiple times (e.g. "Sun" in "object name" as key and in "orbits"; \nb) "earth" as a property which is also present in a different model\n' );

  '"cusmos" (interpreted as "Cosmos")is a domain with 13 categories and 7 records\nDescription:a model with a small subset of cosmological entities. Main purpose is to test \na)properties which occur multiple times (e.g. "Sun" in "object name" as key and in "orbits"; \nb) "earth" as a property which is also present in a different model\n'
//  '"cusmos" (interpreted as "Cosmos")is a domain with 13 categories and 7 records\nDescription:a model with a small subset of cosmological entities. Main purpose is to test \na)properties which occur multiple times (e.g. "Sun" in "object name" as key and in "orbits"; \nb) "earth" as a property which is also present in a different model\n'
  //"cusmos" (interpreted as "Cosmos")is a domain with 13 categories and 7 records\nDescription:a model with a small subset of cosmological entities. Main purpose is to test \na)properties which occur multiple times (e.g. "Sun" in "object name" as key and in "orbits"; \nb) "earth" as a property which is also present in a different model\n');
      );
      test.done();
      Model.releaseModel(theModel);
    });
  });
};

exports.testDescribeFactWhichIsADomain = function (test) {
  getModel().then((theModel) =>{
    Describe.describeFactInDomain('cusmos', undefined, theModel).then(oRes => {
      test.deepEqual(oRes,
//  '"cusmos" (interpreted as "Cosmos")is a domain with 13 categories and 7 records\nDescription:a model with a small subset of cosmological entities. Main purpose is to test \na)properties which occur multiple times (e.g. "Sun" in "object name" as key and in "orbits"; \nb) "earth" as a property which is also present in a different model\n' );
//    '"cusmos" (interpreted as "Cosmos")is a domain with 13 categories and 7 records\nDescription:a model with a small subset of cosmological entities. Main purpose is to test \na)properties which occur multiple times (e.g. "Sun" in "object name" as key and in "orbits"; \nb) "earth" as a property which is also present in a different model\n"cusmos" has a meaning in one domain "metamodel":\n"cusmos" (interpreted as "Cosmos") is a value for category "domain" present in 13(14.8%) of records;\n'
 '"cusmos" (interpreted as "Cosmos")is a domain with 13 categories and 7 records\nDescription:a model with a small subset of cosmological entities. Main purpose is to test \na)properties which occur multiple times (e.g. "Sun" in "object name" as key and in "orbits"; \nb) "earth" as a property which is also present in a different model\n"cusmos" has a meaning in one domain "metamodel":\n"cusmos" (interpreted as "Cosmos") is a value for category "domain" present in 13(14.3%) of records;\n',
 'abc'
      );
      test.done();
      Model.releaseModel(theModel);
    });
  });

};

exports.testDescribeCategoryStatsInDomain = function (test) {
  test.expect(1);
  getModel().then((theModel) =>{
    Describe.getCategoryStatsInDomain('element name', 'IUPAC', theModel).then((oRes) =>{
      delete oRes.categoryDesc._id;
      test.deepEqual(oRes,
        { categoryDesc:
        { wordindex: true,
          category_description: 'element name',
          category: 'element name',
          QBEColumnProps: { LUNRIndex: true, QBE: true, defaultWidth: 120 },
          category_synonyms: [ 'name' ] },
          distinct: '118',
          delta: '',
          presentRecords: 118,
          percPresent: '100.0',
          sampleValues: 'Possible values are ...\n"actinium", "aluminium", "americium", "antimony", "argon", "arsenic", "astatine" ...' }
            );
      test.done();
      Model.releaseModel(theModel);
    });
  });

};


exports.testMakeValuesListOne = function (test) {
  var res = Describe.makeValuesListString(['abc'] );
  test.deepEqual(res, 'The sole value is "abc"');
  test.done();
};



exports.testMakeValuesListEarth = function (test) {
  var res = Describe.makeValuesListString(['earth', 'fire', 'water', 'wind']);
  test.deepEqual(res, 'Possible values are ...\n"earth", "fire", "water" or "wind"');
  test.done();
};


exports.testMakeValuesListFits = function (test) {
  var res = Describe.makeValuesListString(['abc', 'def', 'hif', 'klm']);
  test.deepEqual(res, 'Possible values are ...\n"abc", "def", "hif" or "klm"');
  test.done();
};

exports.testMakeValuesListNoFit = function (test) {
  var res = Describe.makeValuesListString(['abc', 'def', 'hiasfasfasfsaf', 'klasfasfasfsafasfm', 'hijsasfasfasfasfdfsf', 'desafsfasff', 'kasdfasfsafsafdlm']);
  test.deepEqual(res, 'Possible values are ...\n"abc", "def", "hiasfasfasfsaf", "klasfasfasfsafasfm", "hijsasfasfasfasfdfsf" ...');
  test.done();
};



exports.testMakeValuesListLong = function (test) {
  var val1 = 'abcs';
  var val2 = 'abcsadlfaj askdf skfjKKKKK aksdlfj saldkf jaslkfdjas lfjsad flskjaf lsdfkjs alfjks df';
  var val3 = 'abcsadlfaj askdf skfjKKKKK aksdlfj saldkf jaslkfdjas lfjsad flskjaf lsdfkjs alfjks df';
  var res = Describe.makeValuesListString([val1,val2, val3, 'SAFSDFSDF']);
  test.equals(res, 'Possible values are ...\n(1): "' + val1 +
  '"\n(2): "' + val2 + '"\n(3): "' + val3 + '"\n...');
  test.done();
};


exports.testMakeValuesListLong3 = function (test) {
  // no ...
  var val1 = 'abcs';
  var val2 = 'abcsadlfaj askdf skfjKKKKK aksdlfj saldkf jaslkfdjas lfjsad flskjaf lsdfkjs alfjks df';
  var val3 = 'abcsadlfaj askdf skfjKKKKK aksdlfj saldkf jaslkfdjas lfjsad flskjaf lsdfkjs alfjks df';
  var res = Describe.makeValuesListString([val1,val2, val3]);
  test.deepEqual(res, 'Possible values are ...\n(1): "' + val1 +
  '"\n(2): "' + val2 + '"\n(3): "' + val3 + '"\n');
  test.done();
};

var ELEMENT_NAME_IUPAC =
'is a category in domain "IUPAC"\nIt is present in 118 (100.0%) of records in this domain,\n'
 +  'having 118 distinct values.\n'
  + 'Possible values are ...\n"actinium", "aluminium", "americium", "antimony", "argon", "arsenic", "astatine" ...';

ELEMENT_NAME_IUPAC = 'is a category in domain "IUPAC"\nIt is present in 118 (100.0%) of records in this domain,\n'
+'having 118 distinct values.\n'
+'Possible values are ...\n"actinium", "aluminium", "americium", "antimony", "argon", "arsenic", "astatine" ...\nDescription: element name';


exports.testDescribeCategoryWithDomain = function (test) {
  test.expect(1);
  getModel().then((theModel) =>{
    Describe.describeCategory('element name', 'IUPAC', theModel, 'describe element name in domain IUPAC').then(
      res => {
        debuglog(res);
        var cmp =  ELEMENT_NAME_IUPAC;
        debuglog(cmp);
        test.deepEqual(res, [ 'is a category in domain "IUPAC"\nIt is present in 118 (100.0%) of records in this domain,\nhaving 118 distinct values.\nPossible values are ...\n"actinium", "aluminium", "americium", "antimony", "argon", "arsenic", "astatine" ...\nDescription: element name' ]);
        test.done();
        Model.releaseModel(theModel);
      });
  });
};


exports.testDescribeCategoryWithInvalid = function (test) {
  test.expect(1);
  getModel().then((theModel) =>{
    var res = Describe.describeCategory('element name', 'IUPOCCCCCAC', theModel, 'describe element name in domain IUPAC');
    res.then((res) =>{
      debuglog(res);
      var cmp =  ELEMENT_NAME_IUPAC;
      debuglog(cmp);
      test.deepEqual(res, [ ]);
      test.done();
      Model.releaseModel(theModel);
    });
  });
};

exports.testDescribeInDomain = function (test) {
  test.expect(1);
  getModel().then((theModel) =>{
    Describe.describeCategoryInDomain('element name', 'IUPAC', theModel).then((res)=>{
      debuglog(res);
      var cmp =  ELEMENT_NAME_IUPAC;
      debuglog(cmp);
      test.deepEqual(res,cmp);
      test.done();
      Model.releaseModel(theModel);
    });
  });
};


exports.testDescribeCategoryInhomogeneous = function (test) {
  test.expect(1);
  getModel().then((theModel) =>{
    Describe.describeCategory('orbits', undefined, theModel, 'abc').then( (res) => {

      var cmp = 'is a category in domain "Cosmos"\nIt is present in 3 (42.9%) of records in this domain,\nhaving 2(+2) distinct values.\nPossible values are ...\n"Alpha Centauri C" or "Sun"\nDescription: for planets, name of the central entity' ;
  //
  //var cmp = 'is a category in domain "Cosmos"\nIt is present in 3 (42.9%) of records in this domain,\nhaving 2(+2) distinct values.\nPossible values are ...\n"Alpha Centauri C" or "Sun"\nDescription:';
      debuglog(res);
      debuglog([cmp]);
      test.deepEqual(res,[cmp]);
      test.done();
      Model.releaseModel(theModel);
    });
  });
};


exports.testDescribeCategoryEcc = function (test) {
  test.expect(1);
  getModel().then((theModel) =>{
    Describe.describeCategory('eccentricity', undefined, theModel, 'abc').then( (res) => {
      var cmp = 'is a category in domain "Cosmos"\nIt is present in 2 (28.6%) of records in this domain,\nhaving 2(+1) distinct values.\n'
  + 'Possible values are ...\n"0.0167" or "0.0934"';
      debuglog(res);
      debuglog([cmp]);
      test.deepEqual(res,[cmp]);
      test.done();
      Model.releaseModel(theModel);
    });
  });
};


exports.testDescribeCategoryMult = function (test) {
  test.expect(2);
  getModel().then((theModel) =>{
    Describe.describeCategory('element name', undefined, theModel, 'abc').then( (res) =>{
      var cmp1 =
 'is a category in domain "Philosophers elements"\nIt is present in 4 (100.0%) of records in this domain,\nhaving 4 distinct values.\nPossible values are ...\n"earth", "fire", "water" or "wind"\nDescription: name of the philosophical element' ;

//  'is a category in domain "Philosophers elements"\nIt is present in 4 (100.0%) of records in this domain,\nhaving 4 distinct values.\nPossible values are ...\n"earth", "fire", "water" or "wind"';
      var cmp2 =  ELEMENT_NAME_IUPAC;
      debuglog(res[0]);
      debuglog(res[0]);

      test.deepEqual(res[0], cmp2);
      test.deepEqual(res[1], cmp1);
      test.done();
      Model.releaseModel(theModel);
    });
  });
};
