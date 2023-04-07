import { INodeValue, IRank, ITrieNode } from "./interface";
import * as uuid from 'uuid';

export class TrieNode implements ITrieNode {
    rankList: IRank[];
    map: Map<string, TrieNode>;
    nodeValue: NodeValue | null;
    ownRank: IRank;

    constructor(){
        this.rankList = [];
        this.map = new Map();
        this.nodeValue = null;
        this.ownRank = new Rank();
    }
}

export class Rank implements IRank {
    rank: number;
    id: string;

    constructor() {
        this.rank = 0;
        this.id = "";
    }
}


export class NodeValue implements INodeValue {
    private DEFAULT_WEIGHT: number = 1;
    private _id: string;

    text: string;
    value: any;
    weight: number;
    
    constructor(options: INodeValue){
        this.text = options.text;
        this.value = options.value || options.text;
        this.weight = options.weight || this.DEFAULT_WEIGHT;
        this._id = uuid.v4();
    }

    get id(): string {
        return this._id;
    }
}