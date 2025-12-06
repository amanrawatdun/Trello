import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createBoardApi, deleteBoardApi, getBoardByIdApi, getBoardDataApi, updateBoardApi } from "./boardAPI";

export const getBoardData = createAsyncThunk (
    'board/getBoardData',
    async (_, thunkAPI) => {
        try{
            const response = await getBoardDataApi();
            return response.data;
        }catch(error){
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const createBoard = createAsyncThunk(
    'board/createBoard',
    async (boardData, thunkAPI) => {
        try{
            const response = await createBoardApi(boardData);
            return response.data;
        }catch(error){
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);  

export const updateBoard = createAsyncThunk(
    'board/updateBoard',
    async ({ boardId, title, description }, thunkAPI) => {  
        try{
            const response = await updateBoardApi(boardId, title, description);
            return response.data;
        }
        catch(error){
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }   
    }
);

export const getBoardById = createAsyncThunk(
    'board/getBoardById',
    async (boardId, thunkAPI) => {  
        try{
            const response = await getBoardByIdApi(boardId);
            return response.data;
        }
        catch(error){
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }   
    }
);

export const deleteBoard = createAsyncThunk(
    'board/deleteBoard',
    async (boardId, thunkAPI) => {
        try{
            const response = await deleteBoardApi(boardId);
            return response.data;
        }catch(error){
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);  

const boardSlice = createSlice({
    name: 'board',
    initialState: {
        boards: [],
        currentBoard: null,
        isLoading: false,
        isError: false,
        message: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getBoardData.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = '';
            })
            .addCase(getBoardData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.message = '';
                state.boards = action.payload;
            })
            .addCase(getBoardData.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createBoard.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = '';
            })
            .addCase(createBoard.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.message = '';
                state.boards.push(action.payload);
            })
            .addCase(createBoard.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateBoard.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = '';
            })
            .addCase(updateBoard.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.boards.findIndex(board => board._id === action.payload._id);
                if (index !== -1) {
                    state.boards[index] = action.payload;
                }
            })
            .addCase(updateBoard.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getBoardById.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = '';
            })
            .addCase(getBoardById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.message = '';
                state.currentBoard = action.payload;
            })
            .addCase(getBoardById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteBoard.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = '';
            })
            .addCase(deleteBoard.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.message = '';
                state.boards = state.boards.filter(board => board._id !== action.payload.id);
            })
            .addCase(deleteBoard.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export default boardSlice.reducer;