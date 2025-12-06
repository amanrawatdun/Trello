const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const { createCard, moveCard, updateCard, deleteCard, getCard } = require('../controllers/cardController');

router.get('/:boardId', authMiddleware, getCard);

router.post('/',authMiddleware , createCard )
router.put('/move' , authMiddleware , moveCard) 

router.patch("/:cardId",authMiddleware , updateCard );
router.delete("/:cardId" , authMiddleware , deleteCard);


module.exports = router;
