# Pupuk SDL - Sistem Monitoring Tanah

Aplikasi web untuk monitoring data sensor tanah dan rekomendasi pupuk NPK.

## Fitur

### 1. Data Mentah ESP

- Menampilkan 7 variabel sensor dari ESP (pH, Suhu, Kelembaban, N, P, K, EC)
- Grafik real-time data mentah
- Riwayat data mentah
- Download data dalam format PDF
- Simpan data dummy untuk testing

### 2. Data Terkalibrasi

- Menampilkan data sensor yang telah dikalibrasi
- Perbandingan data mentah vs terkalibrasi
- Grafik perbandingan
- Riwayat data terkalibrasi
- Download data dalam format PDF

### 3. Rekomendasi Pupuk NPK

- Input data pH, N, dan K
- Rekomendasi dosis pupuk:
  - Urea (N)
  - SP-36 (P)
  - KCL (K)
- Riwayat rekomendasi
- Download rekomendasi dalam format PDF

## Teknologi

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Frontend

- React.js
- Vite
- Tailwind CSS
- Chart.js
- React Router DOM

## Instalasi

### Prasyarat

- Node.js (v14 atau lebih tinggi)
- MongoDB Atlas account

### Langkah-langkah

1. Clone repository

```bash
git clone <repository-url>
cd pupuk-sdlp
```

2. Install dependencies

```bash
npm install
cd backend
npm install
cd ..
```

3. Konfigurasi MongoDB

- Pastikan MongoDB Atlas sudah terhubung
- Update connection string di `backend/server.js` jika diperlukan

4. Jalankan aplikasi

```bash
npm run dev
```

5. Aplikasi akan tersedia di:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## API Documentation

Lihat `backend/API-README.md` untuk dokumentasi lengkap API endpoints.

## Struktur Folder

```
pupuk-sdlp/
├── backend/
│   ├── models/
│   │   └── DataModel.js
│   ├── server.js
│   ├── package.json
│   └── API-README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Chart.jsx
│   │   │   └── PDFDownload.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── RawData.jsx
│   │   │   ├── CalibratedData.jsx
│   │   │   └── Recommendation.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── ...
│   └── ...
├── package.json
└── README.md
```

## Testing dengan Postman

1. Jalankan backend server

```bash
cd backend
npm start
```

2. Gunakan endpoints yang terdapat di `backend/API-README.md`

### Contoh Request

#### Simpan Data Mentah

```bash
POST http://localhost:3001/api/data/raw
Content-Type: application/json

{
  "timestamp": "2025-08-03T10:30:00.000Z",
  "variables": {
    "pH": 6.8,
    "suhu": 28,
    "kelembaban": 65,
    "N": 45,
    "P": 20,
    "K": 35,
    "EC": 1.2
  }
}
```

#### Dapatkan Rekomendasi

```bash
POST http://localhost:3001/api/recommendation
Content-Type: application/json

{
  "pH": 6.8,
  "N": 45,
  "K": 35
}
```

## Variabel Sensor

| Variabel   | Deskripsi               | Rentang |
| ---------- | ----------------------- | ------- |
| pH         | Tingkat keasaman tanah  | 0-14    |
| Suhu       | Suhu lingkungan (°C)    | 0-100   |
| Kelembaban | Kelembaban udara (%)    | 0-100   |
| N          | Nilai Nitrogen          | 0-100   |
| P          | Nilai Fosfor            | 0-100   |
| K          | Nilai Kalium            | 0-100   |
| EC         | Electrical Conductivity | 0-10    |

## Rekomendasi Pupuk

- **Urea (N)**: Sumber nitrogen untuk pertumbuhan daun
- **SP-36 (P)**: Sumber fosfor untuk akar dan bunga
- **KCL (K)**: Sumber kalium untuk kesehatan tanaman

## Kontribusi

1. Fork repository
2. Buat branch baru (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add some amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Lisensi

MIT License
