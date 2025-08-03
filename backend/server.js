const http = require("http");
const url = require("url");

// Mock data untuk simulasi
let mockData = {
  variables: {
    pH: 6.8,
    suhu: 28,
    kelembaban: 65,
    N: 45,
    P: 20,
    K: 35,
    EC: 1.2,
  },
};

let mockHistory = [
  {
    timestamp: new Date().toISOString(),
    variables: {
      pH: 6.8,
      suhu: 28,
      kelembaban: 65,
      N: 45,
      P: 20,
      K: 35,
      EC: 1.2,
    },
  },
  {
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    variables: {
      pH: 6.9,
      suhu: 27,
      kelembaban: 63,
      N: 44,
      P: 21,
      K: 34,
      EC: 1.1,
    },
  },
];

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Helper function to send JSON response
  const sendJson = (data, statusCode = 200) => {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  };

  // API Routes
  if (pathname === "/api/data/raw") {
    sendJson(mockData);
  } else if (pathname === "/api/data/calibrated") {
    // Simulasi data terkalibrasi
    const calibrated = {
      variables: {
        pH: (mockData.variables.pH * 0.95).toFixed(2),
        suhu: (mockData.variables.suhu * 1.02).toFixed(2),
        kelembaban: (mockData.variables.kelembaban * 0.98).toFixed(2),
        N: (mockData.variables.N * 1.05).toFixed(2),
        P: (mockData.variables.P * 1.03).toFixed(2),
        K: (mockData.variables.K * 1.04).toFixed(2),
        EC: (mockData.variables.EC * 0.97).toFixed(2),
      },
    };
    sendJson(calibrated);
  } else if (pathname === "/api/recommendation") {
    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const { pH, N, K } = JSON.parse(body);

          // Simulasi rekomendasi berdasarkan input
          const recommendation = {
            recommendation: {
              urea: Math.round(100 - pH * 5 + N / 2),
              sp36: Math.round(pH * 10 + P * 2),
              kcl: Math.round(pH * 8 + K * 1.5),
            },
            timestamp: new Date().toISOString(),
          };

          sendJson(recommendation);
        } catch (error) {
          sendJson({ error: "Invalid request body" }, 400);
        }
      });
    } else {
      sendJson({ error: "Method not allowed" }, 405);
    }
  } else if (pathname === "/api/history") {
    sendJson(mockHistory);
  } else {
    sendJson({ error: "Not found" }, 404);
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
