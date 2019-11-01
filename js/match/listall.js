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
const _ = require("lodash");
//const perflog = logger.perf("perflistall");
const Utils = require("abot_utils");
//import * as Match from './match';
//import * as Toolmatcher from './toolmatcher';
const mgnlq_model_1 = require("mgnlq_model");
const mgnlq_parser1_1 = require("mgnlq_parser1");
const Operator = require("./operator");
const WhatIs = require("./whatis");
const mgnlq_parser1_2 = require("mgnlq_parser1");
const mgnlq_model_2 = require("mgnlq_model");
const MongoQueries = require("./mongoqueries");
function projectResultToStringArray(answer, result) {
    return answer.columns.map(c => '' + result[c]);
}
exports.projectResultToStringArray = projectResultToStringArray;
function projectResultsToStringArray(answer) {
    return answer.results.map(rec => projectResultToStringArray(answer, rec)); /*answer.columns.map( c =>
      { //console.log('here ' + JSON.stringify(res));
        return ('' + res[c]); }
    ));
    */
}
exports.projectResultsToStringArray = projectResultsToStringArray;
function projectFullResultsToFlatStringArray(answers) {
    return answers.reduce((prev, result) => {
        prev = prev.concat(projectResultsToStringArray(result));
        return prev;
    }, []);
}
exports.projectFullResultsToFlatStringArray = projectFullResultsToFlatStringArray;
var sWords = {};
/*
export function matchRecordHavingCategory(category: string, records: Array<IMatch.IRecord>)
  : Array<IMatch.IRecord> {
  debuglog(debuglog.enabled ? JSON.stringify(records, undefined, 2) : "-");
  var relevantRecords = records.filter(function (record: IMatch.IRecord) {
    return (record[category] !== undefined) && (record[category] !== null);
  });
  var res = [];
  debuglog("relevant records nr:" + relevantRecords.length);
  return relevantRecords;
}
*/
function analyzeContextString(contextQueryString, rules) {
    return WhatIs.analyzeContextString(contextQueryString, rules);
}
exports.analyzeContextString = analyzeContextString;
// const result = WhatIs.resolveCategory(cat, a1.entity,
//   theModel.mRules, theModel.tools, theModel.records);
function listAllWithContext(category, contextQueryString, theModel, domainCategoryFilter) {
    return listAllTupelWithContext([category], contextQueryString, theModel, domainCategoryFilter);
    /*.then(
      (res) => {
        var answers = res.tupelanswers.map(function (o): IMatch.IWhatIsAnswer {
          return {
            sentence: o.sentence,
            record: o.record,
            category: o.categories[0],
            result: o.result[0],
            _ranking: o._ranking
          };
        }
        );
        return {
          sentences: res.sentences,
          errors: res.errors,
          tokens: res.tokens,
          answers: answers
        };
      })
      */
}
exports.listAllWithContext = listAllWithContext;
function listAllShowMe(query, theModel) {
    return MongoQueries.listShowMe(query, theModel);
}
exports.listAllShowMe = listAllShowMe;
/**
 * analyze results of a query,
 *
 * Resorting results
 *
 * -> split by domains
 * -> order by significance of sentence, dropping "lees relevant" (e.g. metamodel) answers
 * -> prune
 */
function sortAnwsersByDomains() {
}
exports.sortAnwsersByDomains = sortAnwsersByDomains;
//
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
/*
export function filterStringListByOp(operator: IMatch.IOperator, fragment: string, srcarr: string[]): string[] {
  var fragmentLC = BreakDown.trimQuotedSpaced(fragment.toLowerCase());
  return srcarr.filter(function (str) {
    return Operator.matches(operator, fragmentLC, str.toLowerCase());
  }).sort();
}
*/
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
/*
export function joinDistinct(category: string, records: Array<IMatch.IRecord>): string {
  var res = records.reduce(function (prev, oRecord) {
    prev[oRecord[category]] = 1;
    return prev;
  }, {} as any);
  return joinSortedQuoted(Object.keys(res));
}
*/
function formatDistinctFromWhatIfResult(answers) {
    var strs = projectFullResultsToFlatStringArray(answers);
    var resFirst = strs.map(r => r[0]);
    return joinSortedQuoted(resFirst); /*projectResultsToStringArray(answers) answers.map(function (oAnswer) {
      return oAnswer.result;
    }));*/
}
exports.formatDistinctFromWhatIfResult = formatDistinctFromWhatIfResult;
function flattenErrors(results) {
    debuglog('flatten errors');
    return results.reduce((prev, rec) => {
        if ((rec.errors !== undefined) && (rec.errors !== false)
            && (!_.isArray(rec.errors) || rec.errors.length > 0)) {
            prev.push(rec.errors);
        }
        return prev;
    }, []);
}
exports.flattenErrors = flattenErrors;
function flattenComplete(r) {
    var res = [];
    r.forEach(mem => {
        if (_.isArray(mem)) {
            res = res.concat(mem);
        }
        else {
            res.push(mem);
        }
    });
    return res;
}
exports.flattenComplete = flattenComplete;
/**
 * return undefined if resutls is not only erroneous
 * @param results
 */
function returnErrorTextIfOnlyError(results) {
    var errors = flattenErrors(results);
    debuglog(() => 'here flattened errors ' + errors.length + '/' + results.length);
    if (errors.length === results.length) {
        var listOfErrors = flattenComplete(errors);
        var r = mgnlq_parser1_2.ErError.explainError(listOfErrors);
        debuglog(() => 'here explain ' + r);
        return r;
    }
    return undefined;
    /*
    if (results.length === 0) {
      debuglog(() => ` no answers: ${JSON.stringify(results, undefined, 2)}`);
      if (errors.length > 0) {
        if ((errors as any[]).filter(err => (err === false)).length > 0) {
          debuglog('valid result')
          return undefined; // at least one query was ok
        }
        debuglog(() => ` errors:  ${JSON.stringify(errors, undefined, 2)}`);
        if (errors.length) {
          return ErError.explainError(errors); //[0].text
        }
      }
    }
    return undefined;
    */
}
exports.returnErrorTextIfOnlyError = returnErrorTextIfOnlyError;
function flattenToStringArray(results) {
    // TODO SPLIT BY DOMAIN
    var res = [];
    var cnt = results.reduce(function (prev, result) {
        if (true) { // TODO result._ranking === results[0]._ranking) {
            var arrs = projectResultsToStringArray(result);
            res = res.concat(arrs);
        }
        return prev;
    }, 0);
    return res;
}
exports.flattenToStringArray = flattenToStringArray;
function joinResultsFilterDuplicates(answers) {
    var res = [];
    var seen = []; // serialized index
    var cnt = answers.reduce(function (prev, result) {
        if (true) { // TODO result._ranking === results[0]._ranking) {
            var arrs = projectResultsToStringArray(result);
            var cntlen = arrs.reduce((prev, row) => {
                var value = Utils.listToQuotedCommaAnd(row); //projectResultToStringArray(result, result));
                if (seen.indexOf(value) < 0) {
                    seen.push(value);
                    res.push(row);
                }
                return prev + 1;
            }, 0);
        }
        return prev;
    }, 0);
    return res;
}
exports.joinResultsFilterDuplicates = joinResultsFilterDuplicates;
function isOKAnswer(answer) {
    return !(answer.errors) && (answer.domain !== undefined);
}
exports.isOKAnswer = isOKAnswer;
function isNotUndefined(obj) {
    return !(obj === undefined);
}
function isNotEmptyResult(answer) {
    return (answer.results.length > 0);
}
/**
 *
 * @param answers
 * @return {string[]} an array of strings
 */
function getDistinctOKDomains(answers) {
    return _.uniq(answers.filter(isOKAnswer).map(r => r.domain).filter(isNotUndefined));
}
exports.getDistinctOKDomains = getDistinctOKDomains;
function hasOKAnswer(answers) {
    return getDistinctOKDomains(answers).length > 0;
}
exports.hasOKAnswer = hasOKAnswer;
function hasError(answers) {
    return !answers.every(isOKAnswer);
}
exports.hasError = hasError;
function hasEmptyResult(answers) {
    return !answers.every(answer => {
        if (answer.results.length <= 0) {
            //console.log('here empty' + JSON.stringify(answer));
        }
        return (answer.results.length > 0);
    });
}
exports.hasEmptyResult = hasEmptyResult;
/**
 *
 * @param answers
 */
function getOKIfDistinctOKDomains(answers) {
    return _.uniq(answers.filter(isOKAnswer).map(r => r.domain).filter(isNotUndefined));
}
exports.getOKIfDistinctOKDomains = getOKIfDistinctOKDomains;
function removeErrorsIfOKAnswers(answers) {
    if (hasOKAnswer(answers)) {
        return answers.filter(isOKAnswer);
    }
    return answers;
}
exports.removeErrorsIfOKAnswers = removeErrorsIfOKAnswers;
function removeEmptyResults(answers) {
    if (hasOKAnswer(answers)) {
        return answers.filter(isNotEmptyResult);
    }
    return answers;
}
exports.removeEmptyResults = removeEmptyResults;
function removeMetamodelResultIfOthers(answers) {
    if (hasError(answers)) {
        throw Error('remove errors before');
    }
    if (hasEmptyResult(answers)) {
        throw Error('run removeEmptyResults before');
    }
    var domains = getDistinctOKDomains(answers);
    if ((domains.length > 1) && domains.indexOf('metamodel') > 0) {
        return answers.filter(a => (a.domain !== 'metamodel'));
    }
    return answers;
}
exports.removeMetamodelResultIfOthers = removeMetamodelResultIfOthers;
function isSignificantWord(word) {
    return word.rule.wordType === 'F'
        || word.rule.wordType === 'C';
}
exports.isSignificantWord = isSignificantWord;
function isSignificantDifference(actualword, matchedWord) {
    var lca = actualword.toLowerCase();
    var lcm = matchedWord.toLowerCase();
    if (lca === lcm) {
        return false;
    }
    if (lca + 's' === lcm) {
        return false;
    }
    if (lca === lcm + 's') {
        return false;
    }
    return true;
}
exports.isSignificantDifference = isSignificantDifference;
function getQueryString(answ) {
    var words = [];
    debuglog(() => 'here tokens:' + answ.aux.tokens);
    debuglog(() => JSON.stringify(answ.aux.sentence, undefined, 2));
    debuglog(() => ' ' + mgnlq_parser1_1.Sentence.dumpNiceRuled(answ.aux.sentence));
    answ.aux.sentence.forEach((word, index) => {
        var word = answ.aux.sentence[index];
        words.push(word.string);
        if (isSignificantWord(word))
            if (isSignificantDifference(word.matchedString, word.string)) {
                words.push("(\"" + word.rule.matchedString + "\")");
            }
    });
    return words.join(" ");
}
exports.getQueryString = getQueryString;
;
function cmpDomainSentenceRanking(a, b) {
    var r = a.domain.localeCompare(b.domain);
    if (r) {
        return r;
    }
    var ca = mgnlq_parser1_1.Sentence.rankingGeometricMean(a.aux.sentence);
    var cb = mgnlq_parser1_1.Sentence.rankingGeometricMean(b.aux.sentence);
    return cb - ca;
}
exports.cmpDomainSentenceRanking = cmpDomainSentenceRanking;
function retainOnlyTopRankedPerDomain(answers) {
    var domains = getDistinctOKDomains(answers);
    /* domains.sort();
    / answers.forEach( (answer, index) =>  {
       console.log(Sentence.rankingGeometricMean(answer.aux.sentence));
     });
     */
    answers.sort(cmpDomainSentenceRanking);
    return answers.filter((entry, index, arr) => {
        if ((index === 0) || (entry.domain !== arr[index - 1].domain)) {
            return true;
        }
        var prev = arr[index - 1];
        var rank_prev = mgnlq_parser1_1.Sentence.rankingGeometricMean(prev.aux.sentence);
        var rank = mgnlq_parser1_1.Sentence.rankingGeometricMean(entry.aux.sentence);
        if (!WhatIs.safeEqual(rank, rank_prev)) {
            debuglog(() => `dropping ${index} ${mgnlq_parser1_1.Sentence.dumpNiceRuled(entry.aux.sentence)} `);
        }
        return false;
    });
}
exports.retainOnlyTopRankedPerDomain = retainOnlyTopRankedPerDomain;
function resultAsListString(answers) {
    var nonerror = removeErrorsIfOKAnswers(answers);
    var nonempty = removeEmptyResults(nonerror);
    var filteredNoMM = removeMetamodelResultIfOthers(nonempty);
    var filtered = retainOnlyTopRankedPerDomain(filteredNoMM);
    var domains = getDistinctOKDomains(filtered);
    domains.sort();
    var res = '';
    if (domains.length > 1) {
        res = "The query has answers in more than one domain:\n";
    }
    res += domains.map(dom => {
        var answersForDomain = answers.filter(a => (a.domain === dom));
        return answersForDomain.map(answ => {
            var localres = '';
            var querystr = getQueryString(answ);
            var answerN = joinResultsTupel([answ]).join("\n");
            localres += querystr;
            if (domains.length > 1) {
                localres += " in domain \"" + dom + "\"...\n";
            }
            else {
                localres += "\n...";
            }
            localres += joinResultsTupel([answ]).join("\n") + "\n";
            return localres;
        }).join("\n");
    }).join("\n");
    return res;
}
exports.resultAsListString = resultAsListString;
/**
 * TODO
 * @param results
 */
function joinResultsTupel(results) {
    // TODO SPLIT BY DOMAIN
    var res = [];
    var cnt = results.reduce(function (prev, result) {
        if (true) { // TODO result._ranking === results[0]._ranking) {
            var arrs = projectResultsToStringArray(result);
            var cntlen = arrs.reduce((prev, row) => {
                var value = Utils.listToQuotedCommaAnd(row); //projectResultToStringArray(result, result));
                if (res.indexOf(value) < 0) {
                    res.push(value);
                }
                return prev + 1;
            }, 0);
        }
        return prev;
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
