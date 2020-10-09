"use strict";
/**
 *
 * @module jfseb.fdevstart.analyze
 * @file analyze.ts
 * @copyright (c) 2016 Gerd Forstmann
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferDomain = exports.joinResultsTupel = exports.resultAsListString = exports.retainOnlyTopRankedPerDomain = exports.cmpDomainSentenceRanking = exports.getQueryString = exports.isSignificantDifference = exports.isSignificantWord = exports.removeMetamodelResultIfOthers = exports.removeEmptyResults = exports.removeErrorsIfOKAnswers = exports.getOKIfDistinctOKDomains = exports.hasEmptyResult = exports.hasError = exports.hasOKAnswer = exports.getDistinctOKDomains = exports.isOKAnswer = exports.joinResultsFilterDuplicates = exports.flattenToStringArray = exports.returnErrorTextIfOnlyError = exports.flattenComplete = exports.flattenErrors = exports.formatDistinctFromWhatIfResult = exports.joinSortedQuoted = exports.likelyPluralDiff = exports.getCategoryOpFilterAsDistinctStrings = exports.removeCaseDuplicates = exports.listAllTupelWithContext = exports.sortAnwsersByDomains = exports.listAllShowMe = exports.listAllWithContext = exports.analyzeContextString = exports.projectFullResultsToFlatStringArray = exports.projectResultsToStringArray = exports.projectResultToStringArray = void 0;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXRjaC9saXN0YWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7R0FLRzs7O0FBR0gsZ0NBQWdDO0FBRWhDLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNsQywwQ0FBMEM7QUFDMUMsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN6QyxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUIsNEJBQTRCO0FBQzVCLDZDQUE2QztBQUU3QyxvQ0FBb0M7QUFFcEMsbUNBQW1DO0FBRW5DLCtDQUErQztBQUMvQyw2Q0FBd0M7QUFDeEMsaURBQXFEO0FBRXJELHVDQUF1QztBQUN2QyxtQ0FBbUM7QUFDbkMsaURBQW1EO0FBQ25ELDZDQUFvQztBQUNwQywrQ0FBK0M7QUFHL0MsU0FBZ0IsMEJBQTBCLENBQUUsTUFBa0MsRUFBRSxNQUE2QjtJQUMzRyxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xELENBQUM7QUFGRCxnRUFFQztBQUVELFNBQWdCLDJCQUEyQixDQUFFLE1BQWtDO0lBQzdFLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFFLENBQUMsQ0FBQyxDQUFDOzs7O01BSTNFO0FBQ0osQ0FBQztBQU5ELGtFQU1DO0FBRUQsU0FBZ0IsbUNBQW1DLENBQUUsT0FBcUM7SUFDeEYsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFFLENBQUMsSUFBSSxFQUFDLE1BQU0sRUFBRSxFQUFFO1FBQ3JDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLDJCQUEyQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDeEQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDLEVBQUcsRUFBRSxDQUFDLENBQUM7QUFDVixDQUFDO0FBTEQsa0ZBS0M7QUFHRCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDaEI7Ozs7Ozs7Ozs7O0VBV0U7QUFHRixTQUFnQixvQkFBb0IsQ0FBQyxrQkFBMEIsRUFBRSxLQUF3QjtJQUN2RixPQUFPLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNoRSxDQUFDO0FBRkQsb0RBRUM7QUFFRCx3REFBd0Q7QUFDeEQsd0RBQXdEO0FBR3hELFNBQWdCLGtCQUFrQixDQUFDLFFBQWdCLEVBQUUsa0JBQTBCLEVBQzdFLFFBQXdCLEVBQUUsb0JBQW1EO0lBQzdFLE9BQU8sdUJBQXVCLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztJQUMvRjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQW1CSTtBQUNOLENBQUM7QUF2QkQsZ0RBdUJDO0FBWUQsU0FBZ0IsYUFBYSxDQUFDLEtBQWMsRUFBRSxRQUF5QjtJQUNyRSxPQUFPLFlBQVksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ2xELENBQUM7QUFGRCxzQ0FFQztBQUdEOzs7Ozs7OztHQVFHO0FBRUgsU0FBZ0Isb0JBQW9CO0FBR25DLENBQUM7QUFIRixvREFHRTtBQUNGLEVBQUU7QUFJRixTQUFnQix1QkFBdUIsQ0FBQyxVQUFvQixFQUFFLGtCQUEwQixFQUN0RixRQUF3QixFQUFFLG9CQUFtRDtJQUU3RSxJQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsR0FBRyxrQkFBa0IsQ0FBQztJQUNqRSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7UUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0tBQ3REO0lBQ0QsT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQStCSTtBQUNOLENBQUM7QUF4Q0QsMERBd0NDO0FBRUQ7Ozs7Ozs7RUFPRTtBQUVGLFNBQVMsc0JBQXNCLENBQUMsQ0FBUyxFQUFFLENBQVM7SUFDbEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUN2RCxJQUFJLENBQUMsRUFBRTtRQUNMLE9BQU8sQ0FBQyxDQUFDO0tBQ1Y7SUFDRCxPQUFPLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QixDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBZ0Isb0JBQW9CLENBQUMsR0FBYTtJQUNoRCxHQUFHLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDakMsUUFBUSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDN0MsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEtBQUs7UUFDbEMsT0FBTyxLQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDNUYsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBTkQsb0RBTUM7QUFBQSxDQUFDO0FBRUYsU0FBZ0Isb0NBQW9DLENBQUMsUUFBMEIsRUFBRSxRQUFnQixFQUMvRixRQUFnQixFQUFFLE9BQThCLEVBQUUsWUFBcUI7SUFDdkUsSUFBSSxVQUFVLEdBQUcsdUJBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDOUQsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2IsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ2QsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLE1BQU07UUFDOUIsSUFBSSxZQUFZLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLFlBQVksRUFBRTtZQUN0RCxPQUFPO1NBQ1I7UUFDRCxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUU7WUFDOUYsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRTtnQkFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDOUIsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzthQUM1QjtTQUNGO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFqQkQsb0ZBaUJDO0FBQUEsQ0FBQztBQUVGLFNBQWdCLGdCQUFnQixDQUFDLENBQVMsRUFBRSxTQUFpQjtJQUMzRCxJQUFJLEdBQUcsR0FBRyx1QkFBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdEQsSUFBSSxXQUFXLEdBQUcsdUJBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDOUUsSUFBSSxHQUFHLEtBQUssV0FBVyxFQUFFO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFDRCxJQUFJLEdBQUcsR0FBRyxHQUFHLEtBQUssV0FBVyxFQUFFO1FBQzdCLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFWRCw0Q0FVQztBQUFBLENBQUM7QUFFRixTQUFnQixnQkFBZ0IsQ0FBQyxPQUFpQjtJQUNoRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ3hCLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFDRCxPQUFPLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNqRCxDQUFDO0FBTEQsNENBS0M7QUFFRDs7Ozs7Ozs7RUFRRTtBQUVGLFNBQWdCLDhCQUE4QixDQUFDLE9BQXlDO0lBQ3RGLElBQUksSUFBSSxHQUFHLG1DQUFtQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVuQyxPQUFPLGdCQUFnQixDQUFFLFFBQVEsQ0FBRSxDQUFDLENBQUM7O1VBRS9CO0FBQ1IsQ0FBQztBQVBELHdFQU9DO0FBSUQsU0FBZ0IsYUFBYSxDQUFDLE9BQTRDO0lBQ3hFLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzNCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBRSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxLQUFLLENBQUM7ZUFDNUYsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQ3BELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQUU7UUFDMUIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDVCxDQUFDO0FBUEQsc0NBT0M7QUFFRCxTQUFnQixlQUFlLENBQUMsQ0FBUztJQUN2QyxJQUFJLEdBQUcsR0FBRSxFQUFFLENBQUM7SUFDWixDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQUcsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3JDLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3ZCO2FBQU07WUFDTCxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2Y7SUFBQSxDQUFDLENBQUMsQ0FBQztJQUNMLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQVJELDBDQVFDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBZ0IsMEJBQTBCLENBQUMsT0FBNEM7SUFDckYsSUFBSSxNQUFNLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3BDLFFBQVEsQ0FBQyxHQUFFLEVBQUUsQ0FBQSx3QkFBd0IsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUUsSUFBRyxNQUFNLENBQUMsTUFBTSxLQUFLLE9BQU8sQ0FBQyxNQUFNLEVBQUU7UUFDbkMsSUFBSSxZQUFZLEdBQUcsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxHQUFHLHVCQUFPLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzNDLFFBQVEsQ0FBQyxHQUFFLEVBQUUsQ0FBQSxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbEMsT0FBTyxDQUFDLENBQUM7S0FDVjtJQUNELE9BQU8sU0FBUyxDQUFDO0lBQ2pCOzs7Ozs7Ozs7Ozs7Ozs7TUFlRTtBQUNKLENBQUM7QUExQkQsZ0VBMEJDO0FBRUQsU0FBZ0Isb0JBQW9CLENBQUMsT0FBeUM7SUFDNUUsdUJBQXVCO0lBQ3ZCLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNiLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLEVBQUUsTUFBTTtRQUM3QyxJQUFJLElBQUksRUFBRSxFQUFFLGtEQUFrRDtZQUM1RCxJQUFJLElBQUksR0FBRywyQkFBMkIsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMvQyxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN4QjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ04sT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBWEQsb0RBV0M7QUFFRCxTQUFnQiwyQkFBMkIsQ0FBQyxPQUF5QztJQUNuRixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDYixJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxtQkFBbUI7SUFDbEMsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLElBQUksRUFBRSxNQUFNO1FBQzdDLElBQUksSUFBSSxFQUFFLEVBQUUsa0RBQWtEO1lBQzVELElBQUksSUFBSSxHQUFHLDJCQUEyQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQy9DLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUUsQ0FBQyxJQUFJLEVBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ3JDLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLDhDQUE4QztnQkFDM0YsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDakIsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDZjtnQkFDRCxPQUFPLElBQUksR0FBRyxDQUFDLENBQUM7WUFBQSxDQUFDLEVBQUcsQ0FBQyxDQUFDLENBQUM7U0FDMUI7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNOLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQWpCRCxrRUFpQkM7QUFFRCxTQUFnQixVQUFVLENBQUMsTUFBNEI7SUFDckQsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUMsQ0FBQztBQUMzRCxDQUFDO0FBRkQsZ0NBRUM7QUFDRCxTQUFTLGNBQWMsQ0FBQyxHQUFTO0lBQy9CLE9BQU8sQ0FBQyxDQUFDLEdBQUcsS0FBSyxTQUFTLENBQUMsQ0FBQztBQUM5QixDQUFDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxNQUE0QjtJQUNwRCxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDcEMsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixvQkFBb0IsQ0FBQyxPQUErQjtJQUNsRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7QUFDdEYsQ0FBQztBQUZELG9EQUVDO0FBRUQsU0FBZ0IsV0FBVyxDQUFDLE9BQThCO0lBQ3hELE9BQU8sb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBRTtBQUNuRCxDQUFDO0FBRkQsa0NBRUM7QUFFRCxTQUFnQixRQUFRLENBQUMsT0FBOEI7SUFDckQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsQ0FBQztBQUZELDRCQUVDO0FBRUQsU0FBZ0IsY0FBYyxDQUFDLE9BQThCO0lBQzNELE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBRTdCLElBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQzdCLHFEQUFxRDtTQUN0RDtRQUNELE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNyQyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFSRCx3Q0FRQztBQUdEOzs7R0FHRztBQUNILFNBQWdCLHdCQUF3QixDQUFDLE9BQStCO0lBQ3RFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztBQUN0RixDQUFDO0FBRkQsNERBRUM7QUFFRCxTQUFnQix1QkFBdUIsQ0FBQyxPQUE2QjtJQUNuRSxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRztRQUN6QixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDbkM7SUFDRCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBTEQsMERBS0M7QUFFRCxTQUFnQixrQkFBa0IsQ0FBQyxPQUE2QjtJQUM5RCxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRztRQUN6QixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztLQUN6QztJQUNELE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUM7QUFMRCxnREFLQztBQUVELFNBQWdCLDZCQUE2QixDQUFDLE9BQThCO0lBQzFFLElBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3BCLE1BQU0sS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7S0FDckM7SUFDRCxJQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUMxQixNQUFNLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0tBQzlDO0lBQ0QsSUFBSSxPQUFPLEdBQUcsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUc7UUFDN0QsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7S0FDeEQ7SUFDRCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBWkQsc0VBWUM7QUFFRCxTQUFnQixpQkFBaUIsQ0FBQyxJQUFtQjtJQUNuRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxLQUFLLEdBQUc7V0FDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssR0FBRyxDQUFDO0FBQ3BDLENBQUM7QUFIRCw4Q0FHQztBQUVELFNBQWdCLHVCQUF1QixDQUFDLFVBQW1CLEVBQUUsV0FBbUI7SUFDOUUsSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ25DLElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNwQyxJQUFJLEdBQUcsS0FBSyxHQUFHLEVBQUU7UUFDZixPQUFPLEtBQUssQ0FBQztLQUNkO0lBQ0QsSUFBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsRUFBRTtRQUN0QixPQUFPLEtBQUssQ0FBQztLQUNkO0lBQ0QsSUFBSyxHQUFHLEtBQUssR0FBRyxHQUFFLEdBQUcsRUFBRztRQUN0QixPQUFPLEtBQUssQ0FBQztLQUNkO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBYkQsMERBYUM7QUFFRCxTQUFnQixjQUFjLENBQUMsSUFBMEI7SUFDdkQsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ2YsUUFBUSxDQUFDLEdBQUUsRUFBRSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hELFFBQVEsQ0FBQyxHQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFDLFNBQVMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdELFFBQVEsQ0FBQyxHQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsd0JBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQy9ELElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBRSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUN6QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QixJQUFLLGlCQUFpQixDQUFDLElBQUksQ0FBQztZQUM1QixJQUFLLHVCQUF1QixDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFHO2dCQUN4RCxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsQ0FBQzthQUMzRDtJQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLENBQUM7QUFkRCx3Q0FjQztBQUFBLENBQUM7QUFHRixTQUFnQix3QkFBd0IsQ0FBQyxDQUF1QixFQUFFLENBQXVCO0lBQ3ZGLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN6QyxJQUFJLENBQUMsRUFBRTtRQUNMLE9BQU8sQ0FBQyxDQUFDO0tBQ1Y7SUFDRCxJQUFJLEVBQUUsR0FBRyx3QkFBUSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkQsSUFBSSxFQUFFLEdBQUcsd0JBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZELE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNqQixDQUFDO0FBUkQsNERBUUM7QUFFRCxTQUFnQiw0QkFBNEIsQ0FBQyxPQUE4QjtJQUN6RSxJQUFJLE9BQU8sR0FBRyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM3Qzs7OztPQUlHO0lBQ0YsT0FBTyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0lBQ3ZDLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDM0MsSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsSUFBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUM1RCxPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QixJQUFJLFNBQVMsR0FBRyx3QkFBUSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakUsSUFBSSxJQUFJLEdBQUcsd0JBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsRUFBRTtZQUN0QyxRQUFRLENBQUUsR0FBRSxFQUFFLENBQUMsWUFBYSxLQUFNLElBQUssd0JBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUUsR0FBRyxDQUFDLENBQUM7U0FDeEY7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQXBCRCxvRUFvQkM7QUFFRCxTQUFnQixrQkFBa0IsQ0FBQyxPQUE0QjtJQUM3RCxJQUFJLFFBQVEsR0FBRyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNoRCxJQUFJLFFBQVEsR0FBRyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM1QyxJQUFJLFlBQVksR0FBRyw2QkFBNkIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMzRCxJQUFJLFFBQVEsR0FBRyw0QkFBNEIsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMxRCxJQUFJLE9BQU8sR0FBRyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDZixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDYixJQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO1FBQ3RCLEdBQUcsR0FBRyxrREFBa0QsQ0FBQTtLQUN6RDtJQUNELEdBQUcsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3ZCLElBQUksZ0JBQWdCLEdBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2hFLE9BQU8sZ0JBQWdCLENBQUMsR0FBRyxDQUFFLElBQUksQ0FBQyxFQUFFO1lBQ2xDLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUNsQixJQUFJLFFBQVEsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEMsSUFBSSxPQUFPLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsRCxRQUFRLElBQUksUUFBUSxDQUFDO1lBQ3JCLElBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3JCLFFBQVEsSUFBSSxlQUFlLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQzthQUMvQztpQkFBTTtnQkFDTCxRQUFRLElBQUksT0FBTyxDQUFBO2FBQ3BCO1lBQ0QsUUFBUSxJQUFJLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ3ZELE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDZCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUE1QkQsZ0RBNEJDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBZ0IsZ0JBQWdCLENBQUMsT0FBeUM7SUFDeEUsdUJBQXVCO0lBQ3ZCLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNiLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLEVBQUUsTUFBTTtRQUM3QyxJQUFJLElBQUksRUFBRSxFQUFFLGtEQUFrRDtZQUM1RCxJQUFJLElBQUksR0FBRywyQkFBMkIsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMvQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFFLENBQUMsSUFBSSxFQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUNyQyxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyw4Q0FBOEM7Z0JBQzNGLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQzFCLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ2pCO2dCQUNELE9BQU8sSUFBSSxHQUFHLENBQUMsQ0FBQztZQUFBLENBQUMsRUFBRyxDQUFDLENBQUMsQ0FBQztTQUMxQjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ04sT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBaEJELDRDQWdCQztBQUVELFNBQWdCLFdBQVcsQ0FBQyxRQUF3QixFQUFFLGtCQUEwQjtJQUM5RSx1REFBdUQ7SUFDdkQsb0VBQW9FO0lBQ3BFLElBQUksR0FBRyxHQUFHLG9CQUFvQixDQUFDLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuRSxRQUFRLENBQUMsR0FBRSxFQUFFLENBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUMsZ0RBQWdEO0lBQ2hELElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTtRQUN6QixPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUNELElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNqQix5Q0FBeUM7SUFDekMsd0JBQXdCO0lBQ3hCLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsVUFBVTtRQUMzQyxJQUFJLFVBQVUsQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFO1lBQ3BDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1NBQ3ZDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ3hCLFFBQVEsQ0FBQyx1QkFBdUIsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQyxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNuQjtJQUNELElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDdEIsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsc0NBQXNDLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqRyxPQUFPLFNBQVMsQ0FBQztRQUNqQixRQUFRO0tBQ1Q7SUFDRCxRQUFRLENBQUMsb0NBQW9DLENBQUMsQ0FBQTtJQUM5Qyw2QkFBNkI7SUFDN0IsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxVQUFVO1FBQzNDLElBQUksVUFBVSxDQUFDLFFBQVEsS0FBSyxVQUFVLEVBQUU7WUFDdEMsSUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQztZQUNwQyxJQUFJLElBQUksR0FBRyxtQkFBSyxDQUFDLHFCQUFxQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN2RCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSTtnQkFDekIsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDN0IsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDcEI7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ3hCLFFBQVEsQ0FBQyx1QkFBdUIsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQyxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNuQjtJQUNELFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLHNDQUFzQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakcsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQTdDRCxrQ0E2Q0M7QUFBQSxDQUFDIiwiZmlsZSI6Im1hdGNoL2xpc3RhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqXG4gKiBAbW9kdWxlIGpmc2ViLmZkZXZzdGFydC5hbmFseXplXG4gKiBAZmlsZSBhbmFseXplLnRzXG4gKiBAY29weXJpZ2h0IChjKSAyMDE2IEdlcmQgRm9yc3RtYW5uXG4gKi9cblxuaW1wb3J0ICogYXMgQWxnb2wgZnJvbSAnLi9hbGdvbCc7XG5pbXBvcnQgKiBhcyBkZWJ1ZyBmcm9tICdkZWJ1Z2YnO1xuXG5jb25zdCBkZWJ1Z2xvZyA9IGRlYnVnKCdsaXN0YWxsJyk7XG5pbXBvcnQgKiBhcyBsb2dnZXIgZnJvbSAnLi4vdXRpbHMvbG9nZ2VyJztcbnZhciBsb2dQZXJmID0gbG9nZ2VyLnBlcmYoXCJwZXJmbGlzdGFsbFwiKTtcbnZhciBwZXJmbG9nID0gZGVidWcoJ3BlcmYnKTtcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbi8vY29uc3QgcGVyZmxvZyA9IGxvZ2dlci5wZXJmKFwicGVyZmxpc3RhbGxcIik7XG5cbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJ2Fib3RfdXRpbHMnO1xuaW1wb3J0ICogYXMgSU1hdGNoIGZyb20gJy4vaWZtYXRjaCc7XG4vL2ltcG9ydCAqIGFzIE1hdGNoIGZyb20gJy4vbWF0Y2gnO1xuXG4vL2ltcG9ydCAqIGFzIFRvb2xtYXRjaGVyIGZyb20gJy4vdG9vbG1hdGNoZXInO1xuaW1wb3J0IHsgQnJlYWtEb3duIH0gZnJvbSAnbWdubHFfbW9kZWwnO1xuaW1wb3J0IHsgU2VudGVuY2UgYXMgU2VudGVuY2UgfSBmcm9tICdtZ25scV9wYXJzZXIxJztcbmltcG9ydCB7IFdvcmQgYXMgV29yZCB9IGZyb20gJ21nbmxxX3BhcnNlcjEnO1xuaW1wb3J0ICogYXMgT3BlcmF0b3IgZnJvbSAnLi9vcGVyYXRvcic7XG5pbXBvcnQgKiBhcyBXaGF0SXMgZnJvbSAnLi93aGF0aXMnO1xuaW1wb3J0IHsgRXJFcnJvciBhcyBFckVycm9yIH0gZnJvbSAnbWdubHFfcGFyc2VyMSc7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJ21nbmxxX21vZGVsJztcbmltcG9ydCAqIGFzIE1vbmdvUXVlcmllcyBmcm9tICcuL21vbmdvcXVlcmllcyc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHByb2plY3RSZXN1bHRUb1N0cmluZ0FycmF5KCBhbnN3ZXIgOiBJTWF0Y2guSVdoYXRJc1R1cGVsQW5zd2VyLCByZXN1bHQgOiBNb25nb1EuSVJlc3VsdFJlY29yZCkgOiBzdHJpbmdbXSB7XG4gIHJldHVybiBhbnN3ZXIuY29sdW1ucy5tYXAoIGMgPT4gJycgKyByZXN1bHRbY10pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvamVjdFJlc3VsdHNUb1N0cmluZ0FycmF5KCBhbnN3ZXIgOiBJTWF0Y2guSVdoYXRJc1R1cGVsQW5zd2VyKSA6IHN0cmluZ1tdW10ge1xuICByZXR1cm4gYW5zd2VyLnJlc3VsdHMubWFwKCByZWMgPT4gcHJvamVjdFJlc3VsdFRvU3RyaW5nQXJyYXkoYW5zd2VyLCByZWMgKSk7IC8qYW5zd2VyLmNvbHVtbnMubWFwKCBjID0+XG4gICAgeyAvL2NvbnNvbGUubG9nKCdoZXJlICcgKyBKU09OLnN0cmluZ2lmeShyZXMpKTtcbiAgICAgIHJldHVybiAoJycgKyByZXNbY10pOyB9XG4gICkpO1xuICAqL1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvamVjdEZ1bGxSZXN1bHRzVG9GbGF0U3RyaW5nQXJyYXkoIGFuc3dlcnMgOiBJTWF0Y2guSVdoYXRJc1R1cGVsQW5zd2VyW10pIDogc3RyaW5nW11bXSB7XG4gIHJldHVybiBhbnN3ZXJzLnJlZHVjZSggKHByZXYscmVzdWx0KSA9PiAge1xuICAgIHByZXYgPSBwcmV2LmNvbmNhdChwcm9qZWN0UmVzdWx0c1RvU3RyaW5nQXJyYXkocmVzdWx0KSk7XG4gICAgcmV0dXJuIHByZXY7XG4gIH0gLCBbXSk7XG59XG5cblxudmFyIHNXb3JkcyA9IHt9O1xuLypcbmV4cG9ydCBmdW5jdGlvbiBtYXRjaFJlY29yZEhhdmluZ0NhdGVnb3J5KGNhdGVnb3J5OiBzdHJpbmcsIHJlY29yZHM6IEFycmF5PElNYXRjaC5JUmVjb3JkPilcbiAgOiBBcnJheTxJTWF0Y2guSVJlY29yZD4ge1xuICBkZWJ1Z2xvZyhkZWJ1Z2xvZy5lbmFibGVkID8gSlNPTi5zdHJpbmdpZnkocmVjb3JkcywgdW5kZWZpbmVkLCAyKSA6IFwiLVwiKTtcbiAgdmFyIHJlbGV2YW50UmVjb3JkcyA9IHJlY29yZHMuZmlsdGVyKGZ1bmN0aW9uIChyZWNvcmQ6IElNYXRjaC5JUmVjb3JkKSB7XG4gICAgcmV0dXJuIChyZWNvcmRbY2F0ZWdvcnldICE9PSB1bmRlZmluZWQpICYmIChyZWNvcmRbY2F0ZWdvcnldICE9PSBudWxsKTtcbiAgfSk7XG4gIHZhciByZXMgPSBbXTtcbiAgZGVidWdsb2coXCJyZWxldmFudCByZWNvcmRzIG5yOlwiICsgcmVsZXZhbnRSZWNvcmRzLmxlbmd0aCk7XG4gIHJldHVybiByZWxldmFudFJlY29yZHM7XG59XG4qL1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBhbmFseXplQ29udGV4dFN0cmluZyhjb250ZXh0UXVlcnlTdHJpbmc6IHN0cmluZywgcnVsZXM6IElNYXRjaC5TcGxpdFJ1bGVzKSB7XG4gIHJldHVybiBXaGF0SXMuYW5hbHl6ZUNvbnRleHRTdHJpbmcoY29udGV4dFF1ZXJ5U3RyaW5nLCBydWxlcyk7XG59XG5cbi8vIGNvbnN0IHJlc3VsdCA9IFdoYXRJcy5yZXNvbHZlQ2F0ZWdvcnkoY2F0LCBhMS5lbnRpdHksXG4vLyAgIHRoZU1vZGVsLm1SdWxlcywgdGhlTW9kZWwudG9vbHMsIHRoZU1vZGVsLnJlY29yZHMpO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBsaXN0QWxsV2l0aENvbnRleHQoY2F0ZWdvcnk6IHN0cmluZywgY29udGV4dFF1ZXJ5U3RyaW5nOiBzdHJpbmcsXG4gIHRoZU1vZGVsOiBJTWF0Y2guSU1vZGVscywgZG9tYWluQ2F0ZWdvcnlGaWx0ZXI/OiBJTWF0Y2guSURvbWFpbkNhdGVnb3J5RmlsdGVyKTogUHJvbWlzZTxJTWF0Y2guSVByb2Nlc3NlZFdoYXRJc1R1cGVsQW5zd2Vycz4ge1xuICByZXR1cm4gbGlzdEFsbFR1cGVsV2l0aENvbnRleHQoW2NhdGVnb3J5XSwgY29udGV4dFF1ZXJ5U3RyaW5nLCB0aGVNb2RlbCwgZG9tYWluQ2F0ZWdvcnlGaWx0ZXIpO1xuICAvKi50aGVuKFxuICAgIChyZXMpID0+IHtcbiAgICAgIHZhciBhbnN3ZXJzID0gcmVzLnR1cGVsYW5zd2Vycy5tYXAoZnVuY3Rpb24gKG8pOiBJTWF0Y2guSVdoYXRJc0Fuc3dlciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc2VudGVuY2U6IG8uc2VudGVuY2UsXG4gICAgICAgICAgcmVjb3JkOiBvLnJlY29yZCxcbiAgICAgICAgICBjYXRlZ29yeTogby5jYXRlZ29yaWVzWzBdLFxuICAgICAgICAgIHJlc3VsdDogby5yZXN1bHRbMF0sXG4gICAgICAgICAgX3Jhbmtpbmc6IG8uX3JhbmtpbmdcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgICk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzZW50ZW5jZXM6IHJlcy5zZW50ZW5jZXMsXG4gICAgICAgIGVycm9yczogcmVzLmVycm9ycyxcbiAgICAgICAgdG9rZW5zOiByZXMudG9rZW5zLFxuICAgICAgICBhbnN3ZXJzOiBhbnN3ZXJzXG4gICAgICB9O1xuICAgIH0pXG4gICAgKi9cbn1cblxuXG4vKlxuZXhwb3J0IGZ1bmN0aW9uIGxpc3RBbGxXaXRoQ2F0ZWdvcnkoY2F0ZWdvcnk6IHN0cmluZywgdGhlTW9kZWw6IElNYXRjaC5JTW9kZWxzKTogQXJyYXk8SU1hdGNoLklSZWNvcmQ+IHtcbiAgdmFyIG1hdGNoZWRBbnN3ZXJzID0gbWF0Y2hSZWNvcmRIYXZpbmdDYXRlZ29yeShjYXRlZ29yeSwgdGhlTW9kZWwpOyAvL2FUb29sOiBBcnJheTxJTWF0Y2guSVRvb2w+KTogYW55IC8gKiBvYmplY3RzdHJlYW0qIC8ge1xuICBkZWJ1Z2xvZyhcIiBsaXN0QWxsV2l0aENhdGVnb3J5OlwiICsgSlNPTi5zdHJpbmdpZnkobWF0Y2hlZEFuc3dlcnMsIHVuZGVmaW5lZCwgMikpO1xuICByZXR1cm4gbWF0Y2hlZEFuc3dlcnM7XG59XG4qL1xuaW1wb3J0IHsgTW9uZ29RIGFzIE1vbmdvUSB9IGZyb20gJ21nbmxxX3BhcnNlcjEnO1xuXG5leHBvcnQgZnVuY3Rpb24gbGlzdEFsbFNob3dNZShxdWVyeSA6IHN0cmluZywgdGhlTW9kZWwgOiBJTWF0Y2guSU1vZGVscyApIDogUHJvbWlzZTxNb25nb1EuSVByb2Nlc3NlZE1vbmdvQW5zd2Vycz4ge1xuICByZXR1cm4gTW9uZ29RdWVyaWVzLmxpc3RTaG93TWUocXVlcnksIHRoZU1vZGVsKTtcbn1cblxuXG4vKipcbiAqIGFuYWx5emUgcmVzdWx0cyBvZiBhIHF1ZXJ5LFxuICpcbiAqIFJlc29ydGluZyByZXN1bHRzXG4gKlxuICogLT4gc3BsaXQgYnkgZG9tYWluc1xuICogLT4gb3JkZXIgYnkgc2lnbmlmaWNhbmNlIG9mIHNlbnRlbmNlLCBkcm9wcGluZyBcImxlZXMgcmVsZXZhbnRcIiAoZS5nLiBtZXRhbW9kZWwpIGFuc3dlcnNcbiAqIC0+IHBydW5lXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHNvcnRBbndzZXJzQnlEb21haW5zKCApXG4ge1xuXG4gfVxuLy9cblxuXG5cbmV4cG9ydCBmdW5jdGlvbiBsaXN0QWxsVHVwZWxXaXRoQ29udGV4dChjYXRlZ29yaWVzOiBzdHJpbmdbXSwgY29udGV4dFF1ZXJ5U3RyaW5nOiBzdHJpbmcsXG4gIHRoZU1vZGVsOiBJTWF0Y2guSU1vZGVscywgZG9tYWluQ2F0ZWdvcnlGaWx0ZXI/OiBJTWF0Y2guSURvbWFpbkNhdGVnb3J5RmlsdGVyKTogUHJvbWlzZTxJTWF0Y2guSVByb2Nlc3NlZFdoYXRJc1R1cGVsQW5zd2Vycz4ge1xuXG4gIHZhciBxdWVyeSA9IGNhdGVnb3JpZXMuam9pbihcIiBcIikgKyBcIiB3aXRoIFwiICsgY29udGV4dFF1ZXJ5U3RyaW5nO1xuICBpZiAoIWNvbnRleHRRdWVyeVN0cmluZykge1xuICAgIHRocm93IG5ldyBFcnJvcignYXNzdW1lZCBjb250ZXh0UXVlcnlTdHJpbmcgcGFzc2VkJyk7XG4gIH1cbiAgcmV0dXJuIE1vbmdvUXVlcmllcy5saXN0QWxsKHF1ZXJ5LCB0aGVNb2RlbCk7XG4gIC8qXG5cbiAgICBpZiAoY29udGV4dFF1ZXJ5U3RyaW5nLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHVwZWxhbnN3ZXJzIDogW10sXG4gICAgICAgIGVycm9ycyA6IFtFckVycm9yLm1ha2VFcnJvcl9FTVBUWV9JTlBVVCgpXSAsXG4gICAgICAgIHRva2VucyA6W10sXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG5cbiAgICAgIGxvZ1BlcmYoJ2xpc3RBbGxXaXRoQ29udGV4dCcpO1xuICAgICAgcGVyZmxvZyhcInRvdGFsTGlzdEFsbFdpdGhDb250ZXh0XCIpO1xuICAgICAgdmFyIGFTZW50ZW5jZXNSZWluZm9yY2VkID0gYW5hbHl6ZUNvbnRleHRTdHJpbmcoY29udGV4dFF1ZXJ5U3RyaW5nLCBhUnVsZXMpO1xuICAgICAgcGVyZmxvZyhcIkxBVFdDIG1hdGNoaW5nIHJlY29yZHMgKHM9XCIgKyBhU2VudGVuY2VzUmVpbmZvcmNlZC5zZW50ZW5jZXMubGVuZ3RoICsgXCIpLi4uXCIpO1xuICAgICAgdmFyIG1hdGNoZWRBbnN3ZXJzID0gV2hhdElzLm1hdGNoUmVjb3Jkc1F1aWNrTXVsdGlwbGVDYXRlZ29yaWVzKGFTZW50ZW5jZXNSZWluZm9yY2VkLCBjYXRlZ29yaWVzLCByZWNvcmRzLCBkb21haW5DYXRlZ29yeUZpbHRlcik7IC8vYVRvb2w6IEFycmF5PElNYXRjaC5JVG9vbD4pOiBhbnkgLyAqIG9iamVjdHN0cmVhbSogLyB7XG4gICAgICBpZihkZWJ1Z2xvZy5lbmFibGVkKXtcbiAgICAgICAgZGVidWdsb2coXCIgbWF0Y2hlZCBBbnN3ZXJzXCIgKyBKU09OLnN0cmluZ2lmeShtYXRjaGVkQW5zd2VycywgdW5kZWZpbmVkLCAyKSk7XG4gICAgICB9XG4gICAgICBwZXJmbG9nKFwiZmlsdGVyaW5nIHRvcFJhbmtlZCAoYT1cIiArIG1hdGNoZWRBbnN3ZXJzLnR1cGVsYW5zd2Vycy5sZW5ndGggKyBcIikuLi5cIik7XG4gICAgICB2YXIgbWF0Y2hlZEZpbHRlcmVkID0gV2hhdElzLmZpbHRlck9ubHlUb3BSYW5rZWRUdXBlbChtYXRjaGVkQW5zd2Vycy50dXBlbGFuc3dlcnMpO1xuICAgICAgaWYgKGRlYnVnbG9nLmVuYWJsZWQpIHtcbiAgICAgICAgZGVidWdsb2coXCJMQVRXQyBtYXRjaGVkIHRvcC1yYW5rZWQgQW5zd2Vyc1wiICsgSlNPTi5zdHJpbmdpZnkobWF0Y2hlZEZpbHRlcmVkLCB1bmRlZmluZWQsIDIpKTtcbiAgICAgIH1cbiAgICAgIHBlcmZsb2coXCJ0b3RhbExpc3RBbGxXaXRoQ29udGV4dCAoYT1cIiArIG1hdGNoZWRGaWx0ZXJlZC5sZW5ndGggKyBcIilcIik7XG4gICAgICBsb2dQZXJmKCdsaXN0QWxsV2l0aENvbnRleHQnKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR1cGVsYW5zd2VycyA6IG1hdGNoZWRGaWx0ZXJlZCwgLy8gPz8/IEFuc3dlcnM7XG4gICAgICAgIGVycm9ycyA6IGFTZW50ZW5jZXNSZWluZm9yY2VkLmVycm9ycyxcbiAgICAgICAgdG9rZW5zOiBhU2VudGVuY2VzUmVpbmZvcmNlZC50b2tlbnNcbiAgICAgIH1cbiAgICB9XG4gICAgKi9cbn1cblxuLypcbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJTdHJpbmdMaXN0QnlPcChvcGVyYXRvcjogSU1hdGNoLklPcGVyYXRvciwgZnJhZ21lbnQ6IHN0cmluZywgc3JjYXJyOiBzdHJpbmdbXSk6IHN0cmluZ1tdIHtcbiAgdmFyIGZyYWdtZW50TEMgPSBCcmVha0Rvd24udHJpbVF1b3RlZFNwYWNlZChmcmFnbWVudC50b0xvd2VyQ2FzZSgpKTtcbiAgcmV0dXJuIHNyY2Fyci5maWx0ZXIoZnVuY3Rpb24gKHN0cikge1xuICAgIHJldHVybiBPcGVyYXRvci5tYXRjaGVzKG9wZXJhdG9yLCBmcmFnbWVudExDLCBzdHIudG9Mb3dlckNhc2UoKSk7XG4gIH0pLnNvcnQoKTtcbn1cbiovXG5cbmZ1bmN0aW9uIGNvbXBhcmVDYXNlSW5zZW5zaXRpdmUoYTogc3RyaW5nLCBiOiBzdHJpbmcpIHtcbiAgdmFyIHIgPSBhLnRvTG93ZXJDYXNlKCkubG9jYWxlQ29tcGFyZShiLnRvTG93ZXJDYXNlKCkpO1xuICBpZiAocikge1xuICAgIHJldHVybiByO1xuICB9XG4gIHJldHVybiAtYS5sb2NhbGVDb21wYXJlKGIpO1xufVxuXG4vKipcbiAqIFNvcnQgc3RyaW5nIGxpc3QgY2FzZSBpbnNlbnNpdGl2ZSwgdGhlbiByZW1vdmUgZHVwbGljYXRlcyByZXRhaW5pbmdcbiAqIFwibGFyZ2VzdFwiIG1hdGNoXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVDYXNlRHVwbGljYXRlcyhhcnI6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICBhcnIuc29ydChjb21wYXJlQ2FzZUluc2Vuc2l0aXZlKTtcbiAgZGVidWdsb2coJ3NvcnRlZCBhcnInICsgSlNPTi5zdHJpbmdpZnkoYXJyKSk7XG4gIHJldHVybiBhcnIuZmlsdGVyKGZ1bmN0aW9uIChzLCBpbmRleCkge1xuICAgIHJldHVybiBpbmRleCA9PT0gMCB8fCAoMCAhPT0gYXJyW2luZGV4IC0gMV0udG9Mb3dlckNhc2UoKS5sb2NhbGVDb21wYXJlKHMudG9Mb3dlckNhc2UoKSkpO1xuICB9KTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDYXRlZ29yeU9wRmlsdGVyQXNEaXN0aW5jdFN0cmluZ3Mob3BlcmF0b3I6IElNYXRjaC5JT3BlcmF0b3IsIGZyYWdtZW50OiBzdHJpbmcsXG4gIGNhdGVnb3J5OiBzdHJpbmcsIHJlY29yZHM6IEFycmF5PElNYXRjaC5JUmVjb3JkPiwgZmlsdGVyRG9tYWluPzogc3RyaW5nKTogc3RyaW5nW10ge1xuICB2YXIgZnJhZ21lbnRMQyA9IEJyZWFrRG93bi50cmltUXVvdGVkKGZyYWdtZW50LnRvTG93ZXJDYXNlKCkpO1xuICB2YXIgcmVzID0gW107XG4gIHZhciBzZWVuID0ge307XG4gIHJlY29yZHMuZm9yRWFjaChmdW5jdGlvbiAocmVjb3JkKSB7XG4gICAgaWYgKGZpbHRlckRvbWFpbiAmJiByZWNvcmRbJ19kb21haW4nXSAhPT0gZmlsdGVyRG9tYWluKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChyZWNvcmRbY2F0ZWdvcnldICYmIE9wZXJhdG9yLm1hdGNoZXMob3BlcmF0b3IsIGZyYWdtZW50TEMsIHJlY29yZFtjYXRlZ29yeV0udG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgIGlmICghc2VlbltyZWNvcmRbY2F0ZWdvcnldXSkge1xuICAgICAgICBzZWVuW3JlY29yZFtjYXRlZ29yeV1dID0gdHJ1ZTtcbiAgICAgICAgcmVzLnB1c2gocmVjb3JkW2NhdGVnb3J5XSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlbW92ZUNhc2VEdXBsaWNhdGVzKHJlcyk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gbGlrZWx5UGx1cmFsRGlmZihhOiBzdHJpbmcsIHBsdXJhbE9mYTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHZhciBhTEMgPSBCcmVha0Rvd24udHJpbVF1b3RlZChhLnRvTG93ZXJDYXNlKCkpIHx8IFwiXCI7XG4gIHZhciBwbHVyYWxPZkFMQyA9IEJyZWFrRG93bi50cmltUXVvdGVkKChwbHVyYWxPZmEgfHwgXCJcIikudG9Mb3dlckNhc2UoKSkgfHwgXCJcIjtcbiAgaWYgKGFMQyA9PT0gcGx1cmFsT2ZBTEMpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoYUxDICsgJ3MnID09PSBwbHVyYWxPZkFMQykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBqb2luU29ydGVkUXVvdGVkKHN0cmluZ3M6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgaWYgKHN0cmluZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbiAgcmV0dXJuICdcIicgKyBzdHJpbmdzLnNvcnQoKS5qb2luKCdcIjsgXCInKSArICdcIic7XG59XG5cbi8qXG5leHBvcnQgZnVuY3Rpb24gam9pbkRpc3RpbmN0KGNhdGVnb3J5OiBzdHJpbmcsIHJlY29yZHM6IEFycmF5PElNYXRjaC5JUmVjb3JkPik6IHN0cmluZyB7XG4gIHZhciByZXMgPSByZWNvcmRzLnJlZHVjZShmdW5jdGlvbiAocHJldiwgb1JlY29yZCkge1xuICAgIHByZXZbb1JlY29yZFtjYXRlZ29yeV1dID0gMTtcbiAgICByZXR1cm4gcHJldjtcbiAgfSwge30gYXMgYW55KTtcbiAgcmV0dXJuIGpvaW5Tb3J0ZWRRdW90ZWQoT2JqZWN0LmtleXMocmVzKSk7XG59XG4qL1xuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0RGlzdGluY3RGcm9tV2hhdElmUmVzdWx0KGFuc3dlcnM6IEFycmF5PElNYXRjaC5JV2hhdElzVHVwZWxBbnN3ZXI+KTogc3RyaW5nIHtcbiAgdmFyIHN0cnMgPSBwcm9qZWN0RnVsbFJlc3VsdHNUb0ZsYXRTdHJpbmdBcnJheShhbnN3ZXJzKTtcbiAgdmFyIHJlc0ZpcnN0ID0gc3Rycy5tYXAociA9PiByWzBdKTtcblxuICByZXR1cm4gam9pblNvcnRlZFF1b3RlZCggcmVzRmlyc3QgKTsgLypwcm9qZWN0UmVzdWx0c1RvU3RyaW5nQXJyYXkoYW5zd2VycykgYW5zd2Vycy5tYXAoZnVuY3Rpb24gKG9BbnN3ZXIpIHtcbiAgICByZXR1cm4gb0Fuc3dlci5yZXN1bHQ7XG4gIH0pKTsqL1xufVxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGZsYXR0ZW5FcnJvcnMocmVzdWx0czogSU1hdGNoLklQcm9jZXNzZWRXaGF0SXNUdXBlbEFuc3dlcnMpIDogYW55W10ge1xuICBkZWJ1Z2xvZygnZmxhdHRlbiBlcnJvcnMnKTtcbiAgcmV0dXJuIHJlc3VsdHMucmVkdWNlKCAocHJldiwgcmVjKSA9PiAgeyBpZiAoKHJlYy5lcnJvcnMgIT09IHVuZGVmaW5lZCkgJiYgKHJlYy5lcnJvcnMgIT09IGZhbHNlKVxuICAgICYmICghXy5pc0FycmF5KHJlYy5lcnJvcnMpIHx8IHJlYy5lcnJvcnMubGVuZ3RoID4gMCkpIHtcbiAgICAgIHByZXYucHVzaChyZWMuZXJyb3JzKTsgfVxuICAgIHJldHVybiBwcmV2O1xuICB9LCBbXSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuQ29tcGxldGUociA6IGFueVtdKSA6IGFueVtdIHtcbiAgdmFyIHJlcyA9W107XG4gIHIuZm9yRWFjaChtZW0gPT4geyBpZiAoIF8uaXNBcnJheShtZW0pKSB7XG4gICAgIHJlcyA9IHJlcy5jb25jYXQobWVtKTtcbiAgIH0gZWxzZSB7XG4gICAgIHJlcy5wdXNoKG1lbSk7XG4gICB9fSk7XG4gIHJldHVybiByZXM7XG59XG5cbi8qKlxuICogcmV0dXJuIHVuZGVmaW5lZCBpZiByZXN1dGxzIGlzIG5vdCBvbmx5IGVycm9uZW91c1xuICogQHBhcmFtIHJlc3VsdHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJldHVybkVycm9yVGV4dElmT25seUVycm9yKHJlc3VsdHM6IElNYXRjaC5JUHJvY2Vzc2VkV2hhdElzVHVwZWxBbnN3ZXJzKTogc3RyaW5nIHtcbiAgdmFyIGVycm9ycyA9IGZsYXR0ZW5FcnJvcnMocmVzdWx0cyk7XG4gIGRlYnVnbG9nKCgpPT4naGVyZSBmbGF0dGVuZWQgZXJyb3JzICcgKyBlcnJvcnMubGVuZ3RoICsgJy8nICsgcmVzdWx0cy5sZW5ndGgpO1xuICBpZihlcnJvcnMubGVuZ3RoID09PSByZXN1bHRzLmxlbmd0aCkge1xuICAgIHZhciBsaXN0T2ZFcnJvcnMgPSBmbGF0dGVuQ29tcGxldGUoZXJyb3JzKTtcbiAgICB2YXIgciA9IEVyRXJyb3IuZXhwbGFpbkVycm9yKGxpc3RPZkVycm9ycyk7XG4gICAgZGVidWdsb2coKCk9PidoZXJlIGV4cGxhaW4gJyArIHIpO1xuICAgIHJldHVybiByO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG4gIC8qXG4gIGlmIChyZXN1bHRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGRlYnVnbG9nKCgpID0+IGAgbm8gYW5zd2VyczogJHtKU09OLnN0cmluZ2lmeShyZXN1bHRzLCB1bmRlZmluZWQsIDIpfWApO1xuICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKChlcnJvcnMgYXMgYW55W10pLmZpbHRlcihlcnIgPT4gKGVyciA9PT0gZmFsc2UpKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGRlYnVnbG9nKCd2YWxpZCByZXN1bHQnKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkOyAvLyBhdCBsZWFzdCBvbmUgcXVlcnkgd2FzIG9rXG4gICAgICB9XG4gICAgICBkZWJ1Z2xvZygoKSA9PiBgIGVycm9yczogICR7SlNPTi5zdHJpbmdpZnkoZXJyb3JzLCB1bmRlZmluZWQsIDIpfWApO1xuICAgICAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIEVyRXJyb3IuZXhwbGFpbkVycm9yKGVycm9ycyk7IC8vWzBdLnRleHRcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgKi9cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZsYXR0ZW5Ub1N0cmluZ0FycmF5KHJlc3VsdHM6IEFycmF5PElNYXRjaC5JV2hhdElzVHVwZWxBbnN3ZXI+KTogc3RyaW5nW11bXSB7XG4gIC8vIFRPRE8gU1BMSVQgQlkgRE9NQUlOXG4gIHZhciByZXMgPSBbXTtcbiAgdmFyIGNudCA9IHJlc3VsdHMucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCByZXN1bHQpIHtcbiAgICBpZiAodHJ1ZSkgeyAvLyBUT0RPIHJlc3VsdC5fcmFua2luZyA9PT0gcmVzdWx0c1swXS5fcmFua2luZykge1xuICAgICAgdmFyIGFycnMgPSBwcm9qZWN0UmVzdWx0c1RvU3RyaW5nQXJyYXkocmVzdWx0KTtcbiAgICAgIHJlcyA9IHJlcy5jb25jYXQoYXJycyk7XG4gICAgfVxuICAgIHJldHVybiBwcmV2O1xuICB9LCAwKTtcbiAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGpvaW5SZXN1bHRzRmlsdGVyRHVwbGljYXRlcyhhbnN3ZXJzOiBBcnJheTxJTWF0Y2guSVdoYXRJc1R1cGVsQW5zd2VyPik6IHN0cmluZ1tdIHtcbiAgdmFyIHJlcyA9IFtdO1xuICB2YXIgc2VlbiA9IFtdOyAvLyBzZXJpYWxpemVkIGluZGV4XG4gIHZhciBjbnQgPSBhbnN3ZXJzLnJlZHVjZShmdW5jdGlvbiAocHJldiwgcmVzdWx0KSB7XG4gICAgaWYgKHRydWUpIHsgLy8gVE9ETyByZXN1bHQuX3JhbmtpbmcgPT09IHJlc3VsdHNbMF0uX3JhbmtpbmcpIHtcbiAgICAgIHZhciBhcnJzID0gcHJvamVjdFJlc3VsdHNUb1N0cmluZ0FycmF5KHJlc3VsdCk7XG4gICAgICB2YXIgY250bGVuID0gYXJycy5yZWR1Y2UoIChwcmV2LHJvdykgPT4ge1xuICAgICAgICB2YXIgdmFsdWUgPSBVdGlscy5saXN0VG9RdW90ZWRDb21tYUFuZChyb3cpOyAvL3Byb2plY3RSZXN1bHRUb1N0cmluZ0FycmF5KHJlc3VsdCwgcmVzdWx0KSk7XG4gICAgICAgIGlmIChzZWVuLmluZGV4T2YodmFsdWUpIDwgMCkge1xuICAgICAgICAgIHNlZW4ucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgcmVzLnB1c2gocm93KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJldiArIDE7fSAsIDApO1xuICAgIH1cbiAgICByZXR1cm4gcHJldjtcbiAgfSwgMCk7XG4gIHJldHVybiByZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09LQW5zd2VyKGFuc3dlciA6IElNYXRjaC5JVHVwZWxBbnN3ZXIpIDogYm9vbGVhbiB7XG4gIHJldHVybiAhKGFuc3dlci5lcnJvcnMpICYmIChhbnN3ZXIuZG9tYWluICE9PSB1bmRlZmluZWQpO1xufVxuZnVuY3Rpb24gaXNOb3RVbmRlZmluZWQob2JqIDogYW55KSA6IGJvb2xlYW4ge1xuICByZXR1cm4gIShvYmogPT09IHVuZGVmaW5lZCk7XG59XG5cbmZ1bmN0aW9uIGlzTm90RW1wdHlSZXN1bHQoYW5zd2VyIDogSU1hdGNoLklUdXBlbEFuc3dlcikgOiBib29sZWFuIHtcbiAgcmV0dXJuIChhbnN3ZXIucmVzdWx0cy5sZW5ndGggPiAwKVxufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gYW5zd2Vyc1xuICogQHJldHVybiB7c3RyaW5nW119IGFuIGFycmF5IG9mIHN0cmluZ3NcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldERpc3RpbmN0T0tEb21haW5zKGFuc3dlcnMgOiBJTWF0Y2guSVR1cGVsQW5zd2VyW10pIDogc3RyaW5nW10ge1xuICByZXR1cm4gXy51bmlxKGFuc3dlcnMuZmlsdGVyKGlzT0tBbnN3ZXIpLm1hcChyID0+IHIuZG9tYWluKS5maWx0ZXIoaXNOb3RVbmRlZmluZWQpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc09LQW5zd2VyKGFuc3dlcnMgOiBJTWF0Y2guSVR1cGVsQW5zd2VycykgOiBib29sZWFuIHtcbiAgcmV0dXJuIGdldERpc3RpbmN0T0tEb21haW5zKGFuc3dlcnMpLmxlbmd0aCA+IDAgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzRXJyb3IoYW5zd2VycyA6IElNYXRjaC5JVHVwZWxBbnN3ZXJzKSA6IGJvb2xlYW4ge1xuICByZXR1cm4gIWFuc3dlcnMuZXZlcnkoaXNPS0Fuc3dlcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNFbXB0eVJlc3VsdChhbnN3ZXJzIDogSU1hdGNoLklUdXBlbEFuc3dlcnMpIDogYm9vbGVhbiB7XG4gIHJldHVybiAhYW5zd2Vycy5ldmVyeShhbnN3ZXIgPT5cbiAge1xuICAgIGlmKGFuc3dlci5yZXN1bHRzLmxlbmd0aCA8PSAwKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKCdoZXJlIGVtcHR5JyArIEpTT04uc3RyaW5naWZ5KGFuc3dlcikpO1xuICAgIH1cbiAgICByZXR1cm4gKGFuc3dlci5yZXN1bHRzLmxlbmd0aCA+IDApO1xuICB9KTtcbn1cblxuXG4vKipcbiAqXG4gKiBAcGFyYW0gYW5zd2Vyc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0T0tJZkRpc3RpbmN0T0tEb21haW5zKGFuc3dlcnMgOiBJTWF0Y2guSVR1cGVsQW5zd2VyW10pIDogc3RyaW5nW10ge1xuICByZXR1cm4gXy51bmlxKGFuc3dlcnMuZmlsdGVyKGlzT0tBbnN3ZXIpLm1hcChyID0+IHIuZG9tYWluKS5maWx0ZXIoaXNOb3RVbmRlZmluZWQpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUVycm9yc0lmT0tBbnN3ZXJzKGFuc3dlcnM6IElNYXRjaC5JVHVwZWxBbnN3ZXJzKSA6IElNYXRjaC5JVHVwZWxBbnN3ZXJzIHtcbiAgaWYgKGhhc09LQW5zd2VyKGFuc3dlcnMpICkge1xuICAgIHJldHVybiBhbnN3ZXJzLmZpbHRlcihpc09LQW5zd2VyKTtcbiAgfVxuICByZXR1cm4gYW5zd2Vycztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUVtcHR5UmVzdWx0cyhhbnN3ZXJzOiBJTWF0Y2guSVR1cGVsQW5zd2VycykgOiBJTWF0Y2guSVR1cGVsQW5zd2VycyB7XG4gIGlmIChoYXNPS0Fuc3dlcihhbnN3ZXJzKSApIHtcbiAgICByZXR1cm4gYW5zd2Vycy5maWx0ZXIoaXNOb3RFbXB0eVJlc3VsdCk7XG4gIH1cbiAgcmV0dXJuIGFuc3dlcnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVNZXRhbW9kZWxSZXN1bHRJZk90aGVycyhhbnN3ZXJzIDogSU1hdGNoLklUdXBlbEFuc3dlcnMpIDogSU1hdGNoLklUdXBlbEFuc3dlcnMge1xuICBpZihoYXNFcnJvcihhbnN3ZXJzKSkge1xuICAgIHRocm93IEVycm9yKCdyZW1vdmUgZXJyb3JzIGJlZm9yZScpO1xuICB9XG4gIGlmKGhhc0VtcHR5UmVzdWx0KGFuc3dlcnMpKSB7XG4gICAgdGhyb3cgRXJyb3IoJ3J1biByZW1vdmVFbXB0eVJlc3VsdHMgYmVmb3JlJyk7XG4gIH1cbiAgdmFyIGRvbWFpbnMgPSBnZXREaXN0aW5jdE9LRG9tYWlucyhhbnN3ZXJzKTtcbiAgaWYgKChkb21haW5zLmxlbmd0aCA+IDEpICYmIGRvbWFpbnMuaW5kZXhPZignbWV0YW1vZGVsJykgPiAwICkge1xuICAgIHJldHVybiBhbnN3ZXJzLmZpbHRlcihhID0+IChhLmRvbWFpbiAhPT0gJ21ldGFtb2RlbCcpKTtcbiAgfVxuICByZXR1cm4gYW5zd2Vycztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU2lnbmlmaWNhbnRXb3JkKHdvcmQgOiBJTWF0Y2guSVdvcmQpIHtcbiAgcmV0dXJuIHdvcmQucnVsZS53b3JkVHlwZSA9PT0gJ0YnXG4gICAgICB8fCB3b3JkLnJ1bGUud29yZFR5cGUgPT09ICdDJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU2lnbmlmaWNhbnREaWZmZXJlbmNlKGFjdHVhbHdvcmQgOiBzdHJpbmcsIG1hdGNoZWRXb3JkOiBzdHJpbmcpIHtcbiAgdmFyIGxjYSA9IGFjdHVhbHdvcmQudG9Mb3dlckNhc2UoKTtcbiAgdmFyIGxjbSA9IG1hdGNoZWRXb3JkLnRvTG93ZXJDYXNlKCk7XG4gIGlmKCBsY2EgPT09IGxjbSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoIGxjYSArICdzJyA9PT0gbGNtKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICggbGNhID09PSBsY20gKydzJyApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRRdWVyeVN0cmluZyhhbnN3IDogSU1hdGNoLklUdXBlbEFuc3dlcikgOiBzdHJpbmcge1xuICB2YXIgd29yZHMgPSBbXTtcbiAgZGVidWdsb2coKCk9PiAnaGVyZSB0b2tlbnM6JyArIGFuc3cuYXV4LnRva2Vucyk7XG4gIGRlYnVnbG9nKCgpPT4gSlNPTi5zdHJpbmdpZnkoYW5zdy5hdXguc2VudGVuY2UsdW5kZWZpbmVkLDIpKTtcbiAgZGVidWdsb2coKCk9PiAnICcgKyBTZW50ZW5jZS5kdW1wTmljZVJ1bGVkKGFuc3cuYXV4LnNlbnRlbmNlKSk7XG4gIGFuc3cuYXV4LnNlbnRlbmNlLmZvckVhY2goICh3b3JkLCBpbmRleCkgPT4ge1xuICAgIHZhciB3b3JkID0gYW5zdy5hdXguc2VudGVuY2VbaW5kZXhdO1xuICAgIHdvcmRzLnB1c2god29yZC5zdHJpbmcpO1xuICAgIGlmICggaXNTaWduaWZpY2FudFdvcmQod29yZCkpXG4gICAgaWYgKCBpc1NpZ25pZmljYW50RGlmZmVyZW5jZSh3b3JkLm1hdGNoZWRTdHJpbmcsIHdvcmQuc3RyaW5nKSApIHtcbiAgICAgICAgICAgIHdvcmRzLnB1c2goXCIoXFxcIlwiICsgd29yZC5ydWxlLm1hdGNoZWRTdHJpbmcgKyBcIlxcXCIpXCIpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB3b3Jkcy5qb2luKFwiIFwiKTtcbn07XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNtcERvbWFpblNlbnRlbmNlUmFua2luZyhhIDogSU1hdGNoLklUdXBlbEFuc3dlciwgYiA6IElNYXRjaC5JVHVwZWxBbnN3ZXIpIDogbnVtYmVyIHtcbiAgdmFyIHIgPSBhLmRvbWFpbi5sb2NhbGVDb21wYXJlKGIuZG9tYWluKTtcbiAgaWYgKHIpIHtcbiAgICByZXR1cm4gcjtcbiAgfVxuICB2YXIgY2EgPSBTZW50ZW5jZS5yYW5raW5nR2VvbWV0cmljTWVhbihhLmF1eC5zZW50ZW5jZSk7XG4gIHZhciBjYiA9IFNlbnRlbmNlLnJhbmtpbmdHZW9tZXRyaWNNZWFuKGIuYXV4LnNlbnRlbmNlKTtcbiAgcmV0dXJuIGNiIC0gY2E7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXRhaW5Pbmx5VG9wUmFua2VkUGVyRG9tYWluKGFuc3dlcnMgOiBJTWF0Y2guSVR1cGVsQW5zd2VycykgOiBJTWF0Y2guSVR1cGVsQW5zd2VycyB7XG4gIHZhciBkb21haW5zID0gZ2V0RGlzdGluY3RPS0RvbWFpbnMoYW5zd2Vycyk7XG4gLyogZG9tYWlucy5zb3J0KCk7XG4gLyBhbnN3ZXJzLmZvckVhY2goIChhbnN3ZXIsIGluZGV4KSA9PiAge1xuICAgIGNvbnNvbGUubG9nKFNlbnRlbmNlLnJhbmtpbmdHZW9tZXRyaWNNZWFuKGFuc3dlci5hdXguc2VudGVuY2UpKTtcbiAgfSk7XG4gICovXG4gIGFuc3dlcnMuc29ydChjbXBEb21haW5TZW50ZW5jZVJhbmtpbmcpO1xuICByZXR1cm4gYW5zd2Vycy5maWx0ZXIoIChlbnRyeSwgaW5kZXgsIGFycikgPT4gIHtcbiAgICBpZiAoKGluZGV4ID09PSAwKSB8fCAgKGVudHJ5LmRvbWFpbiAhPT0gYXJyW2luZGV4LTFdLmRvbWFpbikpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICB2YXIgcHJldiA9IGFycltpbmRleC0xXTtcbiAgICB2YXIgcmFua19wcmV2ID0gU2VudGVuY2UucmFua2luZ0dlb21ldHJpY01lYW4ocHJldi5hdXguc2VudGVuY2UpO1xuICAgIHZhciByYW5rID0gU2VudGVuY2UucmFua2luZ0dlb21ldHJpY01lYW4oZW50cnkuYXV4LnNlbnRlbmNlKTtcbiAgICBpZiAoIVdoYXRJcy5zYWZlRXF1YWwocmFuaywgcmFua19wcmV2KSkge1xuICAgICAgZGVidWdsb2coICgpPT4gYGRyb3BwaW5nICR7IGluZGV4IH0gJHsgU2VudGVuY2UuZHVtcE5pY2VSdWxlZChlbnRyeS5hdXguc2VudGVuY2UpIH0gYCk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXN1bHRBc0xpc3RTdHJpbmcoYW5zd2VyczpJTWF0Y2guSVR1cGVsQW5zd2VycykgOiBzdHJpbmcge1xuICB2YXIgbm9uZXJyb3IgPSByZW1vdmVFcnJvcnNJZk9LQW5zd2VycyhhbnN3ZXJzKTtcbiAgdmFyIG5vbmVtcHR5ID0gcmVtb3ZlRW1wdHlSZXN1bHRzKG5vbmVycm9yKTtcbiAgdmFyIGZpbHRlcmVkTm9NTSA9IHJlbW92ZU1ldGFtb2RlbFJlc3VsdElmT3RoZXJzKG5vbmVtcHR5KTtcbiAgdmFyIGZpbHRlcmVkID0gcmV0YWluT25seVRvcFJhbmtlZFBlckRvbWFpbihmaWx0ZXJlZE5vTU0pO1xuICB2YXIgZG9tYWlucyA9IGdldERpc3RpbmN0T0tEb21haW5zKGZpbHRlcmVkKTtcbiAgZG9tYWlucy5zb3J0KCk7XG4gIHZhciByZXMgPSAnJztcbiAgaWYoZG9tYWlucy5sZW5ndGggPiAxICkge1xuICAgIHJlcyA9IFwiVGhlIHF1ZXJ5IGhhcyBhbnN3ZXJzIGluIG1vcmUgdGhhbiBvbmUgZG9tYWluOlxcblwiXG4gIH1cbiAgcmVzICs9IGRvbWFpbnMubWFwKGRvbSA9PiB7XG4gICAgdmFyIGFuc3dlcnNGb3JEb21haW4gPSAgYW5zd2Vycy5maWx0ZXIoYSA9PiAoYS5kb21haW4gPT09IGRvbSkpO1xuICAgIHJldHVybiBhbnN3ZXJzRm9yRG9tYWluLm1hcCggYW5zdyA9PiB7XG4gICAgICB2YXIgbG9jYWxyZXMgPSAnJztcbiAgICAgIHZhciBxdWVyeXN0ciA9IGdldFF1ZXJ5U3RyaW5nKGFuc3cpO1xuICAgICAgdmFyIGFuc3dlck4gPSBqb2luUmVzdWx0c1R1cGVsKFthbnN3XSkuam9pbihcIlxcblwiKTtcbiAgICAgIGxvY2FscmVzICs9IHF1ZXJ5c3RyO1xuICAgICAgaWYoZG9tYWlucy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGxvY2FscmVzICs9IFwiIGluIGRvbWFpbiBcXFwiXCIgKyBkb20gKyBcIlxcXCIuLi5cXG5cIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvY2FscmVzICs9IFwiXFxuLi4uXCJcbiAgICAgIH1cbiAgICAgIGxvY2FscmVzICs9IGpvaW5SZXN1bHRzVHVwZWwoW2Fuc3ddKS5qb2luKFwiXFxuXCIpICsgXCJcXG5cIjtcbiAgICAgIHJldHVybiBsb2NhbHJlcztcbiAgICB9KS5qb2luKFwiXFxuXCIpO1xuICB9KS5qb2luKFwiXFxuXCIpO1xuICByZXR1cm4gcmVzO1xufVxuXG4vKipcbiAqIFRPRE9cbiAqIEBwYXJhbSByZXN1bHRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBqb2luUmVzdWx0c1R1cGVsKHJlc3VsdHM6IEFycmF5PElNYXRjaC5JV2hhdElzVHVwZWxBbnN3ZXI+KTogc3RyaW5nW10ge1xuICAvLyBUT0RPIFNQTElUIEJZIERPTUFJTlxuICB2YXIgcmVzID0gW107XG4gIHZhciBjbnQgPSByZXN1bHRzLnJlZHVjZShmdW5jdGlvbiAocHJldiwgcmVzdWx0KSB7XG4gICAgaWYgKHRydWUpIHsgLy8gVE9ETyByZXN1bHQuX3JhbmtpbmcgPT09IHJlc3VsdHNbMF0uX3JhbmtpbmcpIHtcbiAgICAgIHZhciBhcnJzID0gcHJvamVjdFJlc3VsdHNUb1N0cmluZ0FycmF5KHJlc3VsdCk7XG4gICAgICB2YXIgY250bGVuID0gYXJycy5yZWR1Y2UoIChwcmV2LHJvdykgPT4ge1xuICAgICAgICB2YXIgdmFsdWUgPSBVdGlscy5saXN0VG9RdW90ZWRDb21tYUFuZChyb3cpOyAvL3Byb2plY3RSZXN1bHRUb1N0cmluZ0FycmF5KHJlc3VsdCwgcmVzdWx0KSk7XG4gICAgICAgIGlmIChyZXMuaW5kZXhPZih2YWx1ZSkgPCAwKSB7XG4gICAgICAgICAgcmVzLnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcmV2ICsgMTt9ICwgMCk7XG4gICAgfVxuICAgIHJldHVybiBwcmV2O1xuICB9LCAwKTtcbiAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluZmVyRG9tYWluKHRoZU1vZGVsOiBJTWF0Y2guSU1vZGVscywgY29udGV4dFF1ZXJ5U3RyaW5nOiBzdHJpbmcpOiBzdHJpbmcge1xuICAvLyBjb25zb2xlLmxvZyhcImhlcmUgdGhlIHN0cmluZ1wiICsgY29udGV4dFF1ZXJ5U3RyaW5nKTtcbiAgLy8gIGNvbnNvbGUubG9nKFwiaGVyZSB0aGUgcnVsZXNcIiArIEpTT04uc3RyaW5naWZ5KHRoZU1vZGVsLm1SdWxlcykpO1xuICB2YXIgcmVzID0gYW5hbHl6ZUNvbnRleHRTdHJpbmcoY29udGV4dFF1ZXJ5U3RyaW5nLCB0aGVNb2RlbC5ydWxlcyk7XG4gIGRlYnVnbG9nKCgpPT5KU09OLnN0cmluZ2lmeShyZXMsdW5kZWZpbmVkLDIpKTtcbiAgLy8gcnVuIHRocm91Z2ggdGhlIHN0cmluZywgc2VhcmNoIGZvciBhIGNhdGVnb3J5XG4gIGlmICghcmVzLnNlbnRlbmNlcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHZhciBkb21haW5zID0gW107XG4gIC8vY29uc29sZS5sb2coU2VudGVuY2UuZHVtcE5pY2VBcnIocmVzKSk7XG4gIC8vIGRvIHdlIGhhdmUgYSBkb21haW4gP1xuICByZXMuc2VudGVuY2VzWzBdLmZvckVhY2goZnVuY3Rpb24gKG9Xb3JkR3JvdXApIHtcbiAgICBpZiAob1dvcmRHcm91cC5jYXRlZ29yeSA9PT0gXCJkb21haW5cIikge1xuICAgICAgZG9tYWlucy5wdXNoKG9Xb3JkR3JvdXAubWF0Y2hlZFN0cmluZylcbiAgICB9XG4gIH0pO1xuICBpZiAoZG9tYWlucy5sZW5ndGggPT09IDEpIHtcbiAgICBkZWJ1Z2xvZyhcImdvdCBhIHByZWNpc2UgZG9tYWluIFwiICsgZG9tYWluc1swXSk7XG4gICAgcmV0dXJuIGRvbWFpbnNbMF07XG4gIH1cbiAgaWYgKGRvbWFpbnMubGVuZ3RoID4gMCkge1xuICAgIGRlYnVnbG9nKGRlYnVnbG9nLmVuYWJsZWQgPyAoXCJnb3QgbW9yZSB0aGFuIG9uZSBkb21haW4sIGNvbmZ1c2VkICBcIiArIGRvbWFpbnMuam9pbihcIlxcblwiKSkgOiAnLScpO1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgLy8gVE9ET0RcbiAgfVxuICBkZWJ1Z2xvZyhcImF0dGVtcHRpbmcgdG8gZGV0ZXJtaW5lIGNhdGVnb3JpZXNcIilcbiAgLy8gdHJ5IGEgY2F0ZWdvcnkgcmV2ZXJzZSBtYXBcbiAgcmVzLnNlbnRlbmNlc1swXS5mb3JFYWNoKGZ1bmN0aW9uIChvV29yZEdyb3VwKSB7XG4gICAgaWYgKG9Xb3JkR3JvdXAuY2F0ZWdvcnkgPT09IFwiY2F0ZWdvcnlcIikge1xuICAgICAgdmFyIHNDYXQgPSBvV29yZEdyb3VwLm1hdGNoZWRTdHJpbmc7XG4gICAgICB2YXIgZG9tcyA9IE1vZGVsLmdldERvbWFpbnNGb3JDYXRlZ29yeSh0aGVNb2RlbCwgc0NhdCk7XG4gICAgICBkb21zLmZvckVhY2goZnVuY3Rpb24gKHNEb20pIHtcbiAgICAgICAgaWYgKGRvbWFpbnMuaW5kZXhPZihzRG9tKSA8IDApIHtcbiAgICAgICAgICBkb21haW5zLnB1c2goc0RvbSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIGlmIChkb21haW5zLmxlbmd0aCA9PT0gMSkge1xuICAgIGRlYnVnbG9nKFwiZ290IGEgcHJlY2lzZSBkb21haW4gXCIgKyBkb21haW5zWzBdKTtcbiAgICByZXR1cm4gZG9tYWluc1swXTtcbiAgfVxuICBkZWJ1Z2xvZyhkZWJ1Z2xvZy5lbmFibGVkID8gKFwiZ290IG1vcmUgdGhhbiBvbmUgZG9tYWluLCBjb25mdXNlZCAgXCIgKyBkb21haW5zLmpvaW4oXCJcXG5cIikpIDogJy0nKTtcbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn07Il19
