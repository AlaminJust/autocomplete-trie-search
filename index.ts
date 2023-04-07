import { AutoCompleteTrieSearch } from "./src/autocomplete-trie-search";
import { INodeValue } from "./src/interface";

const hello = new AutoCompleteTrieSearch({
    maxSuggestion: 3,
    allowedMismatchCount: 3,
    ignoreCase: false
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

console.log(hello.suggession('Hello'));