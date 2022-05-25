const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("./database/db");

// init app & middleware
const app = express();
app.use(express.json());

// db conncetion

let db;

connectToDb((err) => {
  if (!err) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`app listening on port ${PORT}.`);
    });
    db = getDb();
  } else {
    console.log(err);
  }
});

const authRouter = require("./api/auth/auth.js");

// app.use("/employeeList", authRouter)

// app.get("/employeeList", (req, res) => {
//   let employees = [];

//   db.collection("employee")
//     .find() // cursor toArray forEach
//     .forEach((employee) => employees.push(employee))
//     .then(() => {
//       res
//         .status(200)
//         .json({ status: 200, msg: "Employee List", employees: employees });
//     })
//     .catch(() => {
//       res.status(500).json({ error: "Could not fatch the documents" });
//     });
// });

// EMPLOYEE LIST
app.post("/employeeList", (req, res) => {
  const body = req.body;
  let employees = [];

  if (body.isLoggedIn == 1) {
    db.collection("employee")
      .find()
      .forEach((employee) => employees.push(employee))
      .then(() => {
        res.status(200).json({ employees: employees });
      })
      .catch(() => {
        res.status(500).json({ error: "Could not fatch the documents" });
      });
  } else {
    res.status(400).json({ error: "Not authorised" });
  }
});

// LOGIN
app.post("/login", (req, res) => {
  const _body = req.body;
  const _email = _body.email;
  const _password = _body.password;

  db.collection("employee")
    .findOne({ email: _email, password: _password })
    .then((obj) => {
      console.log(obj);
      if (obj != null) {
        res.status(200).json({
          status: 200,
          msg: "found",
          body: obj,
        });
      } else {
        res.status(200).json({
          status: 400,
          msg: "not found",
          body: obj,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not found" });
    });
});

//USER REGISTRATION
app.post("/registration", (req, res) => {
  const _body = req.body;
  const _email = _body.email;
  const _password = _body.password;

  db.collection("employee")
    .findOne({ email: _email })
    .then((obj) => {
      console.log(obj);
      if (obj == null) {
        db.collection("employee")
          .insertOne(_body)
          .then((obj) => {
            console.log(obj);
            res.status(200).json({
              status: 200,
              msg: "Registration successful",
              body: obj,
            });
          });
      } else {
        res.status(200).json({
          status: 400,
          msg: "Email already exist",
          body: {},
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not found" });
    });
});

//ADD NEW FIELD IN EMPLOYEE COLLECTION
app.post("/employeeNewField", (req, res) => {
  const _body = req.body;
  const _newFieldName = _body.newFieldName;
  const _defaultValue = _body.defaultValue;
  const updates = {};
  updates[_newFieldName] = _defaultValue;

  db.collection("employee")
    .findOne()
    .then((obj) => {
      if (!obj.hasOwnProperty(_newFieldName)) {
        db.collection("employee")
          .updateMany({}, { $set: updates })
          .then((obj) => {
            console.log(obj);
            console.log(obj);
            res.status(200).json({
              status: 200,
              msg: "New Field Added successfully",
              body: temp,
            });
          })
          .catch((err) => {
            res.status(400).json({
              status: 400,
              msg: "Could not added, something went wrong",
              body: {},
            });
          });
      } else {
        res.status(400).json({
          status: 400,
          msg: "Field already exists",
          body: {},
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        status: 500,
        msg: "Internal Database Error",
        body: {},
      });
    });
});

//UPDATE PROFILE
