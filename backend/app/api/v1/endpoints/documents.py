from fastapi import APIRouter, UploadFile, File, HTTPException
from starlette.concurrency import run_in_threadpool
from typing import List
import uuid
import io
import logging
import traceback

logger = logging.getLogger("documents_endpoint")
router = APIRouter()

# === IN-MEMORY RESUME STORE ===
# Stores doc_id -> extracted resume text (no DB dependency needed for the prediction pipeline)
_resume_store: dict[str, str] = {}

def get_resume_text(doc_id: str) -> str | None:
    return _resume_store.get(doc_id)

def _extract_pdf_text(content: bytes) -> str:
    """Extract text from PDF bytes using pdfplumber synchronously. MUST run in threadpool."""
    import pdfplumber
    text_parts = []
    try:
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            for page in pdf.pages:
                t = page.extract_text()
                if t:
                    text_parts.append(t.strip())
    except Exception as e:
        logger.error(f"pdfplumber extraction failed: {e}\n{traceback.format_exc()}")
        raise ValueError(f"Failed to parse PDF: {str(e)}")
    return "\n".join(text_parts)

SUPPORTED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/markdown",
    "application/json",
]

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB to prevent OOM on Render free tier

@router.post("/upload")
async def upload_document(files: List[UploadFile] = File(...)):
    """
    Upload one or more documents. Extracts text asynchronously using a threadpool 
    to prevent event loop blocking, avoiding silent 503 timeouts.
    """
    uploaded_docs = []

    for file in files:
        if not file.filename:
            continue

        try:
            content = await file.read()
            content_type = file.content_type or ""
            file_size = len(content)
            
            logger.info(f"Processing file: '{file.filename}', size: {file_size} bytes, type: '{content_type}'")

            if file_size > MAX_FILE_SIZE:
                logger.warning(f"File '{file.filename}' rejected: Size {file_size} exceeds {MAX_FILE_SIZE} limit")
                raise HTTPException(status_code=413, detail=f"File too large. Max 5MB allowed to prevent memory exhaustion.")

            extracted_text = ""
            
            # Infer type from extension if content_type is missing/octet-stream
            if "pdf" in file.filename.lower() or "pdf" in content_type:
                logger.info(f"Offloading PDF extraction for '{file.filename}' to threadpool...")
                extracted_text = await run_in_threadpool(_extract_pdf_text, content)
            elif "plain" in content_type or file.filename.endswith(".txt"):
                try:
                    extracted_text = content.decode("utf-8", errors="ignore")
                except Exception:
                    extracted_text = ""
            else:
                # Attempt PDF extraction as fallback
                logger.info(f"Attempting fallback PDF extraction for '{file.filename}'...")
                try:
                    extracted_text = await run_in_threadpool(_extract_pdf_text, content)
                except ValueError:
                    extracted_text = content.decode("utf-8", errors="ignore")

            if not extracted_text or not extracted_text.strip():
                raise HTTPException(
                    status_code=400,
                    detail=f"Could not extract text from '{file.filename}'. File may be scanned, encrypted, or empty."
                )

            doc_id = str(uuid.uuid4())
            _resume_store[doc_id] = extracted_text
            logger.info(f"[UPLOAD SUCCESS] '{file.filename}' → doc_id={doc_id}, chars={len(extracted_text)}")

            uploaded_docs.append({
                "doc_id": doc_id,
                "filename": file.filename,
                "status": "ready",
                "chars_extracted": len(extracted_text)
            })

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unhandled error processing '{file.filename}': {e}\n{traceback.format_exc()}")
            raise HTTPException(status_code=500, detail=f"Internal error processing file '{file.filename}': {str(e)}")

    if not uploaded_docs:
        raise HTTPException(status_code=400, detail="No valid files provided or all files failed to process.")

    return {
        "message": "Files received successfully.",
        "documents": uploaded_docs
    }
