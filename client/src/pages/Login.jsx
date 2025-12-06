import { useState } from "react"
import {useDispatch, useSelector} from 'react-redux';
import { loginUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Login=()=>{

    const [email ,setEmail]=useState("");
    const [password ,setPassword]=useState("");

    const {isError , isLoading , message} = useSelector((state)=>state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit=async(e)=>{

        e.preventDefault();

        try{
            const formData = {email , password};
            const response = await dispatch(loginUser(formData));
            
            if(response.payload){
                navigate('/');
            }
        }catch(err){
            console.log("Error in Login",err);   
        }
    }
    return (
        <div className="bg-red-200">
            <form onSubmit={handleSubmit} >
                <h2>Login</h2>

                <label htmlFor="email">Email Address</label>
                <input type="email"
                 id="email"
                 value={email}
                 onChange={(e)=>setEmail(e.target.value)}
                 required
                />

                <label htmlFor="password">Password</label>
                <input type="password"
                id="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
                />

                <button
                type="submit"
                disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'} 
                </button>
            </form>
        </div>
    )
};

export default Login;
