"use strict";
/**
 *
 * @module jfseb.fdevstart.analyze
 * @file analyze.ts
 * @copyright (c) 2016 Gerd Forstmann
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.listShowMe = exports.listAll = void 0;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXRjaC9tb25nb3F1ZXJpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7OztHQUtHOzs7QUFHSCxnQ0FBZ0M7QUFFaEMsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3ZDLDBDQUEwQztBQUMxQyxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzFDLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztBQWU1Qiw2Q0FBb0M7QUFDcEMsaURBQWlEO0FBRWpELElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUVoQix1QkFBdUI7QUFDdkIsK0JBQStCO0FBQy9CLG1DQUFtQztBQUVuQyxTQUFnQixPQUFPLENBQUMsS0FBYSxFQUFFLFFBQXdCO0lBQzdELE9BQU8sc0JBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FDdkMsR0FBRyxDQUFDLEVBQUU7UUFDSixRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekUsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDLENBQ0YsQ0FBQztBQUNKLENBQUM7QUFQRCwwQkFPQztBQUNLOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQTBCSDtBQUNILFNBQWdCLFVBQVUsQ0FBQyxLQUFhLEVBQUUsUUFBd0I7SUFDaEUseUJBQXlCO0lBQ3pCLHdDQUF3QztJQUN4QyxFQUFFO0lBQ0YsT0FBTyxzQkFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FDbEQsR0FBRyxDQUFDLEVBQUU7UUFDSixRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekUseUJBQXlCO1FBQ3pCLElBQUksT0FBTyxHQUFHLFNBQVMsQ0FBQztRQUN4QixHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3hCLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7WUFDdkIsSUFBSSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxNQUFNLEVBQUU7Z0JBQzNDLElBQUksYUFBYSxHQUFHLG1CQUFLLENBQUMsNkJBQTZCLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUMxRSxJQUFJLFdBQVcsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLGtEQUFrRDtnQkFDbEQsSUFBSSxXQUFXO29CQUNYLENBQUMsQ0FBRSxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7MkJBQ3JDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUM3QztvQkFDQSx5REFBeUQ7b0JBQ3pELEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO3dCQUN2QixRQUFRLENBQUMsR0FBRSxFQUFFLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDakQsSUFBSSxDQUFDLE9BQU8sSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUU7NEJBQ2hDLE9BQU8sR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7eUJBQzVCO29CQUNILENBQUMsQ0FBQyxDQUFDO2lCQUNKO2FBQ0Y7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUNsRCxDQUFDLENBQ0YsQ0FBQztBQUNKLENBQUM7QUFoQ0QsZ0NBZ0NDIiwiZmlsZSI6Im1hdGNoL21vbmdvcXVlcmllcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICpcbiAqIEBtb2R1bGUgamZzZWIuZmRldnN0YXJ0LmFuYWx5emVcbiAqIEBmaWxlIGFuYWx5emUudHNcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMTYgR2VyZCBGb3JzdG1hbm5cbiAqL1xuXG5cbmltcG9ydCAqIGFzIGRlYnVnIGZyb20gJ2RlYnVnZic7XG5cbmNvbnN0IGRlYnVnbG9nID0gZGVidWcoJ21vbmdvcXVlcmllcycpO1xuaW1wb3J0ICogYXMgbG9nZ2VyIGZyb20gJy4uL3V0aWxzL2xvZ2dlcic7XG52YXIgbG9nUGVyZiA9IGxvZ2dlci5wZXJmKFwibW9uZ29xdWVyaWVzXCIpO1xudmFyIHBlcmZsb2cgPSBkZWJ1ZygncGVyZicpO1xuLy9jb25zdCBwZXJmbG9nID0gbG9nZ2VyLnBlcmYoXCJwZXJmbGlzdGFsbFwiKTtcblxuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnYWJvdF91dGlscyc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgKiBhcyBJTWF0Y2ggZnJvbSAnLi9pZm1hdGNoJztcblxuaW1wb3J0IHsgQnJlYWtEb3duIH0gZnJvbSAnbWdubHFfbW9kZWwnO1xuXG5pbXBvcnQgeyBTZW50ZW5jZSBhcyBTZW50ZW5jZSB9IGZyb20gJ21nbmxxX3BhcnNlcjEnO1xuXG5pbXBvcnQgeyBXb3JkIGFzIFdvcmQgfSBmcm9tICdtZ25scV9wYXJzZXIxJztcbmltcG9ydCAqIGFzIE9wZXJhdG9yIGZyb20gJy4vb3BlcmF0b3InO1xuaW1wb3J0ICogYXMgV2hhdElzIGZyb20gJy4vd2hhdGlzJztcbmltcG9ydCB7IEVyRXJyb3IgYXMgRXJFcnJvciB9IGZyb20gJ21nbmxxX3BhcnNlcjEnO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tICdtZ25scV9tb2RlbCc7XG5pbXBvcnQgeyBNb25nb1EgYXMgTW9uZ29RIH0gZnJvbSAnbWdubHFfcGFyc2VyMSc7XG5cbnZhciBzV29yZHMgPSB7fTtcblxuLyogd2UgaGF2ZSBzZW50ZW5jZXMgKi9cbi8qIHNlbnRlbmNlcyBsZWFkIHRvIHF1ZXJpZXMgKi9cbi8qIHF1ZXJpZXMgaGF2ZSBjb2x1bW5zLCByZXN1bHRzICovXG5cbmV4cG9ydCBmdW5jdGlvbiBsaXN0QWxsKHF1ZXJ5OiBzdHJpbmcsIHRoZU1vZGVsOiBJTWF0Y2guSU1vZGVscyk6IFByb21pc2U8TW9uZ29RLklQcm9jZXNzZWRNb25nb0Fuc3dlcnM+IHtcbiAgcmV0dXJuIE1vbmdvUS5xdWVyeShxdWVyeSwgdGhlTW9kZWwpLnRoZW4oXG4gICAgcmVzID0+IHtcbiAgICAgIGRlYnVnbG9nKCgpID0+ICdnb3QgYSBxdWVyeSByZXN1bHQnICsgSlNPTi5zdHJpbmdpZnkocmVzLCB1bmRlZmluZWQsIDIpKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICApO1xufVxuICAgICAgLypcbiAgICAgIHZhciB0dXBlbGFuc3dlcnMgPSBbXSBhcyBJTWF0Y2guSVdoYXRJc1R1cGVsQW5zd2VyW107XG4gICAgICByZXMucXVlcnlyZXN1bHRzLm1hcCgocXIsIGluZGV4KSA9PiB7XG4gICAgICAgIHFyLnJlc3VsdHMuZm9yRWFjaChmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgdHVwZWxhbnN3ZXJzLnB1c2goe1xuICAgICAgICAgICAgcmVjb3JkOiB7fSxcbiAgICAgICAgICAgIGNhdGVnb3JpZXM6IHFyLmNvbHVtbnMsXG4gICAgICAgICAgICBzZW50ZW5jZTogcXIuc2VudGVuY2UsXG4gICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgIF9yYW5raW5nOiAxLjAgLy8gcmVzLnNlbnRlbmNlc1tpbmRleF0uX3JhbmtpbmdcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR1cGVsYW5zd2VyczogdHVwZWxhbnN3ZXJzLFxuICAgICAgICBlcnJvcnM6IHJlcy5lcnJvcnMsXG4gICAgICAgIHRva2VuczogcmVzLnRva2Vuc1xuICAgICAgfVxuICAgIH1cbiAgKVxufVxuXG4vKipcbiAqIFF1ZXJ5IGZvciBhIHNob3dNZSByZXN1bHRcbiAqIEBwYXJhbSBxdWVyeVxuICogQHBhcmFtIHRoZU1vZGVsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaXN0U2hvd01lKHF1ZXJ5OiBzdHJpbmcsIHRoZU1vZGVsOiBJTWF0Y2guSU1vZGVscyk6IFByb21pc2U8TW9uZ29RLklQcm9jZXNzZWRNb25nb0Fuc3dlcnM+IHtcbiAgLy8gVG9kbzogcHJlcHJvY2VzcyBxdWVyeVxuICAvLyBTaG93IG1lIEZBY3QgPT4gIHVybCB3aXRoIENBVCBpcyBGQUNUXG4gIC8vXG4gIHJldHVybiBNb25nb1EucXVlcnlXaXRoVVJJKHF1ZXJ5LCB0aGVNb2RlbCwgW10pLnRoZW4oXG4gICAgcmVzID0+IHtcbiAgICAgIGRlYnVnbG9nKCgpID0+ICdnb3QgYSBxdWVyeSByZXN1bHQnICsgSlNPTi5zdHJpbmdpZnkocmVzLCB1bmRlZmluZWQsIDIpKTtcbiAgICAgIC8vIHdlIGZpbmQgdGhlIFwiYmVzdFwiIHVyaVxuICAgICAgdmFyIGJlc3RVUkkgPSB1bmRlZmluZWQ7XG4gICAgICByZXMuZm9yRWFjaCgocXIsIGluZGV4KSA9PiB7XG4gICAgICAgIHZhciBkb21haW4gPSBxci5kb21haW47XG4gICAgICAgIGlmICghYmVzdFVSSSAmJiBxci5yZXN1bHRzLmxlbmd0aCAmJiBkb21haW4pIHtcbiAgICAgICAgICB2YXIgdXJpQ2F0ZWdvcmllcyA9IE1vZGVsLmdldFNob3dVUklDYXRlZ29yaWVzRm9yRG9tYWluKHRoZU1vZGVsLCBkb21haW4pO1xuICAgICAgICAgIHZhciB1cmlDYXRlZ29yeSA9IHVyaUNhdGVnb3JpZXNbMF07XG4gICAgICAgICAgLy8gRVhURU5EOiBkbyBzb21lIHByaW9yaXphdGlvbiBhbmQgc2VhcmNoIGZvciBhbGxcbiAgICAgICAgICBpZiAodXJpQ2F0ZWdvcnkgJiZcbiAgICAgICAgICAgICAgKCggcXIuY29sdW1ucy5pbmRleE9mKHVyaUNhdGVnb3J5KSA+PSAwKVxuICAgICAgICAgICAgICB8fCBxci5hdXhjb2x1bW5zLmluZGV4T2YodXJpQ2F0ZWdvcnkpID49IDApKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgLy92YXIgY29sSW5kZXggPSBxci5jb2x1bW5zLmluZGV4T2Yoc2hvd01lQ2F0ZWdvcmllc1swXSk7XG4gICAgICAgICAgICBxci5yZXN1bHRzLmZvckVhY2gocmVzID0+IHtcbiAgICAgICAgICAgICAgZGVidWdsb2coKCk9PiAncmVzdWx0ICsgJyArIEpTT04uc3RyaW5naWZ5KHJlcykpO1xuICAgICAgICAgICAgICBpZiAoIWJlc3RVUkkgJiYgcmVzW3VyaUNhdGVnb3J5XSkge1xuICAgICAgICAgICAgICAgIGJlc3RVUkkgPSByZXNbdXJpQ2F0ZWdvcnldO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24ocmVzLCB7IGJlc3RVUkk6IGJlc3RVUkkgfSk7XG4gICAgfVxuICApO1xufVxuIl19
