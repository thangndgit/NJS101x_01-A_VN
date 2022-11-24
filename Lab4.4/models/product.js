const products = [];

const fs = require("fs");
const path = require("path");
const dataPath = path.join(__dirname, "..", "data", "products.json");

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    fs.readFile(dataPath, (err, fileContent) => {
      const products = [];
      if (!err) products.push(...JSON.parse(fileContent));
      products.push(this);
      fs.writeFile(dataPath, JSON.stringify(products), (err) =>
        console.log(err)
      );
    });
    products.push(this);
  }

  static fetchAll() {
    fs.readFile(dataPath, (err, fileContent) => {
      if (!err) return JSON.parse(fileContent);
      else return [];
    });
  }
};
