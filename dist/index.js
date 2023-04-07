"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const autocomplete_trie_search_1 = require("./src/autocomplete-trie-search");
const hello = new autocomplete_trie_search_1.AutoCompleteTrieSearch({
    maxSuggestion: 3,
    allowedMismatchCount: 3,
    ignoreCase: false
});
let node = {
    text: 'llo',
    value: '',
    weight: 5,
};
let node1 = {
    text: 'llasafdasdasdf',
    value: '',
    weight: 10,
};
let node2 = {
    text: 'llj',
    value: '',
    weight: 9,
};
hello.insert(node);
hello.insert(node1);
hello.insert(node2);
console.log(hello.suggession('LLj'));
