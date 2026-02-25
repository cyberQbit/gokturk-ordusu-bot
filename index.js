const { Client, GatewayIntentBits, Collection, ActivityType, EmbedBuilder, REST, Routes, SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ] 
});

// Özel cevaplar listesi
const responses = {
    "sa": "Aleykümselam, Karargâha hoş geldin!",
    "selamün aleyküm": "Aleykümselam, Karargâha hoş geldin!",
    "nasılsın": "Görevimin başındayım, sizleri sormalı?",
};

client.once('ready', async () => {
    console.log(`✅ Giriş yapıldı: ${client.user.tag}`);

    // Durum Ayarı
    client.user.setPresence({
        activities: [{ name: 'Her Cuma ve Cmrt Operasyon! Sende Aramıza Katıl: dsc.gg/GokturkARMY', type: ActivityType.Playing }],
        status: 'dnd',
    });

    // --- SLASH KOMUT TANIMLARI ---
    const commands = [
        new SlashCommandBuilder()
            .setName('duyuru')
            .setDescription('Sunucuya (veya belirtilen kanala) gelişmiş duyuru gönderir.')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .addStringOption(option => option.setName('mesaj').setDescription('Duyuru metni (Alt satır için \\n kullanın)').setRequired(true))
            .addChannelOption(option => option.setName('kanal').setDescription('Gönderilecek kanal (Boş bırakırsanız bulunduğunuz kanala atar)').setRequired(false))
            .addStringOption(option => option.setName('zaman').setDescription('Saat (Örn: 19:30). Boş bırakırsanız anında gönderir.').setRequired(false))
            .addBooleanOption(option => option.setName('embed_kullan').setDescription('Mesaj şık bir kutu (Embed) içinde mi gitsin?').setRequired(false))
            .addAttachmentOption(option => option.setName('gorsel1').setDescription('1. Görsel (Embed içine girer)').setRequired(false))
            .addAttachmentOption(option => option.setName('gorsel2').setDescription('2. Görsel (Opsiyonel)').setRequired(false))
            .addAttachmentOption(option => option.setName('gorsel3').setDescription('3. Görsel (Opsiyonel)').setRequired(false))
            .addAttachmentOption(option => option.setName('gorsel4').setDescription('4. Görsel (Opsiyonel)').setRequired(false))
            .addStringOption(option => option.setName('tepki1').setDescription('Eklenecek 1. emoji (Opsiyonel)').setRequired(false))
            .addStringOption(option => option.setName('tepki2').setDescription('Eklenecek 2. emoji (Opsiyonel)').setRequired(false))
            .addStringOption(option => option.setName('tepki3').setDescription('Eklenecek 3. emoji (Opsiyonel)').setRequired(false))
            .addStringOption(option => option.setName('tepki4').setDescription('Eklenecek 4. emoji (Opsiyonel)').setRequired(false))
            .addStringOption(option => option.setName('tepki5').setDescription('Eklenecek 5. emoji (Opsiyonel)').setRequired(false)),
              
        new SlashCommandBuilder()
            .setName('hakkında')
            .setDescription('Botun teknik özelliklerini ve amacını gösterir.'),

        // --- ÖZEL MESAJ KOMUTU ---
        new SlashCommandBuilder()
            .setName('özel_mesaj')
            .setDescription('Belirtilen kişiye veya role özel mesaj atar.')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .addStringOption(option => option.setName('mesaj').setDescription('Gönderilecek mesaj metni').setRequired(true))
            .addUserOption(option => option.setName('kisi').setDescription('Sadece tek bir kişiye göndermek için').setRequired(false))
            .addRoleOption(option => option.setName('rol').setDescription('Bir role sahip üyelere göndermek için').setRequired(false))
            .addChannelOption(option => option.setName('kanal').setDescription('Mesajın sonuna tıklanabilir kanal ekler').setRequired(false)),

        new SlashCommandBuilder()
            .setName('davet')
            .setDescription('Göktürk Ordusu botunu kendi Karargâhınıza (sunucunuza) davet edin.'),
    ].map(command => command.toJSON());

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        console.log('🚀 Komutlar yükleniyor...');
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log('✅ Komutlar başarıyla kaydedildi!');
    } catch (error) {
        console.error(error);
    }
});

// Komut ve Mesaj Dinleyici
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    // --- GELİŞMİŞ, ZAMANLANABİLİR, TEPKİLİ, EMBED VE ÇOKLU GÖRSEL DESTEKLİ DUYURU KOMUTU ---
    if (interaction.commandName === 'duyuru') {
        await interaction.deferReply({ ephemeral: true });

        const mesaj = interaction.options.getString('mesaj').replace(/\\n/g, '\n');
        const kanal = interaction.options.getChannel('kanal') || interaction.channel;
        const zaman = interaction.options.getString('zaman');
        const embedKullan = interaction.options.getBoolean('embed_kullan');

        const gorsel1 = interaction.options.getAttachment('gorsel1');
        const gorsel2 = interaction.options.getAttachment('gorsel2');
        const gorsel3 = interaction.options.getAttachment('gorsel3');
        const gorsel4 = interaction.options.getAttachment('gorsel4');

        // Yüklenen tüm görselleri bir listede topla
        const dosyalar = [];
        if (gorsel1) dosyalar.push(gorsel1);
        if (gorsel2) dosyalar.push(gorsel2);
        if (gorsel3) dosyalar.push(gorsel3);
        if (gorsel4) dosyalar.push(gorsel4);

        const tepkiler = [];
        for (let i = 1; i <= 5; i++) {
            const tepki = interaction.options.getString(`tepki${i}`);
            if (tepki) tepkiler.push(tepki);
        }

        const emojileriEkle = async (gonderilenMesaj) => {
            for (const emoji of tepkiler) {
                try {
                    await gonderilenMesaj.react(emoji);
                } catch (error) {}
            }
        };

        let gonderilecekVeri = {};
        if (embedKullan || mesaj.length > 1900) {
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setDescription(mesaj);
            
            // İlk görseli ana kutunun içine büyük yerleştir
            if (gorsel1) embed.setImage(gorsel1.url);
            
            gonderilecekVeri.embeds = [embed];
            
            // Eğer 2, 3 ve 4. görseller de yüklendiyse onları alt alta mesaj dosyası olarak ekle
            const digerDosyalar = dosyalar.slice(1);
            if (digerDosyalar.length > 0) gonderilecekVeri.files = digerDosyalar;

        } else {
            gonderilecekVeri.content = mesaj;
            // Normal mesaj modunda tüm görselleri alt alta diz
            if (dosyalar.length > 0) gonderilecekVeri.files = dosyalar;
        }

        // 1. DURUM: ZAMAN GİRİLMEDİYSE ANINDA GÖNDER
        if (!zaman) {
            try {
                const gonderilenMesaj = await kanal.send(gonderilecekVeri);
                await emojileriEkle(gonderilenMesaj);
                return interaction.editReply({ content: `✅ Duyuru başarıyla ${kanal} kanalına gönderildi!` });
            } catch (err) {
                console.error(err);
                return interaction.editReply({ content: '❌ Mesaj gönderilemedi. Dosya boyutu çok büyük olabilir veya yetki eksik.' });
            }
        }

        // 2. DURUM: ZAMAN GİRİLDİYSE SAATİ HESAPLA
        const saatDakika = zaman.split(':');
        if (saatDakika.length !== 2 || isNaN(saatDakika[0]) || isNaN(saatDakika[1])) {
            return interaction.editReply({ content: '❌ Lütfen saati doğru formatta girin! (Örn: 19:30)' });
        }

        const simdi = new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/Istanbul"}));
        const hedefZaman = new Date(simdi);
        hedefZaman.setHours(parseInt(saatDakika[0]), parseInt(saatDakika[1]), 0, 0);

        if (hedefZaman <= simdi) {
            hedefZaman.setDate(hedefZaman.getDate() + 1);
        }

        const beklemeSuresi = hedefZaman.getTime() - simdi.getTime();
        const saatGosterimi = hedefZaman.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        
        await interaction.editReply({ content: `⏳ **Komut Alındı!** Duyurunuz (ve görselleriniz) Türkiye saati ile **${saatGosterimi}**'da ${kanal} kanalına gönderilmek üzere zamanlandı.` });

        setTimeout(async () => {
            try {
                const gonderilenMesaj = await kanal.send(gonderilecekVeri);
                await emojileriEkle(gonderilenMesaj);
            } catch (err) {
                console.error('Zamanlanmış duyuru atılamadı:', err);
            }
        }, beklemeSuresi);
    }

    // --- HAKKINDA KOMUTU ---
    if (interaction.commandName === 'hakkında') {
        const hakkindaEmbed = new EmbedBuilder()
            .setColor(0x0099FF) // Rengi sarıdan Göktürk mavisine çektik
            .setTitle('🐺 Göktürk Ordusu Yönetim Sistemi')
            .setDescription('Göktürk Ordusu Discord sunucusunun resmi asistanı ve moderasyon botu.')
            .addFields(
                { name: '🛠️ Geliştirici', value: 'cyberQbit', inline: true },
                { name: '📡 Durum', value: '7/24 Aktif (Railway)', inline: true },
                { name: '📜 Sürüm', value: 'v2.0.0 - Yeniden Yapılanma', inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'Göktürk Ordusu Komuta Kademesi' });

        await interaction.reply({ embeds: [hakkindaEmbed] });
    }

    // --- DAVET KOMUTU ---
    if (interaction.commandName === 'davet') {
        // Bot kendi ID'sini otomatik alıp davet linkini oluşturur (Yönetici yetkisi ister)
        const davetLinki = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`;

        const davetEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('🐺 Karargâhı Genişletin!')
            .setDescription('Göktürk Ordusu botunu kendi sunucunuza davet etmek ve gücümüze güç katmak için aşağıdaki butona tıklayın.')
            .setThumbnail(client.user.displayAvatarURL());

        const buton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Botu Davet Et')
                    .setURL(davetLinki)
                    .setStyle(ButtonStyle.Link)
                    .setEmoji('🔗')
            );

        await interaction.reply({ embeds: [davetEmbed], components: [buton] });
    }

    // --- GELİŞMİŞ ÖZEL MESAJ KOMUTU ---
    if (interaction.commandName === 'özel_mesaj') {
        await interaction.deferReply({ ephemeral: true });

        const mesaj = interaction.options.getString('mesaj').replace(/\\n/g, '\n');
        const kisi = interaction.options.getUser('kisi');
        const rol = interaction.options.getRole('rol');
        const kanal = interaction.options.getChannel('kanal');

        // Tıklanabilir kanalı mesaja ekle
        let sonMesaj = mesaj;
        if (kanal) sonMesaj += `\n\n👉 **İlgili Kanal:** <#${kanal.id}>`;

        // Hata Kontrolleri
        if (!kisi && !rol) return interaction.editReply('❌ Lütfen kime göndereceğimi seçin! (Kişi veya Rol)');
        if (kisi && rol) return interaction.editReply('❌ Aynı anda hem kişi hem rol seçemezsiniz, sadece birini seçin.');

        // 1. DURUM: SADECE KİŞİYE GÖNDERME
        if (kisi) {
            try {
                await kisi.send(sonMesaj);
                return interaction.editReply(`✅ Mesaj başarıyla ${kisi} kullanıcısına iletildi!`);
            } catch (err) {
                return interaction.editReply(`❌ Kullanıcının DM kutusu kapalı olduğu için mesaj iletilemedi.`);
            }
        }

        // 2. DURUM: ROLE GÖNDERME (GÜVENLİKLİ)
        if (rol) {
            const sunucuUyeleri = await interaction.guild.members.fetch();
            // Botları listeden çıkar ve sadece o role sahip olanları bul
            const hedefUyeler = sunucuUyeleri.filter(m => m.roles.cache.has(rol.id) && !m.user.bot);

            // Discord Güvenlik Sınırı (Banlanmamak için)
            if (hedefUyeler.size > 40) {
                return interaction.editReply(`🚨 **GÜVENLİK ENGELİ:** Seçtiğiniz rolde ${hedefUyeler.size} kişi var. Discord kuralları gereği botun banlanmaması için tek seferde en fazla 40 kişiye DM atılabilir. Lütfen duyuruyu bir kanalda yapın.`);
            }

            if (hedefUyeler.size === 0) return interaction.editReply('❌ Bu role sahip kimse bulunamadı veya herkes bot.');

            await interaction.editReply(`⏳ **${hedefUyeler.size}** kişiye gönderim başlatıldı. Discord'un banlamaması için her mesaj arasına 3 saniye bekleme süresi eklendi. Lütfen bekleyin...`);

            let basarili = 0;
            let basarisiz = 0;

            for (const [id, uye] of hedefUyeler) {
                try {
                    await uye.send(sonMesaj);
                    basarili++;
                } catch (e) {
                    basarisiz++; // DM'si kapalı olanlar
                }
                // EN ÖNEMLİ KISIM: Botun banlanmaması için her mesajdan sonra 3 saniye bekle
                await new Promise(resolve => setTimeout(resolve, 3000)); 
            }

            return interaction.followUp({ content: `✅ **İşlem Tamamlandı!**\n> 🟢 Başarılı: ${basarili} kişi\n> 🔴 Başarısız (DM Kapalı): ${basarisiz} kişi`, ephemeral: true });
        }
    }

});

// Otomatik Cevap Sistemi
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    const msg = message.content.toLowerCase();
    
    if (responses[msg]) {
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setDescription(responses[msg]);
        return message.reply({ embeds: [embed] });
    }
});

// Yeni biri katıldığında
client.on('guildMemberAdd', member => {
    const kanal = member.guild.channels.cache.find(ch => ch.name === 'gelen-giden'); 
    if (!kanal) return;

    const hosgeldinEmbed = new EmbedBuilder()
        .setColor(0x0099FF) // Göktürk Mavisi
        .setTitle('🐺 Karargâha Yeni Bir Kan Katıldı!')
        .setDescription(`Hoş geldin ${member}! Göktürk Ordusu saflarına katıldığın için gururluyuz. Kuralları okumayı unutma!`)
        .setThumbnail(member.user.displayAvatarURL());

    kanal.send({ embeds: [hosgeldinEmbed] });
});

client.login(process.env.TOKEN);