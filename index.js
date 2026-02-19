const { Client, GatewayIntentBits, Collection, ActivityType, EmbedBuilder, REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();
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

    // SLASH COMMAND KAYIT İŞLEMİ
    const commands = [
        new SlashCommandBuilder()
            .setName('duyuru')
            .setDescription('Belirlenen kanala emojili duyuru gönderir.')
            .addChannelOption(option => option.setName('kanal').setDescription('Duyuru kanalı').setRequired(true))
            .addStringOption(option => option.setName('mesaj').setDescription('Duyuru metni').setRequired(true))
            .addStringOption(option => option.setName('tepki1').setDescription('1. Emoji (Opsiyonel)'))
            .addStringOption(option => option.setName('tepki2').setDescription('2. Emoji (Opsiyonel)'))
            .addStringOption(option => option.setName('tepki3').setDescription('3. Emoji (Opsiyonel)'))
            .addStringOption(option => option.setName('tepki4').setDescription('4. Emoji (Opsiyonel)'))
            .addStringOption(option => option.setName('tepki5').setDescription('5. Emoji (Opsiyonel)'))
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

    if (interaction.commandName === 'duyuru') {
        const kanal = interaction.options.getChannel('kanal');
        const mesaj = interaction.options.getString('mesaj');
        const tepkiler = [
            interaction.options.getString('tepki1'),
            interaction.options.getString('tepki2'),
            interaction.options.getString('tepki3'),
            interaction.options.getString('tepki4'),
            interaction.options.getString('tepki5')
        ].filter(t => t !== null); // Boş bırakılanları temizle

        try {
            const sentMessage = await kanal.send(mesaj);
            for (const emoji of tepkiler) {
                await sentMessage.react(emoji).catch(() => null); // Geçersiz emojide hata verme
            }
            await interaction.reply({ content: `✅ Duyuru ${kanal} kanalına gönderildi!`, ephemeral: true });
        } catch (err) {
            await interaction.reply({ content: '❌ Mesaj gönderilemedi. Yetkilerimi kontrol et!', ephemeral: true });
        }
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    const msg = message.content.toLowerCase();
    if (responses[msg]) {
        const embed = new EmbedBuilder().setColor(0x0099FF).setDescription(responses[msg]);
        return message.reply({ embeds: [embed] });
    }
});

client.login(process.env.TOKEN);