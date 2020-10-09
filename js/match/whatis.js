"use strict";
/**
 *
 * @module jfseb.fdevstart.analyze
 * @file analyze.ts
 * @copyright (c) 2016 Gerd Forstmann
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIndiscriminateResultTupel = exports.analyzeCategoryMult = exports.analyzeContextString = exports.processString = exports.filterAcceptingOnly = exports.analyzeCategoryMultOnlyAndComma = exports.splitAtCommaAnd = exports.analyzeCategory = exports.dumpNiceTupel = exports.cmpRecords = exports.cmpByResultThenRankingTupel = exports.safeDelta = exports.safeEqual = exports.localeCompareRecord = exports.localeCompareRecordArrays = exports.localeCompareArrays = exports.mockDebug = void 0;
const mgnlq_parser1_1 = require("mgnlq_parser1");
const debug = require("debug");
var debuglog = debug('whatis');
var debuglogV = debug('whatVis');
var perflog = debug('perf');
const mgnlq_parser1_2 = require("mgnlq_parser1");
function mockDebug(o) {
    debuglog = o;
    debuglogV = o;
    perflog = o;
}
exports.mockDebug = mockDebug;
//import * as Match from './match';
//import * as Toolmatcher from './toolmatcher';
const mgnlq_parser1_3 = require("mgnlq_parser1");
const Algol = require("./algol");
/*
export function cmpByResultThenRanking(a: IMatch.IWhatIsAnswer, b: IMatch.IWhatIsAnswer) {
  var cmp = a.result.localeCompare(b.result);
  if (cmp) {
    return cmp;
  }
  return -(a._ranking - b._ranking);
}
*/
function localeCompareArrays(aaresult, bbresult) {
    var cmp = 0;
    var blen = bbresult.length;
    aaresult.every(function (a, index) {
        if (blen <= index) {
            cmp = -1;
            return false;
        }
        cmp = a.localeCompare(bbresult[index]);
        if (cmp) {
            return false;
        }
        return true;
    });
    if (cmp) {
        return cmp;
    }
    if (blen > aaresult.length) {
        cmp = +1;
        return cmp;
    }
    return 0;
}
exports.localeCompareArrays = localeCompareArrays;
function localeCompareRecordArrays(aaresult, bbresult) {
    var cmp = 0;
    var blen = bbresult.length;
    aaresult.every(function (a, index) {
        if (blen <= index) {
            cmp = -1;
            return false;
        }
        cmp = localeCompareRecord(a, bbresult[index]);
        if (cmp) {
            return false;
        }
        return true;
    });
    if (cmp) {
        return cmp;
    }
    if (blen > aaresult.length) {
        cmp = +1;
        return cmp;
    }
    return 0;
}
exports.localeCompareRecordArrays = localeCompareRecordArrays;
function localeCompareRecord(aaresult, bbresult) {
    var cmp = 0;
    var blen = bbresult.length;
    var keys = Object.keys(aaresult).sort();
    keys.every(function (keya, index) {
        var a = aaresult[keya];
        if (blen <= index) {
            cmp = -1;
            return false;
        }
        var b = bbresult[keya];
        var ta = typeof a;
        var tb = typeof b;
        if (ta !== tb) {
            cmp = ta.localeCompare(tb);
            return false;
        }
        if (typeof ta === 'number') {
            cmp = safeDelta(a, b);
        }
        else {
            cmp = a.localeCompare(b);
        }
        if (cmp) {
            return false;
        }
        return true;
    });
    if (cmp) {
        return cmp;
    }
    if (blen > aaresult.length) {
        cmp = +1;
        return cmp;
    }
    return 0;
}
exports.localeCompareRecord = localeCompareRecord;
function safeEqual(a, b) {
    var delta = a - b;
    if (Math.abs(delta) < Algol.RANKING_EPSILON) {
        return true;
    }
    return false;
}
exports.safeEqual = safeEqual;
function safeDelta(a, b) {
    var delta = a - b;
    if (Math.abs(delta) < Algol.RANKING_EPSILON) {
        return 0;
    }
    return delta;
}
exports.safeDelta = safeDelta;
function cmpByResultThenRankingTupel(aa, bb) {
    var cmp = localeCompareRecordArrays(aa.results, bb.results);
    if (cmp) {
        return cmp;
    }
    return 0; // -safeDelta(aa._ranking,bb._ranking);
}
exports.cmpByResultThenRankingTupel = cmpByResultThenRankingTupel;
function cmpRecords(a, b) {
    // are records different?
    var keys = Object.keys(a).concat(Object.keys(b)).sort();
    var res = keys.reduce(function (prev, sKey) {
        if (prev) {
            return prev;
        }
        if (b[sKey] !== a[sKey]) {
            if (!b[sKey]) {
                return -1;
            }
            if (!a[sKey]) {
                return +1;
            }
            return a[sKey].localeCompare(b[sKey]);
        }
        return 0;
    }, 0);
    return res;
}
exports.cmpRecords = cmpRecords;
/*
export function cmpByRanking(a: IMatch.IWhatIsAnswer, b: IMatch.IWhatIsAnswer) : number {
  var cmp = - safeDelta(a._ranking, b._ranking) as number;
  if (cmp) {
    return cmp;
  }
  cmp = a.result.localeCompare(b.result);
  if (cmp) {
    return cmp;
  }

  return cmpRecords(a.record,b.record);
}
*/
/*
export function cmpByRankingTupel(a: IMatch.IWhatIsTupelAnswer, b: IMatch.IWhatIsTupelAnswer) : number {
  var cmp = 0; // - safeDelta(a._ranking, b._ranking);
  if (cmp) {
    return cmp;
  }
  cmp = localeCompareRecordArrays(a.results, b.results);
  if (cmp) {
    return cmp;
  }
  return 0; //cmpRecords(a.record,b.record);
}
*/
function dumpNiceTupel(answer) {
    var result = {
        s: "",
        push: function (s) { this.s = this.s + s; }
    };
    var s = `**Result for categories: ${answer.columns.join(";")} is ${answer.results}
 rank: ${1 /*answer._ranking*/}
`;
    result.push(s);
    answer.results.forEach(function (queryresult, index) {
        answer.columns.forEach(function (sRequires, index) {
            if (sRequires.charAt(0) !== '_') {
                result.push(`record: ${sRequires} -> ${queryresult[sRequires]}`);
            }
            result.push('\n');
        });
    });
    var oSentence = answer.aux.sentence || [];
    oSentence.forEach(function (oWord, index) {
        var sWord = `[${index}] : ${oWord.category} "${oWord.string}" => "${oWord.matchedString}"`;
        result.push(sWord + "\n");
    });
    result.push(".\n");
    return result.s;
}
exports.dumpNiceTupel = dumpNiceTupel;
/*
export function filterDistinctResultAndSortTupel(res: IMatch.IProcessedWhatIsTupelAnswers): IMatch.IProcessedWhatIsTupelAnswers {
  var result = res.tupelanswers.filter(function (iRes, index) {
    if (debuglog.enabled) {
      debuglog(' retain tupel ' + index + ' ' + JSON.stringify(iRes));
    }
    if (_.isEqual(iRes.result, res.tupelanswers[index - 1] && res.tupelanswers[index - 1].result)) {
      debuglog('skip');
      return false;
    }
    return true;
  });
  result.sort(cmpByRankingTupel);
  return (Object as any).assign(res, { tupelanswers: result });
}
*/
/*
export function filterOnlyTopRanked(results: Array<IMatch.IWhatIsAnswer>): Array<IMatch.IWhatIsAnswer> {
  var res = results.filter(function (result) {
    if (safeEqual(result._ranking, results[0]._ranking)) {
      return true;
    }
    if (result._ranking >= results[0]._ranking) {
      throw new Error("List to filter must be ordered");
    }
    return false;
  });
  return res;
}

export function filterOnlyTopRankedTupel(results: Array<IMatch.IWhatIsTupelAnswer>): Array<IMatch.IWhatIsTupelAnswer> {
  var res = results.filter(function (result) {
    if ( safeEqual(result._ranking, results[0]._ranking)) {
      return true;
    }
    if (result._ranking >= results[0]._ranking) {
      throw new Error("List to filter must be ordered");
    }
    return false;
  });
  return res;
}
*/
/**
 * A ranking which is purely based on the numbers of matched entities,
 * disregarding exactness of match
 */
/*
export function calcRankingSimple(matched: number,
  mismatched: number, nouse: number,
  relevantCount: number): number {
  // 2 : 0
  // 1 : 0
  var factor = matched * Math.pow(1.5, matched) * Math.pow(1.5, matched);
  var factor2 = Math.pow(0.4, mismatched);
  var factor3 = Math.pow(0.4, nouse);
  return Math.pow(factor2 * factor * factor3, 1 / (mismatched + matched + nouse));
}
*/
/*
export function calcRankingHavingCategory(matched: { [key: string]: IMatch.IWord },
  hasCategory: { [key: string]: number },
  mismatched: { [key: string]: IMatch.IWord }, relevantCount: number, hasDomain : number): number {


  var lenMatched = Object.keys(matched).length;
  var factor = Match.calcRankingProduct(matched);
  factor *= Math.pow(1.5, lenMatched);
  if(hasDomain) {
    factor *= 1.5;
  }
  var lenHasCategory = Object.keys(hasCategory).length;
  var factorH = Math.pow(1.1, lenHasCategory);

  var lenMisMatched = Object.keys(mismatched).length;
  var factor2 = Match.calcRankingProduct(mismatched);
  factor2 *= Math.pow(0.4, lenMisMatched);
  var divisor =  (lenMisMatched + lenHasCategory + lenMatched);
  divisor = divisor ? divisor : 1;
  return Math.pow(factor2 * factorH * factor, 1 / (divisor));
}
*/
/**
 * list all top level rankings
 */
/*
export function matchRecordsHavingContext(
  pSentences: IMatch.IProcessedSentences, category: string, records: Array<IMatch.IRecord>,
  categorySet: { [key: string]: boolean })
  : IMatch.IProcessedWhatIsAnswers {

  //debuglog(JSON.stringify(records, undefined, 2));
  var relevantRecords = records.filter(function (record: IMatch.IRecord) {
    return (record[category] !== undefined) && (record[category] !== null);
  });
  var res = [];
  debuglog("MatchRecordsHavingContext : relevant records nr:" + relevantRecords.length);
  debuglog(debuglog.enabled ? ("sentences are : " + JSON.stringify(pSentences, undefined, 2)) : "-");
  debuglog(debuglog.enabled ? ("category " + category + " and categoryset is: " + JSON.stringify(categorySet, undefined, 2)) : "-");
  if (process.env.ABOT_FAST && categorySet) {
    // we are only interested in categories present in records for domains which contain the category
    // var categoryset = Model.calculateRelevantRecordCategories(theModel,category);
    //knowing the target
    perflog("got categoryset with " + Object.keys(categorySet).length);
    var fl = 0;
    var lf = 0;
    var aSimplifiedSentences = pSentences.sentences.map(function (oSentence) {
      var fWords = oSentence.filter(function (oWord) {
        return !Word.Word.isFiller(oWord);
      });
      var rWords = oSentence.filter(function (oWord) {
        return !!categorySet[oWord.category] || Word.Word.isCategory(oWord);
      });
      fl = fl + oSentence.length;
      lf = lf + rWords.length;
      return {
        oSentence: oSentence,
        cntRelevantWords: rWords.length, // not a filler  // to be compatible it would be fWords
        rWords: rWords
      };
    });
    Object.freeze(aSimplifiedSentences);
    debuglog("post simplify (r=" + relevantRecords.length + " s=" + pSentences.sentences.length + " fl " + fl + "->" + lf + ")");
    perflog("post simplify (r=" + relevantRecords.length + " s=" + pSentences.sentences.length + " fl " + fl + "->" + lf + ")");
    relevantRecords.forEach(function (record) {
      // count matches in record which are *not* the category
      aSimplifiedSentences.forEach(function (aSentence) {
        var hasCategory = {};
        var mismatched = {};
        var matched = {};
        var cntRelevantWords = aSentence.cntRelevantWords;
        aSentence.rWords.forEach(function (oWord) {
          if (oWord.category && (record[oWord.category] !== undefined)) {
            if (oWord.matchedString === record[oWord.category]) {
              matched[oWord.category] = oWord;
            }
            else {
              mismatched[oWord.category] = oWord;
            }
          }
          else if (Word.Word.isCategory(oWord) && record[oWord.matchedString]) {
            hasCategory[oWord.matchedString] = 1;
          }
        }
        );
        if ((Object.keys(matched).length + Object.keys(hasCategory).length) > Object.keys(mismatched).length) {
          res.push({
            sentence: aSentence.oSentence,
            record: record,
            category: category,
            result: record[category],
            _ranking: calcRankingHavingCategory(matched, hasCategory, mismatched, cntRelevantWords)
          });
        }
      })
    });
    debuglog("here in weird");
  } else {
    relevantRecords.forEach(function (record) {
      // count matches in record which are *not* the category
      pSentences.sentences.forEach(function (aSentence) {
        var hasCategory = {};
        var mismatched = {};
        var matched = {};
        var cntRelevantWords = 0;
        aSentence.forEach(function (oWord) {
          if (!Word.Word.isFiller(oWord)) {
            cntRelevantWords = cntRelevantWords + 1;
            if (oWord.category && (record[oWord.category] !== undefined)) {
              if (oWord.matchedString === record[oWord.category]) {
                matched[oWord.category] = oWord;
              }
              else {
                mismatched[oWord.category] = oWord;
              }
            }
            else if (Word.Word.isCategory(oWord) && record[oWord.matchedString]) {
              hasCategory[oWord.matchedString] = 1;
            }
          }
        });
        if ((Object.keys(matched).length + Object.keys(hasCategory).length) > Object.keys(mismatched).length) {
          res.push({
            sentence: aSentence,
            record: record,
            category: category,
            result: record[category],
            _ranking: calcRankingHavingCategory(matched, hasCategory, mismatched, cntRelevantWords)
          });
        }
      })
    });
  }
  res.sort(cmpByResultThenRanking);
  debuglog(" after sort" + res.length);
  var result = Object.assign({}, pSentences, { answers: res });
  return filterRetainTopRankedResult(result);
}
*/
/*
export function matchRecords(aSentences: IMatch.IProcessedSentences, category: string, records: Array<IMatch.IRecord>)
  : IMatch.IProcessedWhatIsAnswers {
  // if (debuglog.enabled) {
  //   debuglog(JSON.stringify(records, undefined, 2));
  // }
  var relevantRecords = records.filter(function (record: IMatch.IRecord) {
    return (record[category] !== undefined) && (record[category] !== null);
  });
  var res = [];
  debuglog("relevant records nr:" + relevantRecords.length);
  relevantRecords.forEach(function (record) {
    aSentences.sentences.forEach(function (aSentence) {
      // count matches in record which are *not* the category
      var mismatched = {}
      var matched = {};
      var cntRelevantWords = 0;
      aSentence.forEach(function (oWord) {
        if (!Word.Word.isFiller(oWord)) {
          cntRelevantWords = cntRelevantWords + 1;
          if (oWord.category && (record[oWord.category] !== undefined)) {
            if (oWord.matchedString === record[oWord.category]) {
              matched[oWord.category] = oWord;
            } else {
              mismatched[oWord.category] = oWord;
            }
          }
        }
      });
      if (Object.keys(matched).length > Object.keys(mismatched).length) {
        res.push({
          sentence: aSentence,
          record: record,
          category: category,
          result: record[category],
          _ranking: calcRanking(matched, mismatched, cntRelevantWords)
        });
      }
    })
  });
  res.sort(cmpByResultThenRanking);
  var result = Object.assign({}, aSentences, { answers: res });
  return filterRetainTopRankedResult(result);
}
*/
/*
function makeSimplifiedSentencesCategorySet(aSentences: IMatch.IProcessedSentences,
  categorySet: { [key: string]: boolean }, track: { fl: number, lf: number }
): {
  domains: string[],
  oSentence: IMatch.ISentence,
  cntRelevantWords: number,
  rWords: IMatch.IWord[]
}[] {
  return aSentences.sentences.map(function (oSentence) {
    var aDomains = [] as string[];
    var rWords = oSentence.filter(function (oWord) {
      if (oWord.category === "domain") {
        aDomains.push(oWord.matchedString);
        return false;
      }
      if (oWord.category === "meta") {
        // e.g. domain XXX
        return false;
      }
      return !!categorySet[oWord.category];
    });
    track.fl += oSentence.length;
    track.lf += rWords.length;
    return {
      domains: aDomains,
      oSentence: oSentence,
      cntRelevantWords: rWords.length,
      rWords: rWords
    };
  });
}
*/
/*
function makeSimplifiedSentencesCategorySet2(aSentences: IMatch.IProcessedSentences,
  categorySet: { [key: string]: boolean }, track: { fl: number, lf: number }
): {
  domains: string[],
  oSentence: IMatch.ISentence,
  cntRelevantWords: number,
  rWords: IMatch.IWord[]
}[] {
  return aSentences.sentences.map(function (oSentence) {
    var aDomains = [] as string[];
    var rWords = oSentence.filter(function (oWord) {
      if (oWord.category === "domain") {
        aDomains.push(oWord.matchedString);
        return false;
      }
      if (oWord.category === "meta") {
        // e.g. domain XXX
        return false;
      }
      if(oWord.category === "category") {
        if(categorySet[oWord.matchedString]) {
          return true;
        }
      }
      return !!categorySet[oWord.category];
    });
    track.fl += oSentence.length;
    track.lf += rWords.length;
    return {
      domains: aDomains,
      oSentence: oSentence,
      cntRelevantWords: rWords.length,
      rWords: rWords
    };
  });
}
*/
/*
function makeSimplifiedSentences(aSentences : IMatch.IProcessedSentences,  track: { fl: number, lf: number }): {
  domains: string[],
  oSentence: IMatch.ISentence,
  cntRelevantWords: number,
  rWords: IMatch.IWord[]
}[] {
  return aSentences.sentences.map(function (oSentence) {
    var domains = [] as string[];
    var rWords = oSentence.filter(function (oWord) {
      if (oWord.category === "domain") {
        domains.push(oWord.matchedString);
        return false;
      }
      if (oWord.category === "meta") {
        // e.g. domain XXX
        return false;
      }
      return !Word.Word.isFiller(oWord);
    });
    track.fl += oSentence.length;
    track.lf += rWords.length;
    return {
      oSentence: oSentence,
      domains: domains,
      cntRelevantWords: rWords.length,
      rWords: rWords
    };
  });
}
*/
function classifyWordWithTargetCategory(word, targetcategory, rules, wholesentence) {
    //console.log("classify " + word + " "  + targetcategory);
    var cats = mgnlq_parser1_1.InputFilter.categorizeAWord(word, rules, wholesentence, {});
    // TODO qualify
    cats = cats.filter(function (cat) {
        return cat.category === targetcategory;
    });
    //debuglog(JSON.stringify(cats));
    if (cats.length) {
        return cats[0].matchedString;
    }
}
function analyzeCategory(categoryword, rules, wholesentence) {
    return classifyWordWithTargetCategory(categoryword, 'category', rules, wholesentence);
}
exports.analyzeCategory = analyzeCategory;
function splitAtCommaAnd(str) {
    var r = str.split(/(\band\b)|[,]/);
    r = r.filter(function (o, index) {
        if (index % 2 > 0) {
            return false;
        }
        return true;
    });
    var rtrimmed = r.map(function (o) {
        return new String(o).trim();
    });
    return rtrimmed;
}
exports.splitAtCommaAnd = splitAtCommaAnd;
/**
 * A simple implementation, splitting at and and ,
 */
function analyzeCategoryMultOnlyAndComma(categorylist, rules, wholesentence) {
    var rtrimmed = splitAtCommaAnd(categorylist);
    var rcat = rtrimmed.map(function (o) {
        return analyzeCategory(o, rules, wholesentence);
    });
    if (rcat.indexOf(undefined) >= 0) {
        throw new Error('"' + rtrimmed[rcat.indexOf(undefined)] + '" is not a category!');
    }
    return rcat;
}
exports.analyzeCategoryMultOnlyAndComma = analyzeCategoryMultOnlyAndComma;
function filterAcceptingOnly(res, categories) {
    return res.filter(function (aSentence, iIndex) {
        return aSentence.every(function (oWord) {
            return categories.indexOf(oWord.category) >= 0;
        });
    });
}
exports.filterAcceptingOnly = filterAcceptingOnly;
function processString(query, rules) {
    //  if (!process.env.ABOT_OLDMATCH) {
    return mgnlq_parser1_2.ErBase.processString(query, rules, rules.wordCache, {} /*TODO OPERATORS} */);
    //  }
    /*
      var matched = InputFilter.analyzeString(query, rules, sWords);
      if (debuglog.enabled) {
        debuglog("After matched " + JSON.stringify(matched));
      }
      var aSentences = InputFilter.expandMatchArr(matched);
      if (debuglog.enabled) {
        debuglog("after expand" + aSentences.map(function (oSentence) {
          return Sentence.rankingProduct(oSentence) + ":" + JSON.stringify(oSentence);
        }).join("\n"));
      }
      var aSentencesReinforced = InputFilter.reinForce(aSentences);
      if (debuglog.enabled) {
        debuglog("after reinforce" + aSentencesReinforced.map(function (oSentence) {
          return Sentence.rankingProduct(oSentence) + ":" + JSON.stringify(oSentence);
        }).join("\n"));
      }
      return {
        errors: [],
        sentences: aSentencesReinforced
      } as IMatch.IProcessedSentences;
    */
}
exports.processString = processString;
function analyzeContextString(contextQueryString, rules) {
    var aSentencesReinforced = processString(contextQueryString, rules);
    // we limit analysis to n sentences
    aSentencesReinforced.sentences = aSentencesReinforced.sentences.slice(0, Algol.Cutoff_Sentences);
    if (debuglog.enabled) {
        debuglog("after reinforce and cutoff" + aSentencesReinforced.sentences.length + "\n" + aSentencesReinforced.sentences.map(function (oSentence) {
            return mgnlq_parser1_3.Sentence.rankingProduct(oSentence) + ":" + JSON.stringify(oSentence);
        }).join("\n"));
    }
    return aSentencesReinforced;
}
exports.analyzeContextString = analyzeContextString;
/*
export function cmpByNrCategoriesAndSameDomain(a: IMatch.ISentence, b: IMatch.ISentence): number {
  //console.log("compare a" + a + " cntb " + b);
  var cnta = Sentence.getDistinctCategoriesInSentence(a).length;
  var cntb = Sentence.getDistinctCategoriesInSentence(b).length;
  / *
    var cnta = a.reduce(function(prev, oWord) {
      return prev + ((oWord.category === "category")? 1 : 0);
    },0);
    var cntb = b.reduce(function(prev, oWord) {
      return prev + ((oWord.category === "category")? 1 : 0);
    },0);
   // console.log("cnt a" + cnta + " cntb " + cntb);
   * /
  return cntb - cnta;
}*/
function analyzeCategoryMult(categorylist, rules, wholesentence, gWords) {
    var res = analyzeContextString(categorylist, rules);
    //  debuglog("resulting category sentences", JSON.stringify(res));
    var res2 = filterAcceptingOnly(res.sentences, ["category", "filler"]);
    //  console.log("here res2" + JSON.stringify(res2) );
    //  console.log("here undefined ! + " + res2.filter(o => !o).length);
    res2.sort(mgnlq_parser1_3.Sentence.cmpRankingProduct);
    debuglog("resulting category sentences: \n", debuglog.enabled ? (mgnlq_parser1_3.Sentence.dumpNiceArr(res2.slice(0, 3), mgnlq_parser1_3.Sentence.rankingProduct)) : '-');
    // TODO:   res2 = filterAcceptingOnlySameDomain(res2);
    //debuglog("resulting category sentences", JSON.stringify(res2, undefined, 2));
    // expect only categories
    // we could rank now by common domains , but for now we only take the first one
    if (!res2.length) {
        return undefined;
    }
    //res.sort(cmpByNrCategoriesAndSameDomain);
    var rescat = mgnlq_parser1_3.Sentence.getDistinctCategoriesInSentence(res2[0]);
    return rescat;
    // "" return res[0].filter()
    // return classifyWordWithTargetCategory(categorylist, 'category', rules, wholesentence);
}
exports.analyzeCategoryMult = analyzeCategoryMult;
/*
export function analyzeOperator(opword: string, rules: IMatch.SplitRules, wholesentence: string): string {
  return classifyWordWithTargetCategory(opword, 'operator', rules, wholesentence);
}
*/
// const result = WhatIs.resolveCategory(cat, a1.entity,
//   theModel.mRules, theModel.tools, theModel.records);
function isIndiscriminateResultTupel(results) {
    var cnt = results.reduce(function (prev, result) {
        if (safeEqual(1, 1)) { // result._ranking,results[0]._ranking)) {
            return prev + 1;
        }
    }, 0);
    if (cnt > 1) {
        // search for a discriminating category value
        var discriminating = []; /*Object.keys(results[0].record).reduce(function (prev, category) {
          if ((category.charAt(0) !== '_' && results[0].categories.indexOf(category) < 0)
            && (results[0].record[category] !== results[1].record[category])) {
            prev.push(category);
          }
          return prev;
        }, []); */
        if (discriminating.length) {
            return "Many comparable results, perhaps you want to specify a discriminating " + discriminating.join(',') + ' or use "list all ..."';
        }
        return 'Your question does not have a specific answer';
    }
    return undefined;
}
exports.isIndiscriminateResultTupel = isIndiscriminateResultTupel;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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Tyx3RUFBd0UsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLHdCQUF3QixDQUFDO1NBQ3ZJO1FBQ0QsT0FBTywrQ0FBK0MsQ0FBQztLQUN4RDtJQUNELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFyQkQsa0VBcUJDIiwiZmlsZSI6Im1hdGNoL3doYXRpcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICpcbiAqIEBtb2R1bGUgamZzZWIuZmRldnN0YXJ0LmFuYWx5emVcbiAqIEBmaWxlIGFuYWx5emUudHNcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMTYgR2VyZCBGb3JzdG1hbm5cbiAqL1xuXG5cbmltcG9ydCB7IElucHV0RmlsdGVyIGFzIElucHV0RmlsdGVyfSBmcm9tICdtZ25scV9wYXJzZXIxJztcbmltcG9ydCB7IE1vbmdvUSBhcyBNb25nb1EgfSBmcm9tICdtZ25scV9wYXJzZXIxJztcbmltcG9ydCAqIGFzIExpc3RBbGwgZnJvbSAnLi9saXN0YWxsJztcblxuXG5pbXBvcnQgKiBhcyBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5cbnZhciBkZWJ1Z2xvZyA9IGRlYnVnKCd3aGF0aXMnKTtcbnZhciBkZWJ1Z2xvZ1YgPSBkZWJ1Zygnd2hhdFZpcycpO1xudmFyIHBlcmZsb2cgPSBkZWJ1ZygncGVyZicpO1xuXG5cbmltcG9ydCB7IEVyRXJyb3IgYXMgRXJFcnJvcn0gZnJvbSAnbWdubHFfcGFyc2VyMSc7XG5cbmltcG9ydCB7IEVyQmFzZSBhcyBFckJhc2V9IGZyb20gJ21nbmxxX3BhcnNlcjEnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBtb2NrRGVidWcobykge1xuICBkZWJ1Z2xvZyA9IG87XG4gIGRlYnVnbG9nViA9IG87XG4gIHBlcmZsb2cgPSBvO1xufVxuXG5cbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0ICogYXMgSU1hdGNoIGZyb20gJy4vaWZtYXRjaCc7XG5cbi8vaW1wb3J0ICogYXMgTWF0Y2ggZnJvbSAnLi9tYXRjaCc7XG4vL2ltcG9ydCAqIGFzIFRvb2xtYXRjaGVyIGZyb20gJy4vdG9vbG1hdGNoZXInO1xuXG5pbXBvcnQgeyBTZW50ZW5jZSBhcyBTZW50ZW5jZX0gZnJvbSAnbWdubHFfcGFyc2VyMSc7XG5cbmltcG9ydCB7IFdvcmQgYXMgV29yZH0gIGZyb20gJ21nbmxxX3BhcnNlcjEnO1xuXG5pbXBvcnQgKiBhcyBBbGdvbCBmcm9tICcuL2FsZ29sJztcblxuaW1wb3J0IHtNb2RlbCBhcyBNb2RlbH0gIGZyb20gJ21nbmxxX21vZGVsJztcblxuXG5cbi8qXG5leHBvcnQgZnVuY3Rpb24gY21wQnlSZXN1bHRUaGVuUmFua2luZyhhOiBJTWF0Y2guSVdoYXRJc0Fuc3dlciwgYjogSU1hdGNoLklXaGF0SXNBbnN3ZXIpIHtcbiAgdmFyIGNtcCA9IGEucmVzdWx0LmxvY2FsZUNvbXBhcmUoYi5yZXN1bHQpO1xuICBpZiAoY21wKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuICByZXR1cm4gLShhLl9yYW5raW5nIC0gYi5fcmFua2luZyk7XG59XG4qL1xuXG5leHBvcnQgZnVuY3Rpb24gbG9jYWxlQ29tcGFyZUFycmF5cyhhYXJlc3VsdDogc3RyaW5nW10sIGJicmVzdWx0OiBzdHJpbmdbXSk6IG51bWJlciB7XG4gIHZhciBjbXAgPSAwO1xuICB2YXIgYmxlbiA9IGJicmVzdWx0Lmxlbmd0aDtcbiAgYWFyZXN1bHQuZXZlcnkoZnVuY3Rpb24gKGEsIGluZGV4KSB7XG4gICAgaWYgKGJsZW4gPD0gaW5kZXgpIHtcbiAgICAgIGNtcCA9IC0xO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjbXAgPSBhLmxvY2FsZUNvbXBhcmUoYmJyZXN1bHRbaW5kZXhdKTtcbiAgICBpZiAoY21wKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9KTtcbiAgaWYgKGNtcCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cbiAgaWYgKGJsZW4gPiBhYXJlc3VsdC5sZW5ndGgpIHtcbiAgICBjbXAgPSArMTtcbiAgICByZXR1cm4gY21wO1xuICB9XG4gIHJldHVybiAwO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBsb2NhbGVDb21wYXJlUmVjb3JkQXJyYXlzKGFhcmVzdWx0OiBNb25nb1EuSVJlc3VsdFJlY29yZFtdLCBiYnJlc3VsdDogTW9uZ29RLklSZXN1bHRSZWNvcmRbXSk6ICBudW1iZXIge1xuICB2YXIgY21wID0gMDtcbiAgdmFyIGJsZW4gPSBiYnJlc3VsdC5sZW5ndGg7XG4gIGFhcmVzdWx0LmV2ZXJ5KGZ1bmN0aW9uIChhLCBpbmRleCkge1xuICAgIGlmIChibGVuIDw9IGluZGV4KSB7XG4gICAgICBjbXAgPSAtMTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY21wID0gbG9jYWxlQ29tcGFyZVJlY29yZChhLGJicmVzdWx0W2luZGV4XSk7XG4gICAgaWYgKGNtcCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG4gIGlmIChjbXApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG4gIGlmIChibGVuID4gYWFyZXN1bHQubGVuZ3RoKSB7XG4gICAgY21wID0gKzE7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuICByZXR1cm4gMDtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gbG9jYWxlQ29tcGFyZVJlY29yZChhYXJlc3VsdDogTW9uZ29RLklSZXN1bHRSZWNvcmQsIGJicmVzdWx0OiBNb25nb1EuSVJlc3VsdFJlY29yZCk6IG51bWJlciB7XG4gIHZhciBjbXAgPSAwO1xuICB2YXIgYmxlbiA9IGJicmVzdWx0Lmxlbmd0aDtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhYXJlc3VsdCkuc29ydCgpO1xuICBrZXlzLmV2ZXJ5KGZ1bmN0aW9uIChrZXlhLCBpbmRleCkgIDogYm9vbGVhbntcbiAgIHZhciBhID0gYWFyZXN1bHRba2V5YV07XG4gICAgaWYgKGJsZW4gPD0gaW5kZXgpIHtcbiAgICAgIGNtcCA9IC0xO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgYiA9IGJicmVzdWx0W2tleWFdO1xuICAgIHZhciB0YSA9IHR5cGVvZiBhO1xuICAgIHZhciB0YiA9IHR5cGVvZiBiO1xuICAgIGlmKHRhICE9PSB0YiApIHtcbiAgICAgIGNtcCA9IHRhLmxvY2FsZUNvbXBhcmUodGIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZih0eXBlb2YgdGEgPT09ICdudW1iZXInKSB7XG4gICAgICBjbXAgPSBzYWZlRGVsdGEoYSBhcyBudW1iZXIsYiBhcyBudW1iZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjbXAgPSAoYSBhcyBzdHJpbmcpLmxvY2FsZUNvbXBhcmUoIChiIGFzIHN0cmluZykpO1xuICAgIH1cbiAgICBpZiAoY21wKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9KTtcbiAgaWYgKGNtcCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cbiAgaWYgKGJsZW4gPiBhYXJlc3VsdC5sZW5ndGgpIHtcbiAgICBjbXAgPSArMTtcbiAgICByZXR1cm4gY21wO1xuICB9XG4gIHJldHVybiAwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2FmZUVxdWFsKGEgOiBudW1iZXIsIGIgOiBudW1iZXIpIDogYm9vbGVhbiB7XG4gIHZhciBkZWx0YSA9IGEgLSBiIDtcbiAgaWYoTWF0aC5hYnMoZGVsdGEpIDwgQWxnb2wuUkFOS0lOR19FUFNJTE9OKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2FmZURlbHRhKGEgOiBudW1iZXIsIGIgOiBudW1iZXIpIDogbnVtYmVyIHtcbiAgdmFyIGRlbHRhID0gYSAtIGIgO1xuICBpZihNYXRoLmFicyhkZWx0YSkgPCBBbGdvbC5SQU5LSU5HX0VQU0lMT04pIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICByZXR1cm4gZGVsdGE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbXBCeVJlc3VsdFRoZW5SYW5raW5nVHVwZWwoYWE6IElNYXRjaC5JV2hhdElzVHVwZWxBbnN3ZXIsIGJiOiBJTWF0Y2guSVdoYXRJc1R1cGVsQW5zd2VyKSB7XG4gIHZhciBjbXAgPSBsb2NhbGVDb21wYXJlUmVjb3JkQXJyYXlzKGFhLnJlc3VsdHMsIGJiLnJlc3VsdHMpO1xuICBpZiAoY21wKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuICByZXR1cm4gMDsgLy8gLXNhZmVEZWx0YShhYS5fcmFua2luZyxiYi5fcmFua2luZyk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNtcFJlY29yZHMoYTogSU1hdGNoLklSZWNvcmQsIGI6IElNYXRjaC5JUmVjb3JkKSA6IG51bWJlciB7XG4gIC8vIGFyZSByZWNvcmRzIGRpZmZlcmVudD9cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhKS5jb25jYXQoT2JqZWN0LmtleXMoYikpLnNvcnQoKTtcbiAgdmFyIHJlcyA9IGtleXMucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCBzS2V5KSB7XG4gICAgaWYgKHByZXYpIHtcbiAgICAgIHJldHVybiBwcmV2O1xuICAgIH1cbiAgICBpZiAoYltzS2V5XSAhPT0gYVtzS2V5XSkge1xuICAgICAgaWYgKCFiW3NLZXldKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIGlmICghYVtzS2V5XSkge1xuICAgICAgICByZXR1cm4gKzE7XG4gICAgICB9XG4gICAgICByZXR1cm4gYVtzS2V5XS5sb2NhbGVDb21wYXJlKGJbc0tleV0pO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfSwgMCk7XG4gIHJldHVybiByZXM7XG59XG5cbi8qXG5leHBvcnQgZnVuY3Rpb24gY21wQnlSYW5raW5nKGE6IElNYXRjaC5JV2hhdElzQW5zd2VyLCBiOiBJTWF0Y2guSVdoYXRJc0Fuc3dlcikgOiBudW1iZXIge1xuICB2YXIgY21wID0gLSBzYWZlRGVsdGEoYS5fcmFua2luZywgYi5fcmFua2luZykgYXMgbnVtYmVyO1xuICBpZiAoY21wKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuICBjbXAgPSBhLnJlc3VsdC5sb2NhbGVDb21wYXJlKGIucmVzdWx0KTtcbiAgaWYgKGNtcCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICByZXR1cm4gY21wUmVjb3JkcyhhLnJlY29yZCxiLnJlY29yZCk7XG59XG4qL1xuXG4vKlxuZXhwb3J0IGZ1bmN0aW9uIGNtcEJ5UmFua2luZ1R1cGVsKGE6IElNYXRjaC5JV2hhdElzVHVwZWxBbnN3ZXIsIGI6IElNYXRjaC5JV2hhdElzVHVwZWxBbnN3ZXIpIDogbnVtYmVyIHtcbiAgdmFyIGNtcCA9IDA7IC8vIC0gc2FmZURlbHRhKGEuX3JhbmtpbmcsIGIuX3JhbmtpbmcpO1xuICBpZiAoY21wKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuICBjbXAgPSBsb2NhbGVDb21wYXJlUmVjb3JkQXJyYXlzKGEucmVzdWx0cywgYi5yZXN1bHRzKTtcbiAgaWYgKGNtcCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cbiAgcmV0dXJuIDA7IC8vY21wUmVjb3JkcyhhLnJlY29yZCxiLnJlY29yZCk7XG59XG4qL1xuXG5leHBvcnQgZnVuY3Rpb24gZHVtcE5pY2VUdXBlbChhbnN3ZXI6IElNYXRjaC5JV2hhdElzVHVwZWxBbnN3ZXIpIHtcbiAgdmFyIHJlc3VsdCA9IHtcbiAgICBzOiBcIlwiLFxuICAgIHB1c2g6IGZ1bmN0aW9uIChzKSB7IHRoaXMucyA9IHRoaXMucyArIHM7IH1cbiAgfTtcbiAgdmFyIHMgPVxuICAgIGAqKlJlc3VsdCBmb3IgY2F0ZWdvcmllczogJHthbnN3ZXIuY29sdW1ucy5qb2luKFwiO1wiKX0gaXMgJHthbnN3ZXIucmVzdWx0c31cbiByYW5rOiAkezEgLyphbnN3ZXIuX3JhbmtpbmcqL31cbmA7XG4gIHJlc3VsdC5wdXNoKHMpO1xuICBhbnN3ZXIucmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uIChxdWVyeXJlc3VsdCxpbmRleCkge1xuICBhbnN3ZXIuY29sdW1ucy5mb3JFYWNoKGZ1bmN0aW9uIChzUmVxdWlyZXMsIGluZGV4KSB7XG4gICAgaWYgKHNSZXF1aXJlcy5jaGFyQXQoMCkgIT09ICdfJykge1xuICAgICAgcmVzdWx0LnB1c2goYHJlY29yZDogJHtzUmVxdWlyZXN9IC0+ICR7cXVlcnlyZXN1bHRbc1JlcXVpcmVzXX1gKTtcbiAgICB9XG4gICAgcmVzdWx0LnB1c2goJ1xcbicpO1xuICB9KTtcbn0pO1xuXG4gIHZhciBvU2VudGVuY2UgPSBhbnN3ZXIuYXV4LnNlbnRlbmNlIHx8IFtdO1xuICBvU2VudGVuY2UuZm9yRWFjaChmdW5jdGlvbiAob1dvcmQsIGluZGV4KSB7XG4gICAgdmFyIHNXb3JkID0gYFske2luZGV4fV0gOiAke29Xb3JkLmNhdGVnb3J5fSBcIiR7b1dvcmQuc3RyaW5nfVwiID0+IFwiJHtvV29yZC5tYXRjaGVkU3RyaW5nfVwiYFxuICAgIHJlc3VsdC5wdXNoKHNXb3JkICsgXCJcXG5cIik7XG4gIH0pXG4gIHJlc3VsdC5wdXNoKFwiLlxcblwiKTtcbiAgcmV0dXJuIHJlc3VsdC5zO1xufVxuXG4vKlxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckRpc3RpbmN0UmVzdWx0QW5kU29ydFR1cGVsKHJlczogSU1hdGNoLklQcm9jZXNzZWRXaGF0SXNUdXBlbEFuc3dlcnMpOiBJTWF0Y2guSVByb2Nlc3NlZFdoYXRJc1R1cGVsQW5zd2VycyB7XG4gIHZhciByZXN1bHQgPSByZXMudHVwZWxhbnN3ZXJzLmZpbHRlcihmdW5jdGlvbiAoaVJlcywgaW5kZXgpIHtcbiAgICBpZiAoZGVidWdsb2cuZW5hYmxlZCkge1xuICAgICAgZGVidWdsb2coJyByZXRhaW4gdHVwZWwgJyArIGluZGV4ICsgJyAnICsgSlNPTi5zdHJpbmdpZnkoaVJlcykpO1xuICAgIH1cbiAgICBpZiAoXy5pc0VxdWFsKGlSZXMucmVzdWx0LCByZXMudHVwZWxhbnN3ZXJzW2luZGV4IC0gMV0gJiYgcmVzLnR1cGVsYW5zd2Vyc1tpbmRleCAtIDFdLnJlc3VsdCkpIHtcbiAgICAgIGRlYnVnbG9nKCdza2lwJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9KTtcbiAgcmVzdWx0LnNvcnQoY21wQnlSYW5raW5nVHVwZWwpO1xuICByZXR1cm4gKE9iamVjdCBhcyBhbnkpLmFzc2lnbihyZXMsIHsgdHVwZWxhbnN3ZXJzOiByZXN1bHQgfSk7XG59XG4qL1xuXG4vKlxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlck9ubHlUb3BSYW5rZWQocmVzdWx0czogQXJyYXk8SU1hdGNoLklXaGF0SXNBbnN3ZXI+KTogQXJyYXk8SU1hdGNoLklXaGF0SXNBbnN3ZXI+IHtcbiAgdmFyIHJlcyA9IHJlc3VsdHMuZmlsdGVyKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICBpZiAoc2FmZUVxdWFsKHJlc3VsdC5fcmFua2luZywgcmVzdWx0c1swXS5fcmFua2luZykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAocmVzdWx0Ll9yYW5raW5nID49IHJlc3VsdHNbMF0uX3JhbmtpbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpc3QgdG8gZmlsdGVyIG11c3QgYmUgb3JkZXJlZFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcbiAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlck9ubHlUb3BSYW5rZWRUdXBlbChyZXN1bHRzOiBBcnJheTxJTWF0Y2guSVdoYXRJc1R1cGVsQW5zd2VyPik6IEFycmF5PElNYXRjaC5JV2hhdElzVHVwZWxBbnN3ZXI+IHtcbiAgdmFyIHJlcyA9IHJlc3VsdHMuZmlsdGVyKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICBpZiAoIHNhZmVFcXVhbChyZXN1bHQuX3JhbmtpbmcsIHJlc3VsdHNbMF0uX3JhbmtpbmcpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHJlc3VsdC5fcmFua2luZyA+PSByZXN1bHRzWzBdLl9yYW5raW5nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMaXN0IHRvIGZpbHRlciBtdXN0IGJlIG9yZGVyZWRcIik7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG4gIHJldHVybiByZXM7XG59XG4qL1xuXG4vKipcbiAqIEEgcmFua2luZyB3aGljaCBpcyBwdXJlbHkgYmFzZWQgb24gdGhlIG51bWJlcnMgb2YgbWF0Y2hlZCBlbnRpdGllcyxcbiAqIGRpc3JlZ2FyZGluZyBleGFjdG5lc3Mgb2YgbWF0Y2hcbiAqL1xuLypcbmV4cG9ydCBmdW5jdGlvbiBjYWxjUmFua2luZ1NpbXBsZShtYXRjaGVkOiBudW1iZXIsXG4gIG1pc21hdGNoZWQ6IG51bWJlciwgbm91c2U6IG51bWJlcixcbiAgcmVsZXZhbnRDb3VudDogbnVtYmVyKTogbnVtYmVyIHtcbiAgLy8gMiA6IDBcbiAgLy8gMSA6IDBcbiAgdmFyIGZhY3RvciA9IG1hdGNoZWQgKiBNYXRoLnBvdygxLjUsIG1hdGNoZWQpICogTWF0aC5wb3coMS41LCBtYXRjaGVkKTtcbiAgdmFyIGZhY3RvcjIgPSBNYXRoLnBvdygwLjQsIG1pc21hdGNoZWQpO1xuICB2YXIgZmFjdG9yMyA9IE1hdGgucG93KDAuNCwgbm91c2UpO1xuICByZXR1cm4gTWF0aC5wb3coZmFjdG9yMiAqIGZhY3RvciAqIGZhY3RvcjMsIDEgLyAobWlzbWF0Y2hlZCArIG1hdGNoZWQgKyBub3VzZSkpO1xufVxuKi9cbi8qXG5leHBvcnQgZnVuY3Rpb24gY2FsY1JhbmtpbmdIYXZpbmdDYXRlZ29yeShtYXRjaGVkOiB7IFtrZXk6IHN0cmluZ106IElNYXRjaC5JV29yZCB9LFxuICBoYXNDYXRlZ29yeTogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfSxcbiAgbWlzbWF0Y2hlZDogeyBba2V5OiBzdHJpbmddOiBJTWF0Y2guSVdvcmQgfSwgcmVsZXZhbnRDb3VudDogbnVtYmVyLCBoYXNEb21haW4gOiBudW1iZXIpOiBudW1iZXIge1xuXG5cbiAgdmFyIGxlbk1hdGNoZWQgPSBPYmplY3Qua2V5cyhtYXRjaGVkKS5sZW5ndGg7XG4gIHZhciBmYWN0b3IgPSBNYXRjaC5jYWxjUmFua2luZ1Byb2R1Y3QobWF0Y2hlZCk7XG4gIGZhY3RvciAqPSBNYXRoLnBvdygxLjUsIGxlbk1hdGNoZWQpO1xuICBpZihoYXNEb21haW4pIHtcbiAgICBmYWN0b3IgKj0gMS41O1xuICB9XG4gIHZhciBsZW5IYXNDYXRlZ29yeSA9IE9iamVjdC5rZXlzKGhhc0NhdGVnb3J5KS5sZW5ndGg7XG4gIHZhciBmYWN0b3JIID0gTWF0aC5wb3coMS4xLCBsZW5IYXNDYXRlZ29yeSk7XG5cbiAgdmFyIGxlbk1pc01hdGNoZWQgPSBPYmplY3Qua2V5cyhtaXNtYXRjaGVkKS5sZW5ndGg7XG4gIHZhciBmYWN0b3IyID0gTWF0Y2guY2FsY1JhbmtpbmdQcm9kdWN0KG1pc21hdGNoZWQpO1xuICBmYWN0b3IyICo9IE1hdGgucG93KDAuNCwgbGVuTWlzTWF0Y2hlZCk7XG4gIHZhciBkaXZpc29yID0gIChsZW5NaXNNYXRjaGVkICsgbGVuSGFzQ2F0ZWdvcnkgKyBsZW5NYXRjaGVkKTtcbiAgZGl2aXNvciA9IGRpdmlzb3IgPyBkaXZpc29yIDogMTtcbiAgcmV0dXJuIE1hdGgucG93KGZhY3RvcjIgKiBmYWN0b3JIICogZmFjdG9yLCAxIC8gKGRpdmlzb3IpKTtcbn1cbiovXG5cbi8qKlxuICogbGlzdCBhbGwgdG9wIGxldmVsIHJhbmtpbmdzXG4gKi9cbi8qXG5leHBvcnQgZnVuY3Rpb24gbWF0Y2hSZWNvcmRzSGF2aW5nQ29udGV4dChcbiAgcFNlbnRlbmNlczogSU1hdGNoLklQcm9jZXNzZWRTZW50ZW5jZXMsIGNhdGVnb3J5OiBzdHJpbmcsIHJlY29yZHM6IEFycmF5PElNYXRjaC5JUmVjb3JkPixcbiAgY2F0ZWdvcnlTZXQ6IHsgW2tleTogc3RyaW5nXTogYm9vbGVhbiB9KVxuICA6IElNYXRjaC5JUHJvY2Vzc2VkV2hhdElzQW5zd2VycyB7XG5cbiAgLy9kZWJ1Z2xvZyhKU09OLnN0cmluZ2lmeShyZWNvcmRzLCB1bmRlZmluZWQsIDIpKTtcbiAgdmFyIHJlbGV2YW50UmVjb3JkcyA9IHJlY29yZHMuZmlsdGVyKGZ1bmN0aW9uIChyZWNvcmQ6IElNYXRjaC5JUmVjb3JkKSB7XG4gICAgcmV0dXJuIChyZWNvcmRbY2F0ZWdvcnldICE9PSB1bmRlZmluZWQpICYmIChyZWNvcmRbY2F0ZWdvcnldICE9PSBudWxsKTtcbiAgfSk7XG4gIHZhciByZXMgPSBbXTtcbiAgZGVidWdsb2coXCJNYXRjaFJlY29yZHNIYXZpbmdDb250ZXh0IDogcmVsZXZhbnQgcmVjb3JkcyBucjpcIiArIHJlbGV2YW50UmVjb3Jkcy5sZW5ndGgpO1xuICBkZWJ1Z2xvZyhkZWJ1Z2xvZy5lbmFibGVkID8gKFwic2VudGVuY2VzIGFyZSA6IFwiICsgSlNPTi5zdHJpbmdpZnkocFNlbnRlbmNlcywgdW5kZWZpbmVkLCAyKSkgOiBcIi1cIik7XG4gIGRlYnVnbG9nKGRlYnVnbG9nLmVuYWJsZWQgPyAoXCJjYXRlZ29yeSBcIiArIGNhdGVnb3J5ICsgXCIgYW5kIGNhdGVnb3J5c2V0IGlzOiBcIiArIEpTT04uc3RyaW5naWZ5KGNhdGVnb3J5U2V0LCB1bmRlZmluZWQsIDIpKSA6IFwiLVwiKTtcbiAgaWYgKHByb2Nlc3MuZW52LkFCT1RfRkFTVCAmJiBjYXRlZ29yeVNldCkge1xuICAgIC8vIHdlIGFyZSBvbmx5IGludGVyZXN0ZWQgaW4gY2F0ZWdvcmllcyBwcmVzZW50IGluIHJlY29yZHMgZm9yIGRvbWFpbnMgd2hpY2ggY29udGFpbiB0aGUgY2F0ZWdvcnlcbiAgICAvLyB2YXIgY2F0ZWdvcnlzZXQgPSBNb2RlbC5jYWxjdWxhdGVSZWxldmFudFJlY29yZENhdGVnb3JpZXModGhlTW9kZWwsY2F0ZWdvcnkpO1xuICAgIC8va25vd2luZyB0aGUgdGFyZ2V0XG4gICAgcGVyZmxvZyhcImdvdCBjYXRlZ29yeXNldCB3aXRoIFwiICsgT2JqZWN0LmtleXMoY2F0ZWdvcnlTZXQpLmxlbmd0aCk7XG4gICAgdmFyIGZsID0gMDtcbiAgICB2YXIgbGYgPSAwO1xuICAgIHZhciBhU2ltcGxpZmllZFNlbnRlbmNlcyA9IHBTZW50ZW5jZXMuc2VudGVuY2VzLm1hcChmdW5jdGlvbiAob1NlbnRlbmNlKSB7XG4gICAgICB2YXIgZldvcmRzID0gb1NlbnRlbmNlLmZpbHRlcihmdW5jdGlvbiAob1dvcmQpIHtcbiAgICAgICAgcmV0dXJuICFXb3JkLldvcmQuaXNGaWxsZXIob1dvcmQpO1xuICAgICAgfSk7XG4gICAgICB2YXIgcldvcmRzID0gb1NlbnRlbmNlLmZpbHRlcihmdW5jdGlvbiAob1dvcmQpIHtcbiAgICAgICAgcmV0dXJuICEhY2F0ZWdvcnlTZXRbb1dvcmQuY2F0ZWdvcnldIHx8IFdvcmQuV29yZC5pc0NhdGVnb3J5KG9Xb3JkKTtcbiAgICAgIH0pO1xuICAgICAgZmwgPSBmbCArIG9TZW50ZW5jZS5sZW5ndGg7XG4gICAgICBsZiA9IGxmICsgcldvcmRzLmxlbmd0aDtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG9TZW50ZW5jZTogb1NlbnRlbmNlLFxuICAgICAgICBjbnRSZWxldmFudFdvcmRzOiByV29yZHMubGVuZ3RoLCAvLyBub3QgYSBmaWxsZXIgIC8vIHRvIGJlIGNvbXBhdGlibGUgaXQgd291bGQgYmUgZldvcmRzXG4gICAgICAgIHJXb3JkczogcldvcmRzXG4gICAgICB9O1xuICAgIH0pO1xuICAgIE9iamVjdC5mcmVlemUoYVNpbXBsaWZpZWRTZW50ZW5jZXMpO1xuICAgIGRlYnVnbG9nKFwicG9zdCBzaW1wbGlmeSAocj1cIiArIHJlbGV2YW50UmVjb3Jkcy5sZW5ndGggKyBcIiBzPVwiICsgcFNlbnRlbmNlcy5zZW50ZW5jZXMubGVuZ3RoICsgXCIgZmwgXCIgKyBmbCArIFwiLT5cIiArIGxmICsgXCIpXCIpO1xuICAgIHBlcmZsb2coXCJwb3N0IHNpbXBsaWZ5IChyPVwiICsgcmVsZXZhbnRSZWNvcmRzLmxlbmd0aCArIFwiIHM9XCIgKyBwU2VudGVuY2VzLnNlbnRlbmNlcy5sZW5ndGggKyBcIiBmbCBcIiArIGZsICsgXCItPlwiICsgbGYgKyBcIilcIik7XG4gICAgcmVsZXZhbnRSZWNvcmRzLmZvckVhY2goZnVuY3Rpb24gKHJlY29yZCkge1xuICAgICAgLy8gY291bnQgbWF0Y2hlcyBpbiByZWNvcmQgd2hpY2ggYXJlICpub3QqIHRoZSBjYXRlZ29yeVxuICAgICAgYVNpbXBsaWZpZWRTZW50ZW5jZXMuZm9yRWFjaChmdW5jdGlvbiAoYVNlbnRlbmNlKSB7XG4gICAgICAgIHZhciBoYXNDYXRlZ29yeSA9IHt9O1xuICAgICAgICB2YXIgbWlzbWF0Y2hlZCA9IHt9O1xuICAgICAgICB2YXIgbWF0Y2hlZCA9IHt9O1xuICAgICAgICB2YXIgY250UmVsZXZhbnRXb3JkcyA9IGFTZW50ZW5jZS5jbnRSZWxldmFudFdvcmRzO1xuICAgICAgICBhU2VudGVuY2UucldvcmRzLmZvckVhY2goZnVuY3Rpb24gKG9Xb3JkKSB7XG4gICAgICAgICAgaWYgKG9Xb3JkLmNhdGVnb3J5ICYmIChyZWNvcmRbb1dvcmQuY2F0ZWdvcnldICE9PSB1bmRlZmluZWQpKSB7XG4gICAgICAgICAgICBpZiAob1dvcmQubWF0Y2hlZFN0cmluZyA9PT0gcmVjb3JkW29Xb3JkLmNhdGVnb3J5XSkge1xuICAgICAgICAgICAgICBtYXRjaGVkW29Xb3JkLmNhdGVnb3J5XSA9IG9Xb3JkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIG1pc21hdGNoZWRbb1dvcmQuY2F0ZWdvcnldID0gb1dvcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKFdvcmQuV29yZC5pc0NhdGVnb3J5KG9Xb3JkKSAmJiByZWNvcmRbb1dvcmQubWF0Y2hlZFN0cmluZ10pIHtcbiAgICAgICAgICAgIGhhc0NhdGVnb3J5W29Xb3JkLm1hdGNoZWRTdHJpbmddID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgaWYgKChPYmplY3Qua2V5cyhtYXRjaGVkKS5sZW5ndGggKyBPYmplY3Qua2V5cyhoYXNDYXRlZ29yeSkubGVuZ3RoKSA+IE9iamVjdC5rZXlzKG1pc21hdGNoZWQpLmxlbmd0aCkge1xuICAgICAgICAgIHJlcy5wdXNoKHtcbiAgICAgICAgICAgIHNlbnRlbmNlOiBhU2VudGVuY2Uub1NlbnRlbmNlLFxuICAgICAgICAgICAgcmVjb3JkOiByZWNvcmQsXG4gICAgICAgICAgICBjYXRlZ29yeTogY2F0ZWdvcnksXG4gICAgICAgICAgICByZXN1bHQ6IHJlY29yZFtjYXRlZ29yeV0sXG4gICAgICAgICAgICBfcmFua2luZzogY2FsY1JhbmtpbmdIYXZpbmdDYXRlZ29yeShtYXRjaGVkLCBoYXNDYXRlZ29yeSwgbWlzbWF0Y2hlZCwgY250UmVsZXZhbnRXb3JkcylcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KTtcbiAgICBkZWJ1Z2xvZyhcImhlcmUgaW4gd2VpcmRcIik7XG4gIH0gZWxzZSB7XG4gICAgcmVsZXZhbnRSZWNvcmRzLmZvckVhY2goZnVuY3Rpb24gKHJlY29yZCkge1xuICAgICAgLy8gY291bnQgbWF0Y2hlcyBpbiByZWNvcmQgd2hpY2ggYXJlICpub3QqIHRoZSBjYXRlZ29yeVxuICAgICAgcFNlbnRlbmNlcy5zZW50ZW5jZXMuZm9yRWFjaChmdW5jdGlvbiAoYVNlbnRlbmNlKSB7XG4gICAgICAgIHZhciBoYXNDYXRlZ29yeSA9IHt9O1xuICAgICAgICB2YXIgbWlzbWF0Y2hlZCA9IHt9O1xuICAgICAgICB2YXIgbWF0Y2hlZCA9IHt9O1xuICAgICAgICB2YXIgY250UmVsZXZhbnRXb3JkcyA9IDA7XG4gICAgICAgIGFTZW50ZW5jZS5mb3JFYWNoKGZ1bmN0aW9uIChvV29yZCkge1xuICAgICAgICAgIGlmICghV29yZC5Xb3JkLmlzRmlsbGVyKG9Xb3JkKSkge1xuICAgICAgICAgICAgY250UmVsZXZhbnRXb3JkcyA9IGNudFJlbGV2YW50V29yZHMgKyAxO1xuICAgICAgICAgICAgaWYgKG9Xb3JkLmNhdGVnb3J5ICYmIChyZWNvcmRbb1dvcmQuY2F0ZWdvcnldICE9PSB1bmRlZmluZWQpKSB7XG4gICAgICAgICAgICAgIGlmIChvV29yZC5tYXRjaGVkU3RyaW5nID09PSByZWNvcmRbb1dvcmQuY2F0ZWdvcnldKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hlZFtvV29yZC5jYXRlZ29yeV0gPSBvV29yZDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBtaXNtYXRjaGVkW29Xb3JkLmNhdGVnb3J5XSA9IG9Xb3JkO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChXb3JkLldvcmQuaXNDYXRlZ29yeShvV29yZCkgJiYgcmVjb3JkW29Xb3JkLm1hdGNoZWRTdHJpbmddKSB7XG4gICAgICAgICAgICAgIGhhc0NhdGVnb3J5W29Xb3JkLm1hdGNoZWRTdHJpbmddID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoKE9iamVjdC5rZXlzKG1hdGNoZWQpLmxlbmd0aCArIE9iamVjdC5rZXlzKGhhc0NhdGVnb3J5KS5sZW5ndGgpID4gT2JqZWN0LmtleXMobWlzbWF0Y2hlZCkubGVuZ3RoKSB7XG4gICAgICAgICAgcmVzLnB1c2goe1xuICAgICAgICAgICAgc2VudGVuY2U6IGFTZW50ZW5jZSxcbiAgICAgICAgICAgIHJlY29yZDogcmVjb3JkLFxuICAgICAgICAgICAgY2F0ZWdvcnk6IGNhdGVnb3J5LFxuICAgICAgICAgICAgcmVzdWx0OiByZWNvcmRbY2F0ZWdvcnldLFxuICAgICAgICAgICAgX3Jhbmtpbmc6IGNhbGNSYW5raW5nSGF2aW5nQ2F0ZWdvcnkobWF0Y2hlZCwgaGFzQ2F0ZWdvcnksIG1pc21hdGNoZWQsIGNudFJlbGV2YW50V29yZHMpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cbiAgcmVzLnNvcnQoY21wQnlSZXN1bHRUaGVuUmFua2luZyk7XG4gIGRlYnVnbG9nKFwiIGFmdGVyIHNvcnRcIiArIHJlcy5sZW5ndGgpO1xuICB2YXIgcmVzdWx0ID0gT2JqZWN0LmFzc2lnbih7fSwgcFNlbnRlbmNlcywgeyBhbnN3ZXJzOiByZXMgfSk7XG4gIHJldHVybiBmaWx0ZXJSZXRhaW5Ub3BSYW5rZWRSZXN1bHQocmVzdWx0KTtcbn1cbiovXG5cbi8qXG5leHBvcnQgZnVuY3Rpb24gbWF0Y2hSZWNvcmRzKGFTZW50ZW5jZXM6IElNYXRjaC5JUHJvY2Vzc2VkU2VudGVuY2VzLCBjYXRlZ29yeTogc3RyaW5nLCByZWNvcmRzOiBBcnJheTxJTWF0Y2guSVJlY29yZD4pXG4gIDogSU1hdGNoLklQcm9jZXNzZWRXaGF0SXNBbnN3ZXJzIHtcbiAgLy8gaWYgKGRlYnVnbG9nLmVuYWJsZWQpIHtcbiAgLy8gICBkZWJ1Z2xvZyhKU09OLnN0cmluZ2lmeShyZWNvcmRzLCB1bmRlZmluZWQsIDIpKTtcbiAgLy8gfVxuICB2YXIgcmVsZXZhbnRSZWNvcmRzID0gcmVjb3Jkcy5maWx0ZXIoZnVuY3Rpb24gKHJlY29yZDogSU1hdGNoLklSZWNvcmQpIHtcbiAgICByZXR1cm4gKHJlY29yZFtjYXRlZ29yeV0gIT09IHVuZGVmaW5lZCkgJiYgKHJlY29yZFtjYXRlZ29yeV0gIT09IG51bGwpO1xuICB9KTtcbiAgdmFyIHJlcyA9IFtdO1xuICBkZWJ1Z2xvZyhcInJlbGV2YW50IHJlY29yZHMgbnI6XCIgKyByZWxldmFudFJlY29yZHMubGVuZ3RoKTtcbiAgcmVsZXZhbnRSZWNvcmRzLmZvckVhY2goZnVuY3Rpb24gKHJlY29yZCkge1xuICAgIGFTZW50ZW5jZXMuc2VudGVuY2VzLmZvckVhY2goZnVuY3Rpb24gKGFTZW50ZW5jZSkge1xuICAgICAgLy8gY291bnQgbWF0Y2hlcyBpbiByZWNvcmQgd2hpY2ggYXJlICpub3QqIHRoZSBjYXRlZ29yeVxuICAgICAgdmFyIG1pc21hdGNoZWQgPSB7fVxuICAgICAgdmFyIG1hdGNoZWQgPSB7fTtcbiAgICAgIHZhciBjbnRSZWxldmFudFdvcmRzID0gMDtcbiAgICAgIGFTZW50ZW5jZS5mb3JFYWNoKGZ1bmN0aW9uIChvV29yZCkge1xuICAgICAgICBpZiAoIVdvcmQuV29yZC5pc0ZpbGxlcihvV29yZCkpIHtcbiAgICAgICAgICBjbnRSZWxldmFudFdvcmRzID0gY250UmVsZXZhbnRXb3JkcyArIDE7XG4gICAgICAgICAgaWYgKG9Xb3JkLmNhdGVnb3J5ICYmIChyZWNvcmRbb1dvcmQuY2F0ZWdvcnldICE9PSB1bmRlZmluZWQpKSB7XG4gICAgICAgICAgICBpZiAob1dvcmQubWF0Y2hlZFN0cmluZyA9PT0gcmVjb3JkW29Xb3JkLmNhdGVnb3J5XSkge1xuICAgICAgICAgICAgICBtYXRjaGVkW29Xb3JkLmNhdGVnb3J5XSA9IG9Xb3JkO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbWlzbWF0Y2hlZFtvV29yZC5jYXRlZ29yeV0gPSBvV29yZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKE9iamVjdC5rZXlzKG1hdGNoZWQpLmxlbmd0aCA+IE9iamVjdC5rZXlzKG1pc21hdGNoZWQpLmxlbmd0aCkge1xuICAgICAgICByZXMucHVzaCh7XG4gICAgICAgICAgc2VudGVuY2U6IGFTZW50ZW5jZSxcbiAgICAgICAgICByZWNvcmQ6IHJlY29yZCxcbiAgICAgICAgICBjYXRlZ29yeTogY2F0ZWdvcnksXG4gICAgICAgICAgcmVzdWx0OiByZWNvcmRbY2F0ZWdvcnldLFxuICAgICAgICAgIF9yYW5raW5nOiBjYWxjUmFua2luZyhtYXRjaGVkLCBtaXNtYXRjaGVkLCBjbnRSZWxldmFudFdvcmRzKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KVxuICB9KTtcbiAgcmVzLnNvcnQoY21wQnlSZXN1bHRUaGVuUmFua2luZyk7XG4gIHZhciByZXN1bHQgPSBPYmplY3QuYXNzaWduKHt9LCBhU2VudGVuY2VzLCB7IGFuc3dlcnM6IHJlcyB9KTtcbiAgcmV0dXJuIGZpbHRlclJldGFpblRvcFJhbmtlZFJlc3VsdChyZXN1bHQpO1xufVxuKi9cbi8qXG5mdW5jdGlvbiBtYWtlU2ltcGxpZmllZFNlbnRlbmNlc0NhdGVnb3J5U2V0KGFTZW50ZW5jZXM6IElNYXRjaC5JUHJvY2Vzc2VkU2VudGVuY2VzLFxuICBjYXRlZ29yeVNldDogeyBba2V5OiBzdHJpbmddOiBib29sZWFuIH0sIHRyYWNrOiB7IGZsOiBudW1iZXIsIGxmOiBudW1iZXIgfVxuKToge1xuICBkb21haW5zOiBzdHJpbmdbXSxcbiAgb1NlbnRlbmNlOiBJTWF0Y2guSVNlbnRlbmNlLFxuICBjbnRSZWxldmFudFdvcmRzOiBudW1iZXIsXG4gIHJXb3JkczogSU1hdGNoLklXb3JkW11cbn1bXSB7XG4gIHJldHVybiBhU2VudGVuY2VzLnNlbnRlbmNlcy5tYXAoZnVuY3Rpb24gKG9TZW50ZW5jZSkge1xuICAgIHZhciBhRG9tYWlucyA9IFtdIGFzIHN0cmluZ1tdO1xuICAgIHZhciByV29yZHMgPSBvU2VudGVuY2UuZmlsdGVyKGZ1bmN0aW9uIChvV29yZCkge1xuICAgICAgaWYgKG9Xb3JkLmNhdGVnb3J5ID09PSBcImRvbWFpblwiKSB7XG4gICAgICAgIGFEb21haW5zLnB1c2gob1dvcmQubWF0Y2hlZFN0cmluZyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmIChvV29yZC5jYXRlZ29yeSA9PT0gXCJtZXRhXCIpIHtcbiAgICAgICAgLy8gZS5nLiBkb21haW4gWFhYXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAhIWNhdGVnb3J5U2V0W29Xb3JkLmNhdGVnb3J5XTtcbiAgICB9KTtcbiAgICB0cmFjay5mbCArPSBvU2VudGVuY2UubGVuZ3RoO1xuICAgIHRyYWNrLmxmICs9IHJXb3Jkcy5sZW5ndGg7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRvbWFpbnM6IGFEb21haW5zLFxuICAgICAgb1NlbnRlbmNlOiBvU2VudGVuY2UsXG4gICAgICBjbnRSZWxldmFudFdvcmRzOiByV29yZHMubGVuZ3RoLFxuICAgICAgcldvcmRzOiByV29yZHNcbiAgICB9O1xuICB9KTtcbn1cbiovXG4vKlxuZnVuY3Rpb24gbWFrZVNpbXBsaWZpZWRTZW50ZW5jZXNDYXRlZ29yeVNldDIoYVNlbnRlbmNlczogSU1hdGNoLklQcm9jZXNzZWRTZW50ZW5jZXMsXG4gIGNhdGVnb3J5U2V0OiB7IFtrZXk6IHN0cmluZ106IGJvb2xlYW4gfSwgdHJhY2s6IHsgZmw6IG51bWJlciwgbGY6IG51bWJlciB9XG4pOiB7XG4gIGRvbWFpbnM6IHN0cmluZ1tdLFxuICBvU2VudGVuY2U6IElNYXRjaC5JU2VudGVuY2UsXG4gIGNudFJlbGV2YW50V29yZHM6IG51bWJlcixcbiAgcldvcmRzOiBJTWF0Y2guSVdvcmRbXVxufVtdIHtcbiAgcmV0dXJuIGFTZW50ZW5jZXMuc2VudGVuY2VzLm1hcChmdW5jdGlvbiAob1NlbnRlbmNlKSB7XG4gICAgdmFyIGFEb21haW5zID0gW10gYXMgc3RyaW5nW107XG4gICAgdmFyIHJXb3JkcyA9IG9TZW50ZW5jZS5maWx0ZXIoZnVuY3Rpb24gKG9Xb3JkKSB7XG4gICAgICBpZiAob1dvcmQuY2F0ZWdvcnkgPT09IFwiZG9tYWluXCIpIHtcbiAgICAgICAgYURvbWFpbnMucHVzaChvV29yZC5tYXRjaGVkU3RyaW5nKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKG9Xb3JkLmNhdGVnb3J5ID09PSBcIm1ldGFcIikge1xuICAgICAgICAvLyBlLmcuIGRvbWFpbiBYWFhcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYob1dvcmQuY2F0ZWdvcnkgPT09IFwiY2F0ZWdvcnlcIikge1xuICAgICAgICBpZihjYXRlZ29yeVNldFtvV29yZC5tYXRjaGVkU3RyaW5nXSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gISFjYXRlZ29yeVNldFtvV29yZC5jYXRlZ29yeV07XG4gICAgfSk7XG4gICAgdHJhY2suZmwgKz0gb1NlbnRlbmNlLmxlbmd0aDtcbiAgICB0cmFjay5sZiArPSByV29yZHMubGVuZ3RoO1xuICAgIHJldHVybiB7XG4gICAgICBkb21haW5zOiBhRG9tYWlucyxcbiAgICAgIG9TZW50ZW5jZTogb1NlbnRlbmNlLFxuICAgICAgY250UmVsZXZhbnRXb3JkczogcldvcmRzLmxlbmd0aCxcbiAgICAgIHJXb3JkczogcldvcmRzXG4gICAgfTtcbiAgfSk7XG59XG4qL1xuXG4vKlxuZnVuY3Rpb24gbWFrZVNpbXBsaWZpZWRTZW50ZW5jZXMoYVNlbnRlbmNlcyA6IElNYXRjaC5JUHJvY2Vzc2VkU2VudGVuY2VzLCAgdHJhY2s6IHsgZmw6IG51bWJlciwgbGY6IG51bWJlciB9KToge1xuICBkb21haW5zOiBzdHJpbmdbXSxcbiAgb1NlbnRlbmNlOiBJTWF0Y2guSVNlbnRlbmNlLFxuICBjbnRSZWxldmFudFdvcmRzOiBudW1iZXIsXG4gIHJXb3JkczogSU1hdGNoLklXb3JkW11cbn1bXSB7XG4gIHJldHVybiBhU2VudGVuY2VzLnNlbnRlbmNlcy5tYXAoZnVuY3Rpb24gKG9TZW50ZW5jZSkge1xuICAgIHZhciBkb21haW5zID0gW10gYXMgc3RyaW5nW107XG4gICAgdmFyIHJXb3JkcyA9IG9TZW50ZW5jZS5maWx0ZXIoZnVuY3Rpb24gKG9Xb3JkKSB7XG4gICAgICBpZiAob1dvcmQuY2F0ZWdvcnkgPT09IFwiZG9tYWluXCIpIHtcbiAgICAgICAgZG9tYWlucy5wdXNoKG9Xb3JkLm1hdGNoZWRTdHJpbmcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAob1dvcmQuY2F0ZWdvcnkgPT09IFwibWV0YVwiKSB7XG4gICAgICAgIC8vIGUuZy4gZG9tYWluIFhYWFxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gIVdvcmQuV29yZC5pc0ZpbGxlcihvV29yZCk7XG4gICAgfSk7XG4gICAgdHJhY2suZmwgKz0gb1NlbnRlbmNlLmxlbmd0aDtcbiAgICB0cmFjay5sZiArPSByV29yZHMubGVuZ3RoO1xuICAgIHJldHVybiB7XG4gICAgICBvU2VudGVuY2U6IG9TZW50ZW5jZSxcbiAgICAgIGRvbWFpbnM6IGRvbWFpbnMsXG4gICAgICBjbnRSZWxldmFudFdvcmRzOiByV29yZHMubGVuZ3RoLFxuICAgICAgcldvcmRzOiByV29yZHNcbiAgICB9O1xuICB9KTtcbn1cbiovXG5cbmZ1bmN0aW9uIGNsYXNzaWZ5V29yZFdpdGhUYXJnZXRDYXRlZ29yeSh3b3JkOiBzdHJpbmcsIHRhcmdldGNhdGVnb3J5OiBzdHJpbmcsIHJ1bGVzOiBJTWF0Y2guU3BsaXRSdWxlcyxcbiAgd2hvbGVzZW50ZW5jZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgLy9jb25zb2xlLmxvZyhcImNsYXNzaWZ5IFwiICsgd29yZCArIFwiIFwiICArIHRhcmdldGNhdGVnb3J5KTtcbiAgdmFyIGNhdHMgPSBJbnB1dEZpbHRlci5jYXRlZ29yaXplQVdvcmQod29yZCwgcnVsZXMsIHdob2xlc2VudGVuY2UsIHt9KTtcbiAgLy8gVE9ETyBxdWFsaWZ5XG4gIGNhdHMgPSBjYXRzLmZpbHRlcihmdW5jdGlvbiAoY2F0KSB7XG4gICAgcmV0dXJuIGNhdC5jYXRlZ29yeSA9PT0gdGFyZ2V0Y2F0ZWdvcnk7XG4gIH0pXG4gIC8vZGVidWdsb2coSlNPTi5zdHJpbmdpZnkoY2F0cykpO1xuICBpZiAoY2F0cy5sZW5ndGgpIHtcbiAgICByZXR1cm4gY2F0c1swXS5tYXRjaGVkU3RyaW5nO1xuICB9XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGFuYWx5emVDYXRlZ29yeShjYXRlZ29yeXdvcmQ6IHN0cmluZywgcnVsZXM6IElNYXRjaC5TcGxpdFJ1bGVzLCB3aG9sZXNlbnRlbmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gY2xhc3NpZnlXb3JkV2l0aFRhcmdldENhdGVnb3J5KGNhdGVnb3J5d29yZCwgJ2NhdGVnb3J5JywgcnVsZXMsIHdob2xlc2VudGVuY2UpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3BsaXRBdENvbW1hQW5kKHN0cjogc3RyaW5nKTogc3RyaW5nW10ge1xuICB2YXIgciA9IHN0ci5zcGxpdCgvKFxcYmFuZFxcYil8WyxdLyk7XG4gIHIgPSByLmZpbHRlcihmdW5jdGlvbiAobywgaW5kZXgpIHtcbiAgICBpZiAoaW5kZXggJSAyID4gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG4gIHZhciBydHJpbW1lZCA9IHIubWFwKGZ1bmN0aW9uIChvKSB7XG4gICAgcmV0dXJuIG5ldyBTdHJpbmcobykudHJpbSgpO1xuICB9KTtcbiAgcmV0dXJuIHJ0cmltbWVkO1xufVxuLyoqXG4gKiBBIHNpbXBsZSBpbXBsZW1lbnRhdGlvbiwgc3BsaXR0aW5nIGF0IGFuZCBhbmQgLFxuICovXG5leHBvcnQgZnVuY3Rpb24gYW5hbHl6ZUNhdGVnb3J5TXVsdE9ubHlBbmRDb21tYShjYXRlZ29yeWxpc3Q6IHN0cmluZywgcnVsZXM6IElNYXRjaC5TcGxpdFJ1bGVzLCB3aG9sZXNlbnRlbmNlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIHZhciBydHJpbW1lZCA9IHNwbGl0QXRDb21tYUFuZChjYXRlZ29yeWxpc3QpO1xuICB2YXIgcmNhdCA9IHJ0cmltbWVkLm1hcChmdW5jdGlvbiAobykge1xuICAgIHJldHVybiBhbmFseXplQ2F0ZWdvcnkobywgcnVsZXMsIHdob2xlc2VudGVuY2UpO1xuICB9KTtcbiAgaWYgKHJjYXQuaW5kZXhPZih1bmRlZmluZWQpID49IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiJyArIHJ0cmltbWVkW3JjYXQuaW5kZXhPZih1bmRlZmluZWQpXSArICdcIiBpcyBub3QgYSBjYXRlZ29yeSEnKTtcbiAgfVxuICByZXR1cm4gcmNhdDtcbn1cblxuXG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJBY2NlcHRpbmdPbmx5KHJlczogSU1hdGNoLklDYXRlZ29yaXplZFN0cmluZ1tdW10sIGNhdGVnb3JpZXM6IHN0cmluZ1tdKTpcbiAgSU1hdGNoLklDYXRlZ29yaXplZFN0cmluZ1tdW10ge1xuICByZXR1cm4gcmVzLmZpbHRlcihmdW5jdGlvbiAoYVNlbnRlbmNlLCBpSW5kZXgpIHtcbiAgICByZXR1cm4gYVNlbnRlbmNlLmV2ZXJ5KGZ1bmN0aW9uIChvV29yZCkge1xuICAgICAgcmV0dXJuIGNhdGVnb3JpZXMuaW5kZXhPZihvV29yZC5jYXRlZ29yeSkgPj0gMDtcbiAgICB9KTtcbiAgfSlcbn1cblxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NTdHJpbmcocXVlcnk6IHN0cmluZywgcnVsZXM6IElNYXRjaC5TcGxpdFJ1bGVzXG4pOiBJTWF0Y2guSVByb2Nlc3NlZFNlbnRlbmNlcyB7XG5cbi8vICBpZiAoIXByb2Nlc3MuZW52LkFCT1RfT0xETUFUQ0gpIHtcbiAgICByZXR1cm4gRXJCYXNlLnByb2Nlc3NTdHJpbmcocXVlcnksIHJ1bGVzLCBydWxlcy53b3JkQ2FjaGUsIHt9IC8qVE9ETyBPUEVSQVRPUlN9ICovICk7XG4vLyAgfVxuLypcbiAgdmFyIG1hdGNoZWQgPSBJbnB1dEZpbHRlci5hbmFseXplU3RyaW5nKHF1ZXJ5LCBydWxlcywgc1dvcmRzKTtcbiAgaWYgKGRlYnVnbG9nLmVuYWJsZWQpIHtcbiAgICBkZWJ1Z2xvZyhcIkFmdGVyIG1hdGNoZWQgXCIgKyBKU09OLnN0cmluZ2lmeShtYXRjaGVkKSk7XG4gIH1cbiAgdmFyIGFTZW50ZW5jZXMgPSBJbnB1dEZpbHRlci5leHBhbmRNYXRjaEFycihtYXRjaGVkKTtcbiAgaWYgKGRlYnVnbG9nLmVuYWJsZWQpIHtcbiAgICBkZWJ1Z2xvZyhcImFmdGVyIGV4cGFuZFwiICsgYVNlbnRlbmNlcy5tYXAoZnVuY3Rpb24gKG9TZW50ZW5jZSkge1xuICAgICAgcmV0dXJuIFNlbnRlbmNlLnJhbmtpbmdQcm9kdWN0KG9TZW50ZW5jZSkgKyBcIjpcIiArIEpTT04uc3RyaW5naWZ5KG9TZW50ZW5jZSk7XG4gICAgfSkuam9pbihcIlxcblwiKSk7XG4gIH1cbiAgdmFyIGFTZW50ZW5jZXNSZWluZm9yY2VkID0gSW5wdXRGaWx0ZXIucmVpbkZvcmNlKGFTZW50ZW5jZXMpO1xuICBpZiAoZGVidWdsb2cuZW5hYmxlZCkge1xuICAgIGRlYnVnbG9nKFwiYWZ0ZXIgcmVpbmZvcmNlXCIgKyBhU2VudGVuY2VzUmVpbmZvcmNlZC5tYXAoZnVuY3Rpb24gKG9TZW50ZW5jZSkge1xuICAgICAgcmV0dXJuIFNlbnRlbmNlLnJhbmtpbmdQcm9kdWN0KG9TZW50ZW5jZSkgKyBcIjpcIiArIEpTT04uc3RyaW5naWZ5KG9TZW50ZW5jZSk7XG4gICAgfSkuam9pbihcIlxcblwiKSk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBlcnJvcnM6IFtdLFxuICAgIHNlbnRlbmNlczogYVNlbnRlbmNlc1JlaW5mb3JjZWRcbiAgfSBhcyBJTWF0Y2guSVByb2Nlc3NlZFNlbnRlbmNlcztcbiovXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhbmFseXplQ29udGV4dFN0cmluZyhjb250ZXh0UXVlcnlTdHJpbmc6IHN0cmluZywgcnVsZXM6IElNYXRjaC5TcGxpdFJ1bGVzKTpcbiAgSU1hdGNoLklQcm9jZXNzZWRTZW50ZW5jZXMge1xuXG4gIHZhciBhU2VudGVuY2VzUmVpbmZvcmNlZCA9IHByb2Nlc3NTdHJpbmcoY29udGV4dFF1ZXJ5U3RyaW5nLCBydWxlcylcbiAgLy8gd2UgbGltaXQgYW5hbHlzaXMgdG8gbiBzZW50ZW5jZXNcbiAgYVNlbnRlbmNlc1JlaW5mb3JjZWQuc2VudGVuY2VzID0gYVNlbnRlbmNlc1JlaW5mb3JjZWQuc2VudGVuY2VzLnNsaWNlKDAsIEFsZ29sLkN1dG9mZl9TZW50ZW5jZXMpO1xuICBpZiAoZGVidWdsb2cuZW5hYmxlZCkge1xuICAgIGRlYnVnbG9nKFwiYWZ0ZXIgcmVpbmZvcmNlIGFuZCBjdXRvZmZcIiArIGFTZW50ZW5jZXNSZWluZm9yY2VkLnNlbnRlbmNlcy5sZW5ndGggKyBcIlxcblwiICsgYVNlbnRlbmNlc1JlaW5mb3JjZWQuc2VudGVuY2VzLm1hcChmdW5jdGlvbiAob1NlbnRlbmNlKSB7XG4gICAgICByZXR1cm4gU2VudGVuY2UucmFua2luZ1Byb2R1Y3Qob1NlbnRlbmNlKSArIFwiOlwiICsgSlNPTi5zdHJpbmdpZnkob1NlbnRlbmNlKTtcbiAgICB9KS5qb2luKFwiXFxuXCIpKTtcbiAgfVxuICByZXR1cm4gYVNlbnRlbmNlc1JlaW5mb3JjZWQ7XG59XG5cbi8qXG5leHBvcnQgZnVuY3Rpb24gY21wQnlOckNhdGVnb3JpZXNBbmRTYW1lRG9tYWluKGE6IElNYXRjaC5JU2VudGVuY2UsIGI6IElNYXRjaC5JU2VudGVuY2UpOiBudW1iZXIge1xuICAvL2NvbnNvbGUubG9nKFwiY29tcGFyZSBhXCIgKyBhICsgXCIgY250YiBcIiArIGIpO1xuICB2YXIgY250YSA9IFNlbnRlbmNlLmdldERpc3RpbmN0Q2F0ZWdvcmllc0luU2VudGVuY2UoYSkubGVuZ3RoO1xuICB2YXIgY250YiA9IFNlbnRlbmNlLmdldERpc3RpbmN0Q2F0ZWdvcmllc0luU2VudGVuY2UoYikubGVuZ3RoO1xuICAvICpcbiAgICB2YXIgY250YSA9IGEucmVkdWNlKGZ1bmN0aW9uKHByZXYsIG9Xb3JkKSB7XG4gICAgICByZXR1cm4gcHJldiArICgob1dvcmQuY2F0ZWdvcnkgPT09IFwiY2F0ZWdvcnlcIik/IDEgOiAwKTtcbiAgICB9LDApO1xuICAgIHZhciBjbnRiID0gYi5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgb1dvcmQpIHtcbiAgICAgIHJldHVybiBwcmV2ICsgKChvV29yZC5jYXRlZ29yeSA9PT0gXCJjYXRlZ29yeVwiKT8gMSA6IDApO1xuICAgIH0sMCk7XG4gICAvLyBjb25zb2xlLmxvZyhcImNudCBhXCIgKyBjbnRhICsgXCIgY250YiBcIiArIGNudGIpO1xuICAgKiAvXG4gIHJldHVybiBjbnRiIC0gY250YTtcbn0qL1xuXG5leHBvcnQgZnVuY3Rpb24gYW5hbHl6ZUNhdGVnb3J5TXVsdChjYXRlZ29yeWxpc3Q6IHN0cmluZywgcnVsZXM6IElNYXRjaC5TcGxpdFJ1bGVzLCB3aG9sZXNlbnRlbmNlOiBzdHJpbmcsIGdXb3JkczpcbiAgeyBba2V5OiBzdHJpbmddOiBJTWF0Y2guSUNhdGVnb3JpemVkU3RyaW5nW10gfSk6IHN0cmluZ1tdIHtcblxuICB2YXIgcmVzID0gYW5hbHl6ZUNvbnRleHRTdHJpbmcoY2F0ZWdvcnlsaXN0LCBydWxlcyk7XG4gIC8vICBkZWJ1Z2xvZyhcInJlc3VsdGluZyBjYXRlZ29yeSBzZW50ZW5jZXNcIiwgSlNPTi5zdHJpbmdpZnkocmVzKSk7XG4gIHZhciByZXMyID0gZmlsdGVyQWNjZXB0aW5nT25seShyZXMuc2VudGVuY2VzLCBbXCJjYXRlZ29yeVwiLCBcImZpbGxlclwiXSk7XG4gIC8vICBjb25zb2xlLmxvZyhcImhlcmUgcmVzMlwiICsgSlNPTi5zdHJpbmdpZnkocmVzMikgKTtcbiAgLy8gIGNvbnNvbGUubG9nKFwiaGVyZSB1bmRlZmluZWQgISArIFwiICsgcmVzMi5maWx0ZXIobyA9PiAhbykubGVuZ3RoKTtcbiAgcmVzMi5zb3J0KFNlbnRlbmNlLmNtcFJhbmtpbmdQcm9kdWN0KTtcbiAgZGVidWdsb2coXCJyZXN1bHRpbmcgY2F0ZWdvcnkgc2VudGVuY2VzOiBcXG5cIiwgZGVidWdsb2cuZW5hYmxlZCA/IChTZW50ZW5jZS5kdW1wTmljZUFycihyZXMyLnNsaWNlKDAsIDMpLCBTZW50ZW5jZS5yYW5raW5nUHJvZHVjdCkpIDogJy0nKTtcbiAgLy8gVE9ETzogICByZXMyID0gZmlsdGVyQWNjZXB0aW5nT25seVNhbWVEb21haW4ocmVzMik7XG4gIC8vZGVidWdsb2coXCJyZXN1bHRpbmcgY2F0ZWdvcnkgc2VudGVuY2VzXCIsIEpTT04uc3RyaW5naWZ5KHJlczIsIHVuZGVmaW5lZCwgMikpO1xuICAvLyBleHBlY3Qgb25seSBjYXRlZ29yaWVzXG4gIC8vIHdlIGNvdWxkIHJhbmsgbm93IGJ5IGNvbW1vbiBkb21haW5zICwgYnV0IGZvciBub3cgd2Ugb25seSB0YWtlIHRoZSBmaXJzdCBvbmVcbiAgaWYgKCFyZXMyLmxlbmd0aCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgLy9yZXMuc29ydChjbXBCeU5yQ2F0ZWdvcmllc0FuZFNhbWVEb21haW4pO1xuICB2YXIgcmVzY2F0ID0gU2VudGVuY2UuZ2V0RGlzdGluY3RDYXRlZ29yaWVzSW5TZW50ZW5jZShyZXMyWzBdKTtcbiAgcmV0dXJuIHJlc2NhdDtcbiAgLy8gXCJcIiByZXR1cm4gcmVzWzBdLmZpbHRlcigpXG4gIC8vIHJldHVybiBjbGFzc2lmeVdvcmRXaXRoVGFyZ2V0Q2F0ZWdvcnkoY2F0ZWdvcnlsaXN0LCAnY2F0ZWdvcnknLCBydWxlcywgd2hvbGVzZW50ZW5jZSk7XG59XG5cbi8qXG5leHBvcnQgZnVuY3Rpb24gYW5hbHl6ZU9wZXJhdG9yKG9wd29yZDogc3RyaW5nLCBydWxlczogSU1hdGNoLlNwbGl0UnVsZXMsIHdob2xlc2VudGVuY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBjbGFzc2lmeVdvcmRXaXRoVGFyZ2V0Q2F0ZWdvcnkob3B3b3JkLCAnb3BlcmF0b3InLCBydWxlcywgd2hvbGVzZW50ZW5jZSk7XG59XG4qL1xuXG5cbi8vIGNvbnN0IHJlc3VsdCA9IFdoYXRJcy5yZXNvbHZlQ2F0ZWdvcnkoY2F0LCBhMS5lbnRpdHksXG4vLyAgIHRoZU1vZGVsLm1SdWxlcywgdGhlTW9kZWwudG9vbHMsIHRoZU1vZGVsLnJlY29yZHMpO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNJbmRpc2NyaW1pbmF0ZVJlc3VsdFR1cGVsKHJlc3VsdHM6IEFycmF5PElNYXRjaC5JV2hhdElzVHVwZWxBbnN3ZXI+KTogc3RyaW5nIHtcbiAgdmFyIGNudCA9IHJlc3VsdHMucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCByZXN1bHQpIHtcbiAgICBpZiAoc2FmZUVxdWFsKDEsIDEpKSB7IC8vIHJlc3VsdC5fcmFua2luZyxyZXN1bHRzWzBdLl9yYW5raW5nKSkge1xuICAgICAgcmV0dXJuIHByZXYgKyAxO1xuICAgIH1cbiAgfSwgMCk7XG4gIGlmIChjbnQgPiAxKSB7XG4gICAgLy8gc2VhcmNoIGZvciBhIGRpc2NyaW1pbmF0aW5nIGNhdGVnb3J5IHZhbHVlXG4gICAgdmFyIGRpc2NyaW1pbmF0aW5nID0gW107IC8qT2JqZWN0LmtleXMocmVzdWx0c1swXS5yZWNvcmQpLnJlZHVjZShmdW5jdGlvbiAocHJldiwgY2F0ZWdvcnkpIHtcbiAgICAgIGlmICgoY2F0ZWdvcnkuY2hhckF0KDApICE9PSAnXycgJiYgcmVzdWx0c1swXS5jYXRlZ29yaWVzLmluZGV4T2YoY2F0ZWdvcnkpIDwgMClcbiAgICAgICAgJiYgKHJlc3VsdHNbMF0ucmVjb3JkW2NhdGVnb3J5XSAhPT0gcmVzdWx0c1sxXS5yZWNvcmRbY2F0ZWdvcnldKSkge1xuICAgICAgICBwcmV2LnB1c2goY2F0ZWdvcnkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHByZXY7XG4gICAgfSwgW10pOyAqL1xuICAgIGlmIChkaXNjcmltaW5hdGluZy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBcIk1hbnkgY29tcGFyYWJsZSByZXN1bHRzLCBwZXJoYXBzIHlvdSB3YW50IHRvIHNwZWNpZnkgYSBkaXNjcmltaW5hdGluZyBcIiArIGRpc2NyaW1pbmF0aW5nLmpvaW4oJywnKSArICcgb3IgdXNlIFwibGlzdCBhbGwgLi4uXCInO1xuICAgIH1cbiAgICByZXR1cm4gJ1lvdXIgcXVlc3Rpb24gZG9lcyBub3QgaGF2ZSBhIHNwZWNpZmljIGFuc3dlcic7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbiJdfQ==
