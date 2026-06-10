from fastapi import APIRouter, UploadFile, File, HTTPException
from starlette.concurrency import run_in_threadpool
from typing import List
import uuid
import io
import logging
import traceback
import time
import os

logger = logging.getLogger("documents_endpoint")
router = APIRouter()

# === IN-MEMORY RESUME STORE ===
_resume_store: dict[str, str] = {}

def get_resume_text(doc_id: str) -> str | None:
    return _resume_store.get(doc_id)

def get_memory_usage() -> str:
    try:
        import psutil
        process = psutil.Process(os.getpid())
        return f"{process.memory_info().rss / 1024 / 1024:.2f} MB"
    except ImportError:
        return "Unknown"

def _extract_pdf_text(content: bytes) -> str:
    """Extract text from PDF bytes synchronously. MUST run in threadpool."""
    logger.info("[PDF_PARSE_START] Initializing pdfplumber extraction.")
    logger.info(f"[MEMORY] Before PDF Parse: {get_memory_usage()}")
    import pdfplumber
    text_parts = []
    try:
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            total_pages = len(pdf.pages)
            logger.info(f"[PDF_PARSE] Found {total_pages} pages.")
            for i, page in enumerate(pdf.pages):
                t = page.extract_text()
                if t:
                    text_parts.append(t.strip())
                if i % 5 == 0 and i > 0:
                    logger.info(f"[PDF_PARSE] Processed page {i}/{total_pages}. Memory: {get_memory_usage()}")
    except Exception as e:
        logger.error(f"[PDF_PARSE_FAILURE] pdfplumber failed: {e}\n{traceback.format_exc()}")
        raise ValueError(f"Failed to parse PDF: {str(e)}")
    
    final_text = "\n".join(text_parts)
    logger.info(f"[PDF_PARSE_END] Completed. Extracted {len(final_text)} chars. Memory: {get_memory_usage()}")
    return final_text

SUPPORTED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/markdown",
    "application/json",
]

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

@router.post("/upload")
async def upload_document(files: List[UploadFile] = File(...)):
    """
    Robust, memory-safe, thread-pooled upload pipeline with granular logging.
    """
    logger.info(f"[START_UPLOAD] Received upload request with {len(files)} files.")
    start_time = time.time()
    uploaded_docs = []

    for file in files:
        if not file.filename:
            continue

        logger.info(f"[FILE_RECEIVED] Starting processing for: '{file.filename}'")
        try:
            content = await file.read()
            content_type = file.content_type or ""
            file_size = len(content)
            
            logger.info(f"[FILE_SIZE] '{file.filename}' is {file_size} bytes. Content-Type: '{content_type}'")

            if file_size > MAX_FILE_SIZE:
                logger.warning(f"[UPLOAD_FAILURE] File '{file.filename}' rejected (size {file_size} > 5MB)")
                raise HTTPException(status_code=413, detail="File too large. Max 5MB allowed.")

            extracted_text = ""
            
            if "pdf" in file.filename.lower() or "pdf" in content_type:
                extracted_text = await run_in_threadpool(_extract_pdf_text, content)
            elif "plain" in content_type or file.filename.endswith(".txt"):
                try:
                    extracted_text = content.decode("utf-8", errors="ignore")
                except Exception:
                    extracted_text = ""
            else:
                logger.info(f"[FALLBACK] Attempting fallback PDF extraction for '{file.filename}'...")
                try:
                    extracted_text = await run_in_threadpool(_extract_pdf_text, content)
                except ValueError:
                    extracted_text = content.decode("utf-8", errors="ignore")

            if not extracted_text or not extracted_text.strip():
                logger.warning(f"[UPLOAD_FAILURE] No text extracted from '{file.filename}'.")
                raise HTTPException(
                    status_code=400,
                    detail=f"Could not extract text from '{file.filename}'. File may be scanned, encrypted, or empty."
                )

            doc_id = str(uuid.uuid4())
            _resume_store[doc_id] = extracted_text
            logger.info(f"[UPLOAD_SUCCESS] '{file.filename}' stored successfully. doc_id={doc_id}, chars={len(extracted_text)}")

            uploaded_docs.append({
                "doc_id": doc_id,
                "filename": file.filename,
                "status": "ready",
                "chars_extracted": len(extracted_text)
            })

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"[UPLOAD_FAILURE] Unhandled error processing '{file.filename}': {e}\n{traceback.format_exc()}")
            raise HTTPException(status_code=500, detail=f"Internal error processing file '{file.filename}': {str(e)}")

    if not uploaded_docs:
        raise HTTPException(status_code=400, detail="No valid files provided or all files failed to process.")

    duration = time.time() - start_time
    logger.info(f"[UPLOAD_COMPLETED] Total time: {duration:.2f}s. Documents processed: {len(uploaded_docs)}")

    return {
        "message": "Files received successfully.",
        "documents": uploaded_docs
    }
