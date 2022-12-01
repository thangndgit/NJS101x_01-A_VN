const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    return getDb().collection("products").insertOne(this);
  }

  static fetchAll() {
    return getDb().collection("products").find().toArray();
  }

  static findById(prodId) {
    const objId = new mongodb.ObjectId(prodId);
    return getDb().collection("products").find({ _id: objId }).next();
  }
}

module.exports = Product;
