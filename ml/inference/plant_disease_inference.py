from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image
import torchvision.transforms.functional as TF

from ml.models.classes import IDX_TO_CLASS

BASE_DIR = Path(__file__).resolve().parents[1]

MODEL_PATH = BASE_DIR / "models" / "plant_disease_model_int8.onnx"

_session = None


def get_inference_session():
    global _session

    if _session is None:
        _session = ort.InferenceSession(
            str(MODEL_PATH),
            providers=["CPUExecutionProvider"]
        )

    return _session


def predict_image(image: Image.Image):
    session = get_inference_session()

    image = image.convert("RGB")
    image = image.resize((224, 224))

    input_data = (
        TF.to_tensor(image)
        .unsqueeze(0)
        .numpy()
        .astype(np.float32)
    )

    input_name = session.get_inputs()[0].name

    output = session.run(
        None,
        {
            input_name: input_data
        }
    )[0]

    output = output.astype(np.float32)

    exp_output = np.exp(
        output - np.max(output, axis=1, keepdims=True)
    )

    probabilities = exp_output / np.sum(
        exp_output,
        axis=1,
        keepdims=True
    )

    predicted_index = int(np.argmax(probabilities[0]))

    confidence = float(
        probabilities[0][predicted_index] * 100
    )

    class_name = IDX_TO_CLASS[predicted_index]

    parts = class_name.split("___", 1)

    if len(parts) == 2:
        crop = parts[0]
        disease = parts[1]
    else:
        crop = "Unknown"
        disease = class_name

    return {
        "class_index": predicted_index,
        "class_name": class_name,
        "crop": crop,
        "disease": disease,
        "confidence": round(confidence, 2),
    }
