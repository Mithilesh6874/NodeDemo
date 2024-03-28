const mysqlConnection = require("./connection");
const express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Validation middleware for POST and PUT requests
const validateInputs = [
  check("Name")
    .isString()
    .isLength({ max: 50 })
    .withMessage(
      "Name must be a string with a maximum length of 50 characters"
    ),
  check("Email").isEmail().withMessage("Invalid email address"),
  check("Age")
    .isInt({ min: 18, max: 100 })
    .withMessage("Age must be a number between 18 and 100"),
  check("Gender")
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be one of 'Male', 'Female', or 'Other'"),
  check("Address")
    .isString()
    .isLength({ max: 100 })
    .withMessage(
      "Address must be a string with a maximum length of 100 characters"
    ),
  check("Mobile_No")
    .matches(/^\d{10}$/)
    .withMessage("Mobile number must be a valid 10-digit number"),
];

// get users
app.get("/api/users", (req, res) => {
  let sqlQuery = "SELECT * FROM users";
  mysqlConnection.query(sqlQuery, (err, results) => {
    if (err) {
      res.status(500).send(apiResponse(err));
    } else {
      res.status(200).send({ status: 200, error: null, response: results });
    }
  });
});

// Adding New User
app.post("/api/users/insert", validateInputs, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let userData = req.body;
  let sqlQuery = `INSERT INTO users (Name, Email, Age, Gender, Address, Mobile_No) VALUES (?, ?, ?, ?, ?, ?)`;
  mysqlConnection.query(
    sqlQuery,
    [
      userData.Name,
      userData.Email,
      userData.Age,
      userData.Gender,
      userData.Address,
      userData.Mobile_No,
    ],
    (err, results) => {
      if (err) {
        res.status(500).send(apiResponse(err));
      } else {
        res.status(200).send({ status: 200, error: null, response: results });
      }
    }
  );
});

// Updating user details
app.put("/api/users/update/:id", validateInputs, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let userData = req.body;
  let id = req.params.id;
  let sqlQuery = `UPDATE users SET Name=?, Email=?, Age=?, Gender=?, Address=?, Mobile_No=? WHERE Id=?`;
  mysqlConnection.query(
    sqlQuery,
    [
      userData.Name,
      userData.Email,
      userData.Age,
      userData.Gender,
      userData.Address,
      userData.Mobile_No,
      id,
    ],
    (err, results) => {
      if (err) {
        res.status(500).send(apiResponse(err));
      } else {
        res.status(200).send({ status: 200, error: null, response: results });
      }
    }
  );
});

// Deleting a user
app.delete("/api/users/:id", (req, res) => {
  let id = req.params.id;
  let sqlQuery = "DELETE FROM users WHERE id = ?";
  mysqlConnection.query(sqlQuery, id, (err, results) => {
    if (err) {
      res.status(500).send(apiResponse(err));
    } else {
      res.status(200).send({ status: 200, error: null, response: results });
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});
