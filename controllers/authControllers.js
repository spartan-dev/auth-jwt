const User = require("../models/User");
const jwt = require("jsonwebtoken");
//manejar errores
const handleErrors = (error) => {
  console.log(error.message, error.code);
  let errors = { email: "", password: "" };
  //email incorrecto email
  if (error.message === "Email es Incorrecto") {
    errors.email = "Email es Incorrecto";
  }
  if (error.message === "Password Incorrecto") {
    errors.password = "Password Incorrecto";
  }
  //error de usuario duplicados
  if (error.code === 11000) {
    errors.email = "Ese usuario ya esta en uso";
    return errors;
  }
  //validations errors
  if (error.message.includes("user validation failed")) {
    Object.values(error.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};
//tirempo maximo de vida
const maxAge = 3 * 24 * 60 * 60; // tres dias
//crear token
const createToken = (id) => {
  //este metodo firma el token
  /**
   * @param id es el identificador unico para el token (payload)
   * @param string es la llave secreta (que puede ser un process.env)
   * @param {object} objeto de opciones
   */
  return jwt.sign({ id }, "spartans secret key", { expiresIn: maxAge });
};

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const signUser = await User.create({ email, password });
    const token = createToken(signUser._id);
    //poner eso dentro de una cookie
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: signUser._id });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    //poner eso dentro de una cookie
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};
module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
