const mongoose = require('mongoose'); // importation de mongoose
const uniqueValidator = require('mongoose-unique-validator'); // importation du package mongoose

/**************************** SCHEMA ****************************/
/***************************************************************/

const userSchema = mongoose.Schema({ // on stockera l'email et le mdp de l'utilisateur
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // empechera de s'enrigistrer plusieurs fois avec la meme adress mail

module.exports = mongoose.model('User', userSchema);