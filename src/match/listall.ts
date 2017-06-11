/**
 *
 * @module jfseb.fdevstart.analyze
 * @file analyze.ts
 * @copyright (c) 2016 Gerd Forstmann
 */

import * as Algol from './algol';
import * as debug from 'debugf';

const debuglog = debug('listall');
import * as logger from '../utils/logger';
var logPerf = logger.perf("perflistall");
var perflog = debug('perf');
import * as _ from 'lodash';
//const perflog = logger.perf("perflistall");

import * as Utils from 'abot_utils';
import * as IMatch from './ifmatch';
import * as Match from './match';

import * as Toolmatcher from './toolmatcher';
import { BreakDown } from 'mgnlq_model';
import { Sentence as Sentence } from 'mgnlq_er';
import { Word as Word } from 'mgnlq_er';
import * as Operator from './operator';
import * as WhatIs from './whatis';
import { ErError as ErError } from 'mgnlq_er';
import { Model } from 'mgnlq_model';
import * as MongoQueries from './mongoqueries';



var sWords = {};

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


export function analyzeContextString(contextQueryString: string, rules: IMatch.SplitRules) {
  return WhatIs.analyzeContextString(contextQueryString, rules);
}

// const result = WhatIs.resolveCategory(cat, a1.entity,
//   theModel.mRules, theModel.tools, theModel.records);


export function listAllWithContext(category: string, contextQueryString: string,
  theModel: IMatch.IModels, domainCategoryFilter?: IMatch.IDomainCategoryFilter): Promise<IMatch.IProcessedWhatIsAnswers> {
  return listAllTupelWithContext([category], contextQueryString, theModel, domainCategoryFilter).then(
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
}


/*
export function listAllWithCategory(category: string, theModel: IMatch.IModels): Array<IMatch.IRecord> {
  var matchedAnswers = matchRecordHavingCategory(category, theModel); //aTool: Array<IMatch.ITool>): any / * objectstream* / {
  debuglog(" listAllWithCategory:" + JSON.stringify(matchedAnswers, undefined, 2));
  return matchedAnswers;
}
*/

export function listAllTupelWithContext(categories: string[], contextQueryString: string,
  theModel: IMatch.IModels, domainCategoryFilter?: IMatch.IDomainCategoryFilter): Promise<IMatch.IProcessedWhatIsTupelAnswers> {

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

export function filterStringListByOp(operator: IMatch.IOperator, fragment: string, srcarr: string[]): string[] {
  var fragmentLC = BreakDown.trimQuotedSpaced(fragment.toLowerCase());
  return srcarr.filter(function (str) {
    return Operator.matches(operator, fragmentLC, str.toLowerCase());
  }).sort();
}

function compareCaseInsensitive(a: string, b: string) {
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
export function removeCaseDuplicates(arr: string[]): string[] {
  arr.sort(compareCaseInsensitive);
  debuglog('sorted arr' + JSON.stringify(arr));
  return arr.filter(function (s, index) {
    return index === 0 || (0 !== arr[index - 1].toLowerCase().localeCompare(s.toLowerCase()));
  });
};

export function getCategoryOpFilterAsDistinctStrings(operator: IMatch.IOperator, fragment: string,
  category: string, records: Array<IMatch.IRecord>, filterDomain?: string): string[] {
  var fragmentLC = BreakDown.trimQuoted(fragment.toLowerCase());
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
};

export function likelyPluralDiff(a: string, pluralOfa: string): boolean {
  var aLC = BreakDown.trimQuoted(a.toLowerCase()) || "";
  var pluralOfALC = BreakDown.trimQuoted((pluralOfa || "").toLowerCase()) || "";
  if (aLC === pluralOfALC) {
    return true;
  }
  if (aLC + 's' === pluralOfALC) {
    return true;
  }
  return false;
};




export function joinSortedQuoted(strings: string[]): string {
  if (strings.length === 0) {
    return "";
  }
  return '"' + strings.sort().join('"; "') + '"';
}

export function joinDistinct(category: string, records: Array<IMatch.IRecord>): string {
  var res = records.reduce(function (prev, oRecord) {
    prev[oRecord[category]] = 1;
    return prev;
  }, {} as any);
  return joinSortedQuoted(Object.keys(res));
}

export function formatDistinctFromWhatIfResult(answers: Array<IMatch.IWhatIsAnswer>): string {
  return joinSortedQuoted(answers.map(function (oAnswer) {
    return oAnswer.result;
  }));
}

export function joinResults(results: Array<IMatch.IWhatIsAnswer>): string[] {
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


/**
 * return undefined if resutls is not only erroneous
 * @param results
 */
export function returnErrorTextIfOnlyError(results: IMatch.IProcessedWhatIsTupelAnswers): string {
  if (results.tupelanswers.length === 0) {
    debuglog(() => ` no answers: ${JSON.stringify(results, undefined, 2)}`);
    if (results.errors.length > 0) {
      if ((results.errors as any).filter(err => (err === false)).length > 0) {
        debuglog('valid result')
        return undefined; // at least one query was ok
      }
      debuglog(() => ` errors:  ${JSON.stringify(results.errors, undefined, 2)}`);
      if (results.errors[0]) {
        return ErError.explainError(results.errors); //[0].text
      }
    }
  }
  return undefined;
}

export function joinResultsTupel(results: Array<IMatch.IWhatIsTupelAnswer>): string[] {
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

export function inferDomain(theModel: IMatch.IModels, contextQueryString: string): string {
  // console.log("here the string" + contextQueryString);
  //  console.log("here the rules" + JSON.stringify(theModel.mRules));
  var res = analyzeContextString(contextQueryString, theModel.rules);
  debuglog(()=>JSON.stringify(res,undefined,2));
  // run through the string, search for a category
  if (!res.sentences.length) {
    return undefined;
  }
  var domains = [];
  //console.log(Sentence.dumpNiceArr(res));
  // do we have a domain ?
  res.sentences[0].forEach(function (oWordGroup) {
    if (oWordGroup.category === "domain") {
      domains.push(oWordGroup.matchedString)
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
  debuglog("attempting to determine categories")
  // try a category reverse map
  res.sentences[0].forEach(function (oWordGroup) {
    if (oWordGroup.category === "category") {
      var sCat = oWordGroup.matchedString;
      var doms = Model.getDomainsForCategory(theModel, sCat);
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
};