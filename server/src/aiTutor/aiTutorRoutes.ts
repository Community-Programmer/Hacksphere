import express from "express";
import { deleteRoadmap, fetchContent, fetchQuiz, fetchQuizById, fetchRoadmap, fetchRoadmapById, generateQuiz, generate_Roadmap, generate_content } from "./aiTutorControllers";
import passport from "passport";


const aiTutorRouter = express.Router();

// Ai Tutor Routes
aiTutorRouter.post("/roadmap/:topic",passport.authenticate('jwt', { session: false }),generate_Roadmap);
aiTutorRouter.get("/roadmap",passport.authenticate('jwt', { session: false }),fetchRoadmap);
aiTutorRouter.get("/roadmap/:id",passport.authenticate('jwt', { session: false }),fetchRoadmapById);
aiTutorRouter.delete("/roadmap/:id",passport.authenticate('jwt', { session: false }),deleteRoadmap)
aiTutorRouter.post("/generatecontent",passport.authenticate('jwt', { session: false }),generate_content);
aiTutorRouter.get("/getcontent/:id",passport.authenticate('jwt', { session: false }),fetchContent);

aiTutorRouter.post("/generatequiz/:id",passport.authenticate('jwt', { session: false }),generateQuiz);
aiTutorRouter.get("/quiz",passport.authenticate('jwt', { session: false }),fetchQuiz);
aiTutorRouter.get("/quiz/:id",passport.authenticate('jwt', { session: false }),fetchQuizById);


export default aiTutorRouter;
