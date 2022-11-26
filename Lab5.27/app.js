const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

User.hasMany(Product);
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasOne(Cart);
Cart.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => User.findByPk(1))
  .then((user) => {
    if (!user) return User.create({ name: "Max", email: "max@pro.com" });
    return user;
  })
  .then((user) =>
    user
      .getCart()
      .then((cart) => {
        if (!cart) return user.createCart();
        return cart;
      })
      .catch((err) => console.log(err))
  )
  .then(() => app.listen(3000))
  .catch((err) => console.log(err));
