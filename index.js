const { Client, GatewayIntentBits, Collection, ActivityType, EmbedBuilder, REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');require('dotenv').config();
const fs = require('fs');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

// Özel cevaplar listesi
const responses = {
    "sa": "Aleykümselam Efendi!",
    "selamün aleyküm": "Aleykümselam Efendi!",
    "nasılsın": "İyiyim Efendi, sizleri sormalı?",
};

client.once('ready', async () => {
    console.log(`✅ Giriş yapıldı: ${client.user.tag}`);

    // Durum Ayarı
    client.user.setPresence({
        activities: [{ name: 'Göktürk Ordusu\'nu', type: ActivityType.Watching }],
        status: 'online',
    });

    // --- SLASH KOMUT TANIMLARI ---
const duyuruKomutu = new SlashCommandBuilder()
    .setName('duyuru')
    .setDescription('Belirlenen kanala emojili duyuru gönderir.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // SADECE YÖNETİCİLER KULLANABİLİR
    .addChannelOption(option => option.setName('kanal').setDescription('Duyurunun gideceği kanal').setRequired(true))
    .addStringOption(option => option.setName('mesaj').setDescription('Gönderilecek duyuru metni').setRequired(true))
    .addStringOption(option => option.setName('tepki1').setDescription('Eklenecek 1. emoji'))
    .addStringOption(option => option.setName('tepki2').setDescription('Eklenecek 2. emoji'))
    .addStringOption(option => option.setName('tepki3').setDescription('Eklenecek 3. emoji'))
    .addStringOption(option => option.setName('tepki4').setDescription('Eklenecek 4. emoji'))
    .addStringOption(option => option.setName('tepki5').setDescription('Eklenecek 5. emoji'));
    
        new SlashCommandBuilder()
            .setName('hakkında')
            .setDescription('Botun teknik özelliklerini ve amacını gösterir.')
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
            .setColor(0xFFD700)
            .setTitle('🏛️ MKA Bot Bilgi Paneli')
            .setDescription('Ebedi Başkomutan Mustafa Kemal ATATÜRK!')
            .addFields(
                { name: '🛠️ Geliştirici', value: 'cyberQbit', inline: true },
                { name: '📡 Durum', value: '7/24 Aktif (Railway)', inline: true },
                { name: '📜 Sürüm', value: 'v1.3.0 - Kararlı Sürüm & Sistem Güncellemesi', inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'Mustafa Kemal Atatürk\'ün izinde...' });

        await interaction.reply({ embeds: [hakkindaEmbed] });
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
        .setColor(0x00FF00)
        .setTitle('🎉 Yeni Bir Nefer Katıldı!')
        .setDescription(`Hoş geldin ${member}! Seninle birlikte daha güçlüyüz.`)
        .setThumbnail(member.user.displayAvatarURL());

    kanal.send({ embeds: [hosgeldinEmbed] });
});

client.login(process.env.TOKEN);