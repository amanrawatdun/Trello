import axios from 'axios';

const api=axios.create({
    baseURL:'http://localhost:5000/api',
    withCredentials:true,
})

api.interceptors.request.use((data)=>{
    const user = JSON.parse(localStorage.getItem('user'));
    if(user && user.token){
        data.headers.Authorization=`Bearer ${user.token}`;
    }
    return data;
})

export default api;