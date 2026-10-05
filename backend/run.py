import os
from dotenv import load_dotenv

# Ensure backend/.env is loaded into process environment
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"), override=True)

import uvicorn
from app.config import HOST, PORT

if __name__ == "__main__":
    is_dev = os.getenv("ENVIRONMENT", "development") == "development" and not os.getenv("RENDER")
    print(f"[*] Starting TransformAI Compute Engine on http://{HOST}:{PORT}")
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=is_dev)

