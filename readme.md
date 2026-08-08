# API Documentation - Geo Monitor Backend

Dokumentasi ini menjelaskan endpoint API yang tersedia pada backend, cara penggunaannya, format *request* yang diperlukan, dan format respons yang dikembalikan.

## Base URL
Semua request API diakses menggunakan *base path* berikut:
`http://localhost:3000/api`

---

## Response Format
Secara umum, API ini mengembalikan respons dalam format JSON dengan struktur yang konsisten (menggunakan `response.js`):

**Success Response (Contoh 200/201):**
```json
{
  "status": "success",
  "message": "Pesan keberhasilan operasi",
  "data": {
    // Berisi objek, array, atau data lain yang dikembalikan
  }
}
```

**Error Response (Contoh 400/401/403/404/500):**
```json
{
  "status": "error",
  "message": "Pesan deskriptif mengenai error yang terjadi"
}
```

---

## Authentication & Authorization
Beberapa endpoint dilindungi oleh *Middleware* dan memerlukan **JWT Token**.
Kirimkan token pada *header* HTTP `Authorization` dengan tipe `Bearer`:
```http
Authorization: Bearer <your_jwt_token_here>
```
*Roles yang tersedia: `admin`, `worker`.*

---

## 1. Auth Endpoints
Digunakan untuk proses otentikasi (login).

### `POST /api/auth/login`
- **Akses:** Publik
- **Deskripsi:** Login untuk Admin dan Worker.
- **Request Body (JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK):**
  Mengembalikan detail `user` dan `token` JWT.

---

## 2. Category Endpoints
Digunakan untuk manajemen kategori (contoh: Banjir, Kebakaran, dll).

### `GET /api/categories`
- **Akses:** Publik
- **Deskripsi:** Mendapatkan daftar seluruh kategori.

### `POST /api/categories`
- **Akses:** Khusus `admin`
- **Deskripsi:** Membuat kategori baru.
- **Request Body (JSON):**
  ```json
  { "name": "Bencana Alam" }
  ```

### `PUT /api/categories/:id`
- **Akses:** Khusus `admin`
- **Deskripsi:** Memperbarui nama kategori.
- **Request Body (JSON):**
  ```json
  { "name": "Bencana Baru" }
  ```

### `DELETE /api/categories/:id`
- **Akses:** Khusus `admin`
- **Deskripsi:** Menghapus kategori berdasarkan ID.

---

## 3. Location Endpoints
Digunakan untuk manajemen titik lokasi (peta/laporan).

### `GET /api/locations`
- **Akses:** Publik
- **Deskripsi:** Mendapatkan semua lokasi dengan status `approved`.

### `GET /api/locations/search`
- **Akses:** Publik
- **Deskripsi:** Melakukan pencarian lokasi yang sudah di-*approve*.
- **Query Parameters (Opsional):**
  - `q` (string): Mencari berdasarkan nama atau deskripsi.
  - `category` (number): Filter berdasarkan ID kategori.
  - `city` (string): Filter berdasarkan kota.
  - *Contoh: `/api/locations/search?q=banjir&category=1&city=jakarta`*

### `GET /api/locations/category/:categoryId`
- **Akses:** Publik
- **Deskripsi:** Mendapatkan daftar lokasi berdasarkan `categoryId`.

### `GET /api/locations/detail-location/:slug`
- **Akses:** Publik
- **Deskripsi:** Mendapatkan detail spesifik sebuah titik lokasi berdasarkan `slug`-nya.

### `GET /api/locations/all`
- **Akses:** Memerlukan Login (`admin` / `worker`)
- **Deskripsi:** Mendapatkan semua data lokasi (baik `pending` maupun `approved`).

### `GET /api/locations/pending`
- **Akses:** Memerlukan Login (`admin` / `worker`)
- **Deskripsi:** Mendapatkan semua data lokasi dengan status `pending` (menunggu validasi admin).

### `POST /api/locations`
- **Akses:** Khusus `worker`
- **Deskripsi:** Menambahkan titik lokasi baru. Status default akan menjadi `pending`.
- **Request Body (`multipart/form-data`):**
  - `name` (string)
  - `description` (string)
  - `categoryId` (number)
  - `latitude` (number)
  - `longitude` (number)
  - `image` (file/gambar) - *opsional*

### `PUT /api/locations/:slug`
- **Akses:** Khusus `admin`
- **Deskripsi:** Memperbarui data detail sebuah lokasi (termasuk mengganti foto).
- **Request Body (`multipart/form-data`):**
  Sama seperti struktur `POST /api/locations`.

### `PUT /api/locations/:slug/status`
- **Akses:** Khusus `admin`
- **Deskripsi:** Menerima (Approve) atau menolak (Reject) suatu titik lokasi.
- **Request Body (JSON):**
  ```json
  { "status": "approved" } // atau "rejected"
  ```

---

## Files / Static Assets
Foto atau gambar yang diunggah dapat diakses dari browser dengan mengakses sub-direktori `/uploads/`.
- **Path:** `http://localhost:3000/uploads/<filename>`
