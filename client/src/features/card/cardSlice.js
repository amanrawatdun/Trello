import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createCardApi, deleteCardApi, getCardApi, moveCardApi, updateCardApi } from "./cardApi";

export const createCard = createAsyncThunk(
  "cards/createCard",
  async ({ listId, title }, thunkAPI) => {
    try {
      const response = await createCardApi({ listId, title });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getCard = createAsyncThunk(
  "cards/getCard",
  async (boardId, thunkAPI) => {
    try {
      const response = await getCardApi(boardId);
      return response.data; // array of cards
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const moveCard = createAsyncThunk(
  "cards/moveCard",
  async ({ sourceListId, destinationListId, cardId, newCardIdsInDestList }, thunkAPI) => {
    try {
      const response = await moveCardApi(
        sourceListId,
        destinationListId,
        cardId,
        newCardIdsInDestList
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteCard = createAsyncThunk(
  'cards/deleteCard',
  async (cardId, thunkAPI) => {
    try {
      const response = await deleteCardApi(cardId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
)

export const updateCard = createAsyncThunk(
  'cards/updateCard',
  async (data, thunkAPI) => {
    try {

      const response = await updateCardApi(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
)

const cardSlice = createSlice({
  name: "card",
  initialState: {
    cards: [],   // <-- ARRAY VERSION
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // CREATE CARD
    builder
      .addCase(createCard.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCard.fulfilled, (state, action) => {
        state.loading = false;
        state.cards.push(action.payload); // push new card
      })
      .addCase(createCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // GET CARDS
    builder
      .addCase(getCard.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCard.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload; // array of cards
      })
      .addCase(getCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // MOVE CARD
    builder
    .addCase(moveCard.pending, (state, action) => {
  const { sourceListId, destinationListId, cardId, newCardIdsInDestList } = action.meta.arg;

  // update card listId immediately if present in state
  const card = state.cards.find((c) => c._id === cardId);
  if (card) card.listId = destinationListId;

  // Remove any cards that are in newCardIdsInDestList from state
  const remaining = state.cards.filter((c) => !newCardIdsInDestList.includes(c._id));

  // Reconstruct ordered cards from state
  const orderedCards = newCardIdsInDestList.map((id) => {
    const local = state.cards.find((c) => c._id === id);
    return local ? { ...local, listId: destinationListId } : { _id: id, listId: destinationListId };
  });

  state.cards = [...remaining, ...orderedCards];
})
      .addCase(moveCard.fulfilled, (state, action) => {
  state.loading = false;

  const { newOrder, destinationListId, updatedCards } = action.payload;

  // remove any cards that are part of the newOrder from existing state to avoid duplicates
  const remaining = state.cards.filter((c) => !newOrder.includes(c._id));

  // Build orderedCards: prefer server-returned updatedCards, fall back to local state
  const orderedCards = newOrder.map((id) => {
    // try server copy first
    const fromServer = updatedCards && updatedCards.find((c) => c && c._id === id);
    if (fromServer) return fromServer;

    // fallback to existing card in state (if present)
    const local = state.cards.find((c) => c._id === id);
    if (local) {
      // ensure listId is updated
      return { ...local, listId: destinationListId };
    }

    // last resort: return a minimal placeholder (shouldn't usually happen)
    return { _id: id, listId: destinationListId, title: "Unknown" };
  });

  // merge without duplicates (just in case)
  const merged = [...remaining, ...orderedCards].filter(
    (v, i, a) => a.findIndex((t) => t._id === v._id) === i
  );

  state.cards = merged;
})
.addCase(moveCard.rejected, (state, action) => {
  state.loading = false;

  console.error("MOVE CARD FAILED:", action.payload || "Unknown error");

  // ❗ Fallback: simply re-fetching all cards fixes any bad client ordering
  // You should dispatch getCard(boardId) from the component on error.

  // But if staying inside reducer:
  state.error = action.payload?.message || "Card move failed. Reloading required.";
});

    builder
      .addCase(deleteCard.fulfilled, (state, action) => {
        const { cardId } = action.payload;
        state.cards = state.cards.filter((card) => card._id !== cardId);
      });

    builder
      .addCase(updateCard.fulfilled, (state, action) => {
        const updated = action.payload.card;
        const index = state.cards.findIndex((C) => C._id === updated._id);
        if (index !== -1) state.cards[index] = updated;
      })
  },
});

export default cardSlice.reducer;
