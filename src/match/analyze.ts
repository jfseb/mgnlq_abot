/**
 *
 * @module jfseb.fdevstart.analyze
 * @file analyze.ts
 * @copyright (c) 2016 Gerd Forstmann
 */

"use strict";

import {InputFilter as InputFilter, Sentence as Sentence} from 'mgnlq_er';

import * as debug from 'debug';

const debuglog = debug('analyze');



import * as logger from '../utils/logger';
var perf = logger.perf('analyze');


import * as Utils from 'abot_utils';

import * as IMatch from './ifmatch';

import { ErBase as ErBase}  from 'mgnlq_er';
import * as Toolmatcher from './toolmatcher';


export function analyzeAll(sString: string, rules: IMatch.SplitRules, aTools: Array<IMatch.ITool>, words? ) {
  "use strict";
  if (sString.length === 0) {
    return [];
  } else {
    var res = ErBase.processString2(sString, rules, words);
    perf('matchTools');
    var matchedTools = Toolmatcher.matchTools(res.sentences, aTools); //aTool: Array<IMatch.ITool>): any /* objectstream*/ {
    perf('matchTools');
    debuglog(" matchedTools" + JSON.stringify(matchedTools, undefined, 2));
    return matchedTools;
  }
}

