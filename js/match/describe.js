"use strict";
/**
 *
 * @module jfseb.fdevstart.explain
 * @file explain.ts
 * @copyright (c) 2016 Gerd Forstmann
 *
 * Functions dealing with explaining facts, categories etc.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Algol = require("./algol");
const debug = require("debugf");
const debuglog = debug('describe');
const logger = require("../utils/logger");
var logPerf = logger.perf("perflistall");
var perflog = debug('perf');
const mgnlq_er_1 = require("mgnlq_er");
const WhatIs = require("./whatis");
const mgnlq_model_1 = require("mgnlq_model");
//import * as Match from './match';
const Utils = require("abot_utils");
var sWords = {};
function isSynonymFor(exactWord, sloppyWord, theModel) {
    // TODO: use model synonyms
    return sloppyWord === "name" && exactWord === "element name";
}
exports.isSynonymFor = isSynonymFor;
function sloppyOrExact(exactWord, sloppyWord, theModel) {
    if (exactWord.toLowerCase() === sloppyWord.toLowerCase()) {
        return '"' + sloppyWord + '"';
    }
    // TODO, find plural s etc.
    // still exact,
    //
    if (isSynonymFor(exactWord, sloppyWord, theModel)) {
        return '"' + sloppyWord + '" (interpreted as synonym for "' + exactWord + '")';
    }
    //todo, find is synonymfor ...
    // TODO, a synonym for ...
    return '"' + sloppyWord + '" (interpreted as "' + exactWord + '")';
}
exports.sloppyOrExact = sloppyOrExact;
/*
export function countRecordPresenceOLD(category : string, domain : string, theModel : IMatch.IModels) : IDescribeCategory {
  var res = { totalrecords : 0,
    presentrecords : 0,
    values : { },  // an their frequency
    multivalued : false
  } as IDescribeCategory;
  theModel.records.forEach(function(record) {
    //debuglog(JSON.stringify(record,undefined,2));
    if(record._domain !== domain) {
      return;
    }
    res.totalrecords++;
    var val = record[category];
    var valarr = [val];
    if(Array.isArray(val)) {
      res.multivalued = true;
      valarr = val;
    }
    // todo wrap arr
    if(val !== undefined && val !== "n/a") {
      res.presentrecords ++;
    }
    valarr.forEach(function(val) {
      res.values[val] = (res.values[val] || 0) + 1;
    })
  })
  return res;
}
*/
function countRecordPresence(category, domain, theModel) {
    var res = { totalrecords: 0,
        presentrecords: 0,
        values: {},
        multivalued: false
    };
    return mgnlq_model_1.Model.getExpandedRecordsForCategory(theModel, domain, category).then(records => {
        res.totalrecords = records.length;
        records.forEach(function (record) {
            //debuglog(JSON.stringify(record,undefined,2));
            /*if(record._domain !== domain) {
              return;
            }*/
            var val = record[category];
            var valarr = [val];
            if (Array.isArray(val)) {
                res.multivalued = true;
                valarr = val;
            }
            // todo wrap arr
            if (val !== undefined && val !== "n/a") {
                res.presentrecords++;
            }
            valarr.forEach(function (val) {
                res.values[val] = (res.values[val] || 0) + 1;
            });
        });
    }).then(() => res);
}
exports.countRecordPresence = countRecordPresence;
/*
export function countRecordPresenceFact(fact : string, category : string, domain : string, theModel : IMatch.IModels) : Promise<IDescribeFact> {
  var res = { totalrecords : 0,
    presentrecords : 0,
    values : { },  // an their frequency
    multivalued : false
  } as IDescribeCategory;
  return Model.getExpandedRecordsForCategory(theModel,domain,category).then(records =>{
    res.totalrecords = records.length;
    records.forEach((record) =>{
      res.totalrecords++;
      var val = record[category];
      var valarr = [val];
      if(Array.isArray(val)) {
        if(val.indexOf(fact) >= 0) {
          res.multivalued = true;
          valarr = val;
          res.presentrecords++;
        }
      } else if (val === fact) {
          res.presentrecords++;
      }
    });
    return res;
  });
}
*/
/*
export function countRecordPresenceFactOld(fact : string, category : string, domain : string, theModel : IMatch.IModels) : IDescribeFact {
  var res = { totalrecords : 0,
    presentrecords : 0,
    values : { },  // an their frequency
    multivalued : false
  } as IDescribeCategory;


  theModel.records.forEach(function(record) {
    //debuglog(JSON.stringify(record,undefined,2));
    if(record._domain !== domain) {
      return;
    }
    res.totalrecords++;
    var val = record[category];
    var valarr = [val];
    if(Array.isArray(val)) {
      if(val.indexOf(fact) >= 0) {
        res.multivalued = true;
        valarr = val;
        res.presentrecords++;
      }
    } else if (val === fact) {
        res.presentrecords++;
    }
  })
  return res;
}
*/
function makeValuesListString(realvalues) {
    var valuesString = "";
    var totallen = 0;
    var listValues = realvalues.filter(function (val, index) {
        totallen = totallen + val.length;
        return (index < Algol.DescribeValueListMinCountValueList) || (totallen < Algol.DescribeValueListLengthCharLimit);
    });
    if (listValues.length === 1 && realvalues.length === 1) {
        return 'The sole value is \"' + listValues[0] + '"';
    }
    var maxlen = listValues.reduce((prev, val) => Math.max(prev, val.length), 0);
    if (maxlen > 30) {
        return "Possible values are ...\n" +
            listValues.reduce((prev, val, index) => (prev + "(" + (index + 1) + '): "' + val + '"\n'), "")
            + (listValues.length === realvalues.length ? "" : "...");
    }
    var list = "";
    if (listValues.length === realvalues.length) {
        list = Utils.listToQuotedCommaOr(listValues);
    }
    else {
        list = '"' + listValues.join('", "') + '"';
    }
    return "Possible values are ...\n"
        + list
        + (listValues.length === realvalues.length ? "" : " ...");
}
exports.makeValuesListString = makeValuesListString;
function toPercent(a, b) {
    return "" + (100 * a / b).toFixed(1);
}
exports.toPercent = toPercent;
;
function getCategoryStatsInDomain(category, filterdomain, theModel) {
    return countRecordPresence(category, filterdomain, theModel).then((recordCount) => {
        //debuglog(JSON.stringify(theModel.records.filter(a => a._domain === "Cosmos"),undefined,2));
        const percent = toPercent(recordCount.presentrecords, recordCount.totalrecords);
        debuglog(JSON.stringify(recordCount.values));
        var allValues = Object.keys(recordCount.values);
        var realvalues = allValues.filter(value => (value !== 'undefined') && (value !== 'n/a'));
        debuglog;
        realvalues.sort();
        var undefNaDelta = (allValues.length - realvalues.length);
        var delta = (undefNaDelta) ? "(+" + undefNaDelta + ")" : "";
        const distinct = '' + realvalues.length;
        const valuesList = makeValuesListString(realvalues);
        return {
            categoryDesc: theModel.full.domain[filterdomain].categories[category],
            distinct: distinct,
            delta: delta,
            presentRecords: recordCount.presentrecords,
            percPresent: percent,
            sampleValues: valuesList
        };
    });
}
exports.getCategoryStatsInDomain = getCategoryStatsInDomain;
function describeCategoryInDomain(category, filterdomain, theModel) {
    /*  const recordCount = countRecordPresence(category, filterdomain, theModel);
      debuglog(JSON.stringify(theModel.records.filter(a => a._domain === "Cosmos"),undefined,2));
      const percent = toPercent(recordCount.presentrecords , recordCount.totalrecords);
      debuglog(JSON.stringify(recordCount.values));
      var allValues =Object.keys(recordCount.values);
      var realvalues = allValues.filter(value => (value !== 'undefined') && (value !== 'n/a'));
      debuglog
      realvalues.sort();
      var undefNaDelta =  (allValues.length - realvalues.length);
      var delta =  (undefNaDelta) ?  "(+" + undefNaDelta + ")" : "";
      const distinct = '' + realvalues.length;
    
      const valuesList = makeValuesListString(realvalues);
    */
    return getCategoryStatsInDomain(category, filterdomain, theModel).then((stats) => {
        var res = 'is a category in domain "' + filterdomain + '"\n'
            + `It is present in ${stats.presentRecords} (${stats.percPresent}%) of records in this domain,\n` +
            `having ${stats.distinct + ''}${stats.delta} distinct values.\n`
            + stats.sampleValues;
        var desc = theModel.full.domain[filterdomain].categories[category] || {};
        var description = desc.category_description || "";
        if (description) {
            res += `\nDescription: ${description}`;
        }
        return res;
    });
}
exports.describeCategoryInDomain = describeCategoryInDomain;
function findRecordsWithFact(matchedString, category, records, domains) {
    return records.filter(function (record) {
        let res = (record[category] === matchedString);
        if (res) {
            increment(domains, records._domain);
        }
        return res;
    });
}
exports.findRecordsWithFact = findRecordsWithFact;
function increment(map, key) {
    map[key] = (map[key] || 0) + 1;
}
exports.increment = increment;
function sortedKeys(map) {
    var r = Object.keys(map);
    r.sort();
    return r;
}
function describeDomain(fact, domain, theModel) {
    return mgnlq_model_1.Model.getExpandedRecordsForCategory(theModel, domain, mgnlq_model_1.Model.getCategoriesForDomain(theModel, domain)[0]).then((records) => {
        var count = records.length;
        var catcount = mgnlq_model_1.Model.getCategoriesForDomain(theModel, domain).length;
        var res = sloppyOrExact(domain, fact, theModel) + `is a domain with ${catcount} categories and ${count} records\n`;
        var desc = theModel.full.domain[domain].description || "";
        if (desc) {
            res += `Description:` + desc + `\n`;
        }
        return res;
    });
}
exports.describeDomain = describeDomain;
/*
export function describeFactInDomainOld(fact : string, filterdomain : string, theModel: IMatch.IModels) : string {
  var sentences = WhatIs.analyzeContextString(fact,  theModel.rules);
  //console.log("here sentences " + JSON.stringify(sentences));
  var lengthOneSentences = sentences.sentences.filter(oSentence => oSentence.length === 1);
  var res = '';
  // remove categories and domains
  var onlyFacts = lengthOneSentences.filter(oSentence =>{
    debuglog(JSON.stringify(oSentence[0]));
    return !Word.Word.isDomain(oSentence[0]) &&
           !Word.Word.isFiller(oSentence[0]) && !Word.Word.isCategory(oSentence[0])
  }
  );
  var onlyDomains = lengthOneSentences.filter(oSentence =>{
    return Word.Word.isDomain(oSentence[0]);
  });
  if(onlyDomains && onlyDomains.length > 0) {
    debuglog(()=>JSON.stringify(onlyDomains));
    onlyDomains.forEach(function(sentence) {
      var domain = sentence[0].matchedString;
      if( !filterdomain || domain === filterdomain) {
        debuglog(()=>"here match " + JSON.stringify(sentence));
        res += describeDomain(fact, sentence[0].matchedString, theModel);
      }
    })
  }

  debuglog("only facts: " + JSON.stringify(onlyFacts));
  var recordMap = {};
  var domainsMap = {} as {[key: string] : number};
  var matchedwordMap = {} as {[key: string] : number};
  var matchedCategoryMap = {} as {[key: string] : number};
  // look for all records
  onlyFacts.forEach(oSentence =>
    oSentence.forEach(oWord =>
      {
        increment(matchedwordMap, oWord.matchedString);
        increment(matchedCategoryMap, oWord.category);
      }
    )
  );
  // we have:
  // a list of categories,
  // a list of matchedWords  ->
  //

  var categories = sortedKeys(matchedCategoryMap);
  var matchedwords = sortedKeys(matchedwordMap);
  debuglog(()=>"matchedwords: " + JSON.stringify(matchedwords));
  debuglog(()=>"categories: " + JSON.stringify(categories));

  //var allMatchedWords = { [key : string] : number };
  var domainRecordCount = {} as {[key: string] : number};
  var domainMatchCatCount = {} as {[key: string] :
       {[key: string] :
     {[key: string] : number}}};
  // we prepare the following structure
  //
  // {domain} : recordcount;
  // {matchedwords} :
  // {domain} {matchedword} {category} presencecount
  theModel.records.forEach(function(record) {
    if(!filterdomain || record._domain === filterdomain ) {
      domainRecordCount[record._domain] = (domainRecordCount[record._domain] || 0) + 1;
      matchedwords.forEach(matchedword =>
        categories.forEach(category => {
          if( record[category] === matchedword) {
            var md = domainMatchCatCount[record._domain] = domainMatchCatCount[record._domain] || {};
            var mdc = md[matchedword] =  md[matchedword] || {};
            increment(mdc,category);
          };
        }
        )
      );
    }
  });
  debuglog(()=>JSON.stringify(domainMatchCatCount,undefined,2));
  debuglog(()=>JSON.stringify(domainRecordCount,undefined,2));
  var domains = sortedKeys(domainMatchCatCount);
  var resNext =  '"' + fact + '" has a meaning in ';
  var single = false;
  if(Object.keys(domainMatchCatCount).length > 1) {
    resNext += '' + domains.length +
              ' domains: ' + Utils.listToQuotedCommaAnd(domains) + "";
  } else if(domains.length === 1) {
    if(!filterdomain) {
      resNext += `one `;
    }
    resNext += `domain "${domains[0]}":`;
    single = true;
  } else {
    if(res) {
      return res;
    }
    var factclean = Utils.stripQuotes(fact);
    if(filterdomain) {
      return `"${factclean}" is no known fact in domain "${filterdomain}".\n`;
    }
    return `I don't know anything about "${factclean}".\n`;
  }
  res += resNext + "\n"; // ...\n";
  domains.forEach(function(domain) {
    var md = domainMatchCatCount[domain];
    Object.keys(md).forEach(matchedstring => {
      var mdc = md[matchedstring];
      if(!single) {
        res += 'in domain "' + domain + '" ';
      }
      var catsingle = Object.keys(mdc).length === 1;
      res += `${sloppyOrExact(matchedstring,fact,theModel)} `;
      if(!catsingle) {
        res += `...\n`;
      }
      Object.keys(mdc).forEach(category => {
      var percent =  toPercent(mdc[category],domainRecordCount[domain]);
        res += `is a value for category "${category}" present in ${mdc[category]}(${percent}%) of records;\n`;
      });
    });
  });
  return res;
}
*/
function describeFactInDomain(fact, filterdomain, theModel) {
    var sentences = WhatIs.analyzeContextString(fact, theModel.rules);
    //console.log("here sentences " + JSON.stringify(sentences));
    var lengthOneSentences = sentences.sentences.filter(oSentence => oSentence.length === 1);
    var res = '';
    // remove categories and domains
    var onlyFacts = lengthOneSentences.filter(oSentence => {
        debuglog(JSON.stringify(oSentence[0]));
        return !mgnlq_er_1.Word.Word.isDomain(oSentence[0]) &&
            !mgnlq_er_1.Word.Word.isFiller(oSentence[0]) && !mgnlq_er_1.Word.Word.isCategory(oSentence[0]);
    });
    var onlyDomains = lengthOneSentences.filter(oSentence => {
        return (mgnlq_er_1.Word.Word.isDomain(oSentence[0]));
    });
    var pPromise = undefined;
    debuglog(() => ` here onlyDomains ${onlyDomains.join(';')}`);
    if (onlyDomains && onlyDomains.length > 0) {
        debuglog(() => JSON.stringify(onlyDomains));
        pPromise = global.Promise.all(onlyDomains.map(function (sentence) {
            var domain = sentence[0].matchedString;
            if (!filterdomain || (domain === filterdomain)) {
                debuglog(() => "here match " + JSON.stringify(sentence));
                return describeDomain(fact, sentence[0].matchedString, theModel).then(rx => {
                    //console.log(`described domain ${fact} ${domain} ` + rx);
                    res += rx;
                });
            }
            else {
                return global.Promise.resolve(undefined);
            }
        })).then((arr) => {
            debuglog(() => arr.join(";"));
            arr.map((rec) => {
                if (rec !== undefined) {
                    res += rec;
                }
            });
            return res;
        });
    }
    else {
        pPromise = global.Promise.resolve(res);
    }
    ;
    return pPromise.then(resu => {
        debuglog(() => `constructed so far "${res}"`);
        debuglog("only facts: " + JSON.stringify(onlyFacts));
        var recordMap = {};
        var domainsMap = {};
        var matchedwordMap = {};
        var matchedCategoryMap = {};
        // look for all records
        onlyFacts.forEach(oSentence => oSentence.forEach(oWord => {
            increment(matchedwordMap, oWord.matchedString);
            increment(matchedCategoryMap, oWord.category);
        }));
        // we have:
        // a list of categories,
        // a list of matchedWords  ->
        //
        var categories = sortedKeys(matchedCategoryMap);
        categories.sort();
        var matchedwords = sortedKeys(matchedwordMap);
        debuglog(() => "matchedwords: " + JSON.stringify(matchedwords));
        debuglog(() => "categories: " + JSON.stringify(categories));
        //var allMatchedWords = { [key : string] : number };
        var domainRecordCount = {};
        var domainMatchCatCount = {};
        var filteredDomains = theModel.domains.filter((domain) => ((!filterdomain) || domain === filterdomain));
        // we prepare the following structure
        //
        // {domain} : recordcount;
        // {matchedwords} :
        // {domain} {matchedword} {category} presencecount
        return global.Promise.all(filteredDomains.map((domain) => {
            if (!filterdomain || domain === filterdomain) {
                return mgnlq_model_1.Model.getExpandedRecordsFull(theModel, domain).then(records => {
                    domainRecordCount[domain] = records.length;
                    records.map((record) => {
                        // domainRecordCount[record._domain] = (domainRecordCount[record._domain] || 0) + 1;
                        matchedwords.forEach(matchedword => {
                            categories.forEach(category => {
                                if (record[category] === matchedword) {
                                    var md = domainMatchCatCount[domain] = domainMatchCatCount[domain] || {};
                                    var mdc = md[matchedword] = md[matchedword] || {};
                                    increment(mdc, category);
                                }
                            });
                        });
                    });
                });
            }
            else {
                return mgnlq_model_1.Model.getExpandedRecordsFull(theModel, domain).then(records => {
                    domainRecordCount[domain] = records.length;
                    records.map((record) => {
                        // domainRecordCount[record._domain] = (domainRecordCount[record._domain] || 0) + 1;
                        matchedwords.forEach(matchedword => {
                            categories.forEach(category => {
                                if (record[category] === matchedword) {
                                    var md = domainMatchCatCount[domain] = domainMatchCatCount[domain] || {};
                                    var mdc = md[matchedword] = md[matchedword] || {};
                                    increment(mdc, category);
                                }
                            });
                        });
                    });
                });
            }
        })).then((a) => {
            debuglog(() => 'terminal processing ' + res);
            debuglog(() => JSON.stringify(domainMatchCatCount, undefined, 2));
            debuglog(() => JSON.stringify(domainRecordCount, undefined, 2));
            var domains = sortedKeys(domainMatchCatCount);
            var resNext = '"' + fact + '" has a meaning in ';
            var single = false;
            if (Object.keys(domainMatchCatCount).length > 1) {
                resNext += '' + domains.length +
                    ' domains: ' + Utils.listToQuotedCommaAnd(domains) + "";
            }
            else if (domains.length === 1) {
                if (!filterdomain) {
                    resNext += `one `;
                }
                resNext += `domain "${domains[0]}":`;
                single = true;
            }
            else {
                if (res) {
                    return res;
                }
                var factclean = Utils.stripQuotes(fact);
                if (filterdomain) {
                    return `"${factclean}" is no known fact in domain "${filterdomain}".\n`;
                }
                return `I don't know anything about "${factclean}".\n`;
            }
            res += resNext + "\n"; // ...\n";
            domains.forEach(function (domain) {
                var md = domainMatchCatCount[domain];
                Object.keys(md).forEach(matchedstring => {
                    var mdc = md[matchedstring];
                    if (!single) {
                        res += 'in domain "' + domain + '" ';
                    }
                    var catsingle = Object.keys(mdc).length === 1;
                    res += `${sloppyOrExact(matchedstring, fact, theModel)} `;
                    if (!catsingle) {
                        res += `...\n`;
                    }
                    Object.keys(mdc).forEach(category => {
                        debuglog(() => ` percent : ${mdc[category]} of ${domainRecordCount[domain]} `);
                        var percent = toPercent(mdc[category], domainRecordCount[domain]);
                        res += `is a value for category "${category}" present in ${mdc[category]}(${percent}%) of records;\n`;
                    });
                });
            });
            return res;
        });
    });
}
exports.describeFactInDomain = describeFactInDomain;
function describeCategory(category, filterDomain, model, message) {
    var doms = mgnlq_model_1.Model.getDomainsForCategory(model, category);
    function getPromiseArr() {
        var res = [];
        if (filterDomain) {
            if (doms.indexOf(filterDomain) >= 0) {
                res.push(describeCategoryInDomain(category, filterDomain, model));
                return res;
            }
            else {
                return [];
            }
        }
        doms.sort();
        doms.forEach(function (domain) {
            res.push(describeCategoryInDomain(category, domain, model));
        });
        return res;
    }
    var resPromiseArr = getPromiseArr();
    return global.Promise.all(resPromiseArr).then((resArr) => resArr);
}
exports.describeCategory = describeCategory;

//# sourceMappingURL=describe.js.map
