import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register fonts
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
});

Font.register({
  family: "Roboto-Bold",
  src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontFamily: "Roboto-Bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Roboto-Bold",
    color: "#000",
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    fontFamily: "Roboto",
    color: "#000",
    marginBottom: 5,
  },
});

const SimplePDF = ({ data, history = [], type = "raw" }) => {
  const timestamp = new Date().toLocaleString("id-ID");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          Sistem Pupuk SDL -{" "}
          {type === "raw" ? "Data Mentah" : "Data Terkalibrasi"}
        </Text>
        <Text style={styles.text}>Dibuat pada: {timestamp}</Text>

        {data && data.variables && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Sensor Terbaru:</Text>
            {Object.entries(data.variables).map(([key, value]) => (
              <Text key={key} style={styles.text}>
                {key.toUpperCase()}: {value}{" "}
                {key === "suhu" ? "°C" : key === "kelembaban" ? "%" : ""}
              </Text>
            ))}
          </View>
        )}

        {history && history.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Riwayat Data (3 Terbaru):</Text>
            {history.slice(0, 3).map((item, index) => (
              <View key={index}>
                <Text style={styles.text}>
                  Waktu:{" "}
                  {new Date(item.timestamp).toLocaleString("id-ID", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                {item.variables && (
                  <Text style={styles.text}>
                    Data: pH: {item.variables.pH || "N/A"}, Suhu:{" "}
                    {item.variables.suhu || "N/A"}°C, Kelembaban:{" "}
                    {item.variables.kelembaban || "N/A"}%
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default SimplePDF;
