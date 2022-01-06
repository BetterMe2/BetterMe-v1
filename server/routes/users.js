/* Import Declarations */
const express = require("express");
const router = express.Router();
const db = require("../db-models/db-models.js");
const appControllers = require("../controller/controller.js");
const cookieParser = require('cookie-parser');

router.use(cookieParser());

/* SignUp Route*/
router.post("/signup", appControllers.signup, (req, res) => {
  console.log("this is the message: ", res.locals.message);
  console.log("this is error:", res.locals.error);
  // Check where validation errors are generated.
  if (res.locals.validationErrors) {
    return res.json(res.locals.validationErrors);
  }

  if (res.locals.message) {
    return res.status(200).json({ message: res.locals.message });
  }

  if (res.locals.error) {
    return res.status(400).send(res.locals.error);
  }
});

/* Login Route*/
router.post("/login", appControllers.login, (req, res) => {
  // If there is an error at login, send 400 status with error message.
  if (res.locals.error) {
    res.status(400).json({ error: res.locals.error });
  }
  // If a login message is received, send a 200/OK status, which will let the user log in on the client side.
  if (res.locals.message) {
    console.log(res.locals.message)
    res.status(200).json({ message: res.locals.message });
  }
});
/* Logout Route*/
// router.get("/logout", appControllers.logout, (req, res) => {
//   console.log(req.body)
//   res.clearCookie("user");
//   res.status(200).send({ loggedIn: false })
// })



/* Profile Update Route*/
router.put("/:id/updateProfile", async (req, res) => {

  // Profile update route passes ID from client to server in req.params.id.
  const { id } = req.params;

  // Put update route passes fullName, username, passwrod, and email through req.body.
  const { fullname, username, password, email } = req.body;

  // database query for update passes new username, password, email, and fullname for the given username.

  // Parameterized Query: username, password, email, fullname, id are passed in as $1, $2, $3, $4, $5.
  const q =
    "UPDATE users SET username =($1), password=($2), email=($3), fullName=($4) WHERE user_id=($5)";
  await db.query(
    q,
    [username, password, email, fullname, id],
    (err, result) => {
      // If error, send status 400 and error message.
      if (err) {
        return res.status(400).send("Error updating userAccountDetails");
      }
      if (result) {
        // Run query looking for the user that is attemping to update.
        db.query("SELECT * from users where user_id=($1)",[id],(err,result) =>{
          // If query errors, send an error.
          if(err) return res.status(400).send("Error in selecting updated user details");
              res.cookie("user", JSON.stringify(result.rows[0]), {
                maxAge: 900000,
                httpOnly: false,
              });
            // If query does not error, send status 200: user details updated successfully.
            return res.status(200).send("User Details updated successfully");
        })
      }
    }
  );
});

module.exports = router;
