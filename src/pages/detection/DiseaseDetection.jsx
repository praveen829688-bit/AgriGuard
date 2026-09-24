import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Leaf,
  ScanLine,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";

import { analyzePlantImage } from "../../services/plantApi";
import { saveDetection } from "../../services/detectionHistory";

function formatDiseaseName(value) {
  if (!value) return "Unknown";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function DiseaseDetection() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFile(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setPrediction(null);
    setError("");
  }

  function handleFileChange(event) {
    handleFile(event.target.files?.[0]);
  }

  function removeImage() {
    setSelectedFile(null);
    setPreview("");
    setPrediction(null);
    setError("");
  }

  async function handleAnalyze() {
    if (!selectedFile) {
      setError("Please upload a plant image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await analyzePlantImage(selectedFile);

      const result = data.prediction;

      setPrediction(result);

      saveDetection({
        crop: result.crop,
        disease: result.disease,
        confidence: result.confidence,
        severity:
          result.disease
            ?.toLowerCase()
            .includes("healthy")
            ? "Healthy"
            : result.confidence >= 90
              ? "High"
              : result.confidence >= 75
                ? "Moderate"
                : "Low",
        className: result.class_name,
        classIndex: result.class_index,
      });
    } catch (err) {
      setError(
        err?.message ||
          "Unable to analyze the plant image."
      );
    } finally {
      setLoading(false);
    }
  }

  function openDiseaseIntelligence() {
    if (!prediction) return;

    const severity =
      prediction.disease
        ?.toLowerCase()
        .includes("healthy")
        ? "Healthy"
        : prediction.confidence >= 90
          ? "High"
          : prediction.confidence >= 75
            ? "Moderate"
            : "Low";

    navigate("/disease", {
      state: {
        crop: prediction.crop,
        disease: prediction.disease,
        confidence: prediction.confidence,
        severity,
        className: prediction.class_name,
        classIndex: prediction.class_index,
      },
    });
  }

  return (
    <div className="ag-detection-page">

      <header className="ag-detection-header">

        <div>
          <Link
            to="/dashboard"
            className="ag-detection-back"
          >
            <ArrowRight
              size={15}
              style={{ transform: "rotate(180deg)" }}
            />
            Back to Dashboard
          </Link>

          <div className="ag-detection-eyebrow">
            <Leaf size={16} />
            AGRIGUARD AI
          </div>

          <h1>Plant Disease Detection</h1>

          <p>
            Upload a plant leaf image and let the AgriGuard
            AI engine analyze it using a trained CNN model.
          </p>
        </div>

        <Link
          to="/history"
          className="ag-detection-history"
        >
          <Clock3 size={16} />
          Detection History
        </Link>

      </header>


      <main className="ag-detection-container">

        <section className="ag-upload-card">

          <div className="ag-section-label">
            <Upload size={16} />
            PLANT IMAGE
          </div>

          {!preview ? (
            <label
              className="ag-upload-zone"
              htmlFor="plant-image"
            >
              <input
                id="plant-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                hidden
              />

              <div className="ag-upload-icon">
                <Upload size={27} />
              </div>

              <h2>Upload a plant image</h2>

              <p>
                Choose a clear image of a plant leaf
                for AI analysis.
              </p>

              <span className="ag-upload-button">
                Choose Image
              </span>

              <small>
                JPG, JPEG, PNG or WEBP
              </small>
            </label>
          ) : (
            <div className="ag-preview-area">

              <div className="ag-preview-image-wrap">

                <img
                  src={preview}
                  alt="Selected plant"
                  className="ag-preview-image"
                />

                <button
                  type="button"
                  className="ag-remove-image"
                  onClick={removeImage}
                  aria-label="Remove image"
                >
                  <X size={17} />
                </button>

              </div>

              <div className="ag-file-info">
                <div>
                  <strong>
                    {selectedFile?.name}
                  </strong>

                  <span>
                    {(selectedFile?.size / 1024 / 1024).toFixed(
                      2
                    )}{" "}
                    MB
                  </span>
                </div>

                <label
                  htmlFor="replace-image"
                  className="ag-replace-button"
                >
                  Replace
                </label>

                <input
                  id="replace-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  hidden
                />
              </div>

            </div>
          )}


          {error && (
            <div className="ag-detection-error">
              {error}
            </div>
          )}


          <button
            type="button"
            className="ag-analyze-button"
            onClick={handleAnalyze}
            disabled={!selectedFile || loading}
          >
            <ScanLine size={18} />

            {loading
              ? "Analyzing Plant..."
              : "Analyze Plant"}

            {!loading && <ArrowRight size={17} />}
          </button>

        </section>


        <section className="ag-result-card">

          <div className="ag-section-label">
            <ShieldCheck size={16} />
            AI ANALYSIS RESULT
          </div>


          {!prediction && !loading && (
            <div className="ag-result-empty">

              <div className="ag-result-empty-icon">
                <Leaf size={29} />
              </div>

              <h2>Ready for analysis</h2>

              <p>
                Upload a plant image and start the AI
                analysis to see the predicted crop,
                disease and confidence.
              </p>

            </div>
          )}


          {loading && (
            <div className="ag-result-empty">

              <div className="ag-analysis-loader">
                <ScanLine size={29} />
              </div>

              <h2>Analyzing image...</h2>

              <p>
                AgriGuard is processing the image through
                the Plant Disease CNN.
              </p>

            </div>
          )}


          {prediction && !loading && (
            <div className="ag-prediction">

              <div className="ag-prediction-header">

                <div className="ag-prediction-icon">
                  <CheckCircle2 size={25} />
                </div>

                <div>
                  <span>DETECTED CONDITION</span>

                  <h2>
                    {prediction.crop} ·{" "}
                    {formatDiseaseName(
                      prediction.disease
                    )}
                  </h2>

                  <p>
                    Class:{" "}
                    {prediction.class_name}
                  </p>
                </div>

              </div>


              <div className="ag-prediction-stats">

                <div>
                  <span>AI Confidence</span>
                  <strong>
                    {Number(
                      prediction.confidence
                    ).toFixed(2)}
                    %
                  </strong>
                </div>

                <div>
                  <span>Class Index</span>
                  <strong>
                    {prediction.class_index}
                  </strong>
                </div>

                <div>
                  <span>Model</span>
                  <strong>
                    Plant Disease CNN
                  </strong>
                </div>

              </div>


              <div className="ag-result-notice">
                <ShieldCheck size={17} />

                <span>
                  This result is generated by the
                  AgriGuard AI classification model.
                  Verify visible symptoms and field
                  conditions before taking agricultural
                  action.
                </span>
              </div>


              <button
                type="button"
                className="ag-intelligence-button"
                onClick={openDiseaseIntelligence}
              >
                <Leaf size={17} />
                View Disease Intelligence
                <ArrowRight size={17} />
              </button>

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default DiseaseDetection;
