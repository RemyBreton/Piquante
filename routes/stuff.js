const express = require('express');

const router = express.Router();

/**************************** ACHEMINEMENT ****************************/
/*********************************************************************/

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceCtrl = require('../controllers/stuff');

/**************************** CRUD + ACHEMINEMENT + DROIT ****************************/
/************************************************************************************/

router.get('/', auth,  sauceCtrl.getAllSauce);
router.post('/', auth, multer, sauceCtrl.createThing);
router.get('/:id', auth,  sauceCtrl.getOneThing);
router.put('/:id', auth,  multer,  sauceCtrl.modifyThing);
router.delete('/:id', auth,  sauceCtrl.deleteThing);
router.post('/:id/like', auth, sauceCtrl.createLike)

module.exports = router;
