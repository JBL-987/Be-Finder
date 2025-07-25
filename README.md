# Be-Finder

Be-Finder adalah platform kecerdasan lokasi yang dibangun di Internet Computer (ICP) yang membantu pengguna menemukan lokasi strategis untuk bisnis. Platform ini menggabungkan pemetaan interaktif, analisis lokasi berbasis AI, dan visualisasi data untuk memberikan wawasan dalam pengambilan keputusan lokasi bisnis.

## Fitur

- **Peta Interaktif**: Jelajahi lokasi dengan antarmuka peta interaktif yang didukung oleh Leaflet
- **Asisten AI**: Berkomunikasi dengan asisten AI yang khusus dalam analisis lokasi dan wawasan bisnis
- **Dashboard Analitik**: Visualisasikan data dan metrik lokasi
- **Laporan**: Buat dan lihat laporan lokasi yang detail
- **Manajemen Data**: Unggah dan kelola file data lokasi
- **Autentikasi Aman**: Login dengan Internet Identity (II)

## Teknologi

- **Backend**: Motoko di Internet Computer
- **Frontend**: React, Vite, Tailwind CSS
- **Layanan Peta**: Leaflet dengan OpenStreetMap
- **Integrasi AI**: OpenRouter API
- **Autentikasi**: Internet Identity

## Memulai

### Prasyarat

- [Node.js](https://nodejs.org/) (v14 atau lebih baru)
- [DFX](https://internetcomputer.org/docs/current/developer-tools/dfx/install/) (DFINITY Canister SDK)
- [Mops](https://docs.mops.one/quick-start#2-install-mops-cli) (Motoko Package Manager): `npm i -g ic-mops`

### Pengembangan Lokal

1. Clone repositori:

```bash
git clone https://github.com/username-anda/Be-Finder.git
cd Be-Finder
```

2. Instal dependensi:

```bash
npm install
```

3. Mulai replica Internet Computer lokal:

```bash
dfx start --background --clean
```

4. Deploy canister ke replica lokal:

```bash
dfx deploy
```

5. Mulai server pengembangan frontend:

```bash
npm run dev
```

6. Buka browser Anda dan navigasikan ke URL yang ditampilkan di terminal (biasanya http://localhost:5173)

## Deployment ke Internet Computer

### 1. Buat identitas pengembang

```bash
dfx identity new identitas-saya
dfx identity use identitas-saya
```

### 2. Dapatkan cycles

Anda akan membutuhkan cycles untuk deploy ke mainnet. Anda dapat mengkonversi token ICP menjadi cycles:

```bash
dfx ledger create-canister <principal-id> --amount <jumlah-icp>
dfx canister deposit-cycles <jumlah-cycles> <canister-id>
```

### 3. Deploy ke mainnet

```bash
dfx deploy --network ic
```

## Struktur Proyek

- `/backend`: Kode canister Motoko
- `/frontend`: Aplikasi frontend React
  - `/src/components`: Komponen UI
  - `/src/pages`: Halaman aplikasi
  - `/src/services`: Integrasi layanan (Map, OpenRouter)

## Menggunakan Be-Finder

### Autentikasi

Be-Finder menggunakan Internet Identity untuk autentikasi yang aman. Klik tombol "Login" untuk mengautentikasi dengan Internet Identity Anda.

### Navigasi Peta

- Gunakan antarmuka peta untuk menjelajahi lokasi
- Cari alamat atau area tertentu
- Tambahkan penanda untuk lokasi bisnis potensial
- Lihat detail lokasi dengan mengklik penanda

### Asisten AI

- Berkomunikasi dengan asisten AI untuk mendapatkan rekomendasi lokasi
- Ajukan pertanyaan tentang demografi area, lalu lintas pejalan kaki, atau potensi bisnis
- Minta analisis lokasi tertentu

### Manajemen Data

- Unggah file data lokasi untuk analisis
- Lihat dan kelola file yang Anda unggah
- Unduh atau hapus file sesuai kebutuhan

## Pertimbangan Keamanan

Jika Anda menggunakan aplikasi ini sebagai contoh, disarankan agar Anda memahami dan mematuhi [praktik keamanan terbaik](https://internetcomputer.org/docs/building-apps/security/overview) untuk pengembangan di ICP. Contoh ini mungkin tidak menerapkan semua praktik terbaik.

## Lisensi

[Lisensi MIT](LICENSE)

## Ucapan Terima Kasih

- [Internet Computer](https://internetcomputer.org/)
- [DFINITY Foundation](https://dfinity.org/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Leaflet](https://leafletjs.com/)
