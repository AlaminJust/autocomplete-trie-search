"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeValue = exports.Rank = exports.TrieNode = void 0;
const uuid = __importStar(require("uuid"));
class TrieNode {
    constructor() {
        this.rankList = [];
        this.map = new Map();
        this.nodeValue = null;
        this.ownRank = new Rank();
    }
}
exports.TrieNode = TrieNode;
class Rank {
    constructor() {
        this.rank = 0;
        this.id = "";
    }
}
exports.Rank = Rank;
class NodeValue {
    constructor(options) {
        this.DEFAULT_WEIGHT = 1;
        this.text = options.text;
        this.value = options.value || options.text;
        this.weight = options.weight || this.DEFAULT_WEIGHT;
        this._id = uuid.v4();
    }
    get id() {
        return this._id;
    }
}
exports.NodeValue = NodeValue;
