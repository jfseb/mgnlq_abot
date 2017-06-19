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
const mgnlq_model_1 = require("mgnlq_model");
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
/**
 * Query for a showMe result
 * @param query
 * @param theModel
 */
function listShowMe(query, theModel) {
    // Todo: preprocess query
    // Show me FAct =>  url with CAT is FACT
    //
    return mgnlq_parser1_1.MongoQ.queryWithURI(query, theModel, []).then(res => {
        debuglog(() => 'got a query result' + JSON.stringify(res, undefined, 2));
        // we find the "best" uri
        var bestURI = undefined;
        res.queryresults.forEach((qr, index) => {
            var domain = qr.domain;
            if (!bestURI && qr.results.length && domain) {
                var showMeCategories = mgnlq_model_1.Model.getShowURICategoriesForDomain(theModel, domain);
                if (showMeCategories.length && qr.columns.indexOf(showMeCategories[0]) >= 0) {
                    var colIndex = qr.columns.indexOf(showMeCategories[0]);
                    qr.results.forEach(res => {
                        debuglog(() => 'result + ' + JSON.stringify(res));
                        if (!bestURI && res[colIndex]) {
                            bestURI = res[colIndex];
                        }
                    });
                }
            }
        });
        return Object.assign(res, { bestURI: bestURI });
    });
}
exports.listShowMe = listShowMe;

//# sourceMappingURL=mongoqueries.js.map
