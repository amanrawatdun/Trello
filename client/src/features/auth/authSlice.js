import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { loginAPI, registerAPI } from './authApi';

const user = JSON.parse(localStorage.getItem('user'));  

const initialState = {
    user:user ? user : null,
    isLoading:false,
    isError:false,
    message:'',
};

export const registerUser = createAsyncThunk(
    'auth/register',
    async(formData , thunkAPI) => {
        try{
            const response = await registerAPI(formData);
            return response.data;
        }catch(error){
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async(formData , thunkAPI) => {
        try{

            const response = await loginAPI(formData)

            if(response.data){
                localStorage.setItem('user',JSON.stringify(response.data))
            }   
            return response.data;

        }catch(error){
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
)


const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        logout:()=>{
            localStorage.removeItem('user');
            state.user = null;
            state.isLoading=false;
            state.isError=false;
            state.message='';
        },
        setUser:(state, action)=>{
            state.isLoading=false;
            state.isError=false;
            state.message='';
            state.user = action.payload;
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(registerUser.pending,(state)=>{
            state.isLoading=true;
            state.isError=false;
            state.message='';
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.user=action.payload;
            state.isError=false;
            state.message='';
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.message=action.payload;
            state.user=null;
        })
        .addCase(loginUser.pending,(state)=>{
            state.isLoading=true;
            state.isError=false;
            state.message='';
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.user=action.payload;
            state.isError=false;
            state.message='';
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.message=action.payload;
            state.user=null;
        })
    }
})

export const {setUser, logout} = authSlice.actions;
export default authSlice.reducer;