const products = [];

const fs = require("fs");
const path = require("path");
const dataPath = path.join(__dirname, "..", "data", "products.json");

const getProductsFromFile = (apply) => {
  fs.readFile(dataPath, (err, fileContent) => {
    if (err) apply([]);
    else apply(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(dataPath, JSON.stringify(products), (err) =>
        console.log(err)
      );
    });
  }

  static fetchAll(apply) {
    getProductsFromFile(apply);
  }
};
