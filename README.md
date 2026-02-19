# 🏛️ MKA Discord Bot (v1.3.0)

Mustafa Kemal Atatürk'ün izinde, modern Discord sunucuları için geliştirilmiş, gelişmiş bir asistan ve moderasyon botu. Yeni nesil Discord.js altyapısı ve gelişmiş Slash (/) komutlarıyla sunucu düzenini sağlar.

## 🚀 Özellikler

* **🛡️ Modern Slash Komutları (/)**
  * `/duyuru`: Yalnızca yöneticilerin kullanabileceği, satır atlama (`\n`) destekli ve otomatik tepki emojili profesyonel duyuru sistemi.
  * `/hakkında`: Botun anlık durumunu, sürümünü ve geliştirici bilgilerini gösteren şık bilgi paneli (Embed).
* **👋 Otomatik Karşılama Sistemi:** Sunucuya yeni katılan neferleri `gelen-giden` kanalında özel, renkli ve profil fotoğraflı bir mesajla otomatik olarak karşılar.
* **💬 Akıllı Yanıt Sistemi:** "sa", "selamün aleyküm", "nasılsın" gibi temel mesajlara anında, sunucu kültürüne uygun yanıtlar verir.
* **☁️ 7/24 Aktif & Stabil:** Railway bulut sistemi üzerinde kesintisiz çalışacak şekilde optimize edilmiştir.
* **👁️ Özel Durum:** "Göktürk Ordusu'nu izliyor" şeklinde tematik profil aktivitesi.

## 🛠️ Kurulum ve Çalıştırma

Bu proje hem yerel bilgisayarınızda (Local) hem de Railway gibi bulut sistemlerinde çalışmaya uygun şekilde hazırlanmıştır.

### Gereksinimler
* [Node.js](https://nodejs.org/) yüklü bir sistem.
* [Discord Developer Portal](https://discord.com/developers/applications)'dan alınmış bir Bot Tokeni.
* Botun **Message Content Intent** ve **Server Members Intent** ayarlarının açık olması.

### Adımlar

1. Bu depoyu bilgisayarınıza klonlayın veya .zip olarak indirin.
2. Terminali açın ve gerekli kütüphaneleri yükleyin:
   ```bash
   npm install



3. Klasörün ana dizininde bir `.env` dosyası oluşturun ve içine bot tokeninizi şu şekilde ekleyin:
```env
TOKEN=buraya_gizli_bot_tokeninizi_yapistirin

```


4. Botu başlatın:
```bash
node index.js

```



## 🔒 Güvenlik

Desteklenen sürümler ve güvenlik açığı bildirim süreçleri için lütfen [SECURITY.md](SECURITY.md) dosyasını inceleyin.

## 📜 Lisans

Bu proje **MIT Lisansı** ile lisanslanmıştır. Kodların kullanımı ve dağıtımı ile ilgili tüm detaylar için depodaki `LICENSE` dosyasına göz atabilirsiniz.
