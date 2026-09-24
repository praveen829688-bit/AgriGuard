const recommendations = {
  Late_blight: {
    title: "Late Blight Management",
    immediate: [
      "Inspect nearby tomato plants for similar symptoms.",
      "Remove severely affected plant material where appropriate.",
      "Improve airflow around the crop.",
      "Avoid unnecessary handling of wet foliage."
    ],
    irrigation: [
      "Avoid unnecessary overhead irrigation.",
      "Prefer irrigation methods that minimize leaf wetness.",
      "Water according to crop and soil requirements."
    ],
    fertilizer: [
      "Maintain balanced plant nutrition.",
      "Avoid excessive nitrogen application.",
      "Base fertilizer decisions on soil condition and crop stage."
    ],
    prevention: [
      "Maintain adequate spacing between plants.",
      "Improve air circulation through the crop.",
      "Monitor plants regularly during humid conditions.",
      "Maintain good crop sanitation."
    ]
  },

  Early_blight: {
    title: "Early Blight Management",
    immediate: [
      "Inspect older leaves and surrounding plants.",
      "Remove severely affected foliage where appropriate.",
      "Improve airflow around plants."
    ],
    irrigation: [
      "Minimize unnecessary leaf wetness.",
      "Avoid overhead irrigation where practical."
    ],
    fertilizer: [
      "Maintain balanced crop nutrition.",
      "Avoid excessive nitrogen without soil-based justification."
    ],
    prevention: [
      "Maintain crop hygiene.",
      "Provide adequate plant spacing.",
      "Monitor regularly for expanding lesions."
    ]
  },

  Bacterial_spot: {
    title: "Bacterial Spot Management",
    immediate: [
      "Inspect surrounding plants for similar symptoms.",
      "Remove severely affected material where appropriate.",
      "Maintain good crop sanitation."
    ],
    irrigation: [
      "Reduce unnecessary foliage wetness.",
      "Avoid working with plants while foliage is wet."
    ],
    fertilizer: [
      "Maintain balanced crop nutrition.",
      "Use soil and crop requirements to guide fertilizer decisions."
    ],
    prevention: [
      "Use clean planting material.",
      "Keep tools and crop areas clean.",
      "Monitor nearby plants for new symptoms."
    ]
  }
};

export function getRecommendation(disease) {
  if (!disease) return null;

  return (
    recommendations[disease] ||
    recommendations[
      Object.keys(recommendations).find(
        (key) => key.toLowerCase() === disease.toLowerCase()
      )
    ] ||
    null
  );
}
