const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("638b8e203a97245b48def419")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://matitmui:12345679@funix-njs101x-cluster.mvj9tlu.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then(() => User.findOne())
  .then((user) => {
    if (!user) {
      user = new User({
        name: "matitmui",
        email: "matitmui@yahoo.com",
        cart: {
          items: [],
        },
        orders: [],
      });
      user.save();
    }
    app.listen(3000);
  })
  .catch((err) => console.log(err));
