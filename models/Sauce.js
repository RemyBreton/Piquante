const mongoose = require('mongoose');

/**************************** SCHEMA ****************************/
/***************************************************************/

const sauceSchema = mongoose.Schema({ // donne les differents champs que notre shema aura besoin
        userId: {type: String, required: true},
        name: {type: String, required: true},
        manufacturer: {type: String, required: true},
        description: {type: String, required: true},
        mainPepper: {type: String, required: true},
        imageUrl: {type: String, required: true},
        heat: {type: Number, required: true},
        likes: {type: Number, required: true, default: 0},
        dislikes: {type: Number, required: true, default: 0},
        usersLiked: {type: Array},
        usersDisliked: {type: Array}
});

module.exports = mongoose.model('Sauce', sauceSchema); // export du modele 