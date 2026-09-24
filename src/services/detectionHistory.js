const STORAGE_KEY = "agriguard_detection_history";

export function getDetectionHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveDetection(result) {
  const history = getDetectionHistory();

  const record = {
    id: crypto.randomUUID(),
    crop: result.crop || "Unknown",
    disease: result.disease || "Unknown",
    confidence: Number(result.confidence || 0),
    severity: result.severity || "Unknown",
    className: result.className || "",
    classIndex: result.classIndex ?? null,
    timestamp: new Date().toISOString(),
  };

  const updated = [record, ...history].slice(0, 100);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );

  return record;
}

export function clearDetectionHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
