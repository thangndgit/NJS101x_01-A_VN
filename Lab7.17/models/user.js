const mongoose = require("mongoose");
const Order = require("./order");

const Schema = mongoose.Schema;

const userSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  orders: [
    {
      orderId: {
        type: mongoose.Types.ObjectId,
        ref: "Order",
        required: true,
      },
    },
  ],
});

userSchema.methods.addToCart = function (productId) {
  const cartItems = this.cart.items;

  const prodExistedIndex = cartItems.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (prodExistedIndex >= 0) cartItems[prodExistedIndex].quantity++;
  else {
    cartItems.push({
      productId,
      quantity: 1,
    });
  }

  this.cart.items = cartItems;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const cartItems = this.cart.items.filter(
    (item) => item.productId.toString() !== productId
  );
  this.cart.items = cartItems;
  return this.save();
};

userSchema.methods.createOrder = function () {
  const products = this.cart.items.map((item) => {
    return {
      productId: item.productId,
      quantity: item.quantity,
    };
  });

  const order = new Order({
    products,
    userId: this._id,
  });

  return order.save().then(() => {
    this.cart.items = [];
    this.orders.push({ orderId: order._id });
    return this.save();
  });
};

module.exports = mongoose.model("User", userSchema);
