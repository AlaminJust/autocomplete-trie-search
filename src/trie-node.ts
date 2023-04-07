import { INodeValue, IRank, ITrieNode } from "./interface";
import * as uuid from 'uuid';

export class TrieNode implements ITrieNode {
    rankList: IRank[];
    map: Map<string, TrieNode>;
    nodeValue: NodeValue | null;

    constructor(){
        this.rankList = [];
        this.map = new Map();
        this.nodeValue = null;
    }
}

export class NodeValue implements INodeValue {
    private DEFAULT_WEIGHT: number = 1;
    private _id: string;

    text: string;
    value: any;
    weight: number | undefined;
    
    constructor(options: INodeValue){
        this.text = options.text;
        this.value = options.value || options.text;
        this.weight = options.weight || this.DEFAULT_WEIGHT;
        this._id = uuid.v4();

        console.log("What is id", this._id);
    }

    get id(): string {
        return this._id;
    }
}