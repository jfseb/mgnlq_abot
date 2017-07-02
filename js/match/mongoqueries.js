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
const mgnlq_parser1_1 = require("mgnlq_parser1");
var sWords = {};
/* we have sentences */
/* sentences lead to queries */
/* queries have columns, results */
function listAll(query, theModel) {
    return mgnlq_parser1_1.MongoQ.query(query, theModel).then(res => {
        debuglog(() => 'got a query result' + JSON.stringify(res, undefined, 2));
        return res;
    });
}
exports.listAll = listAll;
/*
var tupelanswers = [] as IMatch.IWhatIsTupelAnswer[];
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
}
}
)
}

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
        res.forEach((qr, index) => {
            var domain = qr.domain;
            if (!bestURI && qr.results.length && domain) {
                var uriCategories = mgnlq_model_1.Model.getShowURICategoriesForDomain(theModel, domain);
                var uriCategory = uriCategories[0];
                // EXTEND: do some priorization and search for all
                if (uriCategory &&
                    ((qr.columns.indexOf(uriCategory) >= 0)
                        || qr.auxcolumns.indexOf(uriCategory) >= 0)) {
                    //var colIndex = qr.columns.indexOf(showMeCategories[0]);
                    qr.results.forEach(res => {
                        debuglog(() => 'result + ' + JSON.stringify(res));
                        if (!bestURI && res[uriCategory]) {
                            bestURI = res[uriCategory];
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
