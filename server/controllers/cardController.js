const Board = require('../models/Board');
const List = require('../models/List');
const Card = require('../models/Card');


const checkListAndBoard = async (listId, userId) => {
    const list = await List.findById(listId);
    if (!list) {
        return { status: 404, message: 'List not found' };
    }
    const board = await Board.findById(list.boardId);
    if (!board) {
        return { status: 404, message: 'Board not found' };
    }
    if (!board.members.includes(userId)) {
        return { status: 403, message: 'Not authorized to modify this list' };
    }
    return { status: 200, list, board };
};

exports.getCard = async (req, res) => {
    console.log("i am")
    const { boardId } = req.params;
    console.log(boardId);
    try {
        const cards = await Card.find({ boardId });
        res.status(200).json(cards);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

exports.createCard = async (req, res) => {
    const { title, listId } = req.body;
    const userId = req.user._id;

    const authCheck = await checkListAndBoard(listId, userId);
    if (authCheck.status !== 200) {
        return res.status(authCheck.status).json({ message: authCheck.message });
    }
    try {
        const list = authCheck.list;
        const position = list.cards.length;

        const newCard = new Card({
            title,
            listId,
            boardId: list.boardId,
            position
        });

        await newCard.save();

        list.cards.push(newCard._id);
        await list.save();
        res.status(201).json(newCard);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// controllers/cardController.js
exports.moveCard = async (req, res) => {
  console.log("moveCard payload:", req.body);

  const {
    sourceListId,
    destinationListId,
    cardId,
    newCardIdsInDestList
  } = req.body;

  const userId = req.user && req.user._id;

  // Basic validation
  if (!sourceListId || !destinationListId || !cardId || !Array.isArray(newCardIdsInDestList)) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  // Permission & load destination list + board
  const authCheck = await checkListAndBoard(destinationListId, userId);
  if (authCheck.status !== 200) {
    return res.status(authCheck.status).json({ message: authCheck.message });
  }

  const destList = authCheck.list;
  const board = authCheck.board;

  try {
    // Normalize new order: unique strings
    const normalizedNewOrder = Array.from(
      new Set(newCardIdsInDestList.map((id) => id.toString()))
    );

    // Ensure the moved card is present in the normalized new order.
    // If not present, append it at the intended index (last).
    if (!normalizedNewOrder.includes(cardId.toString())) {
      normalizedNewOrder.push(cardId.toString());
    }

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    // If moving between lists -> remove from source list and update card.listId
    if (sourceListId !== destinationListId) {
      const sourceList = await List.findById(sourceListId);
      if (sourceList) {
        sourceList.cards = sourceList.cards.filter(
          (id) => id.toString() !== cardId.toString()
        );
        await sourceList.save();
      }

      // Update card's listId & boardId (persist)
      card.listId = destinationListId;
      card.boardId = board._id;
      await card.save();
    }

    // Update dest list cards to canonical normalized order
    destList.cards = normalizedNewOrder;
    await destList.save();

    // Bulk update positions for cards in the destination list
    const bulkOps = normalizedNewOrder.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { position: index, listId: destinationListId, boardId: board._id } }
      }
    }));

    if (bulkOps.length > 0) {
      await Card.bulkWrite(bulkOps);
    }

    // Fetch updated card documents for the newOrder so frontend can patch reliably
    const updatedCards = await Card.find({ _id: { $in: normalizedNewOrder } })
      .lean()
      .exec();

    // Ensure updatedCards returned in the same order as normalizedNewOrder
    const updatedCardsOrdered = normalizedNewOrder.map((id) =>
      updatedCards.find((c) => c._id.toString() === id.toString()) || null
    );

    return res.status(200).json({
      message: "Card moved successfully",
      newOrder: normalizedNewOrder,
      destinationListId,
      updatedCards: updatedCardsOrdered
    });
  } catch (error) {
    console.error("Move Card Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.updateCard = async (req, res) => {
    const { cardId } = req.params;
    const userId = req.user._id;

    console.log(req.body)

    try {
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        // Check board permission using card.listId
        const authCheck = await checkListAndBoard(card.listId, userId);
        if (authCheck.status !== 200) {
            return res.status(authCheck.status).json({ message: authCheck.message });
        }

        // Update only provided fields
        const allowedFields = ["title", "description", "labels", "dueDate", "members"];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                card[field] = req.body[field];
            }
        });

        await card.save();

        console.log(card);

        res.status(200).json({
            message: "Card updated successfully",
            card
        });

    } catch (error) {
        console.error("Update Card Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteCard = async (req, res) => {
    const { cardId } = req.params;
    const userId = req.user._id;

    try {
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        // permission check
        const authCheck = await checkListAndBoard(card.listId, userId);
        if (authCheck.status !== 200) {
            return res.status(authCheck.status).json({ message: authCheck.message });
        }

        const list = authCheck.list;

        // 1. Remove card from the list.cards array
        list.cards = list.cards.filter(id => id.toString() !== cardId);
        await list.save();

        // 2. Delete the card document
        await card.deleteOne();

        // 3. Reorder remaining cards' positions
        const remainingCards = await Card.find({ listId: list._id }).sort("position");

        const bulkOps = remainingCards.map((c, index) => ({
            updateOne: {
                filter: { _id: c._id },
                update: { $set: { position: index } }
            }
        }));
        await Card.bulkWrite(bulkOps);

        res.status(200).json({ message: "Card deleted successfully", cardId });

    } catch (error) {
        console.error("Delete Card Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

