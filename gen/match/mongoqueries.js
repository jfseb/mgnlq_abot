"use strict";
/**
 *
 * @module jfseb.fdevstart.analyze
 * @file analyze.ts
 * @copyright (c) 2016 Gerd Forstmann
 */
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debugf");
const debuglog = debug('mongoqueries');
const logger = require("../utils/logger");
var logPerf = logger.perf("mongoqueries");
var perflog = debug('perf');
//import * as Match from './match';
const mgnlq_parser1_1 = require("mgnlq_parser1");
var sWords = {};
/* we have sentences */
/* sentences lead to queries */
/* queries have columns, results */
function listAll(query, theModel) {
    return mgnlq_parser1_1.MongoQ.query(query, theModel).then(res => {
        debuglog(() => 'got a query result' + JSON.stringify(res, undefined, 2));
        var tupelanswers = [];
        res.queryresults.map((qr, index) => {
            qr.results.forEach(function (result) {
                tupelanswers.push({
                    record: {},
                    categories: qr.columns,
                    sentence: qr.sentence,
                    result: result,
                    _ranking: 1.0 // res.sentences[index]._ranking
                });
            });
        });
        return {
            tupelanswers: tupelanswers,
            errors: res.errors,
            tokens: res.tokens
        };
    });
}
exports.listAll = listAll;

//# sourceMappingURL=mongoqueries.js.map
