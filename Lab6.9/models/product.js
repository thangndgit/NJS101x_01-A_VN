const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id;
  }

  save() {
    if (this._id) {
      const objId = mongodb.ObjectId(this._id);
      return getDb()
        .collection("products")
        .updateOne({ _id: objId }, { $set: this });
    } else return getDb().collection("products").insertOne(this);
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
