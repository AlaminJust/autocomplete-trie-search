# Introduction 

The AutoCompleteTrieSearch API is an interface for a Trie data structure that allows for efficient autocompletion of text based on a given set of words. It provides the ability to insert new nodes into the Trie, generate autocomplete suggestions for a given text, and update the options used by the autocomplete search.


# Interface

The AutoCompleteTrieSearch interface consists of the following methods:

# root

The root property is the root node of the Trie.

# insert(node: INodeValue): boolean

The insert method inserts a node into the Trie. It takes a parameter node of type INodeValue, which represents the node to insert. The method returns a boolean value indicating whether the node was inserted successfully or not.

# suggestion(text: string): any[]

The suggestion method generates an array of autocomplete suggestions for a given text. It takes a parameter text of type string, which represents the text to generate suggestions for. The method returns an array of suggestions.

# updateOptions(options: AutoCompleteTrieSearchOptions): void

The updateOptions method updates the options used by the autocomplete search. It takes a parameter options of type AutoCompleteTrieSearchOptions, which represents the new options to use. The method does not return anything.

# Usage

To use the AutoCompleteTrieSearch API, you can create an instance of an object that implements the IAutoCompleteTrieSearch interface. You can then call the various methods of the interface on that object.

# Code

        import { AutoCompleteTrieSearch } from 'autocomplete-trie-search';

        const hello = new AutoCompleteTrieSearch({
            maxSuggestion: 3,
            allowedMismatchCount: 3,
            ignoreCase: true
        });


        let node: INodeValue = {
            text: 'Hello world',
            value: '',
            weight: 5,
        }
        let node1: INodeValue = {
            text: 'Hello I am fine',
            value: '',
            weight: 10,
        }
        let node2: INodeValue = {
            text: 'Hellw you are good',
            value: '',
            weight: 9,
        }
        let node3: INodeValue = {
            text: 'Hellp you are good',
            value: '',
            weight: 9,
        }
        hello.insert(node);
        hello.insert(node1);
        hello.insert(node2);
        hello.insert(node3);

        console.log(hello.suggession('Hello')); // '[ 'Hello I am fine', 'Hellw you are good', 'Hellp you are good' ]'


# Conclusion

The AutoCompleteTrieSearch API is a powerful interface for implementing autocompletion functionality in your applications. By using the Trie data structure, it allows for efficient generation of autocomplete suggestions based on a given set of words.