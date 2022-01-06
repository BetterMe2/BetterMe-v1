/* Import Statements */
const db = require("../db-models/db-models");
const appControllers = {};

/* Controllers */

// Use this controller to login to the app.
appControllers.login = async (req, res, next) => {
  const { username, password } = req.body;
  console.log("this is username from controllers:", username);

  // Submit query searching for a user.
  const q = "SELECT * FROM users WHERE username=($1) AND password=($2)";
  await db.query(q, [username, password], (err, data) => {
    if (err) {
      return next(err);
    }

    // If more than row comes back in the query, we know that the user exists.
    if (data.rows.length > 0) {
      console.log("user exist");
      // If the user is returned, set a cookie 'user' that contains the stringified information associated with that user.
      res.cookie("user", JSON.stringify(data.rows[0]), {
        maxAge: 900000,
        httpOnly: false,
      });

      // If logged in, set res.locals.message to 'successfully logged in.'
      res.locals.message = "successfully logged in";
      return next();
    } else {

      // Otherwise, advise user of wrong username and password.
      res.locals.error = "wrong username or password";
      return next();
    }
  });
};

// Log out controller -- which is not implemented on the frontend -- clears login cookie.
appControllers.logout = async (req, res, next) => {
  console.log(req.body)
  res.clearCookie("user");
  next();
}

// Signup controller.
// RESTRICTIONS:
  // USERNAME [REQUIRED, MINIMUM 6 CHARACTERS, MAXIMUM 20 CHARACTERS]
appControllers.signup = async (req, res, next) => {
  const { fullname, username, password, email } = req.body;
  // console.log("here is the username: ", username);
  // console.log("type of username: ", typeof username);

  //create an empty object
  const validationErrors = {};
  // conditionals to check if entries are formatted correctly, if incorrect, add message to validationErrors object
  // if username is empty/less than x characters
  if (username.length === 0) {
    validationErrors.username = "username is required";
  } else if (username.length < 6) {
    validationErrors.username = "Username must be min 6 characters";
  } else if (username.length > 20) {
    validationErrors.username = "Username must be max 20 characters";
  }

  // if fullname is empty
  console.log('this is the request body');
  console.log(req.body);

  if (fullname.length === 0) {
    validationErrors.fullname = "Please enter your full name.";
  }
  // if password is empty/less than x characters
  if (password.length === 0) {
    validationErrors.password = "Please enter your password.";
  } else if (password.length < 6) {
    validationErrors.password = "Password must be min 6 characters";
  }

  if (email.length === 0) {
    validationErrors.email = "Please enter an email address";
  } else {
    let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    if (regex.test(email) === false) {
      validationErrors.email = "Please enter a valid email address";
    }
  }
  // if email is not correctly formatted as email address

  if (Object.keys(validationErrors).length !== 0) {
    res.locals.validationErrors = validationErrors;
    return next();
  }

  const q = "SELECT * FROM users WHERE username=($1) OR email=($2)";
  await db.query(q, [username, email], async (err, data) => {
    if (err) {
      return next(err);
    }
    console.log(err);
    const result = await data;
    console.log("here is the response: ", result.rows.length);
    if (result.rows.length > 0) {
      res.locals.error =
        "Account with this username/email already exists. Please try with different username/email";
      next();
    } else {
      await db.query(
        "INSERT INTO users (username, fullname, password, email) VALUES (($1), ($2), ($3), ($4))",
        [username, fullname, password, email],
        async (err, data) => {
          if (err) {
            return next(err);
          }
          console.log("hey i inserted the user");

          await db.query(
            "SELECT * FROM users WHERE username=($1)",
            [username],
            (err, data) => {
              // console.log(data.rows[0]);

              res.cookie("user", JSON.stringify(data.rows[0]), {
                maxAge: 90000,
                httpOnly: false,
              });
              res.locals.message = "Successfully Signed Up!";
              return next();
            }
          );
        }
      );
    }
  });
};

module.exports = appControllers;

// pool.query(text, params, callback);
// INSERT INTO users(fullname,username,password,email) VALUES ('Alex Smith','alex','123','alex@gmail.com');
