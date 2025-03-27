import axios from "axios";

const api = axios.create({
    baseURL:'http://localhost:8000/api/v1',
    headers:{
        'Content-Type':'multipart/form-data'
    },
    withCredentials: true
});

const jsonApi = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});


export const uploadPdf = async (data:FormData) => {
    return api.post('/pdfchat/upload-pdfs',data)
};


export const askQuestions = async (question:string) => {
    return jsonApi.get('/pdfchat/ask-question', {
        params: { question }
    });
};
