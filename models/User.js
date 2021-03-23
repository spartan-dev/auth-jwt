const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "EL email es obligatorio"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Ingresa un Email valido"],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Minimo de password es 6 caracteres"],
  },
});
//se dispara cuando algo courre despues del evento de guarado del usuario se llama mongoose hook
/* userSchema.post('save', function(doc,next){
  console.log(doc)
  next()
}) */
// dispara la funcion antes de salvar el documento que

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//metodo estatico para logear al usuario
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Password Incorrecto");
  }
  throw Error("Email es Incorrecto");
};
const User = mongoose.model("user", userSchema);
module.exports = User;
