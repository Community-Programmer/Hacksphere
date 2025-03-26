import express, { NextFunction, Request, Response } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import globalErrorHandler from './middleware/globalErrorHandler';
import { Server } from 'socket.io';


config();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);

app.use(express.json());
app.use(cookieParser());


app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Next Hire Express Backend',
  });
});

app.use(globalErrorHandler);

export { server, io };