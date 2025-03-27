import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import axios from 'axios'
import { config } from 'dotenv'
import roadmapModel from "./roadmapModel";

import contentModel from "./contentModel";
import quizModel from "./quizModel";
import mongoose from "mongoose";
import { AuthRequest } from "../types/authType";
import { prisma } from "../../prisma/client";
import { log } from "console";

config();

const generate_Roadmap = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        const _req = req as AuthRequest;
        const {topic} = req.params
        const response = await axios.post(`${process.env.PYTHON_BACKEND_URL}interviewhelper/roadmap`,{},{
            params: {
              topic
            }
          })
         const roadmap = await roadmapModel.create({...response.data,userId:_req.user.id})
         res.send(roadmap)
    
    } catch (error) {
        console.log(error)
        return next(createHttpError(500, "Error while creating a roadmap"));
    }
};


const fetchRoadmap = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _req = req as AuthRequest;
        const roadmap = await roadmapModel.find({userId:_req.user.id})
        res.status(200).json(roadmap)
    } catch (error) {
        console.log(error)
        return next(createHttpError(500, "Error fetching the roadmap"));
    }
};

const fetchRoadmapById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params
        const roadmap = await roadmapModel.findOne({_id:id})
        res.status(200).json(roadmap)
    } catch (error) {
        console.log(error)
        return next(createHttpError(500, "Error fetching the roadmap"));
    }
};


const deleteRoadmap = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(createHttpError(400, 'Invalid Roadmap ID'));
        }

        const roadmap = await roadmapModel.findOne({ _id: id });
        if (!roadmap) {
            return next(createHttpError(404, 'Roadmap not found'));
        }

        await contentModel.deleteMany({roadMapId:roadmap._id})

      
        await roadmapModel.deleteOne({ _id: id });

        res.status(200).json(roadmap);
    } catch (error) {
        console.log(error);
        return next(createHttpError(500, 'Error deleting the roadmap'));
    }
};

const generate_content = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {_id, roadMapId} = req.body
        console.log(req.body)
        const _req = req as AuthRequest;
        const content = await contentModel.findOne({lessonId:_id})

        if(!content){
            const response = await axios.post(`${process.env.PYTHON_BACKEND_URL}interviewhelper/roadmap/generatecontent`,req.body)
            const createContent = await contentModel.create({roadMapId:roadMapId,lessonId:_id,content:response.data.content,userId:_req.user.id})
            console.log(response.data.content)
            res.status(200).json(createContent)
            return
        }

        res.status(200).json(content)
    } catch (error) {
        console.log(error)
        return next(createHttpError(500, "Error generating the content"));
    }

};

const fetchContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params
        const content = await contentModel.findOne({_id:id})
        res.status(200).json(content)
    } catch (error) {
        return next(createHttpError(500, "Error fetching the roadmap"));
    }
};

const generateQuiz = async(req: Request, res: Response, next: NextFunction) =>{
    try {
        const {id} = req.params
        console.log(id)
        const _req = req as AuthRequest;
        const content = await contentModel.find({roadMapId:id})
        const combinedContent = content.map(content => content.content).join(' ');
        if(combinedContent !== ''){
           const response = await axios.post(`${process.env.PYTHON_BACKEND_URL}interviewhelper/generatequiz`,{combinedContent})
           console.log(response.data)
           await quizModel.create({...response.data,roadMapId:id,userId:_req.user.id})
        res.status(200).json(response.data)
        }
    } catch (error) {
        console.log(error)
        return next(createHttpError(500, "Error generating the content"));
    }

};


const fetchQuiz = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _req = req as AuthRequest;
        const quiz = await quizModel.find({userId:_req.user.id})
        res.status(200).json(quiz)
    } catch (error) {
        return next(createHttpError(500, "Error fetching the roadmap"));
    }
};

const fetchQuizById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params
        const _req = req as AuthRequest;
        const quiz = await quizModel.findOne({_id:id})
        res.status(200).json(quiz)
    } catch (error) {
        return next(createHttpError(500, "Error fetching the roadmap"));
    }
};

export {generate_Roadmap, fetchRoadmap, fetchRoadmapById, deleteRoadmap, generate_content,fetchContent, generateQuiz, fetchQuiz, fetchQuizById}