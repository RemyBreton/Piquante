const express = require('express'); // importation d'express
const router = express.Router();

const userCtrl = require('../controllers/user'); // création du cheminement user

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router; // exportation du router