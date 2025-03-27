from fastapi import APIRouter, Cookie, File, UploadFile, HTTPException,Request
from .helper import get_pdf_text, get_text_chunks, get_vector_store, get_conversational_chain
from app.api.middlewares import authUser
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from typing import List
import os
from langchain_community.vectorstores import FAISS
from fastapi.responses import JSONResponse

router = APIRouter()

#For uploading files to vector Store
@router.post("/upload-pdfs")
async def upload_pdfs(request: Request,files: List[UploadFile] = File(...)):
    user = authUser.authenticateUser(request.cookies.get('refreshToken'))
    print(user)
    pdf_docs = [pdf.file for pdf in files]
    raw_text = get_pdf_text(pdf_docs)
    text_chunks = get_text_chunks(raw_text)
    get_vector_store(text_chunks,user['id'])
    return {"message": "PDFs processed and vector store created successfully."}


@router.get("/ask-question")
async def ask_question( request: Request, question: str):

    user = authUser.authenticateUser(request.cookies.get('refreshToken'))
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    
    user_directory = os.path.join("faissDatabase", user['id'])
    if not os.path.exists(user_directory):
        raise HTTPException(status_code=404, detail="User ID not found")

    subdirectories = sorted(
        [d for d in os.listdir(user_directory) if os.path.isdir(os.path.join(user_directory, d))],
        reverse=True
    )
    if not subdirectories:
        raise HTTPException(status_code=404, detail="No vector stores found for the user")

    latest_subdirectory = subdirectories[0]
    index_path = os.path.join(user_directory, latest_subdirectory, "faiss_index")

    vector_store = FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)
    
    docs = vector_store.similarity_search(question)
    
    chain = get_conversational_chain()
    response = chain.invoke({"input_documents": docs, "question": question}, return_only_outputs=True)
    
    return JSONResponse(content={"reply": response["output_text"]})
