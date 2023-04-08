"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoCompleteTrieSearch = void 0;
const trie_node_1 = require("./trie-node");
class AutoCompleteTrieSearch {
    constructor(options) {
        var _a, _b, _c;
        this.DEFAULT_MISMATCH_ALLOW = 3;
        this.DEFAULT_MAX_SUGGESION = 10;
        this.DEFAULT_IGNORE_CASE = true;
        this.MAX_RANK = 1000000000;
        this._valueByKey = new Map();
        this._root = new trie_node_1.TrieNode();
        this._nodeCount = 0;
        this._maxSuggestion = (_a = options === null || options === void 0 ? void 0 : options.maxSuggestion) !== null && _a !== void 0 ? _a : this.DEFAULT_MAX_SUGGESION;
        this._ignoreCase = (_b = options === null || options === void 0 ? void 0 : options.ignoreCase) !== null && _b !== void 0 ? _b : this.DEFAULT_IGNORE_CASE;
        this._allowedMismatchCount = (_c = options === null || options === void 0 ? void 0 : options.allowedMismatchCount) !== null && _c !== void 0 ? _c : this.DEFAULT_MISMATCH_ALLOW;
    }
    updateOptions(options) {
        var _a, _b;
        this.maxSuggestion = (_a = options.maxSuggestion) !== null && _a !== void 0 ? _a : this.maxSuggestion;
        this.allowedMismatchCount = (_b = options.allowedMismatchCount) !== null && _b !== void 0 ? _b : this.allowedMismatchCount;
    }
    /**
     * The onUpdate method sets a callback function that will be called
     * when the node value is updated.
     *
     * @param {OnUpdateCallback} callback - The callback function to set.
     * @returns {void}
     */
    onUpdate(callback) {
        this.onUpdateCallback = callback;
    }
    set nodeCount(value) {
        this._nodeCount = value;
    }
    get nodeCount() {
        return this._nodeCount;
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
    get ignoreCase() {
        return this._ignoreCase;
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
    removeValueById(key) {
        return this.valueByKey.delete(key);
    }
    insertOrUpddate(nodes) {
        let isInserted = false;
        if (Array.isArray(nodes)) {
            nodes.forEach(node => {
                if (this.add(node)) {
                    isInserted = true;
                }
            });
        }
        else {
            isInserted = this.add(nodes);
        }
        return isInserted;
    }
    delete(node) {
        // Create a new NodeValue instance from the given node.
        const newNode = new trie_node_1.NodeValue(node);
        // Call the remove method with the root of the tree and the new node to be deleted.
        return this.remove(this.root, newNode);
    }
    remove(rootNode, node, index = 0) {
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
        const isDeleted = this.remove(childNode, node, index + 1);
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
    add(node) {
        var _a;
        // If node or node text is falsy or only whitespace, return false
        if (!node || !((_a = node.text) === null || _a === void 0 ? void 0 : _a.trim())) {
            return false;
        }
        if (this.ignoreCase) {
            node.text = node.text.trim().toLowerCase();
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
        var _a;
        // If the root node doesn't exist or the index is out of bounds, return the root node
        if (!rootNode || index > node.text.length) {
            return rootNode;
        }
        // If we've reached the end of the node's text, set the node value in the root node, update the rank list,
        // and return the root node
        if (index === node.text.length) {
            if (rootNode.nodeValue) {
                this.removeValueById(rootNode.nodeValue.id);
                rootNode.ownRank.rank++;
                rootNode.nodeValue.value = node.value;
                rootNode.nodeValue.weight = rootNode.ownRank.rank;
                this.addValueById(rootNode.nodeValue.id, node.value);
                node.weight = rootNode.ownRank.rank;
                (_a = this.onUpdateCallback) === null || _a === void 0 ? void 0 : _a.call(this, node);
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
            childNode = new trie_node_1.TrieNode();
            rootNode.map.set(char, childNode);
            this.nodeCount = this.nodeCount + 1;
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
    removeFromRankList(node, ignoreNode) {
        if (!ignoreNode)
            return;
        node.rankList = this.mergeRankList(node.rankList, [], ignoreNode);
    }
    /**
     * Updates the rank list of the given node by sorting the rank list in descending order
     * based on the rank property, and then trimming it to the maximum number of suggestions.
     * @param node The node whose rank list is to be updated.
     */
    updateRankList(node) {
        let rankList = [];
        // Push the node's id and weight as a new object into the rank list
        rankList.push(node.ownRank);
        // Update the node's rank list with the new rank list
        node.rankList = this.mergeRankList(node.rankList, rankList);
    }
    suggession(text) {
        let rankList;
        // If the text is empty or consists only of whitespace characters, use the root node's rank list
        if (!text.trim()) {
            rankList = this.root.rankList;
        }
        else {
            // Otherwise, search for the node corresponding to the given text and get its rank list
            rankList = this.search(this.root, text) || [];
        }
        let suggesions = [];
        // For each rank in the rank list, get the corresponding node value and add it to the suggestions array
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
            if (rootNode.nodeValue) {
                return this.mergeRankList([{
                        rank: this.MAX_RANK,
                        id: (_a = rootNode.nodeValue) === null || _a === void 0 ? void 0 : _a.id
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
        let rootRankList = [];
        const current = text[index];
        for (const [char, childNode] of rootNode.map.entries()) {
            if (mismatchCount < this.allowedMismatchCount) {
                let resultRankList = this.search(childNode, text, char === current ? mismatchCount : mismatchCount + 1, index + 1);
                if (resultRankList) {
                    rootRankList = this.mergeRankList(rootRankList, resultRankList);
                }
            }
        }
        // Return the rootRankList
        return rootRankList;
    }
    mergeRankList(list1, list2, ignoreNode = null) {
        const mergedList = [];
        list1 = list1 !== null && list1 !== void 0 ? list1 : [];
        list2 = list2 !== null && list2 !== void 0 ? list2 : [];
        let i = 0; // Pointer for list1
        let j = 0; // Pointer for list2
        // Merge the two lists until we reach the maximum number of suggestions
        while (mergedList.length < this.maxSuggestion && i < list1.length && j < list2.length) {
            // Compare the rank of the elements at the current position of the pointers
            if (list1[i].id === list2[j].id) {
                i++;
            }
            else if (ignoreNode && list1[i].id == ignoreNode.id) {
                i++;
            }
            else if (ignoreNode && list2[j].id == ignoreNode.id) {
                j++;
            }
            else if (list1[i].rank >= list2[j].rank) {
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
            if ((ignoreNode === null || ignoreNode === void 0 ? void 0 : ignoreNode.id) == list1[i].id) {
                i++;
                continue;
            }
            mergedList.push(list1[i]);
            i++;
        }
        // Add the remaining elements from list2, if any
        while (mergedList.length < this.maxSuggestion && j < list2.length) {
            if (list2[j].id == (ignoreNode === null || ignoreNode === void 0 ? void 0 : ignoreNode.id)) {
                j++;
                continue;
            }
            mergedList.push(list2[j]);
            j++;
        }
        return mergedList;
    }
    clear() {
        this._root = new trie_node_1.TrieNode();
    }
}
exports.AutoCompleteTrieSearch = AutoCompleteTrieSearch;
