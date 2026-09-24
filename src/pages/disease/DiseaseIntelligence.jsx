import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  Droplets,
  Sprout,
  AlertTriangle,
  Leaf,
  Activity
} from "lucide-react";
import { getRecommendation } from "../../data/recommendations";

export default function DiseaseIntelligence() {
  const location = useLocation();
  const navigate = useNavigate();

  const prediction = location.state || {};

  const crop = prediction.crop || "Tomato";
  const disease = prediction.disease || "Late_blight";
  const confidence = Number(prediction.confidence || 0);
  const className =
    prediction.className || `${crop}___${disease}`;

  const isHealthy =
    disease.toLowerCase().includes("healthy");

  const recommendation = getRecommendation(disease);

  const confidenceBand =
    confidence >= 90
      ? "High"
      : confidence >= 75
        ? "Moderate"
        : "Low";

  const displayDisease = disease
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="page-container disease-page">

      <div className="page-header">
        <div>
          <button
            className="secondary-btn"
            onClick={() => navigate("/detection")}
          >
            <ArrowLeft size={18} />
            Back to Detection
          </button>

          <h1>
            <Leaf size={30} />
            Disease Intelligence
          </h1>

          <p>
            AI-powered analysis and crop management guidance.
          </p>
        </div>
      </div>

      <div className="disease-hero-card">

        <div className="disease-hero-main">
          <div className="disease-icon">
            {isHealthy ? (
              <ShieldCheck size={34} />
            ) : (
              <AlertTriangle size={34} />
            )}
          </div>

          <div>
            <span className="eyebrow">
              {crop}
            </span>

            <h2>
              {isHealthy ? "Healthy Plant" : displayDisease}
            </h2>

            <p>{className}</p>
          </div>
        </div>

        <div className="confidence-box">
          <span>AI Confidence</span>
          <strong>{confidence.toFixed(2)}%</strong>
          <small>{confidenceBand} confidence</small>
        </div>
      </div>

      <div className="disease-grid">

        <section className="disease-card">
          <div className="card-title">
            <Activity size={21} />
            Overview
          </div>

          <p>
            The AgriGuard CNN classified the uploaded plant image as
            <strong> {displayDisease}</strong> with an AI confidence
            of <strong>{confidence.toFixed(2)}%</strong>.
          </p>

          <div className="info-row">
            <span>Crop</span>
            <strong>{crop}</strong>
          </div>

          <div className="info-row">
            <span>Model</span>
            <strong>Plant Disease CNN</strong>
          </div>

          <div className="info-row">
            <span>Class</span>
            <strong>{className}</strong>
          </div>

          {prediction.classIndex !== undefined &&
            prediction.classIndex !== null && (
              <div className="info-row">
                <span>Class Index</span>
                <strong>{prediction.classIndex}</strong>
              </div>
            )}
        </section>

        <section className="disease-card">
          <div className="card-title">
            <AlertTriangle size={21} />
            AI Assessment
          </div>

          <div className="assessment-box">
            <span>Detection confidence</span>
            <strong>{confidence.toFixed(2)}%</strong>
          </div>

          <div className="assessment-box">
            <span>Confidence band</span>
            <strong>{confidenceBand}</strong>
          </div>

          <p className="muted">
            Confidence represents the model's prediction certainty.
            It should not be interpreted as laboratory confirmation
            or as a direct measurement of disease severity.
          </p>
        </section>

      </div>

      {!isHealthy && recommendation && (
        <>
          <div className="section-heading">
            <h2>
              <ShieldCheck size={25} />
              Smart Treatment Guidance
            </h2>

            <p>{recommendation.title}</p>
          </div>

          <div className="recommendation-grid">

            <section className="recommendation-card">
              <div className="recommendation-title">
                <AlertTriangle size={21} />
                Immediate Actions
              </div>

              <ul>
                {recommendation.immediate.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="recommendation-card">
              <div className="recommendation-title">
                <Droplets size={21} />
                Irrigation Guidance
              </div>

              <ul>
                {recommendation.irrigation.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="recommendation-card">
              <div className="recommendation-title">
                <Sprout size={21} />
                Fertilizer Guidance
              </div>

              <ul>
                {recommendation.fertilizer.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="recommendation-card">
              <div className="recommendation-title">
                <Leaf size={21} />
                Prevention
              </div>

              <ul>
                {recommendation.prevention.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

          </div>
        </>
      )}

      {isHealthy && (
        <section className="healthy-card">
          <ShieldCheck size={32} />

          <div>
            <h2>Plant appears healthy</h2>
            <p>
              Continue regular crop monitoring and maintain
              appropriate irrigation, nutrition and sanitation.
            </p>
          </div>
        </section>
      )}

    </div>
  );
}
