const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createList, reorderLists, getAllList, updateList, deleteList } = require('../controllers/listController');
const router = express.Router();

router.get('/:id' , authMiddleware , getAllList);
router.post('/' , authMiddleware , createList);
router.put('/reorder',authMiddleware , reorderLists);

router.patch('/:listId', authMiddleware , updateList);
router.delete('/:listId', authMiddleware , deleteList);

 
module.exports = router;