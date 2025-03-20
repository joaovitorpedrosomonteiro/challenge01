import fs from "fs";

const data = JSON.parse(fs.readFileSync("data01.json", "utf8"));

const titleWords = data
  .map((item) => item.title.split(" "))
  .flat()
  .map((word) => word.toLowerCase());

const corpus = Array.from(new Set(titleWords));

function getEmbeddings(title) {
  const words = title.split(" ").map((word) => word.toLowerCase());
  const indices = words.map((word) => corpus.indexOf(word));
  const embedding = new Array(corpus.length).fill(0);
  indices.forEach((index) => {
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

const products = new Map();

data.forEach((item) => {
  const embeddings = getEmbeddings(item.title);
  products.set(
    embeddings,
    products.has(embeddings)
      ? updateProduct(products.get(embeddings), item)
      : newProduct(item)
  );
});

const answer = Array.from(products.values());

console.log(JSON.stringify(answer, null, 2));
