const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
const app = express();
//middlewares
app.use(express.static("public"));
//body parser express
app.use(express.json());
//cookie parser express
app.use(cookieParser());

//motor de vistas
app.set("views", "./views");
app.set("view engine", "pug");

//conexion a la base de datos del
const mongoConnect = "mongodb://localhost/authyninja";
mongoose
  .connect(mongoConnect, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) =>
    app.listen(3000, console.log("Server ready in local db:🚀"))
  )
  .catch((error) => console.log("Hy pedo :", error));

//route
app.get("*", checkUser);
app.get("/", (req, res, next) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res, next) => res.render("smoothies"));
app.use(authRoutes);
