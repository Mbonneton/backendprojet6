const express = require('express');
const router = express.Router();

console.log("router sauces");

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.post('/', multer, saucesCtrl.createSauces);
router.post('/:id/like',multer,saucesCtrl,likeSauces);
router.put('/:id', auth, multer, saucesCtrl.modifySauces);
router.delete('/:id', auth, saucesCtrl.deleteSauces);
router.get('/:id', auth, saucesCtrl.getOneSauces);
router.get('/', auth, saucesCtrl.getAllSauces);




module.exports = router;