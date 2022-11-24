const fs = require("fs");
const path = require("path");

const Cart = require("./cart");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const editingProdIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        products[editingProdIndex] = this;
        console.log("have id");
      } else {
        if (products.length === 0) this.id = "1";
        else
          this.id = (Number(products[products.length - 1].id) + 1).toString();
        products.push(this);
      }
      fs.writeFile(p, JSON.stringify(products), (err) => {
        if (err) console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => {
        console.log(prod.id + " " + typeof prod.id);
        console.log(id + " " + typeof id);
        return prod.id === id;
      });
      console.log(product);
      cb(product);
    });
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id);
      const updatedProducts = products.filter((prod) => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (err) console.log(err);
        else Cart.deleteById(id, product.price);
      });
    });
  }
};
