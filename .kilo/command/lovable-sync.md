# Lovable Sync Komutu

Lovable'dan projenin son halini cek, farklari analiz et, referans.md'yi guncelle ve degisiklikleri uygula.

## Adimlar

### 1. Kaynagi Cek

- `referans/` dizinindeki en yeni kaynak kodu bul (zip varsa ac, acilmis klasor varsa dogrudan kullan)
- Kullanici guncel halini zaten `referans/` altina koymus olacak

### 2. Fark Analizi

- Mevcut `src/`, `public/`, `supabase/` ile yeni kaynak arasinda diff yap
- Farklari kategorize et: ui, backend, auth, mail, db, content

### 3. Gunlugu Guncelle

- `referans/referans.md` dosyasindaki "Guncelleme Gunlugu" bolumune timestamp ile yeni giris ekle
- Eklenecek: tarih, yeni ozellikler, degisen ozellikler, kategoriler, uygulanan/ertelenen maddeler

### 4. Farklari Uygula

- Mevcut repo yapisini koru
- Korunacak alanlar: .env dosyalari, supabase migration'lari, admin panel, Docker yapilandirmasi, .kilo/ dizini
- Yeni component'leri mevcut dosya yapisina entegre et
- Mevcut component'lerde sadece anlamli iyilestirmeleri uygula

### 5. Dogrulama

- `npm run build` calistir
- `npm run lint` calistir
- Hata varsa duzelt ve tekrar dene

### 6. Ozet

- Kac dosya degisti, ne eklendi, ne cikarildigi ozetini ver

## Kurallar

- ASLA secret/key iceren dosyalari degistirme
- ASLA mevcut supabase migration'larini degistirme (yenileri eklenebilir)
- ASLA admin panel ve auth yapisini bozma
- Her degisikligi referans.md'ye kaydet
