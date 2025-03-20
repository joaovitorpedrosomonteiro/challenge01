"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var data = JSON.parse((0, fs_1.readFileSync)("data01.json", "utf8"));
var titleWords = data
    .map(function (item) { return item.title.split(" "); })
    .flat()
    .map(function (word) { return word.toLowerCase(); });
var corpus = Array.from(new Set(titleWords));
function getEmbeddings(title) {
    var words = title.split(" ").map(function (word) { return word.toLowerCase(); });
    var indices = words.map(function (word) { return corpus.indexOf(word); });
    var embedding = new Array(corpus.length).fill(0);
    indices.forEach(function (index) {
        embedding[index] = 1;
    });
    return embedding.join("");
}
function newProduct(item) {
    return {
        category: item.title,
        count: 1,
        products: [
            {
                title: item.title,
                supermarket: item.supermarket,
            },
        ],
    };
}
function updateProduct(product, item) {
    product.count += 1;
    product.products.push({
        title: item.title,
        supermarket: item.supermarket,
    });
    return product;
}
var products = new Map();
data.forEach(function (item) {
    var embeddings = getEmbeddings(item.title);
    products.set(embeddings, products.has(embeddings)
        ? updateProduct(products.get(embeddings), item)
        : newProduct(item));
});
var answer = Array.from(products.values());
console.log(JSON.stringify(answer, null, 2));
