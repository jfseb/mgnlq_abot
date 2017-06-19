/**
 *
 * @module jfseb.fdevstart.analyze
 * @file analyze.ts
 * @copyright (c) 2016 Gerd Forstmann
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const debuglog = debug('analyze');
const logger = require("../utils/logger");
var perf = logger.perf('analyze');
const mgnlq_er_1 = require("mgnlq_er");
const Toolmatcher = require("./toolmatcher");
function analyzeAll(sString, rules, aTools, words) {
    "use strict";
    if (sString.length === 0) {
        return [];
    }
    else {
        var res = mgnlq_er_1.ErBase.processString2(sString, rules, words);
        perf('matchTools');
        var matchedTools = Toolmatcher.matchTools(res.sentences, aTools); //aTool: Array<IMatch.ITool>): any /* objectstream*/ {
        perf('matchTools');
        debuglog(" matchedTools" + JSON.stringify(matchedTools, undefined, 2));
        return matchedTools;
    }
}
exports.analyzeAll = analyzeAll;

//# sourceMappingURL=analyze.js.map
