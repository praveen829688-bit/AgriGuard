from pathlib import Path
import gc

import torch
from PIL import Image
import torchvision.transforms.functional as TF

from ml.models.cnn import CNN
from ml.models.classes import IDX_TO_CLASS


# Render Free has limited RAM.
# Keep PyTorch CPU threading intentionally small.
torch.set_num_threads(1)

try:
    torch.set_num_interop_threads(1)
except RuntimeError:
    pass


BASE_DIR = Path(__file__).resolve().parents[1]
MODEL_PATH = BASE_DIR / "models" / "plant_disease_model_1_latest.pt"

# AgriGuard Render deployment runs on CPU.
DEVICE = torch.device("cpu")


class PlantDiseaseInference:

    def __init__(self):
        self.device = DEVICE

        # Build the architecture.
        self.model = CNN(39)

        # Memory-map the checkpoint instead of copying the entire
        # checkpoint into normal RAM during deserialization.
        try:
            state_dict = torch.load(
                MODEL_PATH,
                map_location="cpu",
                weights_only=True,
                mmap=True
            )
        except TypeError:
            state_dict = torch.load(
                MODEL_PATH,
                map_location="cpu"
            )

        # assign=True makes the model parameters use the loaded
        # tensors directly instead of copying all weights again.
        try:
            self.model.load_state_dict(
                state_dict,
                assign=True
            )
        except TypeError:
            # Compatibility fallback.
            self.model.load_state_dict(state_dict)

        del state_dict
        gc.collect()

        self.model.eval()

    def predict(self, image: Image.Image):

        image = image.convert("RGB")
        image = image.resize((224, 224))

        input_data = TF.to_tensor(image)
        input_data = input_data.unsqueeze(0)

        with torch.inference_mode():
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

        del input_data
        del output
        del probabilities
        del confidence
        del predicted_index

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
