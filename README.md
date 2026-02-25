# 🏛️ Göktürk Ordusu Discord Botu (v2.2.0)

<p align="center">
  <img src="https://img.shields.io/badge/version-2.2.0-blue.svg" />
  <img src="https://img.shields.io/badge/node-%3E%3D16-green.svg" />
  <img src="https://img.shields.io/badge/license-MIT-yellow.svg" />
  <img src="https://img.shields.io/badge/discord.js-v14-5865F2.svg" />
  <img src="https://img.shields.io/badge/status-active-success.svg" />
</p>

---

## 🧠 Açıklama

**Göktürk Ordusu Discord Botu**, Discord.js altyapısıyla geliştirilmiş, Slash (/) komut destekli, gelişmiş moderasyon, dinamik ses kanalı yönetimi ve otomatik yanıt sistemlerine sahip profesyonel bir Discord moderasyon botudur.

Türkçe Discord sunucuları için optimize edilmiştir.  
Toplu DM koruması, zamanlanabilir embed duyuru sistemi, **yeni nesil özel ses kanalı altyapısı** ve 7/24 bulut uyumluluğu ile modern Discord toplulukları için tasarlanmıştır.

> Anahtar Kelimeler: Discord moderasyon botu, Discord.js bot, Slash komut botu, Türkçe Discord bot, gelişmiş duyuru botu, geçici ses kanalı botu

---

# 🚀 Özellikler

## 🎙️ Dinamik Özel Oda Sistemi (YENİ!)
Sunucu üyelerinin kendilerine ait özel ses ve metin kanalları oluşturmasını sağlayan gelişmiş sistem.

✨ **Özellikler:**
- `/oda_sistemi_kur`: Yöneticiler tarafından kurulan şık "Oda Oluştur" paneli.
- **Akıllı Zamanlayıcı (Çöpçü):** Oluşturulan veya boşalan odalar 120 saniye boyunca sahipsiz kalırsa otomatik olarak silinir. Sunucu kirliliğini %100 önler.
- **Oda Kontrol Paneli:** Oda sahibinin kanalına özel gönderilen butonlu panel sayesinde; odayı kilitleme, kilidi açma, isim değiştirme ve kişi limiti belirleme imkanı.

---

## 🛡️ Modern Slash Komutları (`/`)

### `/duyuru`
Gelişmiş ve zamanlanabilir duyuru sistemi.
- Şık **Embed tasarımı**
- Aynı anda 4 farklı görsel desteği
- 🇹🇷 UTC+3 saat dilimine göre ileri tarihli zamanlama
- Otomatik tepki emojisi

### `/özel_mesaj`
Rol veya kullanıcıya güvenli **DM gönderimi**.
- Toplu mesajlarda otomatik gecikme (Discord API rate-limit koruması)
- Anti-spam güvenlik sistemi

### `/davet`
Bot için hızlı davet bağlantısı oluşturur.

### `/hakkında`
Bot sürümü, durum bilgisi ve geliştirici paneli.

---

## 👋 Otomatik Karşılama Sistemi
Yeni katılan üyeleri `gelen-giden` kanalında profil fotoğraflı, renkli ve Embed formatında otomatik olarak karşılar.

---

## 💬 Akıllı Yanıt Sistemi
"sa", "selamün aleyküm", "nasılsın" gibi mesajlara askeri ve resmî sunucu kültürüne uygun otomatik yanıtlar verir.

---

## ☁️ 7/24 Bulut Uyumu
Koyeb, Render ve diğer Node.js destekli hosting sistemleri için özel HTTP port altyapısı sayesinde kesintisiz çalışmaya uygundur.

---

## 👁️ Özel Aktivite
> 🏛️ Karargâhı izliyor

---

# 🛠️ Kurulum

## 📋 Gereksinimler
- Node.js (v16+ önerilir)
- Discord Bot Token
- **Message Content**, **Server Members** ve **Voice States** Intent'leri (Açık)

## ⚙️ Kurulum Adımları

```bash
git clone <repo-link>
npm install
```

.env dosyasını oluşturun:
``` TOKEN=BURAYA_BOT_TOKEN ```

Başlatın:
```node index.js```

---

# **📜 Lisans**
 `` MIT License.``

Proje açık kaynaklıdır, beğendiyseniz ⭐ bırakmayı unutmayın!
