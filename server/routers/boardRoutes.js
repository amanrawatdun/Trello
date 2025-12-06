const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createBoard, getBoards, getBoardById, updateBoard, deleteBoard } = require('../controllers/boardController');
const router = express.Router();

router.get('/' , authMiddleware , getBoards);
router.post('/', authMiddleware , createBoard);

router.get('/:id' , authMiddleware , getBoardById);
router.put('/:id' , authMiddleware , updateBoard);

router.delete('/:id', authMiddleware , deleteBoard);   

module.exports = router;
