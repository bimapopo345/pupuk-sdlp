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
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: "#22c55e",
    paddingBottom: 10,
    display: "flex",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "Roboto-Bold",
    color: "#166534",
    textAlign: "center",
    flex: 1,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Roboto",
    color: "#6b7280",
    textAlign: "center",
    marginTop: 5,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 15,
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
    marginTop: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#6b7280",
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
          <Image
            style={styles.logo}
            src="https://cdn-icons-png.flaticon.com/512/2986/2986954.png"
          />
          <Text style={styles.title}>Sistem Pupuk SDL</Text>
        </View>
        <Text style={styles.subtitle}>
          {type === "raw"
            ? "Data Pembacaan Sensor Mentah"
            : "Data Pembacaan Sensor Terkalibrasi"}
        </Text>
        <Text style={styles.subtitle}>Dibuat pada: {timestamp}</Text>

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
          <Text>
            Data dihasilkan oleh Sistem Pupuk SDL dengan Machine Learning
          </Text>
          <Text>Sumber: Sensor ESP32 + Model ML</Text>
        </View>
      </Page>
    </Document>
  );
};

export default SimplePDF;
