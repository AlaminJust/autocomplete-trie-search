# autocomplete-trie-search

This package provides an autocomplete search functionality using a Trie data structure. It can be used to quickly search for suggestions based on a user's input.

# Installation

To install the package, run the following command:

    npm install autocomplete-trie-search

# Unit test project using angular

`https://github.com/AlaminJust/autocomplete_trie_search_test`

    run command: ng test
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

# Performance
    it('Performance test by inserting 10000 data', () => {
        const autoCompleteTrieSearch = new AutoCompleteTrieSearch();
        const start = performance.now();

        for(let i = 0; i<10000; i++){
        const node: INodeValue = {
            text: uuid.v4(),
            value: {id: uuid.v4(), text: i},
            weight: 1
        };
        autoCompleteTrieSearch.insertOrUpddate(node);
        }

        
        const takenTime = performance.now() - start;

        console.log("Time taken to insert 100000 data: " + takenTime + "milisecond.");
        expect(takenTime).toBeLessThan(1000);

    });

    it('Suggestion performances by inserting are 10000 data', () => {
        const search = new AutoCompleteTrieSearch({maxSuggestion: 10, allowedMismatchCount: 3});

        for(let i = 0; i<10000; i++){
        const node: INodeValue = {
            text: uuid.v4(),
            value: {id: uuid.v4(), text: i},
            weight: 1
        };
        search.insertOrUpddate(node);
        }

        var list = [
        {
            text: "hello123world",
            value: {id: uuid.v4(), text: 'AL AMIN'},
            weight: 4
        },
        {
            text: "hello231world",
            value: {id: uuid.v4(), text: 'AL AMIN'},
            weight: 5
        },
        {
            text: "hello3423world",
            value: {id: uuid.v4(), text: 'AL AMIN'},
            weight: 6
        },
        {
            text: "hello423world",
            value: {id: uuid.v4(), text: 'AL AMIN'},
            weight: 7
        },
        {
            text: "hello53world",
            value: {id: uuid.v4(), text: 'AL AMIN'},
            weight: 8
        },
        {
            text: "hello43543world",
            value: {id: uuid.v4(), text: 'AL AMIN'},
            weight: 9
        },
        {
            text: "hello4534world",
            value: {id: uuid.v4(), text: 'AL AMIN'},
            weight: 11
        },
        {
            text: "hello545world",
            value: {id: uuid.v4(), text: 'AL AMIN'},
            weight: 12
        },
        {
            text: "hello4543world",
            value: {id: uuid.v4(), text: 'AL AMIN'},
            weight: 13
        }
        ]
        
        search.insertOrUpddate(list);
        
        const sStart = performance.now();

        console.log('Autocomplete suggessions1 => ', search.suggession("hello"));
        const takenForSuggesion = performance.now() - sStart;
        console.log("Time taken for providing suggesion : "+ takenForSuggesion + " in millisecond.", 'nodecount: ', search.nodeCount)
        expect(takenForSuggesion).toBeLessThan(1000)
    });


`For inserting 10000 data it's taking only 225 ms`
`For taking suggestion, the suggestion method take onle 5 ms`

Same time will take for update, delete a text from this data structure.
# Products usage

Our autocomplete-trie-search package could be used for product suggestions on a website:

Search Bar Autocomplete: As users start typing into the search bar, our package could be used to provide a list of suggestions based on the products available on the website. This can help users to easily find the products they are looking for, without having to type out the entire product name.

Related Products: On product pages, our package could be used to suggest related products that the user may be interested in. This could be based on the user's past search history, as well as the products they have recently viewed or purchased.

Upsell/Cross-sell Suggestions: Our package could also be used to suggest complementary or alternative products that the user may be interested in. For example, if a user is viewing a particular item of clothing, our package could suggest matching accessories or similar items from the same collection.

By using our autocomplete-trie-search package to provide intelligent product suggestions, website owners can enhance the user experience and increase the likelihood of users finding and purchasing products on their site.

# Case Study

Our autocomplete-trie-search package could be used for product suggestions on a website:

Search Bar Autocomplete: As users start typing into the search bar, our package could be used to provide a list of suggestions based on the products available on the website. This can help users to easily find the products they are looking for, without having to type out the entire product name.

Related Products: On product pages, our package could be used to suggest related products that the user may be interested in. This could be based on the user's past search history, as well as the products they have recently viewed or purchased.

Upsell/Cross-sell Suggestions: Our package could also be used to suggest complementary or alternative products that the user may be interested in. For example, if a user is viewing a particular item of clothing, our package could suggest matching accessories or similar items from the same collection.

By using our autocomplete-trie-search package to provide intelligent product suggestions, website owners can enhance the user experience and increase the likelihood of users finding and purchasing products on their site.