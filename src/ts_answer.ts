import { readFileSync } from "fs";

type Item = {
  id: number;
  title: string;
  supermarket: string;
  price: number;
};

type ProductInfo = {
  title: string;
  supermarket: string;
};

type Product = {
  category: string;
  count: number;
  products: Array<ProductInfo>;
};

const data: Array<Item> = JSON.parse(readFileSync("data01.json", "utf8"));

const titleWords: Array<string> = data
  .map((item: Item) => item.title.split(" "))
  .flat()
  .map((word: string) => word.toLowerCase());

const corpus: Array<string> = Array.from(new Set(titleWords));

function getEmbeddings(title: string): string {
  const words = title.split(" ").map((word) => word.toLowerCase());
  const indices = words.map((word) => corpus.indexOf(word));
  const embedding = new Array(corpus.length).fill(0);
  indices.forEach((index) => {
    embedding[index] = 1;
  });
  return embedding.join("");
}

function newProduct(item: Item): Product {
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

function updateProduct(product: Product, item: Item): Product {
  product.count += 1;
  product.products.push({
    title: item.title,
    supermarket: item.supermarket,
  });
  return product;
}

const products: Map<string, Product> = new Map();

data.forEach((item) => {
  const embeddings = getEmbeddings(item.title);
  products.set(
    embeddings,
    products.has(embeddings)
      ? updateProduct(products.get(embeddings) as Product, item)
      : newProduct(item)
  );
});

const answer = Array.from(products.values());

console.log(JSON.stringify(answer, null, 2));
