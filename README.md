# Seis Bakery

Website statis Seis Bakery dengan halaman terpisah, katalog menu, keranjang, checkout, pilihan pickup/delivery, dan instruksi pembayaran transfer bank.

## Struktur folder
- `index.html` — beranda
- `menu.html` — katalog cake, filter kategori, tombol tambah ke keranjang
- `about.html` — cerita Seis Bakery
- `reviews.html` — halaman catatan/ulasan
- `checkout.html` — keranjang, data pemesan, pickup/delivery, ringkasan biaya
- `order-success.html` — ringkasan pesanan dan instruksi transfer
- `style.css` — styling seluruh halaman
- `script.js` — navigasi, filter, keranjang, dan alur checkout di browser
- `store-config.js` — konfigurasi rekening transfer
- `assets/` — logo dan foto

## Menjalankan di komputer
Buka folder ini di VS Code, lalu jalankan `index.html` menggunakan Live Server. Bisa juga membuka file `index.html` langsung di browser untuk mencoba fitur dasar.

## Sebelum dipublikasikan
1. Edit `store-config.js`, ganti nama bank, nomor rekening, dan nama pemilik dengan detail rekening resmi Seis Bakery. Jangan publikasikan placeholder sebagai rekening sungguhan.
2. Harga, ketersediaan, ongkos kirim, lokasi toko, dan foto produk perlu diverifikasi. Ongkir saat ini contoh Rp10.000.
3. Checkout ini adalah demo front-end: keranjang dan pesanan tersimpan di browser pengguna, belum masuk ke dashboard pemilik dan belum memverifikasi pembayaran otomatis. Untuk menerima order pelanggan sungguhan, hubungkan ke backend/database atau layanan formulir/order.
4. Informasi rekening di halaman konfirmasi bukan gateway pembayaran. Pemilik harus mengecek mutasi rekening secara manual.

## Upload ke GitHub
Buat repository baru, lalu upload seluruh isi folder ini (bukan folder induk yang membungkusnya). Jangan upload data pribadi pelanggan atau kredensial rahasia.
