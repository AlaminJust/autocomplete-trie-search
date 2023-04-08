# autocomplete-trie-search

This package provides an autocomplete search functionality using a Trie data structure. It can be used to quickly search for suggestions based on a user's input.

# Installation

To install the package, run the following command:

    npm install autocomplete-trie-search

# Usage

Creating a new instance of the autocomplete search
To create a new instance of the autocomplete search, import the package and create a new instance:

    import { AutoCompleteTrieSearch } from "autocomplete-trie-search";

    const search = new AutoCompleteTrieSearch();

# Inserting nodes into the Trie

    const node = { text: "example", value: { text:'example', id: 1 }, weight: 5 };
    search.insertOrUpddate(node);

    const nodes = [
      { text: "example", value: { text:'example', id: 1 }, weight: 5 },
      { text: "sample", value: { text:'sample', id: 2 }, weight: 3 },
    ];
    search.insertOrUpddate(nodes);
    
# Removing nodes from the Trie

To remove a node from the Trie, call the delete() method on the search instance, passing in the node to remove:

    const node = { text: "example", value: { id: 1 }, weight: 5 };
    search.delete(node);
    
# Generating suggestions

To generate suggestions for a user's input, call the suggestion() method on the search instance, passing in the input text:

    const text = "exam";
    const suggestions = search.suggestion(text);
    console.log(suggestions); // [{text:"example",id:1}]

# Updating search options

    const newOptions = {
      maxSuggestion: 5,
      allowedMismatchCount: 2
    };

    search.updateOptions(newOptions);
    
# Clearing the Trie

To clear all nodes from the Trie, call the clear() method on the search instance:

    search.clear();
    
# API

`AutoCompleteTrieSearch()`
Creates a new instance of the autocomplete search.

`insertOrUpddate(node: INodeValue | INodeValue[]): boolean`
Inserts one or more nodes into the Trie, or updates existing nodes if they already exist. Returns true if the nodes were inserted or updated successfully, false otherwise.

`delete(node: INodeValue): boolean`
Removes a node from the Trie. Returns true if the node was removed successfully, false otherwise.

`suggestion(text: string): any[]`
Returns an array of autocomplete suggestions for the given text.

`updateOptions(options: AutoCompleteTrieSearchOptions): void`
Updates the options used by the autocomplete search.

`clear(): void`
Clears all nodes from the Trie.

# Interfaces

`IRank`
Interface representing a rank object that stores the frequency of a word that passes through a Trie node.

`INodeValue`
Interface representing the value of a Trie Node.

`ITrieNode`
Interface representing a Trie Node.

`AutoCompleteTrieSearchOptions`
Options for configuring an autocomplete search using a Trie data structure.

`IAutoCompleteTrieSearch`
Interface representing an autocomplete search using a Trie data structure.
