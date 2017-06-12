"use strict";
/**
 *
 * @module jfseb.fdevstart.analyze
 * @file analyze.ts
 * @copyright (c) 2016 Gerd Forstmann
 */
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debugf");
const debuglog = debug('listall');
const logger = require("../utils/logger");
var logPerf = logger.perf("perflistall");
var perflog = debug('perf');
//const perflog = logger.perf("perflistall");
const Utils = require("abot_utils");
const mgnlq_model_1 = require("mgnlq_model");
const Operator = require("./operator");
const WhatIs = require("./whatis");
const mgnlq_er_1 = require("mgnlq_er");
const mgnlq_model_2 = require("mgnlq_model");
const MongoQueries = require("./mongoqueries");
var sWords = {};
function matchRecordHavingCategory(category, records) {
    debuglog(debuglog.enabled ? JSON.stringify(records, undefined, 2) : "-");
    var relevantRecords = records.filter(function (record) {
        return (record[category] !== undefined) && (record[category] !== null);
    });
    var res = [];
    debuglog("relevant records nr:" + relevantRecords.length);
    return relevantRecords;
}
exports.matchRecordHavingCategory = matchRecordHavingCategory;
function analyzeContextString(contextQueryString, rules) {
    return WhatIs.analyzeContextString(contextQueryString, rules);
}
exports.analyzeContextString = analyzeContextString;
// const result = WhatIs.resolveCategory(cat, a1.entity,
//   theModel.mRules, theModel.tools, theModel.records);
function listAllWithContext(category, contextQueryString, theModel, domainCategoryFilter) {
    return listAllTupelWithContext([category], contextQueryString, theModel, domainCategoryFilter).then((res) => {
        var answers = res.tupelanswers.map(function (o) {
            return {
                sentence: o.sentence,
                record: o.record,
                category: o.categories[0],
                result: o.result[0],
                _ranking: o._ranking
            };
        });
        return {
            sentences: res.sentences,
            errors: res.errors,
            tokens: res.tokens,
            answers: answers
        };
    });
}
exports.listAllWithContext = listAllWithContext;
/*
export function listAllWithCategory(category: string, theModel: IMatch.IModels): Array<IMatch.IRecord> {
  var matchedAnswers = matchRecordHavingCategory(category, theModel); //aTool: Array<IMatch.ITool>): any / * objectstream* / {
  debuglog(" listAllWithCategory:" + JSON.stringify(matchedAnswers, undefined, 2));
  return matchedAnswers;
}
*/
function listAllTupelWithContext(categories, contextQueryString, theModel, domainCategoryFilter) {
    var query = categories.join(" ") + " with " + contextQueryString;
    if (!contextQueryString) {
        throw new Error('assumed contextQueryString passed');
    }
    return MongoQueries.listAll(query, theModel);
    /*
  
      if (contextQueryString.length === 0) {
        return {
          tupelanswers : [],
          errors : [ErError.makeError_EMPTY_INPUT()] ,
          tokens :[],
        };
      } else {
  
        logPerf('listAllWithContext');
        perflog("totalListAllWithContext");
        var aSentencesReinforced = analyzeContextString(contextQueryString, aRules);
        perflog("LATWC matching records (s=" + aSentencesReinforced.sentences.length + ")...");
        var matchedAnswers = WhatIs.matchRecordsQuickMultipleCategories(aSentencesReinforced, categories, records, domainCategoryFilter); //aTool: Array<IMatch.ITool>): any / * objectstream* / {
        if(debuglog.enabled){
          debuglog(" matched Answers" + JSON.stringify(matchedAnswers, undefined, 2));
        }
        perflog("filtering topRanked (a=" + matchedAnswers.tupelanswers.length + ")...");
        var matchedFiltered = WhatIs.filterOnlyTopRankedTupel(matchedAnswers.tupelanswers);
        if (debuglog.enabled) {
          debuglog("LATWC matched top-ranked Answers" + JSON.stringify(matchedFiltered, undefined, 2));
        }
        perflog("totalListAllWithContext (a=" + matchedFiltered.length + ")");
        logPerf('listAllWithContext');
        return {
          tupelanswers : matchedFiltered, // ??? Answers;
          errors : aSentencesReinforced.errors,
          tokens: aSentencesReinforced.tokens
        }
      }
      */
}
exports.listAllTupelWithContext = listAllTupelWithContext;
function filterStringListByOp(operator, fragment, srcarr) {
    var fragmentLC = mgnlq_model_1.BreakDown.trimQuotedSpaced(fragment.toLowerCase());
    return srcarr.filter(function (str) {
        return Operator.matches(operator, fragmentLC, str.toLowerCase());
    }).sort();
}
exports.filterStringListByOp = filterStringListByOp;
function compareCaseInsensitive(a, b) {
    var r = a.toLowerCase().localeCompare(b.toLowerCase());
    if (r) {
        return r;
    }
    return -a.localeCompare(b);
}
/**
 * Sort string list case insensitive, then remove duplicates retaining
 * "largest" match
 */
function removeCaseDuplicates(arr) {
    arr.sort(compareCaseInsensitive);
    debuglog('sorted arr' + JSON.stringify(arr));
    return arr.filter(function (s, index) {
        return index === 0 || (0 !== arr[index - 1].toLowerCase().localeCompare(s.toLowerCase()));
    });
}
exports.removeCaseDuplicates = removeCaseDuplicates;
;
function getCategoryOpFilterAsDistinctStrings(operator, fragment, category, records, filterDomain) {
    var fragmentLC = mgnlq_model_1.BreakDown.trimQuoted(fragment.toLowerCase());
    var res = [];
    var seen = {};
    records.forEach(function (record) {
        if (filterDomain && record['_domain'] !== filterDomain) {
            return;
        }
        if (record[category] && Operator.matches(operator, fragmentLC, record[category].toLowerCase())) {
            if (!seen[record[category]]) {
                seen[record[category]] = true;
                res.push(record[category]);
            }
        }
    });
    return removeCaseDuplicates(res);
}
exports.getCategoryOpFilterAsDistinctStrings = getCategoryOpFilterAsDistinctStrings;
;
function likelyPluralDiff(a, pluralOfa) {
    var aLC = mgnlq_model_1.BreakDown.trimQuoted(a.toLowerCase()) || "";
    var pluralOfALC = mgnlq_model_1.BreakDown.trimQuoted((pluralOfa || "").toLowerCase()) || "";
    if (aLC === pluralOfALC) {
        return true;
    }
    if (aLC + 's' === pluralOfALC) {
        return true;
    }
    return false;
}
exports.likelyPluralDiff = likelyPluralDiff;
;
function joinSortedQuoted(strings) {
    if (strings.length === 0) {
        return "";
    }
    return '"' + strings.sort().join('"; "') + '"';
}
exports.joinSortedQuoted = joinSortedQuoted;
function joinDistinct(category, records) {
    var res = records.reduce(function (prev, oRecord) {
        prev[oRecord[category]] = 1;
        return prev;
    }, {});
    return joinSortedQuoted(Object.keys(res));
}
exports.joinDistinct = joinDistinct;
function formatDistinctFromWhatIfResult(answers) {
    return joinSortedQuoted(answers.map(function (oAnswer) {
        return oAnswer.result;
    }));
}
exports.formatDistinctFromWhatIfResult = formatDistinctFromWhatIfResult;
function joinResults(results) {
    var res = [];
    var cnt = results.reduce(function (prev, result) {
        if (result._ranking === results[0]._ranking) {
            if (res.indexOf(result.result) < 0) {
                res.push(result.result);
            }
            return prev + 1;
        }
    }, 0);
    return res;
}
exports.joinResults = joinResults;
/**
 * return undefined if resutls is not only erroneous
 * @param results
 */
function returnErrorTextIfOnlyError(results) {
    if (results.tupelanswers.length === 0) {
        debuglog(() => ` no answers: ${JSON.stringify(results, undefined, 2)}`);
        if (results.errors.length > 0) {
            if (results.errors.filter(err => (err === false)).length > 0) {
                debuglog('valid result');
                return undefined; // at least one query was ok
            }
            debuglog(() => ` errors:  ${JSON.stringify(results.errors, undefined, 2)}`);
            if (results.errors[0]) {
                return mgnlq_er_1.ErError.explainError(results.errors); //[0].text
            }
        }
    }
    return undefined;
}
exports.returnErrorTextIfOnlyError = returnErrorTextIfOnlyError;
function joinResultsTupel(results) {
    var res = [];
    var cnt = results.reduce(function (prev, result) {
        if (result._ranking === results[0]._ranking) {
            var value = Utils.listToQuotedCommaAnd(result.result);
            if (res.indexOf(value) < 0) {
                res.push(value);
            }
            return prev + 1;
        }
    }, 0);
    return res;
}
exports.joinResultsTupel = joinResultsTupel;
function inferDomain(theModel, contextQueryString) {
    // console.log("here the string" + contextQueryString);
    //  console.log("here the rules" + JSON.stringify(theModel.mRules));
    var res = analyzeContextString(contextQueryString, theModel.rules);
    debuglog(() => JSON.stringify(res, undefined, 2));
    // run through the string, search for a category
    if (!res.sentences.length) {
        return undefined;
    }
    var domains = [];
    //console.log(Sentence.dumpNiceArr(res));
    // do we have a domain ?
    res.sentences[0].forEach(function (oWordGroup) {
        if (oWordGroup.category === "domain") {
            domains.push(oWordGroup.matchedString);
        }
    });
    if (domains.length === 1) {
        debuglog("got a precise domain " + domains[0]);
        return domains[0];
    }
    if (domains.length > 0) {
        debuglog(debuglog.enabled ? ("got more than one domain, confused  " + domains.join("\n")) : '-');
        return undefined;
        // TODOD
    }
    debuglog("attempting to determine categories");
    // try a category reverse map
    res.sentences[0].forEach(function (oWordGroup) {
        if (oWordGroup.category === "category") {
            var sCat = oWordGroup.matchedString;
            var doms = mgnlq_model_2.Model.getDomainsForCategory(theModel, sCat);
            doms.forEach(function (sDom) {
                if (domains.indexOf(sDom) < 0) {
                    domains.push(sDom);
                }
            });
        }
    });
    if (domains.length === 1) {
        debuglog("got a precise domain " + domains[0]);
        return domains[0];
    }
    debuglog(debuglog.enabled ? ("got more than one domain, confused  " + domains.join("\n")) : '-');
    return undefined;
}
exports.inferDomain = inferDomain;
;

//# sourceMappingURL=listall.js.map
