

# 🏛️ Göktürk Ordusu Discord Botu (v2.3.0)

<p align="center">
<img src="[https://img.shields.io/badge/version-2.3.0-blue.svg](https://www.google.com/search?q=https://img.shields.io/badge/version-2.3.0-blue.svg)" />
<img src="[https://img.shields.io/badge/node-%3E%3D16-green.svg](https://img.shields.io/badge/node-%3E%3D16-green.svg)" />
<img src="[https://img.shields.io/badge/license-MIT-yellow.svg](https://img.shields.io/badge/license-MIT-yellow.svg)" />
<img src="[https://img.shields.io/badge/discord.js-v14-5865F2.svg](https://img.shields.io/badge/discord.js-v14-5865F2.svg)" />
<img src="[https://img.shields.io/badge/status-active-success.svg](https://img.shields.io/badge/status-active-success.svg)" />
</p>

---

## 🧠 Açıklama

**Göktürk Ordusu Discord Botu**, Discord.js altyapısıyla geliştirilmiş, Slash (/) komut destekli, gelişmiş moderasyon, dinamik ses kanalı yönetimi, güvenli ModMail (Telsiz) ve otomatik asayiş sistemlerine sahip profesyonel bir Discord moderasyon botudur.

Türkçe Discord sunucuları ve askeri (Milsim/Hard RP) konseptler için optimize edilmiştir.

Toplu DM koruması, İstihbarat (Log) takibi, Anti-Crash (Çökme Koruması) ve 7/24 bulut uyumluluğu ile modern Discord toplulukları için tasarlanmıştır.

> Anahtar Kelimeler: Discord moderasyon botu, Discord.js bot, Slash komut botu, ModMail, gelişmiş duyuru botu, geçici ses kanalı botu, Anti-Raid

---

# 🚀 Özellikler

## 📻 Telsiz Sistemi (ModMail) & İstihbarat (YENİ!)

Karargâh içi iletişimi ve güvenliği en üst düzeye çıkaran sistemler:

* **Telsiz (DM İletişimi):** Üyeler bota DM attığında mesajlar otomatik olarak `telsiz-komuta` kanalına düşer. Yöneticiler `/telsiz_yanit` komutu ile doğrudan karargâhtan askere yanıt verebilir.
* **İstihbarat Dairesi (Logger):** Sunucuda silinen mesajları ve üyelerin değişen rütbelerini (rollerini) anında tespit edip `istihbarat` kanalına raporlar.

---

## 🛡️ Asayiş Kalkanı ve Otorol (YENİ!)

* **Anti-Raid (Küfür/Reklam Filtresi):** Sohbet kanallarına atılan yetkisiz Discord/Telegram davet linklerini ve küfürleri anında silerek kullanıcıyı uyarır.
* **Otorol Sistemi:** Karargâha katılan yeni neferlere anında "Kayıtsız" veya belirlenen başlangıç rütbesini otomatik tahsis eder.
* **Anti-Crash (Ölümsüzlük):** Discord API çökmelerinde veya beklenmeyen hatalarda botun kapanmasını engelleyen özel kalkan altyapısı.

---

## 🎙️ Dinamik Özel Oda Sistemi

Sunucu üyelerinin kendilerine ait özel ses ve metin kanalları oluşturmasını sağlayan gelişmiş sistem.

* `/oda_sistemi_kur`: Yöneticiler tarafından kurulan şık "Oda Oluştur" paneli.
* **Akıllı Zamanlayıcı (Çöpçü):** Oluşturulan veya boşalan odalar 120 saniye boyunca sahipsiz kalırsa otomatik olarak silinir.
* **Oda Kontrol Paneli:** Oda sahibinin kanalına özel gönderilen butonlu panel sayesinde; odayı kilitleme, kilidi açma, isim değiştirme ve kişi limiti belirleme imkanı.

---

## ⚙️ Modern Slash Komutları (`/`)

### `/duyuru`

Gelişmiş ve zamanlanabilir duyuru sistemi.

* Şık **Embed tasarımı** ve 4 farklı görsel desteği
* 🇹🇷 UTC+3 saat dilimine göre ileri tarihli zamanlama
* Otomatik tepki emojisi

### `/özel_mesaj`

Rol veya kullanıcıya güvenli **DM gönderimi**.

* Toplu mesajlarda otomatik gecikme (Discord API rate-limit koruması)
* Anti-spam güvenlik sistemi

### `/davet` & `/hakkında`

Bot için hızlı davet bağlantısı oluşturur ve güncel bot sürümünü/geliştirici panelini gösterir.

---

## 👋 Otomatik Karşılama ve Yanıt Sistemi

* Yeni katılan üyeleri `gelen-giden` kanalında profil fotoğraflı ve Embed formatında karşılar.
* "sa", "selamün aleyküm" gibi mesajlara askeri kültüre uygun resmi yanıtlar verir.

---

## ☁️ 7/24 Bulut Uyumu

Koyeb, Render ve diğer Node.js destekli hosting sistemleri için özel HTTP port altyapısı sayesinde kesintisiz çalışmaya uygundur.

---

# 🛠️ Kurulum

## 📋 Gereksinimler

* Node.js (v16+ önerilir)
* Discord Bot Token
* **Message Content**, **Server Members** ve **Voice States** Intent'leri (Açık)

## ⚙️ Kurulum Adımları

```bash
git clone <repo-link>
npm install

```

.env dosyasını oluşturun:

```env
TOKEN=BURAYA_BOT_TOKEN
PORT=8000

```

Başlatın:

```bash
node index.js

```

---

# **📜 Lisans & Güvenlik**

Güvenlik açığı bildirim süreçleri için lütfen `SECURITY.md` dosyasını inceleyin.

Bu proje **MIT License** ile lisanslanmıştır.

Proje açık kaynaklıdır, beğendiyseniz ⭐ bırakmayı unutmayın!

