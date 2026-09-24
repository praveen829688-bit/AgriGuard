from pathlib import Path

import numpy as np
import torch
from PIL import Image
import torchvision.transforms.functional as TF

from ml.models.cnn import CNN
from ml.models.classes import IDX_TO_CLASS


BASE_DIR = Path(__file__).resolve().parents[1]
MODEL_PATH = BASE_DIR / "models" / "plant_disease_model_1_latest.pt"

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


class PlantDiseaseInference:

    def __init__(self):
        self.device = DEVICE

        self.model = CNN(39)

        state_dict = torch.load(
            MODEL_PATH,
            map_location=self.device
        )

        self.model.load_state_dict(state_dict)
        self.model.to(self.device)
        self.model.eval()

    def predict(self, image: Image.Image):

        image = image.convert("RGB")
        image = image.resize((224, 224))

        input_data = TF.to_tensor(image)

        input_data = input_data.unsqueeze(0)
        input_data = input_data.to(self.device)

        with torch.no_grad():
            output = self.model(input_data)

            probabilities = torch.softmax(output, dim=1)

            confidence, predicted_index = torch.max(
                probabilities,
                dim=1
            )

        index = int(predicted_index.item())

        confidence_value = float(confidence.item() * 100)

        class_name = IDX_TO_CLASS[index]

        parts = class_name.split("___", 1)

        if len(parts) == 2:
            crop = parts[0]
            disease = parts[1]
        else:
            crop = "Unknown"
            disease = class_name

        return {
            "class_index": index,
            "class_name": class_name,
            "crop": crop,
            "disease": disease,
            "confidence": round(confidence_value, 2),
        }


_engine = None


def get_inference_engine():

    global _engine

    if _engine is None:
        _engine = PlantDiseaseInference()

    return _engine


def predict_image(image: Image.Image):

    engine = get_inference_engine()

    return engine.predict(image)
