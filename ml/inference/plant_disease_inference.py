from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image

from ml.models.classes import IDX_TO_CLASS

BASE_DIR = Path(__file__).resolve().parents[1]

MODEL_PATH = BASE_DIR / "models" / "plant_disease_model_int8.onnx"

_session = None


def get_inference_session():
    global _session

    if _session is None:
        options = ort.SessionOptions()

        # Keep Render Free memory and CPU usage low.
        options.intra_op_num_threads = 1
        options.inter_op_num_threads = 1
        options.execution_mode = ort.ExecutionMode.ORT_SEQUENTIAL
        options.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_BASIC
        options.enable_mem_pattern = False
        options.enable_cpu_mem_arena = True

        _session = ort.InferenceSession(
            str(MODEL_PATH),
            sess_options=options,
            providers=["CPUExecutionProvider"]
        )

    return _session


def prepare_image(image: Image.Image):
    image = image.convert("RGB")
    image = image.resize((224, 224))

    array = np.asarray(image, dtype=np.float32) / 255.0

    # HWC -> CHW
    array = np.transpose(array, (2, 0, 1))

    # Add batch dimension
    array = np.expand_dims(array, axis=0)

    return np.ascontiguousarray(array, dtype=np.float32)


def predict_image(image: Image.Image):
    session = get_inference_session()

    input_data = prepare_image(image)

    input_name = session.get_inputs()[0].name

    output = session.run(
        None,
        {
            input_name: input_data
        }
    )[0]

    output = np.asarray(output, dtype=np.float32)

    # Stable softmax.
    shifted = output - np.max(
        output,
        axis=1,
        keepdims=True
    )

    exp_output = np.exp(shifted)

    probabilities = exp_output / np.sum(
        exp_output,
        axis=1,
        keepdims=True
    )

    predicted_index = int(
        np.argmax(probabilities[0])
    )

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
