import { AutoCompleteTrieSearch } from "./src/autocomplete-trie-search";
import { INodeValue } from "./src/interface";

const hello = new AutoCompleteTrieSearch({
    maxSuggestion: 3,
    allowedMismatchCount: 3,
    ignoreCase: false
});

let node: INodeValue = {
    text: 'llo',
    value: '',
    weight: 5,
}


let node1: INodeValue = {
    text: 'llasafdasdasdf',
    value: '',
    weight: 10,
}


let node2: INodeValue = {
    text: 'llj',
    value: '',
    weight: 9,
}


hello.insert(node);
hello.insert(node1);
hello.insert(node2);

console.log(hello.suggession('LLj'));