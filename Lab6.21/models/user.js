const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart ? cart : { items: [] };
    this._id = new ObjectId(id);
  }

  save() {
    return getDb().collection("users").insertOne(this);
  }

  addToCart(productId) {
    const updatedItems = [...this.cart.items];

    const productIndex = this.cart.items.findIndex(
      (cp) => cp.productId.toString() === productId
    );

    if (productIndex === -1)
      updatedItems.push({ productId: new ObjectId(productId), quantity: 1 });
    else updatedItems[productIndex].quantity++;

    const updatedCart = { items: updatedItems };

    return getDb()
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  getCart() {
    const prodIds = this.cart.items.map((item) => item.productId);
    const prodQty = this.cart.items.map((item) => item.quantity);
    return getDb()
      .collection("products")
      .find({ _id: { $in: prodIds } })
      .toArray()
      .then((products) =>
        products.map((prod, index) => {
          return { ...prod, quantity: prodQty[index] };
        })
      );
  }

  deleteProductFromCart(prodId) {
    const updatedCartItems = this.cart.items.filter(
      (item) => item.productId.toString() !== prodId
    );

    const updatedCart = { items: updatedCartItems };

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
