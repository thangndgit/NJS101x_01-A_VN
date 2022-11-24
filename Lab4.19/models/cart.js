const fs = require("fs");
const path = require("path");
const { deleteById } = require("./product");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(id, prodPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) cart = JSON.parse(fileContent);
      const existingProdIndex = cart.products.findIndex(
        (prod) => prod.id == id
      );
      const existingProd = cart.products[existingProdIndex];
      let updatedProd = {};
      if (existingProd) {
        updatedProd = { ...existingProd };
        updatedProd.qty++;
        cart.products[existingProdIndex] = updatedProd;
      } else {
        updatedProd = { id, qty: 1 };
        cart.products = [...cart.products, updatedProd];
      }
      cart.totalPrice += Number(prodPrice);
      fs.writeFile(p, JSON.stringify(cart), (err) => console.log(err));
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) cb(null);
      else cb(cart);
    });
  }

  static deleteById(id, prodPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) return;
      const cart = JSON.parse(fileContent);
      const product = cart.products.find((prod) => prod.id === id);
      const updatedCart = { ...cart };
      updatedCart.products = cart.products.filter((prod) => prod.id !== id);
      updatedCart.totalPrice -= product.qty * prodPrice;
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => console.log(err));
    });
  }
};
