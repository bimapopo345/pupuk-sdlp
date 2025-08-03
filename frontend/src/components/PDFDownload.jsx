import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
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
    backgroundColor: "#f0f9f0",
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: "#22c55e",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: "Roboto-Bold",
    color: "#166534",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Roboto",
    color: "#6b7280",
    textAlign: "center",
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Roboto-Bold",
    color: "#166534",
    marginBottom: 10,
    borderBottom: 1,
    borderBottomColor: "#22c55e",
    paddingBottom: 5,
  },
  dataGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 15,
  },
  dataItem: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 5,
    border: 1,
    borderColor: "#22c55e",
  },
  dataLabel: {
    fontSize: 12,
    fontFamily: "Roboto",
    color: "#6b7280",
    marginBottom: 5,
  },
  dataValue: {
    fontSize: 18,
    fontFamily: "Roboto-Bold",
    color: "#166534",
  },
  recommendationGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 10,
    marginBottom: 15,
  },
  recommendationItem: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 5,
    border: 1,
    borderColor: "#22c55e",
    textAlign: "center",
  },
  recommendationLabel: {
    fontSize: 14,
    fontFamily: "Roboto",
    color: "#6b7280",
    marginBottom: 10,
  },
  recommendationValue: {
    fontSize: 20,
    fontFamily: "Roboto-Bold",
    color: "#166534",
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 10,
    fontFamily: "Roboto",
    color: "#6b7280",
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
});

const PDFDocument = ({ data, history = [], type = "raw" }) => {
  const timestamp = new Date().toLocaleString("id-ID");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            style={styles.logo}
            src="https://cdn-icons-png.flaticon.com/512/2986/2986954.png"
          />
          <Text style={styles.title}>Sistem Pupuk SDL</Text>
          <Text style={styles.subtitle}>
            {type === "raw"
              ? "Data Pembacaan Sensor Mentah"
              : "Data Pembacaan Sensor Terkalibrasi"}
          </Text>
          <Text style={styles.subtitle}>Tanggal: {timestamp}</Text>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Sensor Terbaru</Text>
          <View style={styles.dataGrid}>
            {data &&
              data.variables &&
              Object.entries(data.variables).map(([key, value]) => (
                <View key={key} style={styles.dataItem}>
                  <Text style={styles.dataLabel}>{key.toUpperCase()}</Text>
                  <Text style={styles.dataValue}>
                    {value}
                    {key === "pH"
                      ? ""
                      : key === "suhu"
                      ? " °C"
                      : key === "kelembaban"
                      ? " %"
                      : ""}
                  </Text>
                </View>
              ))}
          </View>
        </View>

        {/* Recommendation Section */}
        {data && data.recommendation && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rekomendasi Pupuk NPK</Text>
            <View style={styles.recommendationGrid}>
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationLabel}>Urea (N)</Text>
                <Text style={styles.recommendationValue}>
                  {data.recommendation.urea} g/m²
                </Text>
              </View>
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationLabel}>SP-36 (P)</Text>
                <Text style={styles.recommendationValue}>
                  {data.recommendation.sp36} g/m²
                </Text>
              </View>
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationLabel}>KCL (K)</Text>
                <Text style={styles.recommendationValue}>
                  {data.recommendation.kcl} g/m²
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* History Section - only if history data is provided and not empty */}
        {history && history.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Riwayat Data (5 Terbaru)</Text>
            {/* Simple table for history */}
            <View
              style={{
                borderWidth: 1,
                borderColor: "#22c55e",
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#f0f9f0",
                  borderBottomColor: "#22c55e",
                  borderBottomWidth: 1,
                }}
              >
                <Text
                  style={{
                    width: "30%",
                    padding: 5,
                    fontSize: 10,
                    fontFamily: "Roboto-Bold",
                    color: "#166534",
                    borderRightColor: "#22c55e",
                    borderRightWidth: 1,
                  }}
                >
                  Waktu
                </Text>
                <Text
                  style={{
                    width: "70%",
                    padding: 5,
                    fontSize: 10,
                    fontFamily: "Roboto-Bold",
                    color: "#166534",
                    borderRightColor: "#22c55e",
                    borderRightWidth: 1,
                  }}
                >
                  Data Sensor (pH, Suhu, Kelembaban)
                </Text>
              </View>
              {history.slice(0, 5).map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    borderBottomColor: "#22c55e",
                    borderBottomWidth: 1,
                  }}
                >
                  <Text
                    style={{
                      width: "30%",
                      padding: 5,
                      fontSize: 8,
                      fontFamily: "Roboto",
                      color: "#6b7280",
                      borderRightColor: "#22c55e",
                      borderRightWidth: 1,
                    }}
                  >
                    {new Date(item.timestamp).toLocaleString("id-ID", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  <Text
                    style={{
                      width: "70%",
                      padding: 5,
                      fontSize: 8,
                      fontFamily: "Roboto",
                      color: "#6b7280",
                      borderRightColor: "#22c55e",
                      borderRightWidth: 1,
                    }}
                  >
                    {item.variables
                      ? `pH: ${item.variables.pH || "N/A"}, Suhu: ${
                          item.variables.suhu || "N/A"
                        }°C, Kelembaban: ${item.variables.kelembaban || "N/A"}%`
                      : "N/A"}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Data dihasilkan oleh Sistem Pupuk SDL dengan Machine Learning
          </Text>
          <Text>Sumber: Sensor ESP32 + Model ML</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument;
