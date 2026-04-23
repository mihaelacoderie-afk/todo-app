
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://mihaelacoderie_db_user:ndo2Ue2OQC6H9zoh@ac-5uvszrf-shard-00-00.7gfs50y.mongodb.net:27017,ac-5uvszrf-shard-00-01.7gfs50y.mongodb.net:27017,ac-5uvszrf-shard-00-02.7gfs50y.mongodb.net:27017/todoDB?ssl=true&replicaSet=atlas-xdppa5-shard-0&authSource=admin&appName=Cluster0");
    console.log("MongoDB conectat ✔️");
  } catch (err) {
    console.log("Eroare MongoDB:", err.message);
  }
};

module.exports = connectDB;