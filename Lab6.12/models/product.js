const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = mongodb.ObjectId(id);
  }

  save() {
    if (this._id)
      return getDb()
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    else return getDb().collection("products").insertOne(this);
  }

  static fetchAll() {
    return getDb().collection("products").find().toArray();
  }

  static findById(prodId) {
    const objId = new mongodb.ObjectId(prodId);
    return getDb().collection("products").find({ _id: objId }).next();
  }

  static deleteById(prodId) {
    const objId = new mongodb.ObjectId(prodId);
    return getDb().collection("products").deleteOne({ _id: objId });
  }
}

module.exports = Product;
