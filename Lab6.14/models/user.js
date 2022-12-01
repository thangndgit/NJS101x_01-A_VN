const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  save() {
    return getDb().collection("users").insertOne(this);
  }

  static findById(userId) {
    const objId = new ObjectId(userId);
    return getDb().collection("users").findOne({ _id: objId });
  }
}

module.exports = User;
