"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const autocomplete_trie_search_1 = require("./src/autocomplete-trie-search");
const hello = new autocomplete_trie_search_1.AutoCompleteTrieSearch({
    maxSuggestion: 3,
    allowedMismatchCount: 3,
    ignoreCase: false
});
let node = {
    text: 'Hello world',
    value: '',
    weight: 5,
};
let node1 = {
    text: 'Hello I am fine',
    value: '',
    weight: 10,
};
let node2 = {
    text: 'Hellw you are good',
    value: '',
    weight: 9,
};
let node3 = {
    text: 'Hellp you are good deveoloper',
    value: { hl: 'hello man', dl: 'how are you' },
    weight: 9,
};
let node4 = {
    text: 'Hellp you are good deveoloper',
    value: { hl: 'hello good man', dl: 'how are you' },
    weight: 9,
};
hello.insert([node, node1, node2, node3, node3, node3, node4]);
console.log(hello.suggession('Hello'));
