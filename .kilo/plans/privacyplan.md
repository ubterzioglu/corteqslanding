Privacy Policy Sayfasını Yayınlama Planı (/privacy-policy)
Özet
Verdiğin metin birebir korunarak yeni bir statik Next.js sayfası oluşturulacak ve https://corteqs.net/privacy-policy altında yayınlanacak. Sayfa mevcut docs düzenine bağlı olmayacak; doğrudan route ile erişilecek.

Uygulama Değişiklikleri
Yeni route dosyası eklenecek: src/pages/privacy-policy.tsx.
Sayfa içeriği, gönderdiğin İngilizce metinle birebir yerleştirilecek:
Başlık: Privacy Policy
Bölümler: 1–11 aynı sıra ve içerikte
İletişim satırları (email + website) korunacak.
Sayfaya temel SEO/inceleme uyum meta bilgisi eklenecek:
<title>Privacy Policy | Corteqs</title>
<meta name="description" ...> (politika kapsamını kısa özetleyen ifade)
canonical: https://corteqs.net/privacy-policy
Navigasyon/sidebar değiştirilmeyecek (sayfa yalnızca direkt URL ile erişilecek).
Public Arayüz/URL Değişikliği
Yeni public endpoint: /privacy-policy (HTTP 200 dönen statik sayfa).
Test Planı
npm run build ile derleme doğrulaması.
Lokal çalıştırmada /privacy-policy route’u açılış kontrolü.
İçerik doğrulaması:
11 bölümün tamamı doğru sırada.
“Email: info@corteqs.net” ve site URL’si doğru.
SEO doğrulaması:
title, description, canonical HTML çıktısında mevcut.
Varsayımlar
Metin birebir kullanılacak (dil/ifadeler revize edilmeyecek).
Sayfa menü/sidebar’a eklenmeyecek; sadece doğrudan URL’den erişilecek.
Hukuki “effective date” veya şirket unvanı gibi ek alanlar bu iterasyonda eklenmeyecek.