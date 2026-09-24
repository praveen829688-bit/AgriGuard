from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

from ml.inference.plant_disease_inference import predict_image


app = FastAPI(
    title="AgriGuard AI API",
    description="AI-powered plant health and disease detection API",
    version="2.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "success": True,
        "name": "AgriGuard AI",
        "message": "AgriGuard AI backend is running"
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "AgriGuard AI API",
        "model": "Plant Disease CNN",
        "classes": 39
    }


@app.post("/api/detect")
async def detect_plant(file: UploadFile = File(...)):

    if not file.content_type or not file.content_type.startswith("image/"):
        return {
            "success": False,
            "error": "Please upload a valid image."
        }

    contents = await file.read()

    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        return {
            "success": False,
            "error": "Unable to read the uploaded image."
        }

    try:
        prediction = predict_image(image)

        return {
            "success": True,
            "filename": file.filename,

            "image_size": {
                "width": image.width,
                "height": image.height
            },

            "prediction": prediction
        }

    except Exception as error:

        return {
            "success": False,
            "error": str(error)
        }
