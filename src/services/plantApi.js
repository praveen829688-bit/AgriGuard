const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function analyzePlantImage(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/api/detect`,
    {
      method: "POST",
      body: formData,
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("AgriGuard AI returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(
      data?.error || "Unable to analyze the plant image."
    );
  }

  if (!data.success) {
    throw new Error(
      data?.error || "Plant disease analysis failed."
    );
  }

  return data;
}
