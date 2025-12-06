const Board = require('../models/Board');


exports.createBoard = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user._id;

        const board = new Board({
            title,
            description,
            owner: userId,
            members: [userId]
        });
        await board.save();
        res.status(201).json(board);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getBoards = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log(userId)
        const boards = await Board.find({ members: userId })
        // .populate('lists').populate('members', 'username email');
        res.status(200).json(boards);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getBoardById = async (req, res) => {
    try {
        const boardId = req.params.id;
        const userId = req.user._id;
        const board = await Board.findOne({ _id: boardId, members: userId })
        // .populate('lists').populate('members', 'username email');
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        res.status(200).json(board);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateBoard = async (req, res) => {
    const { title, description } = req.body;

    try {
        const board = await Board.findById(req.params.id);

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        
        if (!board.members.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to update this board' });
        }

        board.title = title || board.title;
        board.description = description || board.description;

        const updatedBoard = await board.save();
        res.status(200).json(updatedBoard);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteBoard = async(req ,res)=>{
    const boardId = req.params.id;
    try{
        const board = await Board.findById(boardId);
        if(!board){
            return res.status(404).json({message : 'Board not found'});
        }

        if(!board.members.includes(req.user._id)){
            return res.status(403).json({message : 'Not authorized to delete this board'});
        }
        await Board.findByIdAndDelete(boardId);
        res.status(200).json({message : 'Board deleted successfully',id:boardId });
    } catch (error) {
        res.status(500).json({message : 'Server error'});
    }
}