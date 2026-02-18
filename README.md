# Kopi Keliling 👋

Aplikasi mobile pencari kopi keliling secara realtime yang dibuat dengan **Expo** dan **Supabase**.

> [!WARNING]
> **Status Project**: Masih dalam tahap pengembangan awal (Early Development). Banyak data yang ditampilkan masih berupa **Dummy** atau **Simulasi**.

## Fitur & Progress Checklist

### ⚙️ Konfigurasi & Infrasruktur

- [x] **Inisialisasi Project**: Expo Framework & Folder Structure.
- [x] **Database**: Integrasi Supabase (PostgreSQL).
- [x] **Maps**: Google Maps SDK (API Key aktif).
- [x] **Routing**: OSRM Service untuk simulasi rute.

### 🔐 Autentikasi (Auth)

- [/] **Google Login**: [READY] Bisa login via akun Google.
- [ ] **Email/Password**: [PLANNING] Belum diimplementasikan.
- [ ] **Manajemen User**: [PLANNING] Belum ada role Pembeli/Penjual yang sebenarnya.

### 🗺️ Peta & Realtime (The Core)

- [x] **Peta Interaktif**: [READY] Zoom, Pan, & User Location.
- [/] **Realtime Tracking**: [SIMULASI] Menggunakan Supabase Realtime, tapi pergerakan rider masih disimulasikan dari sisi kode (bukan driver asli).
- [x] **Pencarian Rider**: [READY] Filter nama rider di peta.
- [x] **Simulasi Rute**: [READY] Navigasi garis (Polyline) antara user dan rider.

### 🏠 Halaman Aplikasi (Screens)

- [ ] **Beranda**: [DUMMY] Masih berupa halaman kosong (Beranda Text).
- [x] **Map**: [READY] Halaman inti berfungsi penuh dengan simulasi.
- [ ] **Menu**: [DUMMY] Berisi data placeholder makanan (Burger, Pizza) - **BELUM ADA DATA KOPI**.
- [x] **Profil**: [READY] Menampilkan info Google & fungsi Logout.

---

## Persiapan Instalasi

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Jalankan Aplikasi**

   ```bash
   npx expo start
   ```

3. **Gunakan Perangkat Fisik (Android)**
   Sangat disarankan memakai HP asli untuk mencoba fitur GPS & Map:
   ```bash
   npx expo run:android --device
   ```

---

_Project ini dikembangkan oleh STEVEN untuk kebutuhan simulasi UMKM Kopi Keliling._
