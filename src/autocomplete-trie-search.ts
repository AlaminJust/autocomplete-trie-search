import { AutoCompleteTrieSearchOptions, IAutoCompleteTrieSearch, INodeValue, IRank } from './interface';
import { NodeValue, TrieNode } from './trie-node';

export class AutoCompleteTrieSearch implements IAutoCompleteTrieSearch, AutoCompleteTrieSearchOptions {
    private DEFAULT_MISMATCH_ALLOW = 3;
    private DEFAULT_MAX_SUGGESION = 10;
    private DEFAULT_IGNORE_CASE = true;
    private MAX_RANK: number = 1000000000;
    private _root: TrieNode;
    private _maxSuggestion: number;
    private _valueByKey: Map<string, any>;
    private _allowedMismatchCount: number;
    private _ignoreCase: boolean;
    private _nodeCount: number;
    private onUpdateCallback: any;

    constructor(options?: AutoCompleteTrieSearchOptions) {
        this._valueByKey = new Map();
        this._root = new TrieNode();
        this._nodeCount = 0;
        this._maxSuggestion = options?.maxSuggestion ?? this.DEFAULT_MAX_SUGGESION;
        this._ignoreCase = options?.ignoreCase ?? this.DEFAULT_IGNORE_CASE;
        this._allowedMismatchCount = options?.allowedMismatchCount ?? this.DEFAULT_MISMATCH_ALLOW
    }

    updateOptions(options: AutoCompleteTrieSearchOptions): void {
        this.maxSuggestion = options.maxSuggestion ?? this.maxSuggestion;
        this.allowedMismatchCount = options.allowedMismatchCount ?? this.allowedMismatchCount;
    }

    /**
     * The onUpdate method sets a callback function that will be called
     * when the node value is updated.
     *
     * @param {OnUpdateCallback} callback - The callback function to set.
     * @returns {void}
     */
    onUpdate(callback: any) {
        this.onUpdateCallback = callback;
    }

    private set nodeCount(value) {
        this._nodeCount = value;
    }

    get nodeCount(): number{
        return this._nodeCount;
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

    private removeValueById(key: string): boolean{
        return this.valueByKey.delete(key);
    }

    insertOrUpddate(nodes: INodeValue | INodeValue[]): boolean {
        let isInserted = false;
        if(Array.isArray(nodes)){
            nodes.forEach(node => {
                if(this.add(node)){
                    isInserted = true;
                }
            });
        }
        else {
            isInserted = this.add(nodes);
        }

        return isInserted;
    }

    delete(node: INodeValue): boolean {
        // Create a new NodeValue instance from the given node.
        const newNode = new NodeValue(node);
        // Call the remove method with the root of the tree and the new node to be deleted.
        return this.remove(this.root, newNode);
    }

    private remove(rootNode: TrieNode, node: NodeValue, index: number = 0): boolean {
        // If the root node doesn't exist or the index is out of bounds, return false
        if (!rootNode || index > node.text.length) {
            return false;
        }
    
        // If we've reached the end of the node's text, remove the node value from the root node
        if (index === node.text.length) {
            if (!rootNode.nodeValue) {
                return false;
            }
            this.removeValueById(rootNode.nodeValue.id);
            node.id = rootNode.nodeValue.id;
            rootNode.nodeValue = null;
            this.removeFromRankList(rootNode, node);
            return true;
        }
    
        // Get the current character being removed
        const char = node.text[index];
    
        // Get the child node corresponding to the current character
        let childNode = rootNode.map.get(char);
    
        // If the child node doesn't exist, return false
        if (!childNode) {
            return false;
        }
    
        // Recursively remove the remaining characters from the child node
        const isDeleted = this.remove(childNode as TrieNode, node, index + 1);
    
        // If the child node was successfully deleted, update the root node's `map`
        if (isDeleted) {
            if (!childNode.nodeValue && childNode.map.size === 0) {
                rootNode.map.delete(char);
                this.nodeCount = this.nodeCount - 1;
            }
            this.removeFromRankList(rootNode, node);
        }
    
        // Return the updated delete status
        return isDeleted;
    }
    
    
    private add(node: INodeValue): boolean{
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
            if(rootNode.nodeValue) {
                this.removeValueById(rootNode.nodeValue.id);
                rootNode.ownRank.rank++;
                rootNode.nodeValue.value = node.value;
                rootNode.nodeValue.weight = rootNode.ownRank.rank;
                this.addValueById(rootNode.nodeValue.id, node.value);
                node.weight = rootNode.ownRank.rank;
                this.onUpdateCallback?.(node);
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
            this.nodeCount = this.nodeCount + 1;
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

    removeFromRankList(node: TrieNode, ignoreNode: NodeValue){
        if(!ignoreNode)
            return;

        node.rankList = this.mergeRankList(node.rankList, [], ignoreNode);
    }

    /**
     * Updates the rank list of the given node by sorting the rank list in descending order
     * based on the rank property, and then trimming it to the maximum number of suggestions.
     * @param node The node whose rank list is to be updated.
     */
    private updateRankList(node: TrieNode) {
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
                return this.mergeRankList([{
                    rank: this.MAX_RANK,
                    id: rootNode.nodeValue?.id as string
                }], rootNode.rankList);
            }
            else {
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
        
        if(mismatchCount === this.allowedMismatchCount){
            const childNode = rootNode.map.get(current);
            if(!childNode){
                return rootRankList;
            }
            else{
                let resultRankList = this.search(childNode, text, mismatchCount, index + 1);
                if (resultRankList) {
                    rootRankList = this.mergeRankList(rootRankList, resultRankList);
                }
            }
        }
        else {
            for (const [char, childNode] of rootNode.map.entries()) {
                if (mismatchCount < this.allowedMismatchCount) {
                    let resultRankList = this.search(childNode, text, char === current ? mismatchCount : mismatchCount + 1, index + 1) as IRank[];
                    if (resultRankList) {
                        rootRankList = this.mergeRankList(rootRankList, resultRankList);
                    }
                }
            }
        }
    
        // Return the rootRankList
        return rootRankList;
    }
    

    private mergeRankList(list1: IRank[], list2: IRank[], ignoreNode: NodeValue | null = null): IRank[] {
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
            else if(ignoreNode && list1[i].id == ignoreNode.id){
                i++;
            }
            else if(ignoreNode && list2[j].id == ignoreNode.id){
                j++;
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
            if(ignoreNode?.id == list1[i].id){
                i++;
                continue;
            }

            mergedList.push(list1[i]);
            i++;
        }
        
        // Add the remaining elements from list2, if any
        while (mergedList.length < this.maxSuggestion && j < list2.length) {
            if(list2[j].id == ignoreNode?.id){
                j++;
                continue;
            }

            mergedList.push(list2[j]);
            j++;
        }
        
        return mergedList;
    }

    clear(): void {
        this._valueByKey = new Map();
        this._root = new TrieNode();
        this._nodeCount = 0;
        this._maxSuggestion =  this._maxSuggestion ?? this.DEFAULT_MAX_SUGGESION;
        this._ignoreCase = this._ignoreCase ?? this.DEFAULT_IGNORE_CASE;
        this._allowedMismatchCount = this._allowedMismatchCount ?? this.DEFAULT_MISMATCH_ALLOW
    }
}