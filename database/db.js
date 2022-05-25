const { MongoClient } = require("mongodb");

let dbConnection;
let uri =
  "mongodb+srv://jamal:Nm0lqn7ewEFTAVQE@cluster0.adbab.mongodb.net/LoginReg?retryWrites=true&w=majority";

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uri)
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
