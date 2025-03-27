from fastapi import FastAPI
import uvicorn
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.Interview_Helper import interviewHelper
from app.api.routes.ResumeEvaluator import ResumeScore
from app.api.routes.CodeEditor import CodeEditor

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:5050",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interviewHelper.router, prefix="/api/v1/interviewhelper",tags=["interviewhelper"])
app.include_router(ResumeScore.router, prefix="/api/v1/resume", tags=["resume"])
app.include_router(CodeEditor.router, prefix="/api/v1/code", tags=["code"]) 

@app.get("/")
def root():
    return {"message":"Welcome to Placement Pilot Python Backend","status":"Ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)