import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../features/auth/authSlice";
import { useState } from "react";


const Register =()=>{

    const [username,setUsername]=useState('');
    const [email ,setEmail]=useState("");
    const [password ,setPassword]=useState("");

    const {isError , isLoading , message} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();

        try{
            const formData ={username ,email, password};
            const response = await dispatch(registerUser(formData));

            if(response.payload){
                navigate('/login');
            }

        }catch(error){
            console.log("Error in Registration",error);
        }

    }

    return(
        <div>
            <h1>Register Page</h1>
            <form onSubmit={handleSubmit} >
                <label htmlFor="username">Username</label>
                <input type="text"
                 id="username"
                 value={username}
                 onChange={(e)=>setUsername(e.target.value)}
                 required
                />

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
                    {isLoading ? 'Registering...' : 'Register'} 
                </button>
            </form>
        </div>
    )
}
export default Register;