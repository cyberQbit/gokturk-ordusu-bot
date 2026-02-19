const { Client, GatewayIntentBits, Collection, ActivityType, EmbedBuilder, REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
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
        activities: [{ name: 'Karargâhı', type: ActivityType.Watching }],
        status: 'online',
    });

    // --- SLASH KOMUT TANIMLARI ---
    const commands = [
        new SlashCommandBuilder()
            .setName('duyuru')
            .setDescription('Belirlenen kanala emojili duyuru gönderir.')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // SADECE YÖNETİCİLER KULLANABİLİR
            .addChannelOption(option => option.setName('kanal').setDescription('Duyurunun gideceği kanal').setRequired(true))
            .addStringOption(option => option.setName('mesaj').setDescription('Gönderilecek duyuru metni').setRequired(true))
            .addStringOption(option => option.setName('tepki1').setDescription('Eklenecek 1. emoji'))
            .addStringOption(option => option.setName('tepki2').setDescription('Eklenecek 2. emoji'))
            .addStringOption(option => option.setName('tepki3').setDescription('Eklenecek 3. emoji'))
            .addStringOption(option => option.setName('tepki4').setDescription('Eklenecek 4. emoji'))
            .addStringOption(option => option.setName('tepki5').setDescription('Eklenecek 5. emoji')),
            
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

    // --- DUYURU KOMUTU ---
    if (interaction.commandName === 'duyuru') {
        const kanal = interaction.options.getChannel('kanal');
        const mesaj = interaction.options.getString('mesaj').replace(/\\n/g, '\n');
        const tepkiler = [
            interaction.options.getString('tepki1'),
            interaction.options.getString('tepki2'),
            interaction.options.getString('tepki3'),
            interaction.options.getString('tepki4'),
            interaction.options.getString('tepki5')
        ].filter(t => t !== null);

        try {
            const sentMessage = await kanal.send(mesaj);
            for (const emoji of tepkiler) {
                await sentMessage.react(emoji).catch(() => null);
            }
            await interaction.reply({ content: `✅ Duyuru ${kanal} kanalına gönderildi!`, ephemeral: true });
        } catch (err) {
            await interaction.reply({ content: '❌ Mesaj gönderilemedi. Yetkilerimi kontrol et!', ephemeral: true });
        }
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