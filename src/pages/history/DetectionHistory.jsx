import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Leaf,
  Search,
  ShieldAlert,
  Trash2,
} from "lucide-react";

import {
  getDetectionHistory,
  clearDetectionHistory,
} from "../../services/detectionHistory";

export default function DetectionHistory() {
  const [history, setHistory] = useState(getDetectionHistory());
  const [search, setSearch] = useState("");

  const filteredHistory = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return history;

    return history.filter((item) =>
      `${item.crop} ${item.disease} ${item.severity}`
        .toLowerCase()
        .includes(query)
    );
  }, [history, search]);

  const totalScans = history.length;

  const healthyCount = history.filter((item) =>
    item.disease.toLowerCase().includes("healthy")
  ).length;

  const diseasedCount = totalScans - healthyCount;

  const handleClear = () => {
    if (!history.length) return;

    if (!window.confirm("Clear all detection history?")) return;

    clearDetectionHistory();
    setHistory([]);
  };

  const formatDate = (timestamp) =>
    new Date(timestamp).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="history-page">
      <div className="history-container">

        <Link to="/dashboard" className="history-back">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="history-header">
          <div>
            <div className="history-eyebrow">
              <ClipboardList size={17} />
              AGRIGUARD AI
            </div>

            <h1>Detection History</h1>

            <p>
              Review previous plant health analyses performed by
              AgriGuard's AI detection system.
            </p>
          </div>

          <Link to="/detection" className="history-new-scan">
            <Activity size={18} />
            New Analysis
          </Link>
        </div>

        <div className="history-stats">

          <div className="history-stat-card">
            <div className="history-stat-icon">
              <ClipboardList size={21} />
            </div>

            <div>
              <span>Total Scans</span>
              <strong>{totalScans}</strong>
            </div>
          </div>

          <div className="history-stat-card">
            <div className="history-stat-icon healthy">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>Healthy</span>
              <strong>{healthyCount}</strong>
            </div>
          </div>

          <div className="history-stat-card">
            <div className="history-stat-icon disease">
              <ShieldAlert size={21} />
            </div>

            <div>
              <span>Diseased</span>
              <strong>{diseasedCount}</strong>
            </div>
          </div>

        </div>

        <div className="history-toolbar">

          <div className="history-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search crop, disease or severity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {history.length > 0 && (
            <button
              className="history-clear"
              onClick={handleClear}
            >
              <Trash2 size={17} />
              Clear History
            </button>
          )}

        </div>

        {filteredHistory.length === 0 ? (

          <div className="history-empty">

            <div className="history-empty-icon">
              <Leaf size={32} />
            </div>

            <h2>
              {history.length === 0
                ? "No analyses yet"
                : "No matching analyses"}
            </h2>

            <p>
              {history.length === 0
                ? "Analyze a plant image to start building your detection history."
                : "Try a different crop or disease name."}
            </p>

            {history.length === 0 && (
              <Link
                to="/detection"
                className="history-new-scan"
              >
                <Activity size={18} />
                Analyze a Plant
              </Link>
            )}

          </div>

        ) : (

          <div className="history-list">

            {filteredHistory.map((item) => {

              const isHealthy = item.disease
                .toLowerCase()
                .includes("healthy");

              return (
                <div
                  className="history-card"
                  key={item.id}
                >

                  <div className="history-card-main">

                    <div className="history-crop-icon">
                      <Leaf size={22} />
                    </div>

                    <div className="history-info">

                      <div className="history-crop">
                        {item.crop}
                      </div>

                      <div className="history-disease">
                        {item.disease.replaceAll("_", " ")}
                      </div>

                      <div className="history-date">
                        <Calendar size={14} />
                        {formatDate(item.timestamp)}
                      </div>

                    </div>

                  </div>

                  <div className="history-card-right">

                    <div className="history-confidence">
                      <span>AI Confidence</span>
                      <strong>
                        {Number(item.confidence).toFixed(2)}%
                      </strong>
                    </div>

                    <div
                      className={`history-severity ${
                        isHealthy
                          ? "healthy"
                          : String(item.severity).toLowerCase()
                      }`}
                    >
                      {isHealthy
                        ? "Healthy"
                        : item.severity}
                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>
    </div>
  );
}
