
import api from "@/config/axiosInstance";
import { store } from "@/store/store";
import { ILesson } from "@/types/aitutor";
import axios from "axios";

const accessToken = store.getState().auth.accessToken;

// const api = axios.create({
//     baseURL:'http://localhost:5050',
//     headers:{
//         'Content-Type':'application/json',
//         'Authorization': `Bearer ${accessToken}`   
//     },
//     withCredentials: true
// });

export const generateRoadmap = async (topic:string) => {
    return api.post(`/ai-tutor/roadmap/${topic}`)
};


export const fetchRoadmap = async () => {
    return api.get(`/ai-tutor/roadmap`)
};

export const fetchRoadmapByID = async (id?: string) => {
    return api.get(`/ai-tutor/roadmap/${id}`)
};

export const deleteRoadmap = async (id?: string) => {
    return api.delete(`/ai-tutor/roadmap/${id}`)
};


export const generateContent = async (data:ILesson) => {
    return api.post(`/ai-tutor/generatecontent`,data)
};


export const getContent = async (id?: string ) => {
    return api.get(`/ai-tutor/getcontent/${id}`)
};


export const generateQuiz = async (id?: string) => {
    return api.post(`/ai-tutor/generatequiz/${id}`)
};

export const fetchQuiz = async () => {
    return api.get(`/ai-tutor/quiz`)
};

export const getQuiz = async (id?: string) => {
    return api.get(`/ai-tutor/quiz/${id}`)
};