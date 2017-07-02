"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mgnlq_model_1 = require("mgnlq_model");
var EnumResponseCode;
(function (EnumResponseCode) {
    EnumResponseCode[EnumResponseCode["NOMATCH"] = 0] = "NOMATCH";
    EnumResponseCode[EnumResponseCode["EXEC"] = 1] = "EXEC";
    EnumResponseCode[EnumResponseCode["QUERY"] = 2] = "QUERY";
})(EnumResponseCode = exports.EnumResponseCode || (exports.EnumResponseCode = {}));
exports.CAT_CATEGORY = "category";
exports.CAT_FILLER = "filler";
exports.CAT_TOOL = "tool";
exports.ERR_NO_KNOWN_WORD = "NO_KNOWN_WORD";
exports.ERR_EMPTY_INPUT = "EMPTY_INPUT";
;
;
/*

export interface IPromptDescription {
  description: string,
  type: string,
  pattern: RegExp,
  message: string,
  default: string,
  required: boolean
}
*/
exports.aOperatorNames = ["starting with", "ending with", "containing", "excluding", "having", "being"];
;
;
;
;
/**
 * Defines the interface for an analysis
 * reponse
 */
/*
export interface IResponse {
  rating: number,
  type: EnumResponseCode,
  query: string,
  context: { [key: string]: string },
  text: string,
  action: IAction,
  prompts: {
    [key: string]: {
      text: string,
      / **
       * Follows the features of NPM prompts
       * /
      description: IPromptDescription
    };
  }
}
*/
var EnumActionType;
(function (EnumActionType) {
    EnumActionType[EnumActionType["STARTURL"] = 0] = "STARTURL";
    EnumActionType[EnumActionType["STARTCMDLINE"] = 1] = "STARTCMDLINE";
})(EnumActionType = exports.EnumActionType || (exports.EnumActionType = {}));
var mgnlq_model_2 = require("mgnlq_model");
exports.IFModel = mgnlq_model_2.IFModel;
/*
export { IModel = IFModel.IMdoIFModel.IModel } as IModel;
*/
/*
export interface IModel {
    domain: string,
    bitindex : number,
    description? : string,
    tool: ITool,
    toolhidden?: boolean,
    synonyms?: { [key: string]: string[] },
    categoryDescribed :  { name : string,
        description? : string,
        key? : string }[],
    category: string[],
    columns? : string[],
    wordindex: string[],
    exactmatch? : string[],
    hidden: string[]
}; */
exports.EnumRuleType = mgnlq_model_1.IFModel.EnumRuleType;
//export { IFModel.IModels as IModels } from 'mgnlq_model';
/*

export interface IModels {
    full : {
      domain : { [key : string] : {
          description: string,
          bitindex : number,
          categories : { [key : string] : ICategoryDesc }
        }
      }
    },
    rawModels : { [key : string] : IModel};
    domains: string[],
    tools: ITool[],
    category: string[],
    operators : { [key: string] : IOperator },
    mRules: mRule[],
    rules : SplitRules,
    records: any[]
    seenRules?: { [key: string]: mRule[] },
    meta : {
        // entity -> relation -> target
        t3 : { [key: string] : { [key : string] : any }}
    }
}
*/ 

//# sourceMappingURL=ifmatch.js.map
