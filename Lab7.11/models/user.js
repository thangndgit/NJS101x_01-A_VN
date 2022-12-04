const mongoose = require("mongoose");

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

module.exports = mongoose.model("User", userSchema);
