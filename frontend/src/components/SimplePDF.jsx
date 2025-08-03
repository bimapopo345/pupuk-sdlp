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
    padding: 40,
    backgroundColor: "#ffffff",
    fontFamily: "Roboto",
  },
  header: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#f0fdf4", // Light green background
    borderRadius: 8,
    border: 1,
    borderColor: "#bbf7d0", // Light green border
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative", // For pseudo-elements if needed
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Roboto-Bold",
    color: "#166534", // Dark green
    textAlign: "center",
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Roboto",
    color: "#4b5563", // Gray-600
    textAlign: "center",
    marginBottom: 8,
    fontStyle: "italic",
  },
  headerTimestamp: {
    fontSize: 12,
    fontFamily: "Roboto",
    color: "#6b7280", // Gray-500
    textAlign: "center",
    backgroundColor: "#e5e7eb", // Light gray
    padding: "4px 12px",
    borderRadius: 12,
    border: "1px solid #d1d5db", // Gray-300
    marginTop: 10,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 12,
    border: 2,
    borderColor: "#22c55e", // Green-500
    borderRadius: "50%",
    padding: "5px", // Creates a white ring around the logo
    backgroundColor: "#ffffff", // White background for the ring
  },
  headerDecoration: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    background: "linear-gradient(to right, #22c55e, #16a34a, #15803d)", // Green gradient
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Roboto-Bold",
    color: "#166534",
    marginBottom: 15,
    borderBottom: 1,
    borderBottomColor: "#22c55e",
    paddingBottom: 5,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderColor: "#22c55e",
    borderWidth: 1,
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "30%",
    borderStyle: "solid",
    borderColor: "#22c55e",
    borderWidth: 1,
    padding: 8,
    backgroundColor: "#f0f9f0",
    fontFamily: "Roboto-Bold",
    fontSize: 10,
  },
  tableColData: {
    width: "70%",
    borderStyle: "solid",
    borderColor: "#22c55e",
    borderWidth: 1,
    padding: 8,
    fontSize: 10,
  },
  tableRowData: {
    flexDirection: "row",
  },
  tableRowDataAlt: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
  },
  footer: {
    marginTop: 40,
    padding: 15,
    borderTop: 1,
    borderTopColor: "#22c55e",
    textAlign: "center",
    fontSize: 10,
    color: "#6b7280",
  },
  footerText: {
    marginBottom: 3,
  },
});

const SimplePDF = ({ data, history = [], type = "raw" }) => {
  const now = new Date();
  // Format: "3/8/2025, 18.53.58" with WIB timezone
  const timestamp = now
    .toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(/\//g, "/")
    .replace(",", ", ");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerDecoration} />
          <Image
            style={styles.logo}
            src="https://cdn-icons-png.flaticon.com/512/2986/2986954.png"
          />
          <Text style={styles.headerTitle}>SISTEM PUPUK SDL</Text>
          <Text style={styles.headerSubtitle}>
            {type === "raw"
              ? "Data Pembacaan Sensor Mentah"
              : "Data Pembacaan Sensor Terkalibrasi"}
          </Text>
          <Text style={styles.headerTimestamp}>Dibuat pada: {timestamp}</Text>
        </View>

        {/* Current Data Section */}
        {data && data.variables && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Sensor Terbaru</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableColHeader}>Parameter</Text>
                <Text style={styles.tableColHeader}>Nilai</Text>
              </View>
              {Object.entries(data.variables).map(([key, value]) => (
                <View key={key} style={styles.tableRowData}>
                  <Text style={styles.tableColData}>{key.toUpperCase()}</Text>
                  <Text style={styles.tableColData}>
                    {value}
                    {key === "suhu"
                      ? " °C"
                      : key === "kelembaban"
                      ? " %"
                      : key === "pH"
                      ? ""
                      : ""}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* History Data Section */}
        {history && history.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Riwayat Data (5 Terbaru)</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableColHeader}>Waktu Pembacaan</Text>
                <Text style={styles.tableColHeader}>
                  Data Sensor (pH, Suhu, Kelembaban)
                </Text>
              </View>
              {history.slice(0, 5).map((item, index) => (
                <View
                  key={index}
                  style={
                    index % 2 === 0
                      ? styles.tableRowData
                      : styles.tableRowDataAlt
                  }
                >
                  <Text style={styles.tableColData}>
                    {new Date(item.timestamp).toLocaleString("id-ID", {
                      timeZone: "Asia/Jakarta",
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                    (WIB)
                  </Text>
                  <Text style={styles.tableColData}>
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
          <Text style={styles.footerText}>
            Data dihasilkan oleh Sistem Pupuk SDL dengan Machine Learning
          </Text>
          <Text style={styles.footerText}>Sumber: Sensor ESP32 + Model ML</Text>
          <Text style={styles.footerText}>
            © 2025 Sistem Pupuk SDL. All rights reserved.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default SimplePDF;
