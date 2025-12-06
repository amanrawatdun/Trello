import api from "../../service/api";

export const getCardApi = async(boardId)=>{
    const response = await api.get(`/cards/${boardId}`);
    console.log(response.data);
    return response;
} 


export const createCardApi = async ({listId, title}) => {
    console.log(listId , title)
    const response = await api.post('/cards', { listId, title });
    return response;
}

export const moveCardApi = async (sourceListId, destinationListId, cardId, newCardIdsInDestList) => {
    console.log("hil");
    const response = await api.put('/cards/move', { sourceListId, destinationListId, cardId, newCardIdsInDestList });
    return response;
}

export const deleteCardApi = async(cardId)=>{
    const response = await api.delete(`cards/${cardId}`)
    return response;
} 

export const updateCardApi = async({cardId , title })=>{
    console.log(title);
    const response = await api.patch(`cards/${cardId}` , {title})
    console.log(response.data);
    return response;
}
