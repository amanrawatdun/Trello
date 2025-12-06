import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createListApi, getListsApi, reorderListsApi, updateListApi, deleteListApi } from "./listApi";

// GET LISTS
export const getLists = createAsyncThunk(
  "lists/getLists",
  async (boardId, thunkAPI) => {
    try {
      const response = await getListsApi(boardId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// CREATE LIST
export const createList = createAsyncThunk(
  "lists/createList",
  async (data, thunkAPI) => {
    try {
      const response = await createListApi(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// UPDATE LIST
export const updateList = createAsyncThunk(
  "lists/updateList",
  async (data, thunkAPI) => {
    try {
      console.log(data);
      const response = await updateListApi(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// DELETE LIST
export const deleteList = createAsyncThunk(
  "lists/deleteList",
  async (listId, thunkAPI) => {
    try {
      const response = await deleteListApi(listId);
      return { listId };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// REORDER LISTS
export const reorderLists = createAsyncThunk(
  "lists/reorderLists",
  async ({ boardId, listIds }, thunkAPI) => {
    try {
      const response = await reorderListsApi({ boardId, listIds });
      return response.data; // contains newOrder
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const listSlice = createSlice({
  name: "list",
  initialState: {
    lists: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLists.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLists.fulfilled, (state, action) => {
        state.loading = false;
        state.lists = action.payload;
      })
      .addCase(createList.fulfilled, (state, action) => {
        state.lists.push(action.payload);
      })
      .addCase(updateList.fulfilled, (state, action) => {
        const updated = action.payload.list;
        const index = state.lists.findIndex((l) => l._id === updated._id);
        if (index !== -1) state.lists[index] = updated;
      })
      .addCase(deleteList.fulfilled, (state, action) => {
        const { listId } = action.payload;
        state.lists = state.lists.filter((l) => l._id !== listId);
      })
      .addCase(reorderLists.fulfilled, (state, action) => {
        const newOrder = action.payload.newOrder;
        state.lists.sort(
          (a, b) => newOrder.indexOf(a._id) - newOrder.indexOf(b._id)
        );
      });
  },
});

export default listSlice.reducer;

