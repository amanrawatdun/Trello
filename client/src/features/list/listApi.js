import api from "../../service/api";

export const getListsApi = async (boardId) => {
    const response = await api.get(`/lists/${boardId}`);
    console.log(response.data)
    return response;
};

export const createListApi = async (data) => {
   
    const response = await api.post('/lists', data);
    console.log(response.data);
    return response;
}

export const reorderListsApi = async ({boardId, listIds}) => {
    const response = await api.put('/lists/reorder', { boardId, listIds });
    return response;
}

export const updateListApi = async ({listId, title}) => {
    const response = await api.patch(`/lists/${listId}`, {title});
    return response;
}

export const deleteListApi = async (listId) => {
    const response = await api.delete(`/lists/${listId}`);
    return response;
}