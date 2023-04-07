/**
 * Interface representing a rank object that stores the frequency of a word that passes through a Trie node.
 * @interface
 */
export interface IRank {
    /**
     * The frequency rank of the word.
     * @type {number}
     */
    rank: number,

    /**
     * The ID of the word.
     * @type {string}
     */
    id: string
}

/**
 * Interface representing the value of a Trie Node.
 * @interface
 */
export interface INodeValue{
    /**
     * The text of the node value.
     * @type {string}
     */
    text: string,

    /**
     * The value associated with the node.
     * @type {any | undefined}
     */
    value: any | undefined,

    /**
     * The weight or importance of the node value.
     * @type {number | undefined}
     */
    weight: number | undefined,
}

/**
 * Interface representing a Trie Node.
 * @interface
 */
export interface ITrieNode {
    /**
     * Array of rank objects that stores the frequency of each word that passes through the node.
     * @type {IRank[]}
     */
    rankList: IRank[],

    /**
     * Map object that stores the child nodes of the current node, mapped by the characters in their node value.
     * @type {Map<string, ITrieNode>}
     */
    map: Map<string, ITrieNode>;

    /**
     * The value of the node.
     * @type {INodeValue | null}
     */
    nodeValue: INodeValue | null;
}


/**
 * Options for configuring an autocomplete search using a Trie data structure.
 * @interface
 */
export interface AutoCompleteTrieSearchOptions {
    /**
     * The maximum number of suggestions to return in the autocomplete results.
     * @type {number}
     * @default {number} 10
     */
    maxSuggestion: number;

    /**
     * The maximum number of character mismatches allowed between the user input and the suggested words.
     * Max allowed mismatch count is 3.
     * @type {number} - An integer value representing the maximum number of allowed mismatches.
     * @default {number} 3
     */
    allowedMismatchCount: number;

    /**
     * Determines whether the autocomplete search should be case-sensitive or case-insensitive.
     * @type {boolean}
     * @default {boolean} true
     */
    ignoreCase: boolean;
}

/**
 * Interface representing an autocomplete search using a Trie data structure.
 * @interface
 */
export interface IAutoCompleteTrieSearch {
    /**
     * The root node of the Trie.
     * @type {ITrieNode}
     */
    root: ITrieNode;
  
    /**
     * Inserts a node into the Trie.
     * @param {INodeValue} node - The node to insert.
     * @returns {boolean} - True if the node was inserted successfully, false otherwise.
     */
    insert(node: INodeValue): boolean;
  
    /**
     * Returns an array of autocomplete suggestions for the given text.
     * @param {string} text - The text to generate suggestions for.
     * @returns {any[]} - An array of suggestions.
     */
    suggession(text: string): any[];
  
    /**
     * Updates the options used by the autocomplete search.
     * @requires {op}
     * @param {AutoCompleteTrieSearchOptions} options - The new options to use.
     * @returns {void}
     */
    updateOptions(options: AutoCompleteTrieSearchOptions): void;
  }
  