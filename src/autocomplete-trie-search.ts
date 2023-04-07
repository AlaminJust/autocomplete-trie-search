import { AutoCompleteTrieSearchOptions, IAutoCompleteTrieSearch, INodeValue, IRank } from './interface';
import { NodeValue, TrieNode } from './trie-node';

export class AutoCompleteTrieSearch implements IAutoCompleteTrieSearch, AutoCompleteTrieSearchOptions {
    private DEFAULT_MISMATCH_ALLOW = 3;
    private DEFAULT_MAX_SUGGESION = 10;
    private MAX_RANK: number = 1000000000;
    private _root: TrieNode;
    private _maxSuggestion: number;
    private _valueByKey: Map<string, any>;
    private _allowedMismatchCount: number;
    private _ignoreCase: boolean;

    constructor(options: AutoCompleteTrieSearchOptions | any) {
        this._valueByKey = new Map();
        this._root = new TrieNode();
        this._maxSuggestion = options.maxSuggestion ?? this.DEFAULT_MAX_SUGGESION;
        this._ignoreCase = options.ignoreCase ?? true;
        this._allowedMismatchCount = options.allowedMismatchCount ?? this.DEFAULT_MISMATCH_ALLOW
    }

    updateOptions(options: AutoCompleteTrieSearchOptions): void {
        this.maxSuggestion = options.maxSuggestion;
        this.allowedMismatchCount = options.allowedMismatchCount;
    }

    private set allowedMismatchCount(value) {
        if(this.DEFAULT_MISMATCH_ALLOW < value || !value){
            value = this.DEFAULT_MISMATCH_ALLOW;
        }

        this._allowedMismatchCount = value;
    }

    get allowedMismatchCount(): number {
        return this._allowedMismatchCount as number;
    }

    get ignoreCase(): boolean {
        return this._ignoreCase;
    }

    private set root(value) {
        this._root = value;
    }

    get root(): TrieNode {
        return this._root as TrieNode;
    }

    private set maxSuggestion(value){
        this._maxSuggestion = value;
    }

    get maxSuggestion(): number {
        return this._maxSuggestion;
    }

    private get valueByKey(): Map<string, any> {
        return this._valueByKey;
    }

    private addValueById(key: string, value: any){
        // If the key is not already in the map, add the key-value pair
        if (!this.valueByKey.has(key)) {
            this.valueByKey.set(key, value);
        }
    }

    insert(node: INodeValue): boolean {
        // If node or node text is falsy or only whitespace, return false
        if (!node || !node.text?.trim()) {
            return false;
        }
        
        if(this.ignoreCase){
            node.text = node.text.trim().toLowerCase();
        }

        // Create a new node value object from the given node and assign a unique ID
        const nodeValue = new NodeValue(node);
        // Insert the node value into the trie
        this.insertInToTrie(this.root, nodeValue);
    
        // Return true to indicate successful insertion
        return true;
    }
    

    /**
     * Inserts a node into a trie.
     * @param rootNode - The root node of the trie.
     * @param node - The node to be inserted.
     * @param index - The current index of the character being inserted.
     * @returns The root node of the updated trie.
     */
    private insertInToTrie(rootNode: TrieNode, node: NodeValue, index: number = 0): TrieNode {
        // If the root node doesn't exist or the index is out of bounds, return the root node
        if (!rootNode || index > node.text.length) {
            return rootNode;
        }

        // If we've reached the end of the node's text, set the node value in the root node, update the rank list,
        // and return the root node
        if (index === node.text.length) {
            if(rootNode.nodeValue){
                rootNode.ownRank.rank++;
            }
            else {
                rootNode.nodeValue = node;
                rootNode.ownRank.id = node.id;
                rootNode.ownRank.rank = node.weight;
                this.addValueById(node.id, node.value);
            }

            this.updateRankList(rootNode);
            return rootNode;
        }

        // Get the current character being inserted
        const char = node.text[index];

        // Get the child node corresponding to the current character
        let childNode = rootNode.map.get(char);

        // If the child node doesn't exist, create a new one and add it to the root node's map
        if (!childNode) {
            childNode = new TrieNode();
            rootNode.map.set(char, childNode);
        }
        
        // Recursively insert the remaining characters into the child node
        childNode = this.insertInToTrie(childNode as TrieNode, node, index + 1);

        // If the child node was successfully updated, merge its rank list with the root node's rank list
        if (childNode) {
            rootNode.rankList = this.mergeRankList(rootNode.rankList, childNode.rankList);
        }

        // Return the updated root node
        return rootNode;
    }

    /**
     * Updates the rank list of the given node by sorting the rank list in descending order
     * based on the rank property, and then trimming it to the maximum number of suggestions.
     * @param node The node whose rank list is to be updated.
     */
    updateRankList(node: TrieNode) {
        let rankList: IRank[] = [];
      
        // Push the node's id and weight as a new object into the rank list
        rankList.push(node.ownRank);
      
        // Update the node's rank list with the new rank list
        node.rankList = this.mergeRankList(node.rankList, rankList);
    }
    
    suggession(text: string): any[] {
        let rankList: IRank[];

        // If the text is empty or consists only of whitespace characters, use the root node's rank list
        if(!text.trim()){
            rankList = this.root.rankList;
        }
        else {
            // Otherwise, search for the node corresponding to the given text and get its rank list
            rankList = this.search(this.root, text) || [];
        }

        let suggesions:any[] = [];

        // For each rank in the rank list, get the corresponding node value and add it to the suggestions array
        rankList.forEach((rank) => {
            const value = this.valueByKey.get(rank.id);
            suggesions.push(value);
        });

        return suggesions;
    }

    private search(rootNode: TrieNode, text: string, mismatchCount: number = 0, index: number = 0): IRank[] | undefined {
        // If the rootNode is undefined, return undefined
        if (!rootNode) {
            return undefined;
        }
    
        // If index has reached the end of the text and mismatchCount is zero,
        // return the node's rank as a single element array with the node's ID
        if (index === text.length && mismatchCount === 0) {
            if(rootNode.nodeValue){
                return [{
                    rank: this.MAX_RANK,
                    id: rootNode.nodeValue?.id as string
                }];
            }
            else{
                return rootNode.rankList;
            }
        }
    
        // If index has reached the end of the text, return the node's rankList
        if (index === text.length) {
            return rootNode.rankList;
        }
    
        // Initialize an empty array for the rootRankList and get the current character
        let rootRankList: IRank[] = [];
        const current = text[index];
    
        for (const [char, childNode] of rootNode.map.entries()) {
            if (mismatchCount < this.allowedMismatchCount) {
                let resultRankList = this.search(childNode, text, char === current ? mismatchCount : mismatchCount + 1, index + 1) as IRank[];
                if (resultRankList) {
                    rootRankList = this.mergeRankList(rootRankList, resultRankList);
                }
            }
        }
    
        // Return the rootRankList
        return rootRankList;
    }
    

    private mergeRankList(list1: IRank[], list2: IRank[]): IRank[] {
        const mergedList: IRank[] = [];
        list1 = list1 ?? [];
        list2 = list2 ?? [];

        let i = 0; // Pointer for list1
        let j = 0; // Pointer for list2
        
        // Merge the two lists until we reach the maximum number of suggestions
        while (mergedList.length < this.maxSuggestion && i < list1.length && j < list2.length) {
            // Compare the rank of the elements at the current position of the pointers
            if(list1[i].id === list2[j].id){
                i++;
            }
            else if (list1[i].rank >= list2[j].rank) {
                mergedList.push(list1[i]);
                i++;
            } else {
                mergedList.push(list2[j]);
                j++;
            }
        }
        
        // Add the remaining elements from list1, if any
        while (mergedList.length < this.maxSuggestion && i < list1.length) {
            mergedList.push(list1[i]);
            i++;
        }
        
        // Add the remaining elements from list2, if any
        while (mergedList.length < this.maxSuggestion && j < list2.length) {
            mergedList.push(list2[j]);
            j++;
        }
        
        return mergedList;
    }
}