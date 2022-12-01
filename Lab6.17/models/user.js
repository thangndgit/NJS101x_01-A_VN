const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(name, email, id) {
    this.name = name;
    this.email = email;
    this._id = new ObjectId(id);
  }

  save() {
    return getDb().collection("users").insertOne(this);
  }

  addToCart(productId) {
    // const cartProduct = this.cart.items.findIndex(
    //   (cp) => cp._id === product._id
    // );
    const updatedCart = {
      items: [{ productId: new ObjectId(productId), quantity: 1 }],
    };
    return getDb()
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  static findById(userId) {
    const objId = new ObjectId(userId);
    return getDb().collection("users").findOne({ _id: objId });
  }
}

module.exports = User;
