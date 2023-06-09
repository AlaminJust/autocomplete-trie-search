"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoCompleteTrieSearch = void 0;
const trie_node_1 = require("./trie-node");
class AutoCompleteTrieSearch {
    constructor(options) {
        var _a, _b;
        this.DEFAULT_MISMATCH_ALLOW = 3;
        this.DEFAULT_MAX_SUGGESION = 10;
        this._valueByKey = new Map();
        this._root = new trie_node_1.TrieNode();
        this._maxSuggestion = (_a = options.maxSuggestion) !== null && _a !== void 0 ? _a : this.DEFAULT_MAX_SUGGESION;
        this._allowedMismatchCount = (_b = options.allowedMismatchCount) !== null && _b !== void 0 ? _b : this.DEFAULT_MISMATCH_ALLOW;
    }
    updateOptions(options) {
        this.maxSuggestion = options.maxSuggestion;
        this.allowedMismatchCount = options.allowedMismatchCount;
    }
    set allowedMismatchCount(value) {
        if (this.DEFAULT_MISMATCH_ALLOW < value || !value) {
            value = this.DEFAULT_MISMATCH_ALLOW;
        }
        this._allowedMismatchCount = value;
    }
    get allowedMismatchCount() {
        return this._allowedMismatchCount;
    }
    set root(value) {
        this._root = value;
    }
    get root() {
        return this._root;
    }
    set maxSuggestion(value) {
        this._maxSuggestion = value;
    }
    get maxSuggestion() {
        return this._maxSuggestion;
    }
    get valueByKey() {
        return this._valueByKey;
    }
    addValueById(key, value) {
        // If the key is not already in the map, add the key-value pair
        if (!this.valueByKey.has(key)) {
            this.valueByKey.set(key, value);
        }
    }
    insert(node) {
        var _a;
        // If node or node text is falsy or only whitespace, return false
        if (!node || !((_a = node.text) === null || _a === void 0 ? void 0 : _a.trim())) {
            return false;
        }
        // Create a new node value object from the given node and assign a unique ID
        const nodeValue = new trie_node_1.NodeValue(node);
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
    insertInToTrie(rootNode, node, index = 0) {
        // If the root node doesn't exist or the index is out of bounds, return the root node
        if (!rootNode || index > node.text.length) {
            return rootNode;
        }
        // If we've reached the end of the node's text, set the node value in the root node, update the rank list,
        // and return the root node
        if (index === node.text.length) {
            rootNode.nodeValue = node;
            this.addValueById(node.id, node.value);
            this.updateRankList(rootNode);
            return rootNode;
        }
        // Get the current character being inserted
        const char = node.text[index];
        // Get the child node corresponding to the current character
        let childNode = rootNode.map.get(char);
        // If the child node doesn't exist, create a new one and add it to the root node's map
        if (!childNode) {
            childNode = new trie_node_1.TrieNode();
            rootNode.map.set(char, childNode);
        }
        // Recursively insert the remaining characters into the child node
        childNode = this.insertInToTrie(childNode, node, index + 1);
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
    updateRankList(node) {
        var _a, _b;
        let rankList = node.rankList;
        // If the rank list of the node is not defined, set it to an empty array
        if (!rankList) {
            rankList = [];
        }
        // Push the node's id and weight as a new object into the rank list
        rankList.push({
            rank: (_a = node.nodeValue) === null || _a === void 0 ? void 0 : _a.weight,
            id: (_b = node.nodeValue) === null || _b === void 0 ? void 0 : _b.id
        });
        // Sort the rank list in descending order based on the rank property
        rankList.sort((a, b) => b.rank - a.rank);
        // If the length of the rank list is greater than the maximum number of suggestions, remove the last item
        if (rankList.length > this.maxSuggestion) {
            rankList.pop();
        }
        // Update the node's rank list with the new rank list
        node.rankList = rankList;
    }
    suggession(text) {
        let rankList;
        if (!text.trim()) {
            rankList = this.root.rankList;
        }
        else {
            rankList = this.search(this.root, text) || [];
        }
        let suggesions = [];
        rankList.forEach((rank) => {
            const value = this.valueByKey.get(rank.id);
            suggesions.push(value);
        });
        return suggesions;
    }
    search(rootNode, text, mismatchCount = 0, index = 0) {
        var _a;
        // If the rootNode is undefined, return undefined
        if (!rootNode) {
            return undefined;
        }
        // If index has reached the end of the text and mismatchCount is zero,
        // return the node's rank as a single element array with the node's ID
        if (index === text.length && mismatchCount === 0) {
            return [{
                    rank: Math.max(),
                    id: (_a = rootNode.nodeValue) === null || _a === void 0 ? void 0 : _a.id
                }];
        }
        // If index has reached the end of the text, return the node's rankList
        if (index === text.length) {
            return rootNode.rankList;
        }
        // Initialize an empty array for the rootRankList and get the current character
        let rootRankList = [];
        const char = text[index];
        // Get the child node for the current character
        let childNode = rootNode.map.get(char);
        // If a child node exists for the current character, search for the rest of the text in the child node
        if (childNode) {
            return this.search(childNode, text, mismatchCount, index + 1);
        }
        else {
            // If no child node exists for the current character, search all child nodes with mismatchCount incremented
            for (const [char, childNode] of rootNode.map.entries()) {
                if (mismatchCount < this.allowedMismatchCount) {
                    let resultRankList = this.search(childNode, text, mismatchCount + 1, index + 1);
                    if (resultRankList) {
                        rootRankList = this.mergeRankList(rootRankList, resultRankList);
                    }
                }
            }
        }
        // Return the rootRankList
        return rootRankList;
    }
    mergeRankList(list1, list2) {
        const mergedList = [];
        let i = 0; // Pointer for list1
        let j = 0; // Pointer for list2
        // Merge the two lists until we reach the maximum number of suggestions
        while (mergedList.length < this.maxSuggestion && i < list1.length && j < list2.length) {
            // Compare the rank of the elements at the current position of the pointers
            if (list1[i].rank >= list2[j].rank) {
                mergedList.push(list1[i]);
                i++;
            }
            else {
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
exports.AutoCompleteTrieSearch = AutoCompleteTrieSearch;
module.exports = AutoCompleteTrieSearch;
