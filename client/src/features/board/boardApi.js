import api from '../../service/api';

export const getBoardDataApi = async () => {
    console.log("i am here");
    const response = await api.get('/boards');
    console.log("jlo");
    console.log(response.data);
    return response;
}

export const createBoardApi = async (boardData) => {
    const response = await api.post('/boards', boardData);
    return response;
}

export const updateBoardApi = async (boardId, title , description) => {
    const response = await api.put(`/boards/${boardId}`, { title, description });
    return response;
}

export const getBoardByIdApi = async (boardId) => {
    const response = await api.get(`/boards/${boardId}`);
    return response;
}

export const deleteBoardApi = async (boardId) => {
    const response = await api.delete(`/boards/${boardId}`);
    return response;
}

