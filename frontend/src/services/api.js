const API_URL = "http://localhost:3001/api";

export const getRawData = async () => {
  try {
    const response = await fetch(`${API_URL}/data/raw`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching raw data:", error);
    return null;
  }
};

export const getCalibratedData = async () => {
  try {
    const response = await fetch(`${API_URL}/data/calibrated`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching calibrated data:", error);
    return null;
  }
};

export const getRecommendation = async (data) => {
  try {
    const response = await fetch(`${API_URL}/recommendation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching recommendation:", error);
    return null;
  }
};

export const getHistory = async () => {
  try {
    const response = await fetch(`${API_URL}/history`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching history:", error);
    return null;
  }
};
