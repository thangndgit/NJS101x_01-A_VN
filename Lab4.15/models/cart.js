const fs = require("fs");
const path = require("path");

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
};
