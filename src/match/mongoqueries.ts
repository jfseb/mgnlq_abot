/**
 *
 * @module jfseb.fdevstart.analyze
 * @file analyze.ts
 * @copyright (c) 2016 Gerd Forstmann
 */


import * as debug from 'debugf';

const debuglog = debug('mongoqueries');
import * as logger from '../utils/logger';
var logPerf = logger.perf("mongoqueries");
var perflog = debug('perf');
//const perflog = logger.perf("perflistall");

import * as Utils from 'abot_utils';

import * as IMatch from './ifmatch';

import * as Toolmatcher from './toolmatcher';

import { BreakDown } from 'mgnlq_model';

import { Sentence as Sentence} from 'mgnlq_er';

import { Word as Word} from 'mgnlq_er';
import * as Operator from './operator';
import * as WhatIs from './whatis';
import { ErError as ErError} from 'mgnlq_er';
import { Model } from 'mgnlq_model';
//import * as Match from './match';
import { MongoQ as MongoQ } from 'mgnlq_parser1';

var sWords = {};

/* we have sentences */
/* sentences lead to queries */
/* queries have columns, results */

export function listAll(query : string, theModel: IMatch.IModels) : Promise<IMatch.IProcessedWhatIsTupelAnswers> {
  return MongoQ.query(query,theModel).then(
    res => {
      debuglog(()=>'got a query result' + JSON.stringify(res,undefined,2));
      var tupelanswers = [] as IMatch.IWhatIsTupelAnswer[];
      res.queryresults.map( (qr,index) => {
        qr.results.forEach(function(result) {
          tupelanswers.push( {
            record : {},
            categories : qr.columns,
            sentence : qr.sentence,
            result : result,
            _ranking : 1.0 // res.sentences[index]._ranking
          });
        });
      });
      return {
        tupelanswers : tupelanswers,
        errors : res.errors,
        tokens: res.tokens
      }
    }
  )
}

