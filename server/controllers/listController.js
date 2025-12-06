const Board = require('../models/Board');
const List = require('../models/List');
const Card=require('../models/Card');

const checkBoardMembership = async (boardId, userId) => {
    const board = await Board.findById(boardId);
    if (!board) {
        return { status: 404, message: 'Board not found' };
    }
    if (!board.members.includes(userId)) {
        return { status: 403, message: 'Not authorized to modify this board' };
    }
    return { status: 200, board };
};

exports.getAllList =async (req ,res) =>{
    
    try {
        const boardId = req.params.id;

        const lists =  await List.find({ boardId }).sort({ position: 1 });
        res.status(200).json(lists);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }   
}


exports.createList = async (req, res) => {
    const {title , boardId} = req.body;

    const userId = req.user._id;



    const authCheck = await checkBoardMembership(boardId, userId);
    if (authCheck.status !== 200) {
        return res.status(authCheck.status).json({ message: authCheck.message });
    }
    try{ 

        const board = authCheck.board;
        const position = board.lists.length;

        const newList = new List({
            title,
            boardId,
            position
        });

        await newList.save();

        board.lists.push(newList._id);
        await board.save();

        res.status(201).json(newList);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

exports.reorderLists = async (req, res) => {
    const {boardId , listIds} = req.body;
    const userId = req.user._id;

    const authCheck = await checkBoardMembership(boardId, userId);
    if (authCheck.status !== 200) {
        return res.status(authCheck.status).json({ message: authCheck.message });
    }
    try {
        const board = authCheck.board;

        board.lists = listIds;
        await board.save();

        const bulkOps = listIds.map((id, index)=>({
            updateOne: {
                filter:{_id:id  , boardId:boardId},
                update:{$set:{position:index} }
            }
        }));
        console.log(bulkOps);
        await List.bulkWrite(bulkOps);
        res.status(200).json({ message: 'Lists reordered successfully' ,newOrder: listIds });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


exports.updateList = async (req, res) => {
    const { listId } = req.params;
    const { title } = req.body;
    const userId = req.user._id;

    try {
        const list = await List.findById(listId);
        if (!list) return res.status(404).json({ message: 'List not found' });

        // Check board permission
        const authCheck = await checkBoardMembership(list.boardId, userId);
        if (authCheck.status !== 200) {
            return res.status(authCheck.status).json({ message: authCheck.message });
        }

        list.title = title || list.title;
        await list.save();

        res.status(200).json({ message: 'List updated successfully', list });

    } catch (error) {
        console.error("Update List Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.deleteList = async (req, res) => {
    const { listId } = req.params;
    const userId = req.user._id;

    try {
        const list = await List.findById(listId);
        if (!list) return res.status(404).json({ message: "List not found" });

        // Permission check
        const authCheck = await checkBoardMembership(list.boardId, userId);
        if (authCheck.status !== 200) {
            return res.status(authCheck.status).json({ message: authCheck.message });
        }

        const board = authCheck.board;

        // 1. Remove all cards inside the list
        await Card.deleteMany({ listId: listId });

        // 2. Remove list from board.lists array
        board.lists = board.lists.filter(id => id.toString() !== listId);
        await board.save();

        // 3. Delete the list itself
        await list.deleteOne();

        // 4. Reassign positions to remaining lists
        const remainingLists = await List.find({ boardId: board._id }).sort("position");
        const bulkOps = remainingLists.map((l, index) => ({
            updateOne: {
                filter: { _id: l._id },
                update: { $set: { position: index } }
            }
        }));
        await List.bulkWrite(bulkOps);

        res.status(200).json({ message: "List deleted successfully" });

    } catch (error) {
        console.error("Delete List Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
