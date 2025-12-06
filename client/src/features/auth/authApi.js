import api from '../../service/api';

export const registerAPI = async (data)=>{
    const res = await api.post('/users/register',data);
    return res;
}

export const loginAPI = async (data)=>{
    const res =await api.post('/users/login',data);
    return res;
}