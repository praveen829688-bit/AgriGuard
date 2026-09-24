import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Leaf,
  ScanLine,
  ShieldCheck,
  Sprout,
  TrendingUp,
  XCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getDetectionHistory } from "../../services/detectionHistory";

function Dashboard() {
  const history = getDetectionHistory();

  const stats = useMemo(() => {
    const total = history.length;

    const healthy = history.filter(
      (item) =>
        item.disease?.toLowerCase().includes("healthy") ||
        item.severity?.toLowerCase() === "healthy"
    ).length;

    const diseased = total - healthy;

    const averageConfidence =
      total > 0
        ? history.reduce(
            (sum, item) => sum + Number(item.confidence || 0),
            0
          ) / total
        : 0;

    const diseaseCounts = {};

    history.forEach((item) => {
      const disease = item.disease || "Unknown";
      if (!disease.toLowerCase().includes("healthy")) {
        diseaseCounts[disease] = (diseaseCounts[disease] || 0) + 1;
      }
    });

    const mostFrequentDisease =
      Object.entries(diseaseCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "No disease data";

    const cropCounts = {};

    history.forEach((item) => {
      const crop = item.crop || "Unknown";
      cropCounts[crop] = (cropCounts[crop] || 0) + 1;
    });

    const cropData = Object.entries(cropCounts).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    const diseaseData = Object.entries(diseaseCounts).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    return {
      total,
      healthy,
      diseased,
      averageConfidence,
      mostFrequentDisease,
      cropData,
      diseaseData,
    };
  }, [history]);

  return (
    <div className="ag-dashboard-page">

      <header className="ag-dashboard-header">
        <div>
          <div className="ag-dashboard-eyebrow">
            <Leaf size={16} />
            AGRIGUARD AI
          </div>

          <h1>Plant Health Dashboard</h1>

          <p>
            Monitor AI-powered plant disease detections,
            confidence levels, and crop health trends.
          </p>
        </div>

        <div className="ag-dashboard-actions">
          <Link
            to="/history"
            className="ag-dashboard-secondary-btn"
          >
            <Clock3 size={17} />
            History
          </Link>

          <Link
            to="/detection"
            className="ag-dashboard-primary-btn"
          >
            <ScanLine size={17} />
            Analyze Plant
            <ArrowRight size={17} />
          </Link>
        </div>
      </header>


      <section className="ag-dashboard-stats">

        <div className="ag-stat-card">
          <div className="ag-stat-icon">
            <ScanLine size={21} />
          </div>

          <div>
            <span>Total Scans</span>
            <strong>{stats.total}</strong>
            <small>AI analyses performed</small>
          </div>
        </div>


        <div className="ag-stat-card">
          <div className="ag-stat-icon">
            <ShieldCheck size={21} />
          </div>

          <div>
            <span>Avg. Confidence</span>
            <strong>
              {stats.averageConfidence.toFixed(2)}%
            </strong>
            <small>Model prediction confidence</small>
          </div>
        </div>


        <div className="ag-stat-card">
          <div className="ag-stat-icon">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Healthy</span>
            <strong>{stats.healthy}</strong>
            <small>Healthy detections</small>
          </div>
        </div>


        <div className="ag-stat-card">
          <div className="ag-stat-icon">
            <Activity size={21} />
          </div>

          <div>
            <span>Diseased</span>
            <strong>{stats.diseased}</strong>
            <small>Potential disease detections</small>
          </div>
        </div>

      </section>


      <section className="ag-dashboard-grid">

        <div className="ag-dashboard-card ag-chart-card">

          <div className="ag-card-heading">
            <div>
              <span className="ag-card-kicker">
                ANALYTICS
              </span>

              <h2>Crop Distribution</h2>

              <p>
                Crops represented in your detection history.
              </p>
            </div>

            <Sprout size={22} />
          </div>

          {stats.cropData.length > 0 ? (
            <div className="ag-chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.cropData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="ag-empty-chart">
              <Sprout size={30} />
              <strong>No crop data yet</strong>
              <span>
                Run an AI analysis to populate this chart.
              </span>
            </div>
          )}

        </div>


        <div className="ag-dashboard-card ag-chart-card">

          <div className="ag-card-heading">
            <div>
              <span className="ag-card-kicker">
                HEALTH OVERVIEW
              </span>

              <h2>Detection Status</h2>

              <p>
                Healthy versus diseased analyses.
              </p>
            </div>

            <BarChart3 size={22} />
          </div>

          {stats.total > 0 ? (
            <div className="ag-pie-section">

              <div className="ag-pie-chart">
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Healthy",
                          value: stats.healthy,
                        },
                        {
                          name: "Diseased",
                          value: stats.diseased,
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={62}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      <Cell />
                      <Cell />
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="ag-pie-center">
                  <strong>{stats.total}</strong>
                  <span>Scans</span>
                </div>
              </div>

              <div className="ag-status-list">

                <div>
                  <span>
                    <i className="ag-status-dot healthy-dot" />
                    Healthy
                  </span>

                  <strong>{stats.healthy}</strong>
                </div>

                <div>
                  <span>
                    <i className="ag-status-dot disease-dot" />
                    Diseased
                  </span>

                  <strong>{stats.diseased}</strong>
                </div>

              </div>

            </div>
          ) : (
            <div className="ag-empty-chart">
              <BarChart3 size={30} />
              <strong>No analytics yet</strong>
              <span>
                Complete your first plant analysis.
              </span>
            </div>
          )}

        </div>

      </section>


      <section className="ag-dashboard-grid">

        <div className="ag-dashboard-card">

          <div className="ag-card-heading">
            <div>
              <span className="ag-card-kicker">
                DISEASE INTELLIGENCE
              </span>

              <h2>Most Frequent Disease</h2>

              <p>
                Based on your saved AI detection history.
              </p>
            </div>

            <TrendingUp size={22} />
          </div>

          <div className="ag-highlight-box">

            <div className="ag-highlight-icon">
              <Activity size={24} />
            </div>

            <div>
              <span>Detected most often</span>
              <strong>
                {stats.mostFrequentDisease}
              </strong>

              {stats.diseaseData.length > 0 && (
                <small>
                  {stats.diseaseData[0].value} detection
                  {stats.diseaseData[0].value !== 1
                    ? "s"
                    : ""}
                </small>
              )}
            </div>

          </div>

        </div>


        <div className="ag-dashboard-card">

          <div className="ag-card-heading">
            <div>
              <span className="ag-card-kicker">
                SYSTEM STATUS
              </span>

              <h2>AI Detection Engine</h2>

              <p>
                Current AgriGuard model information.
              </p>
            </div>

            <ShieldCheck size={22} />
          </div>

          <div className="ag-system-status">

            <div className="ag-online-indicator">
              <span />
              AI Engine Active
            </div>

            <div className="ag-system-row">
              <span>Model</span>
              <strong>Plant Disease CNN</strong>
            </div>

            <div className="ag-system-row">
              <span>Supported Classes</span>
              <strong>39</strong>
            </div>

            <div className="ag-system-row">
              <span>Inference</span>
              <strong>PyTorch</strong>
            </div>

          </div>

        </div>

      </section>


      <section className="ag-dashboard-card ag-recent-card">

        <div className="ag-card-heading">

          <div>
            <span className="ag-card-kicker">
              RECENT ACTIVITY
            </span>

            <h2>Recent Analyses</h2>

            <p>
              Your latest plant health detection results.
            </p>
          </div>

          <Link
            to="/history"
            className="ag-view-all"
          >
            View all
            <ArrowRight size={16} />
          </Link>

        </div>


        {history.length > 0 ? (
          <div className="ag-recent-list">

            {history.slice(0, 5).map((item) => (
              <div
                className="ag-recent-row"
                key={item.id}
              >

                <div className="ag-recent-main">

                  <div className="ag-recent-icon">
                    <Leaf size={18} />
                  </div>

                  <div>
                    <strong>{item.crop}</strong>
                    <span>{item.disease}</span>
                  </div>

                </div>


                <div className="ag-recent-confidence">
                  <span>Confidence</span>
                  <strong>
                    {Number(item.confidence).toFixed(2)}%
                  </strong>
                </div>


                <div className="ag-recent-severity">
                  <span
                    className={
                      item.severity?.toLowerCase() ===
                      "healthy"
                        ? "ag-severity healthy"
                        : "ag-severity"
                    }
                  >
                    {item.severity}
                  </span>
                </div>


                <div className="ag-recent-date">
                  {new Date(
                    item.timestamp
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>

              </div>
            ))}

          </div>
        ) : (
          <div className="ag-dashboard-empty">

            <XCircle size={34} />

            <h3>No analyses yet</h3>

            <p>
              Start your first AI-powered plant disease
              detection to populate your dashboard.
            </p>

            <Link
              to="/detection"
              className="ag-dashboard-primary-btn"
            >
              <ScanLine size={17} />
              Analyze Your First Plant
              <ArrowRight size={17} />
            </Link>

          </div>
        )}

      </section>

    </div>
  );
}

export default Dashboard;
