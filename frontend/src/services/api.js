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

export const getDataBasedRecommendation = async () => {
  try {
    // Get latest calibrated data
    const calibratedResponse = await fetch(`${API_URL}/latest/calibrated`);
    const calibratedResult = await calibratedResponse.json();

    // Get latest manual data
    const manualResponse = await fetch(`${API_URL}/data/manual`);
    const manualResult = await manualResponse.json();

    let latestData = null;
    let source = "";

    // Determine which data is more recent
    if (calibratedResult.success && manualResult.success) {
      const calibratedTime = new Date(calibratedResult.data.timestamp);
      const manualTime = new Date(manualResult.data.timestamp);

      if (calibratedTime > manualTime) {
        latestData = calibratedResult.data;
        source = "Sensor ESP32";
      } else {
        latestData = manualResult.data;
        source = "Input Manual";
      }
    } else if (calibratedResult.success) {
      latestData = calibratedResult.data;
      source = "Sensor ESP32";
    } else if (manualResult.success) {
      latestData = manualResult.data;
      source = "Input Manual";
    } else {
      return {
        success: false,
        message: "Tidak ada data yang tersedia untuk rekomendasi",
      };
    }

    // Generate recommendation based on the latest data
    const recommendation = {
      urea: Math.max(
        0,
        Math.min(
          200,
          150 - parseFloat(latestData.pH) * 10 + parseFloat(latestData.N) * 2
        )
      ),
      sp36: Math.max(
        0,
        Math.min(
          150,
          100 - parseFloat(latestData.pH) * 5 + parseFloat(latestData.K) * 1.5
        )
      ),
      kcl: Math.max(
        0,
        Math.min(
          100,
          80 - parseFloat(latestData.pH) * 3 + parseFloat(latestData.N) * 1.2
        )
      ),
    };

    return {
      success: true,
      data: {
        source,
        input: latestData,
        recommendation,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Error getting data-based recommendation:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat mendapatkan rekomendasi",
    };
  }
};

export const getManualData = async () => {
  try {
    const response = await fetch(`${API_URL}/data/manual`);
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error("Error fetching manual data:", error);
    return null;
  }
};

export const saveManualData = async (data) => {
  try {
    const response = await fetch(`${API_URL}/data/manual`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error("Error saving manual data:", error);
    return null;
  }
};

export const saveAiRecommendation = async (data) => {
  try {
    const response = await fetch(`${API_URL}/recommendation/ai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error("Error saving AI recommendation:", error);
    return null;
  }
};
