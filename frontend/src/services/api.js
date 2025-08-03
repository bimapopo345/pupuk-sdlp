const API_URL = "http://localhost:3001/api";

export const getRawData = async () => {
  try {
    const response = await fetch(`${API_URL}/data/raw`);
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error("Error fetching raw data:", error);
    return null;
  }
};

export const getRawDataHistory = async (limit = 50) => {
  try {
    const response = await fetch(`${API_URL}/data/raw/history?limit=${limit}`);
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error("Error fetching raw data history:", error);
    return [];
  }
};

export const saveRawData = async (data) => {
  try {
    const response = await fetch(`${API_URL}/data/raw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error("Error saving raw data:", error);
    return null;
  }
};

export const deleteRawData = async (id) => {
  try {
    const response = await fetch(`${API_URL}/data/raw/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Error deleting raw data:", error);
    return false;
  }
};

export const deleteAllRawData = async () => {
  try {
    const response = await fetch(`${API_URL}/data/raw`, {
      method: "DELETE",
    });
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Error deleting all raw data:", error);
    return false;
  }
};

export const getCalibratedData = async () => {
  try {
    const response = await fetch(`${API_URL}/data/calibrated`);
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error("Error fetching calibrated data:", error);
    return null;
  }
};

export const getCalibratedDataHistory = async (limit = 50) => {
  try {
    const response = await fetch(
      `${API_URL}/data/calibrated/history?limit=${limit}`
    );
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error("Error fetching calibrated data history:", error);
    return [];
  }
};

export const saveCalibratedData = async (data) => {
  try {
    const response = await fetch(`${API_URL}/data/calibrated`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error("Error saving calibrated data:", error);
    return null;
  }
};

export const deleteCalibratedData = async (id) => {
  try {
    const response = await fetch(`${API_URL}/data/calibrated/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Error deleting calibrated data:", error);
    return false;
  }
};

export const deleteAllCalibratedData = async () => {
  try {
    const response = await fetch(`${API_URL}/data/calibrated`, {
      method: "DELETE",
    });
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Error deleting all calibrated data:", error);
    return false;
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
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error("Error fetching recommendation:", error);
    return null;
  }
};

export const getRecommendationHistory = async (limit = 50) => {
  try {
    const response = await fetch(
      `${API_URL}/recommendation/history?limit=${limit}`
    );
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error("Error fetching recommendation history:", error);
    return [];
  }
};

export const getHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    const result = await response.json();
    return result.success ? result : null;
  } catch (error) {
    console.error("Error fetching health status:", error);
    return null;
  }
};

export const getLatestCalibrated = async () => {
  try {
    const response = await fetch(`${API_URL}/latest/calibrated`);
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error("Error fetching latest calibrated data:", error);
    return null;
  }
};
