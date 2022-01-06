/* Import Declarations -- Using ES5 Modules */
const express = require("express");
const app = express();
// Check what CORS module is needed for.
const cors = require("cors");
const appControllers = require("./controller/controller.js");
const port = 4000;
const db = require("./db-models/db-models");
const cookieParser = require("cookie-parser");

/* Use Declarations -- Using JSON, URL Encoding, CORS, Cookie Parser */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());

/* Router Declarations -- Most Functionality is Embedded in Routers */
const usersRouter = require("./routes/users.js");
const favoritesRouter = require("./routes/favorites.js");
const preferencesRouter = require("./routes/preferences.js");
const summaryRouter = require("./routes/summary.js");
const userDetailsRouter = require("./routes/user-details.js");

app.use("/users", usersRouter);
app.use("/favorites", favoritesRouter);
app.use("/preferences", preferencesRouter);
app.use("/summary", summaryRouter);
app.use("/userDetails",userDetailsRouter)

/* Default Routes: Routes that do not use a router.*/

// Base Route: Send mesage 'welcome to server' (not used).
app.get("/", function (req, res, next) {
  // Why is RememberMe turned off?
  // res.cookie('rememberMe', 'yes', { httpOnly: false})
  res.status(200).send("welcome to server");
});

// Default Route: Route client to 'not-found' page.
app.get("*", function (req, res, next) {
  res.status(301).redirect("/not-found");
});

// Send error message and 500 status on error.
app.use((error, req, res, next) => {
  return res.status(500).json({ error: error });
});

app.listen(port, (req, res) => {
  console.log("SERVER is listening on port 4000");
});
