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
    text: 'Hellp you are good deveoloper',
    value: {hl: 'hello man', dl: 'how are you'},
    weight: 9,
}
let node4: INodeValue = {
    text: 'Hellp you are good deveoloper',
    value: {hl: 'hello good man', dl: 'how are you'},
    weight: 9,
}

hello.insert([node,node1,node2,node3,node3,node3,node4]);

console.log(hello.suggession('Hello'));